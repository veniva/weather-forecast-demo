import { IMG_URL } from '../constants'
import type { DailyForecast, Units } from '../forecast'
import { formatHourLabel, formatTemperature } from '../forecast'
import { formatDescription, formatWindSpeed } from '../formatters'

type HourlyForecastProps = {
  day: DailyForecast
  timezone: number
  units: Units
  onClose: () => void
}

export const HourlyForecast = ({ day, timezone, units, onClose }: HourlyForecastProps) => (
  <section className="hourly" role="dialog" aria-modal="true" aria-label={`Hourly forecast for ${day.label}`}>
    <div className="hourly-header">
      <div className="hourly-header-main">
        <h3>Hourly details for {day.label}</h3>
        <p>Each row represents a 3-hour interval.</p>
      </div>
      <button className="hourly-close" type="button" onClick={onClose} aria-label="Close hourly forecast">
        Close
      </button>
    </div>
    <div className="hourly-list">
      {day.entries.map((entry) => (
        <div key={entry.dt} className="hour-row">
          <div className="hour-main">
            <span className="hour-time">{formatHourLabel(entry.dt, timezone)}</span>
            <img
              src={`${IMG_URL}/${entry.weather[0]?.icon ?? '01d'}.png`}
              alt={formatDescription(entry.weather[0]?.description ?? '')}
              loading="lazy"
            />
            <span className="hour-desc">
              {formatDescription(entry.weather[0]?.description ?? 'No data')}
            </span>
          </div>
          <div className="hour-details">
            <span>{formatTemperature(entry.main.temp, units)}</span>
            <span>Humidity {entry.main.humidity}%</span>
            <span>Wind {formatWindSpeed(entry.wind.speed, units)}</span>
          </div>
        </div>
      ))}
    </div>
  </section>
)
