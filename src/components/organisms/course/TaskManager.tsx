import { useState } from 'react'
import { toast } from 'sonner'
import { useAuth } from '../../../context/AuthContext'
import { useTasksByLesson, useCreateTask, useUpdateTask, useDeleteTask, useUploadTaskFile } from '../../../hooks/useTasks'
import Modal from '../../molecules/Modal'
import Button from '../../atoms/Button'
import Input from '../../atoms/Input'
import { downloadTaskFile } from '../../../lib/download'
import { FaPencilAlt, FaTrashAlt } from 'react-icons/fa'
import type { Task, TaskCreate, TaskUpdate } from '../../../types'

interface TaskManagerProps { lessonId: number | null; onClose: () => void }

export default function TaskManager({ lessonId, onClose }: TaskManagerProps) {
  const { user } = useAuth()
  const canManage = user && ['superuser', 'admin', 'teacher'].includes(user.role)
  const { data: tasks } = useTasksByLesson(lessonId ?? 0, { enabled: lessonId !== null })
  const createTask = useCreateTask()
  const updateTask = useUpdateTask()
  const deleteTask = useDeleteTask()
  const uploadTaskFile = useUploadTaskFile()

  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskDesc, setNewTaskDesc] = useState('')
  const [newTaskGoogleDrive, setNewTaskGoogleDrive] = useState('')
  const [uploadFile, setUploadFile] = useState<File | null>(null)

  function handleEdit(task: Task) { setEditingTask(task); setNewTaskTitle(task.title); setNewTaskDesc(task.description ?? ''); setNewTaskGoogleDrive(task.google_drive_link ?? ''); setUploadFile(null) }
  function resetForm() { setEditingTask(null); setNewTaskTitle(''); setNewTaskDesc(''); setNewTaskGoogleDrive(''); setUploadFile(null) }

  async function handleSave() {
    if (!newTaskTitle.trim() || !lessonId) return
    if (editingTask) {
      const data: TaskUpdate = { title: newTaskTitle.trim(), description: newTaskDesc || null, google_drive_link: newTaskGoogleDrive || null, file_type: newTaskGoogleDrive ? 'google_drive' : uploadFile ? 'upload' : editingTask.file_type }
      try { await updateTask.mutateAsync({ id: editingTask.id, data }); if (uploadFile) await uploadTaskFile.mutateAsync({ taskId: editingTask.id, file: uploadFile }); toast.success('Tarea actualizada'); resetForm() }
      catch (err: unknown) { toast.error(err instanceof Error ? err.message : 'Error') }
    } else {
      const payload: TaskCreate = { lesson_id: lessonId, title: newTaskTitle.trim(), description: newTaskDesc || null, google_drive_link: newTaskGoogleDrive || null, file_type: newTaskGoogleDrive ? 'google_drive' : uploadFile ? 'upload' : 'none', order_index: (tasks?.length ?? 0) + 1 }
      try { const created = await createTask.mutateAsync(payload); if (uploadFile) await uploadTaskFile.mutateAsync({ taskId: created.id, file: uploadFile }); toast.success('Tarea creada'); resetForm() }
      catch (err: unknown) { toast.error(err instanceof Error ? err.message : 'Error') }
    }
  }

  return (
    <Modal open={lessonId !== null} onClose={onClose} title="Tareas de la lección">
      <div>
        <div className="mb-3">
          {(!tasks || tasks.length === 0) ? (
            <p className="small text-muted">No hay tareas aún.</p>
          ) : tasks.map((t) => (
            <div key={t.id} className="d-flex align-items-start justify-content-between border rounded-2 p-3 mb-2">
              <div className="flex-grow-1 min-w-0">
                <p className="small fw-medium text-neutral-800 mb-0">{t.title}</p>
                {t.description && <small className="text-muted">{t.description}</small>}
                <div className="mt-1">
                  {t.file_type === 'google_drive' && t.google_drive_link && <a href={t.google_drive_link} target="_blank" rel="noopener noreferrer" className="small text-bar-600">Google Drive</a>}
                  {t.file_type === 'upload' && t.file_url && <button onClick={() => downloadTaskFile(t.id)} className="btn btn-link btn-sm p-0 small text-bar-600">Descargar archivo</button>}
                </div>
              </div>
              {canManage && (
                <div className="d-flex gap-1 flex-shrink-0">
                  <button onClick={() => handleEdit(t)} className="btn btn-sm btn-outline-secondary"><FaPencilAlt /></button>
                  <button onClick={() => deleteTask.mutateAsync(t.id).then(() => toast.success('Tarea eliminada')).catch((e) => toast.error(e.message))} className="btn btn-sm btn-outline-danger"><FaTrashAlt /></button>
                </div>
              )}
            </div>
          ))}
        </div>

        {canManage && (
          <div className="border-top pt-3">
            <p className="small fw-semibold text-neutral-700 mb-2">{editingTask ? 'Editar tarea' : 'Añadir tarea'}</p>
            <Input label="Título" value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} placeholder="Nombre de la tarea" />
            <FormGroup label="Descripción">
              <textarea value={newTaskDesc} onChange={(e) => setNewTaskDesc(e.target.value)} rows={2} className="form-control" placeholder="Instrucciones" />
            </FormGroup>
            <Input label="Enlace de Google Drive (opcional)" value={newTaskGoogleDrive} onChange={(e) => setNewTaskGoogleDrive(e.target.value)} placeholder="https://drive.google.com/file/d/..." />
            <FormGroup label="Subir archivo (opcional, máx 50 MB)">
              <input type="file" onChange={(e) => setUploadFile(e.target.files?.[0] ?? null)} className="form-control" />
            </FormGroup>
            <div className="d-flex justify-content-end gap-2">
              {editingTask && <Button variant="secondary" type="button" onClick={resetForm}>Cancelar</Button>}
              <Button onClick={handleSave} loading={createTask.isPending || updateTask.isPending}>{editingTask ? 'Guardar cambios' : 'Añadir tarea'}</Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}

function FormGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="mb-3"><label className="form-label small fw-medium text-secondary">{label}</label>{children}</div>
}
