import { useEffect, useState } from 'react'

function easeOutCubic(t: number): number {
  return 1 - (1 - t) ** 3
}

/**
 * Animates a numeric value from 0 to `end` over `durationMs` (default 600ms).
 */
export function useCountUp(
  end: number,
  durationMs = 600,
  decimals = 2,
): number {
  const [value, setValue] = useState(0)

  useEffect(() => {
    let frame: number
    const start = performance.now()

    const tick = (now: number) => {
      const elapsed = now - start
      const t = Math.min(elapsed / durationMs, 1)
      const eased = easeOutCubic(t)
      setValue(end * eased)
      if (t < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [end, durationMs])

  return Number(value.toFixed(decimals))
}
