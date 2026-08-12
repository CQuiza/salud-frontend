import { useState } from 'react'
import Modal from '../molecules/Modal'
import Button from '../atoms/Button'
import Input from '../atoms/Input'
import Badge from '../atoms/Badge'
import { useRenewCertificate } from '../../hooks/useCertificates'
import { toast } from 'sonner'
import { getErrorMessage } from '../../lib/error'
import { formatDate } from '../../lib/dates'
import { certificateStatusVariant } from '../../lib/statusVariant'
import type { Certificate } from '../../types'

interface Props {
  open: boolean
  onClose: () => void
  certificate: Certificate
}

export default function RenewCertificateModal({ open, onClose, certificate }: Props) {
  const [issuedAt, setIssuedAt] = useState('')
  const [validityExtension, setValidityExtension] = useState<number | null>(null)
  const renew = useRenewCertificate(certificate.id)

  const [prevOpen, setPrevOpen] = useState(open)
  if (open !== prevOpen) {
    setPrevOpen(open)
    if (open) {
      setIssuedAt('')
      setValidityExtension(null)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      await renew.mutateAsync({
        issued_at: issuedAt || undefined,
        validity_extension: validityExtension ?? undefined,
      })
      toast.success('Certificado renovado correctamente')
      onClose()
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Renovar certificado">
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="small fw-medium text-secondary">Certificado actual</label>
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

        <p className="small text-muted mb-3">
          Al renovar, el certificado actual se revoca y se emite uno nuevo con la vigencia del tipo de certificado.
        </p>

        <Input
          label="Fecha de emisión (opcional)"
          type="date"
          value={issuedAt}
          onChange={(e) => setIssuedAt(e.target.value)}
        />
        <Input
          label="Extensión de vigencia (años, opcional)"
          type="number"
          min={1}
          value={validityExtension ?? ''}
          onChange={(e) => setValidityExtension(e.target.value ? Number(e.target.value) : null)}
        />

        <div className="d-flex justify-content-end gap-2 pt-2">
          <Button variant="secondary" type="button" onClick={onClose}>Cancelar</Button>
          <Button type="submit" loading={renew.isPending} disabled={renew.isPending}>Renovar</Button>
        </div>
      </form>
    </Modal>
  )
}