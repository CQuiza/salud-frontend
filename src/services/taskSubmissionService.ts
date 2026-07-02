import { config } from '../config'
import api from './api'
import type { TaskSubmission, TaskSubmissionWithUser } from '../types'

export const taskSubmissionService = {
  submit: (taskId: number, file: File) => {
    const fd = new FormData()
    fd.append('file', file)
    return api.post<TaskSubmission>(`/tasks/${taskId}/submit`, fd).then((r) => r.data)
  },

  listByTask: (taskId: number) =>
    api.get<TaskSubmissionWithUser[]>(`/tasks/${taskId}/submissions`).then((r) => r.data),

  getMySubmission: (taskId: number) =>
    api.get<TaskSubmission | null>(`/tasks/${taskId}/my-submission`).then((r) => r.data),

  getFileUrl: (submissionId: number) =>
    `${config.apiUrl}/submissions/${submissionId}/file`,

  downloadFile: async (submissionId: number, preferredName?: string) => {
    const res = await fetch(`${config.apiUrl}/submissions/${submissionId}/file`, {
      credentials: 'include',
    })
    if (!res.ok) throw new Error('Error al descargar el archivo')
    const blob = await res.blob()
    const disposition = res.headers.get('content-disposition')
    let filename = preferredName || `submission-${submissionId}.pdf`
    if (disposition) {
      const rfcMatch = disposition.match(/filename\*=UTF-8''([^;]+)/)
      if (rfcMatch) {
        filename = decodeURIComponent(rfcMatch[1])
      } else {
        const fallbackMatch = disposition.match(/filename="?(.+?)"?\s*(?:;|$)/)
        if (fallbackMatch) {
          filename = fallbackMatch[1]
        }
      }
    }
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  },
}
