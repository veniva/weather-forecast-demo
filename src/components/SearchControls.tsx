import { type FormEvent } from 'react'
import buttonStyles from './Button.module.css'
import styles from './SearchControls.module.css'

type SearchControlsProps = {
  hasApiKey: boolean
  loading: boolean
  query: string
  onQueryChange: (nextQuery: string) => void
  onSearch: (city: string) => void
  onUseLocation: () => void
}

export const SearchControls = ({
  hasApiKey,
  loading,
  query,
  onQueryChange,
  onSearch,
  onUseLocation,
}: SearchControlsProps) => {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSearch(query)
  }

  return (
    <section className={styles.controls}>
      <form className={styles.searchForm} onSubmit={handleSubmit}>
        <label className={styles.srOnly} htmlFor="city-search">
          City search
        </label>
        <input
          className={styles.searchInput}
          id="city-search"
          name="city"
          type="text"
          placeholder="Search by city (e.g., Paris)"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          disabled={loading}
        />
        <button className={buttonStyles.button} type="submit" disabled={!hasApiKey || loading}>
          Search
        </button>
      </form>
      <button
        type="button"
        className={`${buttonStyles.button} ${buttonStyles.secondary}`}
        onClick={onUseLocation}
        disabled={!hasApiKey || loading}
      >
        Use my location
      </button>
    </section>
  )
}
