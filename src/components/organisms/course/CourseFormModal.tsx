import { useState, useMemo } from 'react'
import Modal from '../../molecules/Modal'
import Input from '../../atoms/Input'
import Button from '../../atoms/Button'
import SearchableSelect from '../../molecules/SearchableSelect'
import { formatDate } from '../../../lib/dates'
import type { Course, User, CertificateType } from '../../../types'
import { CourseStatus } from '../../../types'

interface FormData {
  title: string
  description: string
  status: string
  teacher_id: number
  certificate_type_id: number
}

const emptyForm: FormData = { title: '', description: '', status: 'draft', teacher_id: 0, certificate_type_id: 0 }

interface CourseFormModalProps {
  open: boolean
  editing: Course | null
  users: User[] | undefined
  certTypes: CertificateType[] | undefined
  loading: boolean
  onSubmit: (data: FormData) => Promise<void>
  onClose: () => void
}

export default function CourseFormModal({ open, editing, users, certTypes, loading, onSubmit, onClose }: CourseFormModalProps) {
  const [form, setForm] = useState<FormData>(
    editing ? {
      title: editing.title,
      description: editing.description || '',
      status: editing.status,
      teacher_id: editing.teacher_id ?? 0,
      certificate_type_id: editing.certificate_type_id ?? 0,
    } : emptyForm
  )

  const certTypeOptions = useMemo(() => [
    { value: 0, label: 'Sin tipo' },
    ...(certTypes || []).map((t) => ({
      value: t.id,
      label: t.name,
      sublabel: t.reference || undefined,
    })),
  ], [certTypes])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await onSubmit(form)
    setForm(emptyForm)
  }

  return (
    <Modal open={open} onClose={onClose} title={editing ? 'Editar curso' : 'Nuevo curso'}>
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input label="Título" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        <div>
          <label className="form-label small fw-medium text-secondary">Descripción</label>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="form-control" />
        </div>
        {editing && (
          <div className="row g-3">
            <div className="col-6"><Input label="Creado" value={formatDate(editing.created_at)} disabled /></div>
            <div className="col-6"><Input label="Actualizado" value={formatDate(editing.updated_at)} disabled /></div>
          </div>
        )}
        <div>
          <label className="form-label small fw-medium text-secondary">Docente</label>
          <select value={form.teacher_id} onChange={(e) => setForm({ ...form, teacher_id: Number(e.target.value) })} className="form-select">
            <option value={0}>Sin docente</option>
            {users?.filter((t) => t.role === 'teacher').map((t) => <option key={t.id} value={t.id}>{t.name || t.email}</option>)}
          </select>
        </div>
        <div>
          <SearchableSelect
            label="Tipo de certificado"
            options={certTypeOptions}
            value={form.certificate_type_id}
            onChange={(v) => setForm({ ...form, certificate_type_id: Number(v) })}
            placeholder="Buscar tipo de certificado..."
          />
        </div>
        <div>
          <label className="form-label small fw-medium text-secondary">Estado</label>
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="form-select">
            {Object.values(CourseStatus).map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="d-flex justify-content-end gap-2 pt-2">
          <Button variant="secondary" type="button" onClick={onClose}>Cancelar</Button>
          <Button type="submit" loading={loading}>
            {editing ? 'Guardar cambios' : 'Crear curso'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
