import { Spinner as BsSpinner } from 'react-bootstrap'

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export default function Spinner({ size = 'md', className = '' }: SpinnerProps) {
  const sz = size === 'sm' ? 'sm' : undefined
  return (
    <BsSpinner animation="border" size={sz} className={className} />
  )
}
