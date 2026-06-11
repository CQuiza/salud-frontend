import { Card as BsCard } from 'react-bootstrap'
import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  padding?: boolean
}

export default function Card({ children, className = '', padding = true }: CardProps) {
  return (
    <BsCard className={`border-0 shadow-sm ${padding ? '' : ''} ${className}`}>
      <BsCard.Body className={padding ? '' : 'p-0'}>
        {children}
      </BsCard.Body>
    </BsCard>
  )
}
