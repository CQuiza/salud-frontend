import { Button as BsButton } from 'react-bootstrap'
import type { ButtonProps as BsButtonProps } from 'react-bootstrap'
import type { ReactNode } from 'react'

interface ButtonProps extends Omit<BsButtonProps, 'variant'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  loading?: boolean
  children: ReactNode
}

const variantMap: Record<string, BsButtonProps['variant']> = {
  primary: 'primary',
  secondary: 'outline-secondary',
  ghost: 'light',
  danger: 'danger',
}

export default function Button({ variant = 'primary', loading, children, className = '', ...props }: ButtonProps) {
  return (
    <BsButton
      variant={variantMap[variant] || 'primary'}
      className={`d-inline-flex align-items-center justify-content-center gap-2 fw-medium ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && <span className="spinner-border spinner-border-sm" role="status" />}
      {children}
    </BsButton>
  )
}
