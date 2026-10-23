<script setup lang="ts">
import { ref, onMounted, onUnmounted, shallowRef } from 'vue'
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
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

interface Props {
  sizeClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  sizeClass: 'w-48 h-48 sm:w-64 sm:h-64',
})

const containerRef = ref<HTMLDivElement | null>(null)
const { isReducedMotion } = useReducedMotion()

const renderer = shallowRef<WebGLRenderer | null>(null)
let scene: Scene | null = null
let camera: PerspectiveCamera | null = null
let mesh: Mesh | null = null
let innerMesh: Mesh | null = null
let pointLight: PointLight | null = null
let animationFrameId: number | null = null

let targetRotX = 0
let targetRotY = 0
let currentRotX = 0
let currentRotY = 0

let isVisible = true
let lastTime = performance.now()

const handleMouseMove = (e: MouseEvent): void => {
  const width = window.innerWidth || 1
  const height = window.innerHeight || 1
  targetRotY = (e.clientX / width - 0.5) * 0.9
  targetRotX = (e.clientY / height - 0.5) * 0.7
}

const initThree = (): void => {
  if (!containerRef.value) return
  const container = containerRef.value
  const width = container.clientWidth || 256
  const height = container.clientHeight || 256

  scene = new Scene()

  camera = new PerspectiveCamera(45, width / height, 0.1, 100)
  camera.position.z = 4.8

  const webglRenderer = new WebGLRenderer({
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance',
  })
  webglRenderer.setSize(width, height)
  webglRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
  webglRenderer.toneMapping = ACESFilmicToneMapping
  webglRenderer.toneMappingExposure = 1.3

  container.appendChild(webglRenderer.domElement)
  renderer.value = webglRenderer

  // Outer Pearl Glass Physical Sphere with iridescent lavender & cyan refraction
  const geometry = new SphereGeometry(1.4, 64, 64)
  const material = new MeshPhysicalMaterial({
    color: new Color(0xf3e8ff), // Luminous pale lavender pearl
    emissive: new Color(0x8b5cf6), // Subtle violet core radiance
    emissiveIntensity: 0.12,
    roughness: 0.06,
    metalness: 0.08,
    transmission: 0.82,
    ior: 1.5,
    thickness: 1.4,
    attenuationColor: new Color(0xa855f7),
    attenuationDistance: 1.5,
    reflectivity: 0.95,
    clearcoat: 1.0,
    clearcoatRoughness: 0.04,
    sheen: 0.8,
    sheenColor: new Color(0x38bdf8),
    sheenRoughness: 0.15,
    iridescence: 0.8,
    iridescenceIOR: 1.5,
    transparent: true,
    opacity: 0.85,
  })

  mesh = new Mesh(geometry, material)

  // Inner Chromatic Core Sphere to give subtle internal color refraction
  const innerGeometry = new SphereGeometry(0.70, 32, 32)
  const innerMaterial = new MeshStandardMaterial({
    color: new Color(0x818cf8),
    emissive: new Color(0x6366f1),
    emissiveIntensity: 0.35,
    roughness: 0.25,
    metalness: 0.2,
  })
  innerMesh = new Mesh(innerGeometry, innerMaterial)
  mesh.add(innerMesh)

  scene.add(mesh)

  // Soft Ambient & Directional Lighting
  const ambientLight = new AmbientLight(0xffffff, 1.4)
  scene.add(ambientLight)

  // Vibrant lavender primary key studio light
  const lavenderLight = new DirectionalLight(0x9b87f5, 6.0)
  lavenderLight.position.set(-3, 4, 3)
  scene.add(lavenderLight)

  // Electric cyan/aqua rim light
  const aquaLight = new DirectionalLight(0x06b6d4, 5.5)
  aquaLight.position.set(3.5, -2, -2)
  scene.add(aquaLight)

  // Top periwinkle accent light
  const fillLight = new DirectionalLight(0x6366f1, 4.0)
  fillLight.position.set(1, 4, 2)
  scene.add(fillLight)

  // Inside radiant orchid point light
  pointLight = new PointLight(0xe879f9, 3.0, 6)
  pointLight.position.set(0, 0, 1)
  scene.add(pointLight)
}

const render = (): void => {
  if (!renderer.value || !scene || !camera || !mesh || !isVisible) {
    animationFrameId = requestAnimationFrame(render)
    return
  }

  const now = performance.now()
  const dt = Math.min((now - lastTime) / 1000, 0.1)
  lastTime = now

  // Gentle continuous rotation
  mesh.rotation.y += 0.007
  mesh.rotation.x += 0.004

  // Counter-rotating inner core creates active refraction caustics
  if (innerMesh) {
    innerMesh.rotation.y -= 0.011
    innerMesh.rotation.z += 0.006
  }

  // Soft vertical breathing oscillation
  const time = now * 0.0015
  mesh.position.y = Math.sin(time) * 0.08

  // Damped pointer parallax reaction
  const factor = 1.0 - Math.exp(-6.0 * dt)
  currentRotX += (targetRotX - currentRotX) * factor
  currentRotY += (targetRotY - currentRotY) * factor

  mesh.rotation.x += currentRotX * 0.2
  mesh.rotation.y += currentRotY * 0.2

  renderer.value.render(scene, camera)
  animationFrameId = requestAnimationFrame(render)
}

const handleResize = (): void => {
  if (!containerRef.value || !renderer.value || !camera) return
  const container = containerRef.value
  const width = container.clientWidth
  const height = container.clientHeight
  camera.aspect = width / height
  camera.updateProjectionMatrix()
  renderer.value.setSize(width, height)
}

onMounted(() => {
  if (typeof window === 'undefined') return

  initThree()
  if (!isReducedMotion.value) {
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('resize', handleResize, { passive: true })
    lastTime = performance.now()
    animationFrameId = requestAnimationFrame(render)
  } else if (renderer.value && scene && camera) {
    renderer.value.render(scene, camera)
  }
})

onUnmounted(() => {
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId)
    animationFrameId = null
  }

  if (typeof window !== 'undefined') {
    window.removeEventListener('mousemove', handleMouseMove)
    window.removeEventListener('resize', handleResize)
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

  if (mesh) {
    mesh.geometry.dispose()
    if (Array.isArray(mesh.material)) {
      mesh.material.forEach((m) => m.dispose())
    } else {
      mesh.material.dispose()
    }
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
  mesh = null
})
</script>

<template>
  <div
    ref="containerRef"
    class="relative flex items-center justify-center select-none pointer-events-none pearl-orb-glow"
    :class="props.sizeClass"
    aria-hidden="true"
  />
</template>

<style scoped>
.pearl-orb-glow {
  filter: drop-shadow(0 0 22px rgba(168, 85, 247, 0.45)) drop-shadow(0 0 38px rgba(56, 189, 248, 0.28));
}
</style>
