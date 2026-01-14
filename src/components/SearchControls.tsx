import { type FormEvent, useState } from 'react'

type SearchControlsProps = {
  hasApiKey: boolean
  loading: boolean
  onSearch: (city: string) => void
  onUseLocation: () => void
}

export const SearchControls = ({
  hasApiKey,
  loading,
  onSearch,
  onUseLocation,
}: SearchControlsProps) => {
  const [query, setQuery] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSearch(query)
  }

  return (
    <section className="controls">
      <form className="search-form" onSubmit={handleSubmit}>
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
      <button type="button" className="secondary" onClick={onUseLocation} disabled={!hasApiKey || loading}>
        Use my location
      </button>
    </section>
  )
}
