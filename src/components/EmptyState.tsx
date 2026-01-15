import styles from './EmptyState.module.css'

export const EmptyState = () => (
  <section className={styles.empty}>
    <h2>No forecast loaded</h2>
    <p>Start by searching for a city or using your current location.</p>
  </section>
)
