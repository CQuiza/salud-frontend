import { useState } from 'react'
import { Form } from 'react-bootstrap'
import Modal from '../molecules/Modal'
import Button from '../atoms/Button'
import Badge from '../atoms/Badge'
import { useUpdateCertificate } from '../../hooks/useCertificates'
import { toast } from 'sonner'
import { getErrorMessage } from '../../lib/error'
import { formatDate } from '../../lib/dates'
import { certificateStatusVariant } from '../../lib/statusVariant'
import type { Certificate, CertificateStatus } from '../../types'

interface Props {
  open: boolean
  onClose: () => void
  certificate: Certificate
}

export default function EditCertificateStatusModal({ open, onClose, certificate }: Props) {
  const [editStatus, setEditStatus] = useState<CertificateStatus>(certificate.status)
  const update = useUpdateCertificate(certificate.id)

  const [prevOpen, setPrevOpen] = useState(open)
  if (open !== prevOpen) {
    setPrevOpen(open)
    if (open) {
      setEditStatus(certificate.status)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      await update.mutateAsync({ status: editStatus })
      toast.success('Certificado actualizado correctamente')
      onClose()
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Actualizar certificado">
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="small fw-medium text-secondary">Certificado</label>
          <div className="border rounded-lg p-3 mt-1">
            <div className="d-flex align-items-center justify-content-between">
              <Badge variant={certificateStatusVariant(certificate.status)}>{certificate.status}</Badge>
              <small className="text-muted font-monospace">{certificate.unique_id.slice(0, 8)}</small>
            </div>
            <dl className="row small mb-0 mt-2">
              <dt className="col-4 text-muted fw-normal">Emitido</dt>
              <dd className="col-8 mb-0">{formatDate(certificate.issued_at)}</dd>
              <dt className="col-4 text-muted fw-normal">Expira</dt>
              <dd className="col-8 mb-0">{!certificate.expires_at ? '—' : formatDate(certificate.expires_at)}</dd>
            </dl>
          </div>
        </div>

        <Form.Group className="mb-3">
          <Form.Label className="small fw-medium text-secondary">Estado</Form.Label>
          <Form.Select value={editStatus} onChange={(e) => setEditStatus(e.target.value as CertificateStatus)} required>
            <option value="active">Activo</option>
            <option value="revoked">Revocado</option>
          </Form.Select>
        </Form.Group>

        <div className="d-flex justify-content-end gap-2">
          <Button variant="secondary" type="button" onClick={onClose}>Cancelar</Button>
          <Button type="submit" loading={update.isPending} disabled={update.isPending}>Guardar</Button>
        </div>
      </form>
    </Modal>
  )
}