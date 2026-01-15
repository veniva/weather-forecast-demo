import { IMG_URL } from '../constants'
import type { DailyForecast, Units } from '../forecast'
import { formatHourLabel, formatTemperature } from '../forecast'
import { formatDescription, formatWindSpeed } from '../formatters'
import buttonStyles from './Button.module.css'
import styles from './HourlyForecast.module.css'

type HourlyForecastProps = {
  day: DailyForecast
  timezone: number
  units: Units
  onClose: () => void
}

export const HourlyForecast = ({ day, timezone, units, onClose }: HourlyForecastProps) => (
  <section className={styles.hourly} role="dialog" aria-modal="true" aria-label={`Hourly forecast for ${day.label}`}>
    <div className={styles.hourlyHeader}>
      <div className={styles.hourlyHeaderMain}>
        <h3 className={styles.hourlyTitle}>Hourly details for {day.label}</h3>
        <p className={styles.hourlyIntro}>Each row represents a 3-hour interval.</p>
      </div>
      <button
        className={`${buttonStyles.button} ${styles.hourlyClose}`}
        type="button"
        onClick={onClose}
        aria-label="Close hourly forecast"
      >
        Close
      </button>
    </div>
    <div className={styles.hourlyList}>
      {day.entries.map((entry) => (
        <div key={entry.dt} className={styles.hourRow}>
          <div className={styles.hourMain}>
            <span className={styles.hourTime}>{formatHourLabel(entry.dt, timezone)}</span>
            <img
              className={styles.hourIcon}
              src={`${IMG_URL}/${entry.weather[0]?.icon ?? '01d'}.png`}
              alt={formatDescription(entry.weather[0]?.description ?? '')}
              loading="lazy"
            />
            <span className={styles.hourDesc}>
              {formatDescription(entry.weather[0]?.description ?? 'No data')}
            </span>
          </div>
          <div className={styles.hourDetails}>
            <span>{formatTemperature(entry.main.temp, units)}</span>
            <span>Humidity {entry.main.humidity}%</span>
            <span>Wind {formatWindSpeed(entry.wind.speed, units)}</span>
          </div>
        </div>
      ))}
    </div>
  </section>
)
