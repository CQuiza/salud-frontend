import { Modal as BsModal } from 'react-bootstrap'
import type { ReactNode } from 'react'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

export default function Modal({ open, onClose, title, children }: ModalProps) {
  return (
    <BsModal show={open} onHide={onClose} centered>
      <BsModal.Header closeButton>
        <BsModal.Title className="h5 fw-bold">{title}</BsModal.Title>
      </BsModal.Header>
      <BsModal.Body>{children}</BsModal.Body>
    </BsModal>
  )
}
