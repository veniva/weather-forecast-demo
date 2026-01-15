import { useEffect, useState } from 'react'
import type { DailyForecast, ForecastResponse, Units } from '../forecast'
import { DailyForecastGrid } from './DailyForecastGrid'
import { ForecastSummary } from './ForecastSummary'
import { HourlyForecast } from './HourlyForecast'
import { useCompactLayout } from '../hooks/useCompactLayout'

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
}: ForecastPanelProps) => {
  const isCompact = useCompactLayout()
  const [isOverlayOpen, setIsOverlayOpen] = useState(false)

  useEffect(() => {
    if (selectedDayKey) {
      setIsOverlayOpen(true)
      return
    }
    setIsOverlayOpen(false)
  }, [selectedDayKey])

  const handleSelectDay = (dayKey: string) => {
    setIsOverlayOpen(true)
    onSelectDay(dayKey)
  }

  const shouldShowHourly = Boolean(selectedDay) && (!isCompact || isOverlayOpen)

  return (
    <div className="forecast">
      <ForecastSummary forecast={forecast} />
      <DailyForecastGrid
        days={daily}
        selectedDayKey={selectedDayKey}
        units={units}
        onSelectDay={handleSelectDay}
      />
      {shouldShowHourly && selectedDay && (
        <div className="hourly-overlay">
          <HourlyForecast
            day={selectedDay}
            timezone={forecast.city.timezone}
            units={units}
            onClose={() => setIsOverlayOpen(false)}
          />
        </div>
      )}
    </div>
  )
}
