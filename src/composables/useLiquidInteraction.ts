import { ref, onMounted, onUnmounted, shallowRef, type Ref, type ShallowRef } from 'vue'

export interface LiquidRipple {
  x: number
  y: number
  startTime: number
  intensity: number
}

export interface LiquidInteractionState {
  addRipple: (x: number, y: number, intensity?: number) => void
  tickInterpolation: (dt: number) => void
  getDampedCoords: () => { x: number; y: number }
  getWakeCoords: () => { x: number; y: number }
  getWakeVector: () => { dx: number; dy: number }
  getVelocity: () => { vx: number; vy: number }
  getSpeed: () => number
  getActiveRipples: () => readonly LiquidRipple[]
}

export function useLiquidInteraction(): LiquidInteractionState {
  // Non-reactive internal numerical state to guarantee zero Vue re-render overhead on pointermove
  let targetX = 0.5
  let targetY = 0.5
  let currentX = 0.5
  let currentY = 0.5
  let wakeX = 0.5
  let wakeY = 0.5

  let lastTargetX = 0.5
  let lastTargetY = 0.5

  let filteredVelX = 0
  let filteredVelY = 0
  let speedValue = 0

  let lastRippleTime = 0
  let internalRipples: LiquidRipple[] = []

  const handlePointerMove = (e: MouseEvent | TouchEvent): void => {
    let clientX = 0
    let clientY = 0

    if ('touches' in e && e.touches.length > 0) {
      const touch = e.touches[0]
      if (!touch) return
      clientX = touch.clientX
      clientY = touch.clientY
    } else if ('clientX' in e) {
      clientX = e.clientX
      clientY = e.clientY
    }

    const width = window.innerWidth || 1
    const height = window.innerHeight || 1

    targetX = Math.min(Math.max(clientX / width, 0), 1)
    targetY = Math.min(Math.max(clientY / height, 0), 1)
  }

  const addRipple = (x: number, y: number, intensity = 1.0): void => {
    const now = performance.now()
    // Prune ripples older than 2.2 seconds
    internalRipples = internalRipples.filter((r) => now - r.startTime < 2200)
    if (internalRipples.length < 6) {
      internalRipples.push({
        x,
        y,
        startTime: now,
        intensity: Math.min(Math.max(intensity, 0.2), 1.8),
      })
    }
  }

  const handlePointerDown = (e: MouseEvent | TouchEvent): void => {
    let clientX = 0
    let clientY = 0
    if ('touches' in e && e.touches.length > 0) {
      const touch = e.touches[0]
      if (!touch) return
      clientX = touch.clientX
      clientY = touch.clientY
    } else if ('clientX' in e) {
      clientX = e.clientX
      clientY = e.clientY
    }

    const width = window.innerWidth || 1
    const height = window.innerHeight || 1
    const nx = clientX / width
    const ny = clientY / height
    addRipple(nx, ny, 1.3)
  }

  const tickInterpolation = (dt: number): void => {
    // Frame-rate independent exponential damping
    const clampedDt = Math.min(Math.max(dt, 0.001), 0.1)

    // Primary coordinates follow pointer with snappy yet weighted curve (k ≈ 9.0)
    const decayCoord = 1.0 - Math.exp(-9.0 * clampedDt)
    currentX += (targetX - currentX) * decayCoord
    currentY += (targetY - currentY) * decayCoord

    // Trailing wake coordinates lag gently behind to formulate physical liquid drag (k ≈ 3.5)
    const decayWake = 1.0 - Math.exp(-3.5 * clampedDt)
    wakeX += (currentX - wakeX) * decayWake
    wakeY += (currentY - wakeY) * decayWake

    // Instantaneous velocity calculation
    const instVelX = (targetX - lastTargetX) / clampedDt
    const instVelY = (targetY - lastTargetY) / clampedDt
    lastTargetX = targetX
    lastTargetY = targetY

    // Smooth velocity filtering to eliminate high-frequency spikes
    const velFilter = 1.0 - Math.exp(-10.0 * clampedDt)
    filteredVelX += (instVelX - filteredVelX) * velFilter
    filteredVelY += (instVelY - filteredVelY) * velFilter

    const currentSpeed = Math.sqrt(filteredVelX * filteredVelX + filteredVelY * filteredVelY)
    const speedDecay = 1.0 - Math.exp(-8.0 * clampedDt)
    speedValue += (currentSpeed - speedValue) * speedDecay

    // Generate expanding ripple waves on natural mouse movement
    const now = performance.now()
    if (speedValue > 0.35 && now - lastRippleTime > 150) {
      addRipple(currentX, currentY, Math.min(speedValue * 0.45, 1.3))
      lastRippleTime = now
    }
  }

  const getDampedCoords = (): { x: number; y: number } => ({ x: currentX, y: currentY })
  const getWakeCoords = (): { x: number; y: number } => ({ x: wakeX, y: wakeY })
  const getWakeVector = (): { dx: number; dy: number } => ({ dx: currentX - wakeX, dy: currentY - wakeY })
  const getVelocity = (): { vx: number; vy: number } => ({ vx: filteredVelX, vy: filteredVelY })
  const getSpeed = (): number => speedValue
  const getActiveRipples = (): readonly LiquidRipple[] => internalRipples

  onMounted(() => {
    if (typeof window === 'undefined') return

    window.addEventListener('mousemove', handlePointerMove, { passive: true })
    window.addEventListener('mousedown', handlePointerDown, { passive: true })
    window.addEventListener('touchmove', handlePointerMove, { passive: true })
    window.addEventListener('touchstart', handlePointerDown, { passive: true })
  })

  onUnmounted(() => {
    if (typeof window === 'undefined') return

    window.removeEventListener('mousemove', handlePointerMove)
    window.removeEventListener('mousedown', handlePointerDown)
    window.removeEventListener('touchmove', handlePointerMove)
    window.removeEventListener('touchstart', handlePointerDown)
  })

  return {
    addRipple,
    tickInterpolation,
    getDampedCoords,
    getWakeCoords,
    getWakeVector,
    getVelocity,
    getSpeed,
    getActiveRipples,
  }
}
