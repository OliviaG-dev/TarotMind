import { useCallback, type PointerEvent as ReactPointerEvent, type RefObject } from 'react'

type PointerTiltOptions = {
  maxTilt?: number
  baseRotateX?: number
  baseRotateY?: number
  hoverScale?: number
  hoverLift?: number
  cssVarPrefix?: string
}

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function tiltVarName(prefix: string, suffix: string): string {
  return `--${prefix}-${suffix}`
}

export function usePointerTiltHandlers(
  elementRef: RefObject<HTMLElement | null>,
  {
    maxTilt = 11,
    baseRotateX = 4,
    baseRotateY = -6,
    hoverScale = 1.02,
    hoverLift = 0,
    cssVarPrefix = 'hero-tilt',
  }: PointerTiltOptions = {},
) {
  const applyTilt = useCallback(
    (rotateX: number, rotateY: number, scale: number, lift = 0) => {
      const el = elementRef.current
      if (!el) return
      el.style.setProperty(tiltVarName(cssVarPrefix, 'x'), `${rotateX}deg`)
      el.style.setProperty(tiltVarName(cssVarPrefix, 'y'), `${rotateY}deg`)
      el.style.setProperty(tiltVarName(cssVarPrefix, 'scale'), String(scale))
      el.style.setProperty(tiltVarName(cssVarPrefix, 'lift'), `${lift}px`)
    },
    [cssVarPrefix, elementRef],
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

      applyTilt(rotateX, rotateY, hoverScale, hoverLift)
    },
    [applyTilt, baseRotateX, baseRotateY, elementRef, hoverLift, hoverScale, maxTilt],
  )

  const onPointerLeave = useCallback(() => {
    applyTilt(baseRotateX, baseRotateY, 1, 0)
  }, [applyTilt, baseRotateX, baseRotateY])

  return { onPointerMove, onPointerLeave }
}
