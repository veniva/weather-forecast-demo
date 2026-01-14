import './App.css'
import { AppHeader } from './components/AppHeader'
import { EmptyState } from './components/EmptyState'
import { ForecastPanel } from './components/ForecastPanel'
import { Notice } from './components/Notice'
import { SearchControls } from './components/SearchControls'
import { useForecast } from './hooks/useForecast'

function App() {
  const {
    forecast,
    daily,
    selectedDay,
    selectedDayKey,
    loading,
    error,
    hasApiKey,
    units,
    searchByCity,
    useCurrentLocation,
    selectDay,
  } = useForecast()

  const hasForecast = Boolean(forecast && daily.length > 0)

  return (
    <div className="app">
      <AppHeader units={units} />
      {!hasApiKey && (
        <Notice>
          Add <code>VITE_OPENWEATHER_API_KEY</code> to a <code>.env</code> file to enable requests.
        </Notice>
      )}
      {error && <Notice variant="error">{error}</Notice>}
      <SearchControls
        hasApiKey={hasApiKey}
        loading={loading}
        onSearch={searchByCity}
        onUseLocation={useCurrentLocation}
      />
      {loading && <div className="loading">Loading forecast...</div>}
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
