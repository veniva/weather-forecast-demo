import type { DailyForecast, ForecastResponse, Units } from '../forecast'
import { DailyForecastGrid } from './DailyForecastGrid'
import { ForecastSummary } from './ForecastSummary'
import { HourlyForecast } from './HourlyForecast'

type ForecastPanelProps = {
  forecast: ForecastResponse
  daily: DailyForecast[]
  selectedDayKey: string | null
  selectedDay: DailyForecast | null
  units: Units
  onSelectDay: (dayKey: string) => void
}

export const ForecastPanel = ({
  forecast,
  daily,
  selectedDayKey,
  selectedDay,
  units,
  onSelectDay,
}: ForecastPanelProps) => (
  <div className="forecast">
    <ForecastSummary forecast={forecast} />
    <DailyForecastGrid
      days={daily}
      selectedDayKey={selectedDayKey}
      units={units}
      onSelectDay={onSelectDay}
    />
    {selectedDay && <HourlyForecast day={selectedDay} timezone={forecast.city.timezone} units={units} />}
  </div>
)
