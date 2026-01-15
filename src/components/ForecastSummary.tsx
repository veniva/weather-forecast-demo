import type { ForecastResponse } from '../forecast'
import { formatDayLabel } from '../forecast'
import { formatTimezoneOffset } from '../formatters'

type ForecastSummaryProps = {
  forecast: ForecastResponse
}

export const ForecastSummary = ({ forecast }: ForecastSummaryProps) => (
  <section className="summary">
    <div>
      <h2>
        {forecast.city.name}, {forecast.city.country}
      </h2>
      <p className="summary-subtitle">
        Updated {formatDayLabel(forecast.list[0].dt, forecast.city.timezone)} •{' '}
        {formatTimezoneOffset(forecast.city.timezone)}
      </p>
    </div>
    <div className="summary-meta">
      <span>5-day outlook</span>
      <span>3-hour intervals</span>
    </div>
  </section>
)
