import { Form } from 'react-bootstrap'
import type { FormControlProps } from 'react-bootstrap'

interface InputProps extends FormControlProps {
  label?: string
  error?: string
}

export default function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <Form.Group className="mb-3">
      {label && (
        <Form.Label className="text-secondary small fw-medium">{label}</Form.Label>
      )}
      <Form.Control isInvalid={!!error} className={className} {...props} />
      {error && <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>}
    </Form.Group>
  )
}
