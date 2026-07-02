import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useAllProgressSummaries } from '../hooks/useModuleAssessments'
import { useUsers } from '../hooks/useUsers'
import { taskSubmissionService } from '../services/taskSubmissionService'
import Card from '../components/molecules/Card'
import SearchBar from '../components/molecules/SearchBar'
import Spinner from '../components/atoms/Spinner'
import {
  FaChevronDown, FaChevronRight, FaClipboardCheck,
  FaDownload, FaCheck, FaTimes, FaFileAlt,
} from 'react-icons/fa'
import type { CourseProgressSummary, ModuleProgressItem, User } from '../types'
import { useNavigate } from 'react-router-dom'

function isModuleComplete(mod: ModuleProgressItem): boolean {
  const assessmentOk = mod.total_assessment_questions === 0 || mod.passed
  const tasksOk = mod.total_tasks === 0 || mod.submitted_tasks === mod.total_tasks
  return assessmentOk && tasksOk
}

export default function ProgressPage() {
  const { user } = useAuth()
  const isStaff = user && ['superuser', 'admin', 'teacher'].includes(user.role)
  const navigate = useNavigate()

  const [selectedUserId, setSelectedUserId] = useState<number | null>(
    user && !isStaff ? user.id : null
  )
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedCourse, setExpandedCourse] = useState<number | null>(null)
  const [downloading, setDownloading] = useState<number | null>(null)

  const { data: users } = useUsers(undefined, { enabled: isStaff })
  const { data: progress, isLoading } = useAllProgressSummaries(selectedUserId ?? undefined)

  const filteredUsers = isStaff && users
    ? users.filter(
        (u: User) =>
          u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          u.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : []

  async function handleDownload(mod: ModuleProgressItem) {
    const task = mod.tasks.find((t) => t.submitted && t.submission_id)
    if (!task?.submission_id) return
    setDownloading(task.submission_id)
    try {
      await taskSubmissionService.downloadFile(task.submission_id, task.original_filename ?? undefined)
    } catch {
      // silent
    } finally {
      setDownloading(null)
    }
  }

  if (isLoading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="text-center py-5"><Spinner /></div>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-4">
        <h1 className="fs-2 fw-bold text-neutral-800 mb-1">Progreso</h1>
        <p className="text-muted small">Visualiza tu avance en los cursos</p>
      </div>

      {isStaff && (
        <Card className="mb-4">
          <div className="p-3">
            <p className="small fw-semibold text-neutral-700 mb-2">Buscar alumno</p>
            <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Nombre o email del alumno..." />
            {searchQuery && filteredUsers.length > 0 && (
              <div className="mt-2 border rounded-2">
                {filteredUsers.slice(0, 10).map((u: User) => (
                  <button
                    key={u.id}
                    onClick={() => { setSelectedUserId(u.id); setSearchQuery('') }}
                    className="d-block w-100 text-start px-3 py-2 border-bottom hover-bg-light bg-transparent border-0"
                  >
                    <span className="small fw-medium">{u.name}</span>
                    <span className="small text-muted ms-2">({u.email})</span>
                  </button>
                ))}
              </div>
            )}
            {selectedUserId && (
              <div className="mt-2">
                <span className="badge bg-bar-500 text-white d-inline-flex align-items-center gap-2 px-3 py-2">
                  {users?.find((u: User) => u.id === selectedUserId)?.name || 'Usuario'}
                  <button onClick={() => setSelectedUserId(null)} className="btn-close btn-close-white" style={{ fontSize: '0.5rem' }} />
                </span>
              </div>
            )}
          </div>
        </Card>
      )}

      {progress && progress.overall_percent !== undefined && (
        <Card className="mb-4">
          <div className="p-4">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="small fw-semibold text-neutral-700">Progreso global</span>
              <span className="small fw-bold" style={{ color: progress.overall_percent >= 100 ? '#83CA18' : undefined }}>
                {Math.round(progress.overall_percent)}%
              </span>
            </div>
            <div className="progress" style={{ height: 12 }}>
              <div
                className="progress-bar"
                style={{
                  width: `${progress.overall_percent}%`,
                  backgroundColor: progress.overall_percent >= 100 ? '#83CA18' : undefined,
                }}
              />
            </div>
            {progress.overall_percent >= 100 && (
              <p className="small text-success fw-semibold mt-2 mb-0">
                <FaCheck className="me-1" /> Completaste todos los requisitos del curso
              </p>
            )}
          </div>
        </Card>
      )}

      {progress?.courses.map((course: CourseProgressSummary) => (
        <Card key={course.course_id} className="mb-3">
          <div className="p-4">
            <div
              onClick={() => setExpandedCourse(expandedCourse === course.course_id ? null : course.course_id)}
              className="d-flex align-items-center justify-content-between cursor-pointer"
              style={{ cursor: 'pointer' }}
            >
              <div className="flex-grow-1 me-3">
                <p className="fw-semibold text-neutral-800 mb-1">{course.course_title}</p>
                <div className="d-flex align-items-center gap-3">
                  <div className="flex-grow-1">
                    <div className="progress" style={{ height: 8 }}>
                      <div
                        className="progress-bar"
                        style={{
                          width: `${course.progress_percent}%`,
                          backgroundColor: course.progress_percent >= 100 ? '#83CA18' : undefined,
                        }}
                      />
                    </div>
                  </div>
                  <span className="small fw-bold" style={{ color: course.progress_percent >= 100 ? '#83CA18' : undefined }}>
                    {Math.round(course.progress_percent)}%
                  </span>
                </div>
                <small className="text-muted">{course.completed_modules}/{course.total_modules} módulos completados</small>
              </div>
              {expandedCourse === course.course_id ? <FaChevronDown className="text-muted" /> : <FaChevronRight className="text-muted" />}
            </div>

            {expandedCourse === course.course_id && (
              <div className="mt-3 border-top pt-3">
                {course.modules.map((mod) => {
                  const complete = isModuleComplete(mod)
                  return (
                    <div key={mod.module_id} className="py-3 border-bottom">
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <div className="d-flex align-items-center gap-2">
                          {complete ? (
                            <span className="text-success fw-bold"><FaCheck /></span>
                          ) : mod.total_assessment_questions > 0 || mod.total_tasks > 0 ? (
                            <span className="text-warning">⏳</span>
                          ) : (
                            <span className="text-muted">📝</span>
                          )}
                          <div>
                            <p className="small fw-medium text-neutral-800 mb-0">{mod.module_title}</p>
                            <small className="text-muted">
                              {mod.total_assessment_questions > 0
                                ? `Evaluación: ${mod.last_score ?? '—'}/100 · ${mod.attempts_count} intento${mod.attempts_count !== 1 ? 's' : ''}`
                                : 'Sin evaluación'}
                              {mod.total_tasks > 0 && ` · Tareas: ${mod.submitted_tasks}/${mod.total_tasks}`}
                            </small>
                          </div>
                        </div>
                        <div>
                          {complete ? (
                            <span className="badge bg-success">Completado</span>
                          ) : (
                            <span className="badge bg-secondary">Pendiente</span>
                          )}
                        </div>
                      </div>

                      {mod.tasks.length > 0 && (
                        <div className="ms-4 mt-1">
                          <small className="text-muted fw-medium">Tareas:</small>
                          {mod.tasks.map((task) => (
                            <div key={task.task_id} className="d-flex align-items-center justify-content-between py-1">
                              <div className="d-flex align-items-center gap-2">
                                <FaFileAlt className="text-bar-500" style={{ fontSize: '0.75rem' }} />
                                <small>{task.task_title}</small>
                                {task.submitted ? (
                                  <span className="badge bg-success" style={{ fontSize: '0.65rem' }}>
                                    <FaCheck className="me-1" /> Entregado
                                  </span>
                                ) : (
                                  <span className="badge bg-secondary" style={{ fontSize: '0.65rem' }}>
                                    <FaTimes className="me-1" /> No entregado
                                  </span>
                                )}
                              </div>
                              {task.submitted && task.submission_id && (
                                <button
                                  onClick={() => handleDownload(mod)}
                                  disabled={downloading === task.submission_id}
                                  className="btn btn-sm btn-outline-secondary d-inline-flex align-items-center gap-1"
                                  style={{ fontSize: '0.75rem' }}
                                >
                                  {downloading === task.submission_id ? (
                                    <><Spinner /> Descargando...</>
                                  ) : (
                                    <><FaDownload /> Descargar</>
                                  )}
                                </button>
                              )}
                            </div>
                          ))}
                          {mod.submitted_tasks < mod.total_tasks && (
                            <small className="text-warning d-block mt-1">
                              Debes completar todas las tareas para finalizar el curso.
                            </small>
                          )}
                        </div>
                      )}

                      <div className="d-flex align-items-center gap-2 mt-2 ms-4">
                        {!mod.passed && mod.total_assessment_questions > 0 && (
                          <button
                            onClick={() => {
                              setExpandedCourse(null)
                              navigate(`/courses/${course.course_id}`)
                            }}
                            className="btn btn-sm btn-outline-bar-600 d-inline-flex align-items-center gap-1"
                          >
                            <FaClipboardCheck /> Tomar evaluación
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </Card>
      ))}

      {progress?.courses.length === 0 && (
        <Card>
          <p className="text-center py-4 small text-muted mb-0">No hay cursos inscritos.</p>
        </Card>
      )}
    </div>
  )
}
