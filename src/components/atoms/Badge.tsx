import { Badge as BsBadge } from 'react-bootstrap'
import type { ReactNode } from 'react'

interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info'
  children: ReactNode
}

const bgMap: Record<string, string> = {
  default: 'secondary',
  success: 'success',
  warning: 'warning',
  danger: 'danger',
  info: 'info',
}

export default function Badge({ variant = 'default', children }: BadgeProps) {
  return (
    <BsBadge bg={bgMap[variant]} className="fw-medium px-2 py-1">
      {children}
    </BsBadge>
  )
}
