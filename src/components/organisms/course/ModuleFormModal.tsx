import { useState } from 'react'
import Modal from '../../molecules/Modal'
import Input from '../../atoms/Input'
import Button from '../../atoms/Button'
import type { Module } from '../../../types'

interface ModuleForm {
  title: string
  order_index: number
}

const emptyForm: ModuleForm = { title: '', order_index: 0 }

interface ModuleFormModalProps {
  open: boolean
  editing: Module | null
  loading: boolean
  onSubmit: (data: ModuleForm) => Promise<void>
  onClose: () => void
}

export default function ModuleFormModal({ open, editing, loading, onSubmit, onClose }: ModuleFormModalProps) {
  const [form, setForm] = useState<ModuleForm>(
    editing ? { title: editing.title, order_index: editing.order_index } : emptyForm
  )

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await onSubmit(form)
    setForm(emptyForm)
  }

  return (
    <Modal open={open} onClose={onClose} title={editing ? 'Editar módulo' : 'Nuevo módulo'}>
      <form onSubmit={handleSubmit}>
        <Input label="Título" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        <Input label="Orden" type="number" min={0} value={form.order_index} onChange={(e) => setForm({ ...form, order_index: Number(e.target.value) })} required />
        <div className="d-flex justify-content-end gap-2 pt-2">
          <Button variant="secondary" type="button" onClick={onClose}>Cancelar</Button>
          <Button type="submit" loading={loading}>{editing ? 'Guardar' : 'Crear módulo'}</Button>
        </div>
      </form>
    </Modal>
  )
}
