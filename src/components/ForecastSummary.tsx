import type { ForecastResponse } from '../forecast'
import { formatDayLabel } from '../forecast'
import { formatTimezoneOffset } from '../formatters'
import styles from './ForecastSummary.module.css'

type ForecastSummaryProps = {
  forecast: ForecastResponse
}

export const ForecastSummary = ({ forecast }: ForecastSummaryProps) => (
  <section className={styles.summary}>
    <div>
      <h2 className={styles.summaryTitle}>
        {forecast.city.name}, {forecast.city.country}
      </h2>
      <p className={styles.summarySubtitle}>
        Updated {formatDayLabel(forecast.list[0].dt, forecast.city.timezone)} •{' '}
        {formatTimezoneOffset(forecast.city.timezone)}
      </p>
    </div>
    <div className={styles.summaryMeta}>
      <span>5-day outlook</span>
      <span>3-hour intervals</span>
    </div>
  </section>
)
