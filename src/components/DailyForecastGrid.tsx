import { IMG_URL } from '../constants'
import type { DailyForecast, Units } from '../forecast'
import { formatTemperature } from '../forecast'
import { formatDescription } from '../formatters'
import styles from './DailyForecastGrid.module.css'

type DailyForecastGridProps = {
  days: DailyForecast[]
  selectedDayKey: string | null
  units: Units
  onSelectDay: (dayKey: string) => void
}

export const DailyForecastGrid = ({
  days,
  selectedDayKey,
  units,
  onSelectDay,
}: DailyForecastGridProps) => (
  <section className={styles.dailyGrid}>
    {days.map((day) => {
      const isActive = selectedDayKey === day.dayKey
      const cardClassName = isActive ? `${styles.dayCard} ${styles.active}` : styles.dayCard

      return (
        <button
          key={day.dayKey}
          type="button"
          className={cardClassName}
          onClick={() => onSelectDay(day.dayKey)}
        >
          <div className={styles.dayCardHeader}>
            <span className={styles.dayLabel}>{day.label}</span>
            <img
              className={styles.dayIcon}
              src={`${IMG_URL}/${day.icon}@2x.png`}
              alt={formatDescription(day.description)}
              loading="lazy"
            />
          </div>
          <div className={styles.dayCardBody}>
            <span className={styles.dayTemp}>
              {formatTemperature(day.maxTemp, units)} / {formatTemperature(day.minTemp, units)}
            </span>
            <span className={styles.dayDesc}>{formatDescription(day.description)}</span>
          </div>
        </button>
      )
    })}
  </section>
)
