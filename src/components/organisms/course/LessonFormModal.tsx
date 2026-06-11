import { useState } from 'react'
import Modal from '../../molecules/Modal'
import Input from '../../atoms/Input'
import Button from '../../atoms/Button'
import LessonFileManager from './LessonFileManager'
import type { Lesson } from '../../../types'

interface LessonForm {
  title: string
  text_content: string
  image_content_url: string
  video_content_url: string
  file_content_url: string
  order_index: number
}

const emptyForm: LessonForm = { title: '', text_content: '', image_content_url: '', video_content_url: '', file_content_url: '', order_index: 0 }

interface LessonFormModalProps {
  open: boolean
  editing: Lesson | null
  loading: boolean
  onSubmit: (data: LessonForm) => Promise<void>
  onClose: () => void
  lessonId?: number
}

export default function LessonFormModal({ open, editing, loading, onSubmit, onClose, lessonId }: LessonFormModalProps) {
  const [form, setForm] = useState<LessonForm>(
    editing ? {
      title: editing.title,
      text_content: editing.text_content ?? '',
      image_content_url: editing.image_content_url ?? '',
      video_content_url: editing.video_content_url ?? '',
      file_content_url: editing.file_content_url ?? '',
      order_index: editing.order_index,
    } : emptyForm
  )

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await onSubmit(form)
    setForm(emptyForm)
  }

  return (
    <Modal open={open} onClose={onClose} title={editing ? 'Editar lección' : 'Nueva lección'}>
      <form onSubmit={handleSubmit}>
        <Input label="Título" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        <FormGroup label="Contenido de texto">
          <textarea value={form.text_content} onChange={(e) => setForm({ ...form, text_content: e.target.value })} rows={3} className="form-control" />
        </FormGroup>
        <Input label="URL de imagen (opcional)" value={form.image_content_url} onChange={(e) => setForm({ ...form, image_content_url: e.target.value })} />
        <Input label="URL de video (opcional)" value={form.video_content_url} onChange={(e) => setForm({ ...form, video_content_url: e.target.value })} />
        <Input label="URL de archivo (opcional)" value={form.file_content_url} onChange={(e) => setForm({ ...form, file_content_url: e.target.value })} />
        <Input label="Orden" type="number" min={0} value={form.order_index} onChange={(e) => setForm({ ...form, order_index: Number(e.target.value) })} required />
        {lessonId && lessonId > 0 && (
          <div className="mb-3 pt-2 border-top">
            <LessonFileManager lessonId={lessonId} />
          </div>
        )}
        <div className="d-flex justify-content-end gap-2 pt-2">
          <Button variant="secondary" type="button" onClick={onClose}>Cancelar</Button>
          <Button type="submit" loading={loading}>{editing ? 'Guardar' : 'Crear lección'}</Button>
        </div>
      </form>
    </Modal>
  )
}

function FormGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="mb-3"><label className="form-label small fw-medium text-secondary">{label}</label>{children}</div>
}
