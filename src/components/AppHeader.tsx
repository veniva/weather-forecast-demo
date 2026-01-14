import type { Units } from '../forecast'

type AppHeaderProps = {
  units: Units
}

export const AppHeader = ({ units }: AppHeaderProps) => (
  <header className="app-header">
    <div>
      <p className="eyebrow">OpenWeatherMap 5-day forecast</p>
      <h1>Weather Outlook</h1>
      <p className="subtitle">Search for a city or use your current location to explore the next 5 days.</p>
    </div>
    <div className="units-badge">Units: {units === 'metric' ? 'Celsius' : 'Fahrenheit'}</div>
  </header>
)
