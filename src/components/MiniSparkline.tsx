import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'

interface MiniSparklineProps {
  data: number[]
  /** When true, stroke follows up = green / down = red */
  directional?: boolean
}

export function MiniSparkline({
  data,
  directional = true,
}: MiniSparklineProps) {
  const chartData = data.map((y, i) => ({ i, y }))
  const up = data[data.length - 1] >= data[0]
  const stroke = directional
    ? up
      ? 'var(--positive)'
      : 'var(--negative)'
    : 'var(--accent)'

  return (
    <div className="h-8 w-24 shrink-0 opacity-90">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 2, right: 2, bottom: 2, left: 2 }}
        >
          <XAxis dataKey="i" hide />
          <YAxis hide domain={['dataMin - 0.05', 'dataMax + 0.05']} />
          <Line
            type="monotone"
            dataKey="y"
            stroke={stroke}
            strokeWidth={1.5}
            dot={false}
            isAnimationActive
            animationDuration={800}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
