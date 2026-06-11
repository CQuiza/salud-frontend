import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useAllProgressSummaries } from '../hooks/useModuleAssessments'
import { useUsers } from '../hooks/useUsers'
import Card from '../components/molecules/Card'
import SearchBar from '../components/molecules/SearchBar'
import Skeleton from '../components/atoms/Skeleton'
import Spinner from '../components/atoms/Spinner'
import { FaChevronDown, FaChevronRight, FaClipboardCheck } from 'react-icons/fa'
import type { CourseProgressSummary, AllProgressSummary, User } from '../types'
import { useNavigate } from 'react-router-dom'

export default function ProgressPage() {
  const { user } = useAuth()
  const isStaff = user && ['superuser', 'admin', 'teacher'].includes(user.role)
  const navigate = useNavigate()

  const [selectedUserId, setSelectedUserId] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedCourse, setExpandedCourse] = useState<number | null>(null)

  const { data: users } = useUsers()
  const { data: progress, isLoading } = useAllProgressSummaries(selectedUserId ?? undefined)

  const filteredUsers = isStaff && users
    ? users.filter(
        (u: User) =>
          u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          u.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : []

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
              <span className="small fw-bold text-bar-600">{Math.round(progress.overall_percent)}%</span>
            </div>
            <div className="progress" style={{ height: 12 }}>
              <div
                className="progress-bar bg-bar-500"
                style={{ width: `${progress.overall_percent}%` }}
              />
            </div>
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
                        className="progress-bar bg-bar-500"
                        style={{ width: `${course.progress_percent}%` }}
                      />
                    </div>
                  </div>
                  <span className="small fw-bold text-bar-600">{Math.round(course.progress_percent)}%</span>
                </div>
                <small className="text-muted">{course.completed_modules}/{course.total_modules} módulos completados</small>
              </div>
              {expandedCourse === course.course_id ? <FaChevronDown className="text-muted" /> : <FaChevronRight className="text-muted" />}
            </div>

            {expandedCourse === course.course_id && (
              <div className="mt-3 border-top pt-3">
                {course.modules.map((mod) => (
                  <div key={mod.module_id} className="d-flex align-items-center justify-content-between py-2 border-bottom">
                    <div className="d-flex align-items-center gap-2">
                      {mod.passed ? (
                        <span className="text-success fw-bold">✓</span>
                      ) : mod.total_assessment_questions > 0 ? (
                        <span className="text-warning">⏳</span>
                      ) : (
                        <span className="text-muted">📝</span>
                      )}
                      <div>
                        <p className="small fw-medium text-neutral-800 mb-0">{mod.module_title}</p>
                        <small className="text-muted">
                          {mod.total_assessment_questions > 0
                            ? `Calificación: ${mod.last_score ?? '—'}/100 · ${mod.attempts_count} intento${mod.attempts_count !== 1 ? 's' : ''}`
                            : 'Sin evaluar'}
                        </small>
                      </div>
                    </div>
                    <div>
                      {mod.passed ? (
                        <span className="badge bg-success">Aprobado</span>
                      ) : mod.total_assessment_questions > 0 ? (
                        <button
                          onClick={() => {
                            setExpandedCourse(null)
                            navigate(`/courses/${course.course_id}`)
                          }}
                          className="btn btn-sm btn-outline-bar-600 d-inline-flex align-items-center gap-1"
                        >
                          <FaClipboardCheck /> Tomar evaluación
                        </button>
                      ) : (
                        <span className="badge bg-secondary">Sin evaluar</span>
                      )}
                    </div>
                  </div>
                ))}
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
