<script setup lang="ts">
import { ref, onMounted, onUnmounted, shallowRef } from 'vue';
import { useLiquidInteraction } from '@/composables/useLiquidInteraction';
import { useReducedMotion } from '@/composables/useReducedMotion';

const canvasRef = ref<HTMLCanvasElement | null>(null);
const isWebGLSupported = ref<boolean>(true);
const { isReducedMotion } = useReducedMotion();
const {
  getDampedCoords,
  getWakeCoords,
  getWakeVector,
  getVelocity,
  getSpeed,
  getActiveRipples,
  tickInterpolation,
} = useLiquidInteraction();

const glContext = shallowRef<WebGLRenderingContext | null>(null);
let program: WebGLProgram | null = null;
let positionBuffer: WebGLBuffer | null = null;
let animationFrameId: number | null = null;
let startTime = performance.now();
let lastFrameTime = performance.now();
let isVisible = true;

// Uniform locations
let uTimeLocation: WebGLUniformLocation | null = null;
let uResolutionLocation: WebGLUniformLocation | null = null;
let uMouseLocation: WebGLUniformLocation | null = null;
let uWakeLocation: WebGLUniformLocation | null = null;
let uWakeVectorLocation: WebGLUniformLocation | null = null;
let uVelocityLocation: WebGLUniformLocation | null = null;
let uSpeedLocation: WebGLUniformLocation | null = null;
let uRipplesLocation: WebGLUniformLocation | null = null;
let uRippleCountLocation: WebGLUniformLocation | null = null;

const VERTEX_SHADER_SOURCE = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER_SOURCE = `
precision highp float;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform vec2 u_wake;
uniform vec2 u_wake_vector;
uniform vec2 u_velocity;
uniform float u_speed;
uniform vec4 u_ripples[4];
uniform int u_ripple_count;

// Layered continuous organic oceanic swell
float calculateOceanSwell(vec2 uv, float t) {
  // Low frequency fundamental deep tides
  float w1 = sin(uv.x * 2.1 + t * 0.38 + sin(uv.y * 1.8 + t * 0.28));
  float w2 = cos(uv.y * 2.8 - t * 0.32 + sin(uv.x * 2.4 - t * 0.24));
  // Secondary oblique wave currents
  float w3 = sin((uv.x * 0.8 + uv.y * 1.2) * 2.0 + t * 0.26);
  // Delicate high-frequency caustic detail
  float w4 = cos(length(uv * 1.4) * 3.2 - t * 0.45) * 0.2;
  return (w1 * 0.4 + w2 * 0.35 + w3 * 0.25 + w4);
}

void main() {
  // Aspect-ratio corrected normalized coordinates
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution) / min(u_resolution.x, u_resolution.y);
  vec2 mouseUv = (u_mouse * u_resolution - 0.5 * u_resolution) / min(u_resolution.x, u_resolution.y);
  vec2 wakeUv = (u_wake * u_resolution - 0.5 * u_resolution) / min(u_resolution.x, u_resolution.y);

  // 1. Natural pointer fluid displacement
  float distToMouse = length(uv - mouseUv);
  float mouseDisplaceFactor = exp(-distToMouse * distToMouse * 16.0);
  vec2 mouseDisplacement = (uv - mouseUv) * mouseDisplaceFactor * (0.045 + clamp(u_speed * 0.025, 0.0, 0.075));

  // 2. Trailing liquid wake trail
  float distToWake = length(uv - wakeUv);
  float wakeFactor = exp(-distToWake * distToWake * 10.0);
  vec2 wakeDisplacement = u_wake_vector * wakeFactor * 0.08;

  // 3. Smooth expanding ripple rings with clean spatial envelope (no infinite repeats)
  float totalRipple = 0.0;
  for (int i = 0; i < 4; i++) {
    if (i >= u_ripple_count) break;
    vec4 rip = u_ripples[i];
    vec2 ripUv = (rip.xy * u_resolution - 0.5 * u_resolution) / min(u_resolution.x, u_resolution.y);
    float d = length(uv - ripUv);
    float age = rip.z;
    float intensity = rip.w;

    // Narrow Gaussian envelope around expanding wave front
    float waveRadius = age * 0.58;
    float waveDist = abs(d - waveRadius);
    float waveProfile = exp(-waveDist * waveDist * 85.0);
    float waveOscillation = sin((d - waveRadius) * 34.0);

    // Smooth time dissipation
    float dissipation = exp(-age * 1.7) * intensity;
    totalRipple += waveOscillation * waveProfile * dissipation;
  }

  // Combined displaced coordinates
  vec2 displacedUv = uv - mouseDisplacement - wakeDisplacement - vec2(totalRipple * 0.025);

  // Calculate oceanic elevation
  float elevation = calculateOceanSwell(displacedUv, u_time);
  elevation += totalRipple * 0.16;

  // Finite difference normal vector for surface light caustics
  float eps = 0.005;
  float hL = calculateOceanSwell(displacedUv - vec2(eps, 0.0), u_time);
  float hR = calculateOceanSwell(displacedUv + vec2(eps, 0.0), u_time);
  float hD = calculateOceanSwell(displacedUv - vec2(0.0, eps), u_time);
  float hU = calculateOceanSwell(displacedUv + vec2(0.0, eps), u_time);
  vec3 normal = normalize(vec3(-(hR - hL), -(hU - hD), 0.32));

  // Domain Palette for Pearl Glass Aesthetic
  vec3 pearlBase = vec3(0.969, 0.969, 0.984);       // #F7F7FB - Pearl Porcelain
  vec3 pearlWhite = vec3(1.0, 1.0, 1.0);             // #FFFFFF - Cool White
  vec3 paleLavender = vec3(0.933, 0.922, 0.984);     // #EDEBFA - Pale Lavender
  vec3 mistBlue = vec3(0.914, 0.941, 0.988);         // #E9F0FC - Mist Blue
  vec3 lavenderAccent = vec3(0.608, 0.529, 0.961);   // #9B87F5 - Lavender Accent
  vec3 periwinkleAccent = vec3(0.475, 0.600, 0.980); // #7999FA - Periwinkle Accent
  vec3 aquaHighlight = vec3(0.549, 0.878, 0.906);    // #8CE0E7 - Aqua Highlight

  // Depth gradient across porcelain liquid surface
  float depth = smoothstep(-1.2, 1.2, elevation);
  vec3 surfaceBase = mix(pearlBase, paleLavender, depth * 0.70);
  surfaceBase = mix(surfaceBase, mistBlue, smoothstep(-0.2, 0.9, elevation) * 0.45);

  // Directional studio lighting across surface ridges
  vec3 lightDir = normalize(vec3(0.40, 0.75, 0.50));
  float diffuse = max(dot(normal, lightDir), 0.0);
  float specular = pow(diffuse, 24.0);

  // Crystalline specular highlights along wave crests
  vec3 waveSpecular = pearlWhite * specular * 0.45;

  // Atmospheric lavender wash
  float lavenderField = smoothstep(1.3, -0.6, uv.x + uv.y * 0.65);
  vec3 lavenderSheen = lavenderAccent * (diffuse * 0.10 + specular * 0.18) * lavenderField;

  // Aqua oceanic reflections along wave crests
  float aquaField = smoothstep(-1.0, 0.8, uv.x - uv.y * 0.45);
  vec3 aquaSheen = aquaHighlight * (diffuse * 0.12 + specular * 0.20) * aquaField;

  // Mouse fluid ripple aura
  float pointerGlow = exp(-distToMouse * 3.8);
  vec3 pointerWaves = mix(lavenderAccent, aquaHighlight, 0.5) * pointerGlow * (0.16 + clamp(u_speed * 0.08, 0.0, 0.20));

  // Trailing wake highlight
  float wakeGlow = exp(-distToWake * 4.6);
  vec3 wakeWaves = periwinkleAccent * wakeGlow * clamp(u_speed * 0.07, 0.0, 0.15);

  // Concentric expanding wave rings
  float rippleAccent = abs(totalRipple) * 0.60;
  vec3 rippleWaves = mix(lavenderAccent, periwinkleAccent, 0.5) * rippleAccent;

  // Composite final illuminated pearl liquid surface
  vec3 finalColor = surfaceBase + waveSpecular + lavenderSheen + aquaSheen + pointerWaves + wakeWaves + rippleWaves;

  gl_FragColor = vec4(finalColor, 1.0);
}
`;

function createShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.warn('WebGL shader error:', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function initWebGL(): boolean {
  if (!canvasRef.value) return false;
  const canvas = canvasRef.value;

  const gl = canvas.getContext('webgl', {
    alpha: false,
    depth: false,
    stencil: false,
    antialias: false,
    powerPreference: 'high-performance',
  });

  if (!gl) {
    isWebGLSupported.value = false;
    return false;
  }

  glContext.value = gl;

  const vertexShader = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER_SOURCE);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SOURCE);

  if (!vertexShader || !fragmentShader) {
    isWebGLSupported.value = false;
    return false;
  }

  program = gl.createProgram();
  if (!program) {
    isWebGLSupported.value = false;
    return false;
  }

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.warn('WebGL program error:', gl.getProgramInfoLog(program));
    isWebGLSupported.value = false;
    return false;
  }

  gl.useProgram(program);

  const positions = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]);
  positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

  const aPositionLocation = gl.getAttribLocation(program, 'a_position');
  gl.enableVertexAttribArray(aPositionLocation);
  gl.vertexAttribPointer(aPositionLocation, 2, gl.FLOAT, false, 0, 0);

  // Uniform lookups
  uTimeLocation = gl.getUniformLocation(program, 'u_time');
  uResolutionLocation = gl.getUniformLocation(program, 'u_resolution');
  uMouseLocation = gl.getUniformLocation(program, 'u_mouse');
  uWakeLocation = gl.getUniformLocation(program, 'u_wake');
  uWakeVectorLocation = gl.getUniformLocation(program, 'u_wake_vector');
  uVelocityLocation = gl.getUniformLocation(program, 'u_velocity');
  uSpeedLocation = gl.getUniformLocation(program, 'u_speed');
  uRipplesLocation = gl.getUniformLocation(program, 'u_ripples');
  uRippleCountLocation = gl.getUniformLocation(program, 'u_ripple_count');

  handleResize();
  return true;
}

function handleResize(): void {
  if (!canvasRef.value || !glContext.value) return;
  const canvas = canvasRef.value;
  const gl = glContext.value;

  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  const displayWidth = Math.floor(window.innerWidth * dpr);
  const displayHeight = Math.floor(window.innerHeight * dpr);

  if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
    canvas.width = displayWidth;
    canvas.height = displayHeight;
    gl.viewport(0, 0, displayWidth, displayHeight);
  }
}

function renderLoop(): void {
  if (!glContext.value || !program || !isVisible) {
    animationFrameId = requestAnimationFrame(renderLoop);
    return;
  }

  const now = performance.now();
  const dt = (now - lastFrameTime) / 1000;
  lastFrameTime = now;

  // Frame-rate independent exponential interpolation
  tickInterpolation(dt);
  const mouseCoords = getDampedCoords();
  const wakeCoords = getWakeCoords();
  const wakeVec = getWakeVector();
  const velocity = getVelocity();
  const currentSpeed = getSpeed();
  const activeRipples = getActiveRipples();

  const gl = glContext.value;
  const elapsed = (now - startTime) / 1000;

  gl.useProgram(program);

  if (uTimeLocation) gl.uniform1f(uTimeLocation, elapsed);
  if (uResolutionLocation && canvasRef.value) {
    gl.uniform2f(uResolutionLocation, canvasRef.value.width, canvasRef.value.height);
  }
  if (uMouseLocation) {
    gl.uniform2f(uMouseLocation, mouseCoords.x, 1.0 - mouseCoords.y);
  }
  if (uWakeLocation) {
    gl.uniform2f(uWakeLocation, wakeCoords.x, 1.0 - wakeCoords.y);
  }
  if (uWakeVectorLocation) {
    gl.uniform2f(uWakeVectorLocation, wakeVec.dx, -wakeVec.dy);
  }
  if (uVelocityLocation) {
    gl.uniform2f(uVelocityLocation, velocity.vx, -velocity.vy);
  }
  if (uSpeedLocation) {
    gl.uniform1f(uSpeedLocation, currentSpeed);
  }

  // Format active click ripples
  const recentRipples = activeRipples.slice(-4);
  const rippleData = new Float32Array(16);
  recentRipples.forEach((rip, idx) => {
    const age = (now - rip.startTime) / 1000;
    const offset = idx * 4;
    rippleData[offset + 0] = rip.x;
    rippleData[offset + 1] = 1.0 - rip.y;
    rippleData[offset + 2] = age;
    rippleData[offset + 3] = rip.intensity;
  });

  if (uRipplesLocation) {
    gl.uniform4fv(uRipplesLocation, rippleData);
  }
  if (uRippleCountLocation) {
    gl.uniform1i(uRippleCountLocation, recentRipples.length);
  }

  gl.drawArrays(gl.TRIANGLES, 0, 6);

  animationFrameId = requestAnimationFrame(renderLoop);
}

const handleVisibilityChange = (): void => {
  isVisible = !document.hidden;
  if (isVisible) {
    lastFrameTime = performance.now();
  }
};

onMounted(() => {
  if (typeof window === 'undefined') return;

  if (!isReducedMotion.value) {
    const initialized = initWebGL();
    if (initialized) {
      window.addEventListener('resize', handleResize, { passive: true });
      document.addEventListener('visibilitychange', handleVisibilityChange);
      lastFrameTime = performance.now();
      animationFrameId = requestAnimationFrame(renderLoop);
    }
  } else {
    isWebGLSupported.value = false;
  }
});

onUnmounted(() => {
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }

  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', handleResize);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  }

  if (glContext.value) {
    const gl = glContext.value;
    if (positionBuffer) gl.deleteBuffer(positionBuffer);
    if (program) gl.deleteProgram(program);
    glContext.value = null;
  }
});
</script>

<template>
  <div class="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-pearl-bg" aria-hidden="true">
    <!-- WebGL Canvas for GPU Interactive Pearl Liquid Waves -->
    <canvas
      v-if="isWebGLSupported && !isReducedMotion"
      ref="canvasRef"
      class="w-full h-full block"
    />

    <!-- Accessible Static/Subtle Fallback for Reduced Motion or Missing WebGL -->
    <div v-else class="w-full h-full bg-pearl-bg relative">
      <div
        class="absolute -top-32 -right-32 w-160 h-160 rounded-full bg-linear-to-br from-purple-200/50 via-indigo-100/40 to-transparent blur-3xl opacity-80"
      />
      <div
        class="absolute top-1/4 -left-32 w-xl h-144 rounded-full bg-linear-to-tr from-sky-100/60 via-blue-50/40 to-transparent blur-3xl opacity-75"
      />
      <div
        class="absolute bottom-12 -right-12 w-lg h-128 rounded-full bg-linear-to-tl from-cyan-100/40 via-purple-100/30 to-transparent blur-3xl opacity-60"
      />
    </div>
  </div>
</template>
