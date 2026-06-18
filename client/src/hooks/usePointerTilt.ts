import { useCallback, type PointerEvent as ReactPointerEvent, type RefObject } from 'react'

type PointerTiltOptions = {
  maxTilt?: number
  baseRotateX?: number
  baseRotateY?: number
  hoverScale?: number
}

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function usePointerTiltHandlers(
  elementRef: RefObject<HTMLElement | null>,
  {
    maxTilt = 11,
    baseRotateX = 4,
    baseRotateY = -6,
    hoverScale = 1.02,
  }: PointerTiltOptions = {},
) {
  const applyTilt = useCallback(
    (rotateX: number, rotateY: number, scale: number) => {
      const el = elementRef.current
      if (!el) return
      el.style.setProperty('--hero-tilt-x', `${rotateX}deg`)
      el.style.setProperty('--hero-tilt-y', `${rotateY}deg`)
      el.style.setProperty('--hero-tilt-scale', String(scale))
    },
    [elementRef],
  )

  const onPointerMove = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      if (prefersReducedMotion()) return

      const el = elementRef.current
      if (!el) return

      const rect = el.getBoundingClientRect()
      const x = (event.clientX - rect.left) / rect.width - 0.5
      const y = (event.clientY - rect.top) / rect.height - 0.5
      const rotateY = baseRotateY + x * maxTilt * 2
      const rotateX = baseRotateX - y * maxTilt * 2

      applyTilt(rotateX, rotateY, hoverScale)
    },
    [applyTilt, baseRotateX, baseRotateY, elementRef, hoverScale, maxTilt],
  )

  const onPointerLeave = useCallback(() => {
    applyTilt(baseRotateX, baseRotateY, 1)
  }, [applyTilt, baseRotateX, baseRotateY])

  return { onPointerMove, onPointerLeave }
}
