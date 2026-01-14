import type { ReactNode } from 'react'

type NoticeProps = {
  variant?: 'info' | 'error'
  children: ReactNode
}

export const Notice = ({ variant = 'info', children }: NoticeProps) => (
  <div className={`notice${variant === 'error' ? ' error' : ''}`} role={variant === 'error' ? 'alert' : undefined}>
    {children}
  </div>
)
