import { useState } from 'react'
import { API_URL, DEFAULT_UNITS } from '../constants'
import { buildDailySummaries, type DailyForecast, type ForecastResponse, type Units } from '../forecast'

type UseForecastResult = {
  forecast: ForecastResponse | null
  daily: DailyForecast[]
  selectedDay: DailyForecast | null
  selectedDayKey: string | null
  loading: boolean
  error: string | null
  hasApiKey: boolean
  units: Units
  toggleUnits: () => void
  searchByCity: (city: string) => void
  useCurrentLocation: () => void
  selectDay: (dayKey: string) => void
}

export const useForecast = (): UseForecastResult => {
  const [forecast, setForecast] = useState<ForecastResponse | null>(null)
  const [daily, setDaily] = useState<DailyForecast[]>([])
  const [selectedDayKey, setSelectedDayKey] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [units, setUnits] = useState<Units>(DEFAULT_UNITS)
  const [lastParams, setLastParams] = useState<Record<string, string> | null>(null)

  const apiKey = (import.meta.env.VITE_OPENWEATHER_API_KEY as string | undefined) ?? ''
  const hasApiKey = Boolean(apiKey)

  const selectedDay = daily.find((day) => day.dayKey === selectedDayKey) ?? null

  const ensureApiKey = () => {
    if (hasApiKey) {
      return true
    }
    setError('Add VITE_OPENWEATHER_API_KEY to a .env file to load forecasts.')
    return false
  }

  const fetchForecast = async (params: Record<string, string>, nextUnits: Units = units) => {
    if (!ensureApiKey()) {
      return
    }

    setLoading(true)
    setError(null)
    setLastParams(params)

    try {
      const url = new URL(API_URL)
      url.searchParams.set('appid', apiKey)
      url.searchParams.set('units', nextUnits)
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

  const searchByCity = (city: string) => {
    const trimmed = city.trim()
    if (!trimmed) {
      setError('Enter a city name to search.')
      return
    }
    void fetchForecast({ q: trimmed })
  }

  const useCurrentLocation = () => {
    if (!ensureApiKey()) {
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
        void fetchForecast({
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

  const toggleUnits = () => {
    const nextUnits = units === 'metric' ? 'imperial' : 'metric'
    setUnits(nextUnits)
    if (lastParams) {
      void fetchForecast(lastParams, nextUnits)
    }
  }

  const selectDay = (dayKey: string) => {
    setSelectedDayKey(dayKey)
  }

  return {
    forecast,
    daily,
    selectedDay,
    selectedDayKey,
    loading,
    error,
    hasApiKey,
    units,
    toggleUnits,
    searchByCity,
    useCurrentLocation,
    selectDay,
  }
}
