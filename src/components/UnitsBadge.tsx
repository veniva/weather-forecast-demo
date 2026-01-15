import type { Units } from '../forecast'

type UnitsBadgeProps = {
  units: Units
  onToggle: () => void
}

export const UnitsBadge = ({ units, onToggle }: UnitsBadgeProps) => {
  const label = units === 'metric' ? 'Celsius' : 'Fahrenheit'

  return (
    <div
      className="units-badge"
      role="button"
      tabIndex={0}
      aria-pressed={units === 'imperial'}
      aria-label="Toggle units"
      onClick={onToggle}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onToggle()
        }
      }}
    >
      Units: {label}
    </div>
  )
}
