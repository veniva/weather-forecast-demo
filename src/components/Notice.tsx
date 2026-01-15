import type { ReactNode } from 'react'
import styles from './Notice.module.css'

type NoticeProps = {
  variant?: 'info' | 'error'
  children: ReactNode
}

export const Notice = ({ variant = 'info', children }: NoticeProps) => {
  const className = variant === 'error' ? `${styles.notice} ${styles.error}` : styles.notice

  return (
    <div className={className} role={variant === 'error' ? 'alert' : undefined}>
      {children}
    </div>
  )
}
