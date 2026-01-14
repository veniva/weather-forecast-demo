import { type FormEvent, useState } from 'react'
import './App.css'
import {
  buildDailySummaries,
  formatDayLabel,
  formatHourLabel,
  formatTemperature,
  type DailyForecast,
  type ForecastResponse,
  type Units,
} from './forecast'

const API_URL = 'https://api.openweathermap.org/data/2.5/forecast'
const DEFAULT_UNITS: Units = 'metric'

const formatDescription = (value: string) =>
  value ? `${value.charAt(0).toUpperCase()}${value.slice(1)}` : value

const formatTimezoneOffset = (offsetSeconds: number) => {
  const sign = offsetSeconds >= 0 ? '+' : '-'
  const absOffset = Math.abs(offsetSeconds)
  const hours = Math.floor(absOffset / 3600)
  const minutes = Math.floor((absOffset % 3600) / 60)
  return `UTC${sign}${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}

const formatWindSpeed = (speed: number, units: Units) => {
  const rounded = Math.round(speed)
  return units === 'metric' ? `${rounded} m/s` : `${rounded} mph`
}

function App() {
  const [query, setQuery] = useState('')
  const [forecast, setForecast] = useState<ForecastResponse | null>(null)
  const [daily, setDaily] = useState<DailyForecast[]>([])
  const [selectedDayKey, setSelectedDayKey] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const apiKey = (import.meta.env.VITE_OPENWEATHER_API_KEY as string | undefined) ?? ''
  const hasApiKey = Boolean(apiKey)

  const selectedDay = daily.find((day) => day.dayKey === selectedDayKey) ?? null

  const handleFetch = async (params: Record<string, string>) => {
    if (!hasApiKey) {
      setError('Add VITE_OPENWEATHER_API_KEY to a .env file to load forecasts.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const url = new URL(API_URL)
      url.searchParams.set('appid', apiKey)
      url.searchParams.set('units', DEFAULT_UNITS)
      Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value))

      const response = await fetch(url.toString())
      const data = (await response.json()) as ForecastResponse

      if (!response.ok || data.cod !== '200') {
        const message =
          typeof data.message === 'string' && data.message.length > 0
            ? data.message
            : 'Unable to load forecast.'
        throw new Error(message)
      }

      const summaries = buildDailySummaries(data.list, data.city.timezone).slice(0, 5)
      setForecast(data)
      setDaily(summaries)
      setSelectedDayKey(summaries[0]?.dayKey ?? null)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to load forecast.'
      setForecast(null)
      setDaily([])
      setSelectedDayKey(null)
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const handleCitySearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmed = query.trim()
    if (!trimmed) {
      setError('Enter a city name to search.')
      return
    }
    void handleFetch({ q: trimmed })
  }

  const handleGeolocation = () => {
    if (!hasApiKey) {
      setError('Add VITE_OPENWEATHER_API_KEY to a .env file to load forecasts.')
      return
    }
    if (!navigator.geolocation) {
      setError('Geolocation is not supported in this browser.')
      return
    }

    setLoading(true)
    setError(null)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        void handleFetch({
          lat: position.coords.latitude.toString(),
          lon: position.coords.longitude.toString(),
        })
      },
      () => {
        setLoading(false)
        setError('Unable to retrieve your location.')
      },
      { timeout: 10000 }
    )
  }

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <p className="eyebrow">OpenWeatherMap 5-day forecast</p>
          <h1>Weather Outlook</h1>
          <p className="subtitle">
            Search for a city or use your current location to explore the next 5 days.
          </p>
        </div>
        <div className="units-badge">Units: {DEFAULT_UNITS === 'metric' ? 'Celsius' : 'Fahrenheit'}</div>
      </header>

      {!hasApiKey && (
        <div className="notice">
          Add <code>VITE_OPENWEATHER_API_KEY</code> to a <code>.env</code> file to enable requests.
        </div>
      )}

      {error && <div className="notice error">{error}</div>}

      <section className="controls">
        <form className="search-form" onSubmit={handleCitySearch}>
          <label className="sr-only" htmlFor="city-search">
            City search
          </label>
          <input
            id="city-search"
            name="city"
            type="text"
            placeholder="Search by city (e.g., Paris)"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            disabled={loading}
          />
          <button type="submit" disabled={!hasApiKey || loading}>
            Search
          </button>
        </form>
        <button type="button" className="secondary" onClick={handleGeolocation} disabled={!hasApiKey || loading}>
          Use my location
        </button>
      </section>

      {loading && <div className="loading">Loading forecast...</div>}

      {!forecast && !loading && (
        <section className="empty">
          <h2>No forecast loaded</h2>
          <p>Start by searching for a city or using your current location.</p>
        </section>
      )}

      {forecast && daily.length > 0 && (
        <div className="forecast">
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
              <span>{forecast.list.length} x 3-hour intervals</span>
            </div>
          </section>

          <section className="daily-grid">
            {daily.map((day) => (
              <button
                key={day.dayKey}
                type="button"
                className={`day-card${selectedDayKey === day.dayKey ? ' active' : ''}`}
                onClick={() => setSelectedDayKey(day.dayKey)}
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
                    {formatTemperature(day.maxTemp, DEFAULT_UNITS)} /{' '}
                    {formatTemperature(day.minTemp, DEFAULT_UNITS)}
                  </span>
                  <span className="day-desc">{formatDescription(day.description)}</span>
                </div>
              </button>
            ))}
          </section>

          {selectedDay && (
            <section className="hourly">
              <div className="hourly-header">
                <h3>Hourly details for {selectedDay.label}</h3>
                <p>Each row represents a 3-hour interval.</p>
              </div>
              <div className="hourly-list">
                {selectedDay.entries.map((entry) => (
                  <div key={entry.dt} className="hour-row">
                    <div className="hour-main">
                      <span className="hour-time">
                        {formatHourLabel(entry.dt, forecast.city.timezone)}
                      </span>
                      <img
                        src={`https://openweathermap.org/img/wn/${entry.weather[0]?.icon ?? '01d'}.png`}
                        alt={formatDescription(entry.weather[0]?.description ?? '')}
                        loading="lazy"
                      />
                      <span className="hour-desc">
                        {formatDescription(entry.weather[0]?.description ?? 'No data')}
                      </span>
                    </div>
                    <div className="hour-details">
                      <span>{formatTemperature(entry.main.temp, DEFAULT_UNITS)}</span>
                      <span>Humidity {entry.main.humidity}%</span>
                      <span>Wind {formatWindSpeed(entry.wind.speed, DEFAULT_UNITS)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  )
}

export default App
