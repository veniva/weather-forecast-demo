import type { Units } from './forecast'

export const formatDescription = (value: string) =>
  value ? `${value.charAt(0).toUpperCase()}${value.slice(1)}` : value

export const formatTimezoneOffset = (offsetSeconds: number) => {
  const sign = offsetSeconds >= 0 ? '+' : '-'
  const absOffset = Math.abs(offsetSeconds)
  const hours = Math.floor(absOffset / 3600)
  const minutes = Math.floor((absOffset % 3600) / 60)
  return `UTC${sign}${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}

export const formatWindSpeed = (speed: number, units: Units) => {
  const rounded = Math.round(speed)
  return units === 'metric' ? `${rounded} m/s` : `${rounded} mph`
}
