import Modal from '../../molecules/Modal'
import Button from '../../atoms/Button'

interface ConfirmDeleteModalProps {
  open: boolean
  type: 'module' | 'lesson'
  loading: boolean
  onConfirm: () => void
  onClose: () => void
}

export default function ConfirmDeleteModal({ open, type, loading, onConfirm, onClose }: ConfirmDeleteModalProps) {
  return (
    <Modal open={open} onClose={onClose} title="Confirmar eliminación">
      <p className="small text-muted">¿Estás seguro de eliminar este {type === 'module' ? 'módulo' : 'lección'}? Esta acción no se puede deshacer.</p>
      <div className="d-flex justify-content-end gap-2 pt-3">
        <Button variant="secondary" onClick={onClose}>Cancelar</Button>
        <Button onClick={onConfirm} loading={loading}>Eliminar</Button>
      </div>
    </Modal>
  )
}
