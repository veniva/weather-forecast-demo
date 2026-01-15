import styles from './App.module.css'
import { AppHeader } from './components/AppHeader'
import { EmptyState } from './components/EmptyState'
import { ForecastPanel } from './components/ForecastPanel'
import { Notice } from './components/Notice'
import { SearchControls } from './components/SearchControls'
import { useForecast } from './hooks/useForecast'
import { useEffect, useState } from 'react'

function App() {
  const {
    forecast,
    daily,
    selectedDay,
    selectedDayKey,
    loading,
    error,
    hasApiKey,
    lastSearchSource,
    resolvedCityName,
    units,
    toggleUnits,
    searchByCity,
    useCurrentLocation,
    selectDay,
  } = useForecast()

  const hasForecast = Boolean(forecast && daily.length > 0)
  const [query, setQuery] = useState('')

  useEffect(() => {
    if (hasApiKey) {
      useCurrentLocation()
    }
  }, [hasApiKey])

  useEffect(() => {
    if (lastSearchSource === 'location' && resolvedCityName) {
      setQuery(resolvedCityName)
    }
  }, [lastSearchSource, resolvedCityName])

  return (
    <div className={styles.app}>
      <AppHeader units={units} onToggleUnits={toggleUnits} />
      {!hasApiKey && (
        <Notice>
          Add <code>VITE_OPENWEATHER_API_KEY</code> to a <code>.env</code> file to enable requests.
        </Notice>
      )}
      {error && <Notice variant="error">{error}</Notice>}
      <SearchControls
        hasApiKey={hasApiKey}
        loading={loading}
        query={query}
        onQueryChange={setQuery}
        onSearch={searchByCity}
        onUseLocation={useCurrentLocation}
      />
      {loading && <div className={styles.loading}>Loading forecast...</div>}
      {!hasForecast && !loading && <EmptyState />}
      {forecast && hasForecast && (
        <ForecastPanel
          forecast={forecast}
          daily={daily}
          selectedDayKey={selectedDayKey}
          selectedDay={selectedDay}
          units={units}
          onSelectDay={selectDay}
        />
      )}
    </div>
  )
}

export default App
