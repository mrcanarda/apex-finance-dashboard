import { useCountUp } from '../hooks/useCountUp'
import type { KPIConfig } from '../data/mockData'

interface KPICardProps {
  config: KPIConfig
  index: number
}

function formatDisplay(config: KPIConfig, animated: number): string {
  switch (config.format) {
    case 'currency': {
      const fd = config.fractionDigits ?? 0
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: fd,
        maximumFractionDigits: fd,
      }).format(animated)
    }
    case 'percent':
      return `${animated >= 0 ? '+' : ''}${animated.toFixed(2)}%`
    case 'number':
    default:
      return new Intl.NumberFormat('en-US').format(Math.round(animated))
  }
}

export function KPICard({ config, index }: KPICardProps) {
  const decimals =
    config.format === 'currency'
      ? (config.fractionDigits ?? 0)
      : config.format === 'percent'
        ? 2
        : 0
  const animated = useCountUp(config.value, 600, decimals)

  return (
    <article
      className="animate-card-enter group relative overflow-hidden rounded-[12px] border border-edge bg-card p-6 shadow-card-inset transition-[box-shadow,transform] duration-300 hover:shadow-[0_0_0_1px_rgba(240,165,0,0.12),0_0_28px_-4px_rgba(240,165,0,0.35)]"
      style={{
        animationDelay: `${index * 100}ms`,
      }}
    >
      <p className="font-mono text-xs uppercase tracking-wider text-muted">
        {config.label}
      </p>
      <p
        className="mt-3 text-3xl font-normal tracking-tight text-accent sm:text-4xl"
        style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
      >
        {formatDisplay(config, animated)}
      </p>
      {config.hint ? (
        <p className="mt-2 font-mono text-[11px] text-muted">{config.hint}</p>
      ) : null}
    </article>
  )
}
