import type { Units } from '../forecast'
import { UnitsBadge } from './UnitsBadge'
import styles from './AppHeader.module.css'

type AppHeaderProps = {
  units: Units
  onToggleUnits: () => void
}

export const AppHeader = ({ units, onToggleUnits }: AppHeaderProps) => (
  <header className={styles.appHeader}>
    <div>
      <p className={styles.eyebrow}>OpenWeatherMap 5-day forecast</p>
      <h1 className={styles.title}>Weather Outlook</h1>
      <p className={styles.subtitle}>Search for a city or use your current location to explore the next 5 days.</p>
    </div>
    <UnitsBadge units={units} onToggle={onToggleUnits} />
  </header>
)
