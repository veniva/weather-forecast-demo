import { describe, expect, it } from 'vitest'
import { buildDailySummaries, getDayKey, type ForecastEntry } from './forecast'

const toUnix = (iso: string) => Math.floor(Date.parse(iso) / 1000)

const createEntry = (iso: string, overrides: Partial<ForecastEntry> = {}): ForecastEntry => {
  const base: ForecastEntry = {
    dt: toUnix(iso),
    main: {
      temp: 10,
      temp_min: 9,
      temp_max: 11,
      humidity: 70,
    },
    weather: [
      {
        description: 'clear sky',
        icon: '01d',
      },
    ],
    wind: {
      speed: 4,
    },
  }

  return {
    ...base,
    ...overrides,
    main: {
      ...base.main,
      ...overrides.main,
    },
    weather: overrides.weather ?? base.weather,
    wind: {
      ...base.wind,
      ...overrides.wind,
    },
  }
}

describe('getDayKey', () => {
  it('uses timezone offset when grouping days', () => {
    const dt = toUnix('2024-05-01T23:00:00Z')

    expect(getDayKey(dt, 2 * 3600)).toBe('2024-05-02')
    expect(getDayKey(dt, 0)).toBe('2024-05-01')
  })
})

describe('buildDailySummaries', () => {
  it('computes min/max and picks a midday representative entry', () => {
    const entries = [
      createEntry('2024-05-01T09:00:00Z', {
        main: { temp: 10, temp_min: 7, temp_max: 11, humidity: 70 },
        weather: [{ description: 'mist', icon: '50d' }],
      }),
      createEntry('2024-05-01T12:00:00Z', {
        main: { temp: 14, temp_min: 13, temp_max: 15, humidity: 50 },
        weather: [{ description: 'clear sky', icon: '01d' }],
      }),
      createEntry('2024-05-01T15:00:00Z', {
        main: { temp: 12, temp_min: 12, temp_max: 14, humidity: 55 },
        weather: [{ description: 'broken clouds', icon: '03d' }],
      }),
    ]

    const summaries = buildDailySummaries(entries, 0)

    expect(summaries).toHaveLength(1)
    expect(summaries[0].minTemp).toBe(7)
    expect(summaries[0].maxTemp).toBe(15)
    expect(summaries[0].description).toBe('clear sky')
  })

  it('splits entries into multiple days in order', () => {
    const entries = [
      createEntry('2024-05-01T21:00:00Z'),
      createEntry('2024-05-02T03:00:00Z'),
    ]

    const summaries = buildDailySummaries(entries, 0)

    expect(summaries.map((summary) => summary.dayKey)).toEqual(['2024-05-01', '2024-05-02'])
  })
})
