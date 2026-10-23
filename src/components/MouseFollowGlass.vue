<script setup lang="ts">
import { ref, onMounted, onUnmounted, shallowRef } from 'vue'
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Group,
  Mesh,
  SphereGeometry,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  Color,
  DirectionalLight,
  AmbientLight,
  PointLight,
  ACESFilmicToneMapping,
} from 'three'
import { useReducedMotion } from '@/composables/useReducedMotion'

const containerRef = ref<HTMLDivElement | null>(null)
const { isReducedMotion } = useReducedMotion()

const isTouchDevice = ref<boolean>(false)
const renderer = shallowRef<WebGLRenderer | null>(null)

let scene: Scene | null = null
let camera: PerspectiveCamera | null = null
let glassGroup: Group | null = null
let outerMesh: Mesh | null = null
let innerMesh: Mesh | null = null
let movingPointLight: PointLight | null = null
let animationFrameId: number | null = null

let targetWorldX = 1.4
let targetWorldY = 0.8
let currentX = 1.4
let currentY = 0.8

let prevTargetX = 1.4
let prevTargetY = 0.8

let velocityX = 0
let velocityY = 0
let tiltX = 0
let tiltY = 0

let isVisible = true
let hasMovedPointer = false
let lastTime = performance.now()

let targetOpacity = 0.90
let currentOpacity = 0.90

const checkProximityToPhoto = (clientX: number, clientY: number): boolean => {
  if (typeof document === 'undefined') return false
  const photoEl = document.querySelector('[data-portrait]') as HTMLElement | null
  if (!photoEl) return false
  const rect = photoEl.getBoundingClientRect()
  const pad = 60
  return (
    clientX >= rect.left - pad &&
    clientX <= rect.right + pad &&
    clientY >= rect.top - pad &&
    clientY <= rect.bottom + pad
  )
}

const updatePointerWorldCoordinates = (clientX: number, clientY: number): void => {
  if (!camera) return
  const width = window.innerWidth || 1
  const height = window.innerHeight || 1

  const ndcX = (clientX / width) * 2 - 1
  const ndcY = -(clientY / height) * 2 + 1

  const vFOV = (camera.fov * Math.PI) / 180
  const visibleHeight = 2 * Math.tan(vFOV / 2) * camera.position.z
  const visibleWidth = visibleHeight * camera.aspect

  // Keep object comfortably bounded within the visible viewport
  const marginX = 1.0
  const marginY = 0.8
  const maxX = visibleWidth / 2 - marginX
  const maxY = visibleHeight / 2 - marginY

  targetWorldX = Math.max(-maxX, Math.min(maxX, (ndcX * visibleWidth) / 2))
  targetWorldY = Math.max(-maxY, Math.min(maxY, (ndcY * visibleHeight) / 2))
}

const handleMouseMove = (e: MouseEvent): void => {
  if (isTouchDevice.value) return

  // Detect proximity to developer portrait: fade out completely when near photo
  const isNear = checkProximityToPhoto(e.clientX, e.clientY)
  targetOpacity = isNear ? 0.0 : 0.90

  if (!hasMovedPointer) {
    hasMovedPointer = true
    updatePointerWorldCoordinates(e.clientX, e.clientY)
    currentX = targetWorldX
    currentY = targetWorldY
    prevTargetX = targetWorldX
    prevTargetY = targetWorldY
  } else {
    updatePointerWorldCoordinates(e.clientX, e.clientY)
  }
}

const handleMouseLeaveWindow = (): void => {
  targetOpacity = 0.90
}

const handleVisibilityChange = (): void => {
  if (typeof document === 'undefined') return
  isVisible = !document.hidden
  if (isVisible) {
    lastTime = performance.now()
    targetOpacity = 0.90
  }
}

const initThreeScene = (): void => {
  if (!containerRef.value) return
  const container = containerRef.value
  const width = window.innerWidth || 1
  const height = window.innerHeight || 1

  scene = new Scene()

  camera = new PerspectiveCamera(45, width / height, 0.1, 100)
  camera.position.z = 5.5

  const webglRenderer = new WebGLRenderer({
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance',
  })
  webglRenderer.setSize(width, height)
  webglRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
  webglRenderer.toneMapping = ACESFilmicToneMapping
  webglRenderer.toneMappingExposure = 1.30

  // Apply subtle purple pearl drop shadow glow to the canvas
  webglRenderer.domElement.style.filter =
    'drop-shadow(0 10px 24px rgba(147, 51, 234, 0.28)) drop-shadow(0 2px 8px rgba(99, 102, 241, 0.20))'

  container.appendChild(webglRenderer.domElement)
  renderer.value = webglRenderer

  // Create composite 3D Liquid Pearl Glass Sculpture
  glassGroup = new Group()

  // Outer Rounded Pearl Glass Sphere (matches color in photo & navfooter pearl gradient)
  const outerGeometry = new SphereGeometry(0.50, 64, 64)
  const outerMaterial = new MeshPhysicalMaterial({
    color: new Color(0xf3e8ff), // Pale lavender pearl base
    emissive: new Color(0x9333ea), // Rich violet-purple core radiance matching photo orb
    emissiveIntensity: 0.24,
    roughness: 0.06,
    metalness: 0.08,
    transmission: 0.70, // Rich pearl glass body with internal refraction
    ior: 1.50,
    thickness: 1.4,
    attenuationColor: new Color(0xa855f7), // Violet absorption
    attenuationDistance: 1.4,
    reflectivity: 0.96,
    clearcoat: 1.0,
    clearcoatRoughness: 0.03,
    sheen: 0.85,
    sheenColor: new Color(0x38bdf8), // Electric cyan rim reflection
    sheenRoughness: 0.14,
    iridescence: 0.82,
    iridescenceIOR: 1.50,
    transparent: true,
    opacity: 0.90,
  })

  outerMesh = new Mesh(outerGeometry, outerMaterial)
  glassGroup.add(outerMesh)

  // Inner Rounded Chromatic Core (Smooth violet/indigo specular core)
  const innerGeometry = new SphereGeometry(0.26, 32, 32)
  const innerMaterial = new MeshStandardMaterial({
    color: new Color(0x818cf8),
    emissive: new Color(0x7c3aed),
    emissiveIntensity: 0.45,
    roughness: 0.22,
    metalness: 0.18,
    transparent: true,
    opacity: 0.65,
  })

  innerMesh = new Mesh(innerGeometry, innerMaterial)
  glassGroup.add(innerMesh)

  scene.add(glassGroup)

  // Atmospheric Studio Lighting matching ThreePearlOrb & Photo aesthetic
  const ambientLight = new AmbientLight(0xffffff, 1.3)
  scene.add(ambientLight)

  // Key light: Vibrant lavender
  const keyLight = new DirectionalLight(0x9b87f5, 5.0)
  keyLight.position.set(-3.5, 4.5, 3.5)
  scene.add(keyLight)

  // Rim light: Soft electric aqua/cyan
  const rimLight = new DirectionalLight(0x06b6d4, 4.5)
  rimLight.position.set(3.5, -2.5, -2)
  scene.add(rimLight)

  // Top highlight: Cool periwinkle / purple
  const topLight = new DirectionalLight(0x818cf8, 3.2)
  topLight.position.set(1, 4, 2.5)
  scene.add(topLight)

  // Moving radiant orchid point light that tracks the sculpture
  movingPointLight = new PointLight(0xe879f9, 2.6, 7)
  movingPointLight.position.set(currentX + 0.8, currentY + 1.0, 2.0)
  scene.add(movingPointLight)
}

const renderLoop = (): void => {
  if (!renderer.value || !scene || !camera || !glassGroup || !isVisible) {
    animationFrameId = requestAnimationFrame(renderLoop)
    return
  }

  const now = performance.now()
  const dt = Math.min((now - lastTime) / 1000, 0.1)
  lastTime = now

  if (!isReducedMotion.value) {
    // 1. Fast & Fluid Damped Position Interpolation toward Cursor (Fast follow)
    const posDecay = 1.0 - Math.exp(-11.5 * dt)
    currentX += (targetWorldX - currentX) * posDecay
    currentY += (targetWorldY - currentY) * posDecay

    // 2. Velocity Calculation for Dynamic Tilt & Banking
    const instVelX = (targetWorldX - prevTargetX) / Math.max(dt, 0.001)
    const instVelY = (targetWorldY - prevTargetY) / Math.max(dt, 0.001)
    prevTargetX = targetWorldX
    prevTargetY = targetWorldY

    const velFilter = 1.0 - Math.exp(-12.0 * dt)
    velocityX += (instVelX - velocityX) * velFilter
    velocityY += (instVelY - velocityY) * velFilter

    // Dynamic rotational tilt based on fast movement velocity
    const maxTilt = 0.65
    const targetTiltX = Math.max(-maxTilt, Math.min(maxTilt, -velocityY * 0.040))
    const targetTiltY = Math.max(-maxTilt, Math.min(maxTilt, velocityX * 0.040))

    const tiltDecay = 1.0 - Math.exp(-10.0 * dt)
    tiltX += (targetTiltX - tiltX) * tiltDecay
    tiltY += (targetTiltY - tiltY) * tiltDecay

    // 3. Weightless Floating Breathing Oscillation & Organic Liquid Wobble
    const floatTime = now * 0.002
    const floatOffsetX = Math.cos(floatTime * 0.8) * 0.05
    const floatOffsetY = Math.sin(floatTime) * 0.08

    glassGroup.position.set(currentX + floatOffsetX, currentY + floatOffsetY, 0)

    // Organic droplet liquid wobble
    const wobbleTime = now * 0.003
    const scaleX = 1.0 + Math.sin(wobbleTime) * 0.05 - velocityX * 0.015
    const scaleY = 1.0 + Math.cos(wobbleTime * 1.2) * 0.05 - velocityY * 0.015
    const scaleZ = 1.0 - Math.sin(wobbleTime * 0.8) * 0.04
    glassGroup.scale.set(scaleX, scaleY, scaleZ)

    // 4. Multi-Axis Rotation: Continuous Ambient Spin + Velocity Banking
    glassGroup.rotation.y += 0.010 + tiltY * 0.12
    glassGroup.rotation.x += 0.006 + tiltX * 0.12
    glassGroup.rotation.z = -tiltY * 0.42 // Dynamic banking like fluid in flight

    // Counter-rotating inner core creates complex refractive caustics
    if (innerMesh) {
      innerMesh.rotation.y -= 0.014
      innerMesh.rotation.x += 0.008
    }

    // 5. Dynamic Moving Point Light Following the Glass Sculpture
    if (movingPointLight) {
      movingPointLight.position.set(currentX + 0.9, currentY + 1.2, 2.2)
    }
  } else {
    // Resting graceful position for reduced motion
    glassGroup.position.set(targetWorldX, targetWorldY, 0)
  }

  // Smoothly fade out when cursor moves near the photo, fade in when away
  const opacityDecay = 1.0 - Math.exp(-12.0 * dt)
  currentOpacity += (targetOpacity - currentOpacity) * opacityDecay

  if (glassGroup) {
    glassGroup.visible = currentOpacity > 0.01
  }
  if (outerMesh && outerMesh.material instanceof MeshPhysicalMaterial) {
    outerMesh.material.opacity = currentOpacity * 0.90
  }
  if (innerMesh && innerMesh.material instanceof MeshStandardMaterial) {
    innerMesh.material.opacity = currentOpacity * 0.65
  }
  if (containerRef.value) {
    containerRef.value.style.opacity = currentOpacity.toFixed(3)
  }

  renderer.value.render(scene, camera)
  animationFrameId = requestAnimationFrame(renderLoop)
}

const handleResize = (): void => {
  if (!renderer.value || !camera) return
  const width = window.innerWidth || 1
  const height = window.innerHeight || 1

  camera.aspect = width / height
  camera.updateProjectionMatrix()
  renderer.value.setSize(width, height)
}

onMounted(() => {
  if (typeof window === 'undefined') return

  if (window.matchMedia('(pointer: coarse)').matches) {
    isTouchDevice.value = true
    // On touch devices, position comfortably in top-right ambient zone
    targetWorldX = 1.6
    targetWorldY = 1.2
    currentX = 1.6
    currentY = 1.2
  }

  initThreeScene()

  window.addEventListener('mousemove', handleMouseMove, { passive: true })
  window.addEventListener('resize', handleResize, { passive: true })
  document.addEventListener('visibilitychange', handleVisibilityChange)
  document.addEventListener('mouseleave', handleMouseLeaveWindow)
  window.addEventListener('blur', handleMouseLeaveWindow)

  lastTime = performance.now()
  animationFrameId = requestAnimationFrame(renderLoop)
})

onUnmounted(() => {
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId)
    animationFrameId = null
  }

  if (typeof window !== 'undefined') {
    window.removeEventListener('mousemove', handleMouseMove)
    window.removeEventListener('resize', handleResize)
    document.removeEventListener('visibilitychange', handleVisibilityChange)
    document.removeEventListener('mouseleave', handleMouseLeaveWindow)
    window.removeEventListener('blur', handleMouseLeaveWindow)
  }

  if (outerMesh) {
    outerMesh.geometry.dispose()
    if (Array.isArray(outerMesh.material)) {
      outerMesh.material.forEach((m) => m.dispose())
    } else {
      outerMesh.material.dispose()
    }
    outerMesh = null
  }

  if (innerMesh) {
    innerMesh.geometry.dispose()
    if (Array.isArray(innerMesh.material)) {
      innerMesh.material.forEach((m) => m.dispose())
    } else {
      innerMesh.material.dispose()
    }
    innerMesh = null
  }

  if (renderer.value) {
    renderer.value.dispose()
    if (renderer.value.domElement.parentElement) {
      renderer.value.domElement.parentElement.removeChild(renderer.value.domElement)
    }
    renderer.value = null
  }

  scene = null
  camera = null
  glassGroup = null
  movingPointLight = null
})
</script>

<template>
  <!-- Full-viewport fixed background layer behind all text, photos, and cards (z-0) -->
  <div
    ref="containerRef"
    class="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
    aria-hidden="true"
  />
</template>
