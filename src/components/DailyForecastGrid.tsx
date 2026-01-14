import type { DailyForecast, Units } from '../forecast'
import { formatTemperature } from '../forecast'
import { formatDescription } from '../formatters'

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
  <section className="daily-grid">
    {days.map((day) => (
      <button
        key={day.dayKey}
        type="button"
        className={`day-card${selectedDayKey === day.dayKey ? ' active' : ''}`}
        onClick={() => onSelectDay(day.dayKey)}
      >
        <div className="day-card-header">
          <span className="day-label">{day.label}</span>
          <img
            src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
            alt={formatDescription(day.description)}
            loading="lazy"
          />
        </div>
        <div className="day-card-body">
          <span className="day-temp">
            {formatTemperature(day.maxTemp, units)} / {formatTemperature(day.minTemp, units)}
          </span>
          <span className="day-desc">{formatDescription(day.description)}</span>
        </div>
      </button>
    ))}
  </section>
)
