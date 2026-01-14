export type Units = 'metric' | 'imperial'

export type ForecastEntry = {
  dt: number
  main: {
    temp: number
    temp_min: number
    temp_max: number
    humidity: number
  }
  weather: Array<{
    description: string
    icon: string
  }>
  wind: {
    speed: number
  }
}

export type ForecastResponse = {
  cod: string
  message: string | number
  cnt: number
  list: ForecastEntry[]
  city: {
    name: string
    country: string
    timezone: number
  }
}

export type DailyForecast = {
  dayKey: string
  label: string
  minTemp: number
  maxTemp: number
  description: string
  icon: string
  entries: ForecastEntry[]
}

const toZonedDate = (unixSeconds: number, offsetSeconds: number) =>
  new Date((unixSeconds + offsetSeconds) * 1000)

const pad2 = (value: number) => (value < 10 ? `0${value}` : `${value}`)

export const getDayKey = (unixSeconds: number, offsetSeconds: number) => {
  const date = toZonedDate(unixSeconds, offsetSeconds)
  return `${date.getUTCFullYear()}-${pad2(date.getUTCMonth() + 1)}-${pad2(date.getUTCDate())}`
}

export const formatDayLabel = (unixSeconds: number, offsetSeconds: number) => {
  const date = toZonedDate(unixSeconds, offsetSeconds)
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(date)
}

export const formatHourLabel = (unixSeconds: number, offsetSeconds: number) => {
  const date = toZonedDate(unixSeconds, offsetSeconds)
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'UTC',
  }).format(date)
}

const pickRepresentativeEntry = (entries: ForecastEntry[], offsetSeconds: number) => {
  let chosen = entries[0]
  let smallestDiff = Number.POSITIVE_INFINITY

  entries.forEach((entry) => {
    const localHour = toZonedDate(entry.dt, offsetSeconds).getUTCHours()
    const diff = Math.abs(localHour - 12)
    if (diff < smallestDiff) {
      smallestDiff = diff
      chosen = entry
    }
  })

  return chosen
}

export const buildDailySummaries = (entries: ForecastEntry[], offsetSeconds: number) => {
  const grouped = new Map<string, ForecastEntry[]>()

  entries.forEach((entry) => {
    const dayKey = getDayKey(entry.dt, offsetSeconds)
    const bucket = grouped.get(dayKey)
    if (bucket) {
      bucket.push(entry)
      return
    }
    grouped.set(dayKey, [entry])
  })

  const summaries: DailyForecast[] = []

  grouped.forEach((groupEntries, dayKey) => {
    const sortedEntries = [...groupEntries].sort((left, right) => left.dt - right.dt)
    const representative = pickRepresentativeEntry(sortedEntries, offsetSeconds)
    const minTemp = Math.min(...sortedEntries.map((entry) => entry.main.temp_min))
    const maxTemp = Math.max(...sortedEntries.map((entry) => entry.main.temp_max))
    const description = representative.weather[0]?.description ?? 'No data'
    const icon = representative.weather[0]?.icon ?? '01d'

    summaries.push({
      dayKey,
      label: formatDayLabel(representative.dt, offsetSeconds),
      minTemp,
      maxTemp,
      description,
      icon,
      entries: sortedEntries,
    })
  })

  return summaries
}

export const formatTemperature = (value: number, units: Units) => {
  const rounded = Math.round(value)
  return `${rounded}°${units === 'metric' ? 'C' : 'F'}`
}
