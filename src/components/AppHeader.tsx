import type { Units } from '../forecast'
import { UnitsBadge } from './UnitsBadge'

type AppHeaderProps = {
  units: Units
  onToggleUnits: () => void
}

export const AppHeader = ({ units, onToggleUnits }: AppHeaderProps) => (
  <header className="app-header">
    <div>
      <p className="eyebrow">OpenWeatherMap 5-day forecast</p>
      <h1>Weather Outlook</h1>
      <p className="subtitle">Search for a city or use your current location to explore the next 5 days.</p>
    </div>
    <UnitsBadge units={units} onToggle={onToggleUnits} />
  </header>
)
