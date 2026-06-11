import { useParams, Link } from 'react-router-dom'
import { useLesson } from '../hooks/useLessons'
import { useModule } from '../hooks/useModules'
import { useCourse } from '../hooks/useCourses'
import { useTasksByLesson } from '../hooks/useTasks'
import { useLessonFiles } from '../hooks/useLessonFiles'
import { downloadTaskFile } from '../lib/download'
import Card from '../components/molecules/Card'
import Skeleton from '../components/atoms/Skeleton'
import { FaArrowLeft, FaFilePdf, FaVideo, FaImage, FaFile, FaClipboardList, FaExternalLinkAlt, FaArrowUp, FaFileAlt, FaDownload, FaEye } from 'react-icons/fa'
import { lessonFileService } from '../services/lessonFileService'

function getYoutubeEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url)
    const host = u.hostname.replace(/^www\./, '').replace(/^m\./, '')
    if (!['youtube.com', 'youtu.be'].includes(host)) return null
    let id: string | null = null
    if (host === 'youtu.be') { id = u.pathname.slice(1).split('/')[0] || null }
    else if (u.pathname.startsWith('/embed/') || u.pathname.startsWith('/shorts/')) { id = u.pathname.split('/')[2]?.split('?')[0] || null }
    else { id = u.searchParams.get('v') }
    return id ? `https://www.youtube.com/embed/${id}` : null
  } catch { return null }
}

function getGoogleDriveId(url: string): string | null {
  try {
    const u = new URL(url)
    if (!u.hostname.includes('drive.google.com')) return null
    const m = u.pathname.match(/\/file\/d\/([^/]+)/)
    return m ? m[1] : null
  } catch { return null }
}

export default function LessonViewPage() {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>()
  const lessonIdNum = Number(lessonId)
  const courseIdNum = Number(courseId)
  const { data: lesson, isLoading: loadingLesson } = useLesson(lessonIdNum)
  const { data: mod } = useModule(lesson?.module_id ?? 0)
  const { data: course } = useCourse(courseIdNum)
  const { data: tasks } = useTasksByLesson(lessonIdNum)
  const { data: lessonFiles } = useLessonFiles(lessonIdNum)

  if (loadingLesson) return <div className="p-6 lg:p-8"><Skeleton count={4} className="h-8 w-full" /></div>
  if (!lesson) return <div className="p-6 lg:p-8"><p className="text-muted">Lección no encontrada</p></div>

  return (
    <div className="p-6 lg:p-8">
      <div className="d-flex align-items-center gap-2 small mb-3">
        <Link to={`/courses/${courseIdNum}`} className="d-inline-flex align-items-center gap-1 fw-medium text-bar-600 text-decoration-none">
          <FaArrowLeft /> {course?.title || 'Curso'}
        </Link>
        <span className="text-muted">/</span>
        <span className="text-muted">{mod?.title || 'Módulo'}</span>
      </div>

      <div className="row g-4">
        <div className={`col-12 ${lesson.video_content_url ? 'col-xl-6' : ''}`}>
          <Card padding={false}>
            <div className="border-bottom px-4 py-3 bg-content-50 rounded-top">
              <div className="d-flex align-items-center gap-2">
                <FaFileAlt className="text-bar-500" />
                <h1 className="h5 fw-bold text-neutral-800 mb-0">{lesson.title}</h1>
              </div>
            </div>

            {lesson.text_content && (
              <div className="px-4 py-4 border-bottom">
                <div className="text-muted small whitespace-pre-wrap text-justify">{lesson.text_content}</div>
              </div>
            )}

            {lessonFiles && lessonFiles.length > 0 && (
              <div className="px-4 py-4 border-bottom">
                <div className="d-flex align-items-center gap-2 mb-3">
                  <FaFileAlt className="text-bar-500" />
                  <h6 className="fw-bold text-neutral-800 mb-0">Archivos de la lección</h6>
                </div>
                <div className="d-flex flex-column gap-2">
                  {lessonFiles.map((f) => (
                    <div key={f.id} className="d-flex align-items-center justify-content-between rounded border px-3 py-2">
                      <div className="d-flex align-items-center gap-2 min-w-0">
                        <FaFileAlt className="text-bar-500 shrink-0" />
                        <span className="small text-truncate">{f.original_filename || 'Archivo'}</span>
                      </div>
                      <div className="d-flex gap-2 shrink-0">
                        <a
                          href={lessonFileService.getFileUrl(lessonIdNum, f.id)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1"
                        >
                          <FaEye /> Ver
                        </a>
                        <a
                          href={lessonFileService.getFileUrl(lessonIdNum, f.id, true)}
                          download={f.original_filename || undefined}
                          className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1"
                        >
                          <FaDownload /> Descargar
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {lesson.image_content_url && (() => {
              const gId = getGoogleDriveId(lesson.image_content_url)
              const src = gId ? `https://drive.google.com/thumbnail?id=${gId}&sz=w1000` : lesson.image_content_url
              return (
                <div className="px-4 py-4 border-bottom">
                  <div className="d-flex align-items-center gap-1 small fw-medium text-muted mb-2">
                    <FaImage className="text-warning-500" /> Imagen
                  </div>
                  <img src={src} alt={lesson.title} className="rounded-3 border max-w-100 w-100" style={{ maxHeight: 500, objectFit: 'contain' }} />
                </div>
              )
            })()}

            {lesson.file_content_url && (() => {
              const gId = getGoogleDriveId(lesson.file_content_url)
              const dlUrl = gId ? `https://drive.google.com/uc?export=download&id=${gId}` : lesson.file_content_url
              const previewUrl = gId ? `https://drive.google.com/file/d/${gId}/preview` : null
              return (
                <div className="px-4 py-4 border-bottom">
                  <div className="d-flex align-items-center gap-1 small fw-medium text-muted mb-2">
                    <FaFile className="text-info-500" /> Archivo adjunto
                  </div>
                  <div className="d-flex gap-2">
                    <a href={dlUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1"><FaArrowUp /> Descargar</a>
                    {previewUrl && <a href={previewUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1"><FaFilePdf /> Vista previa</a>}
                  </div>
                </div>
              )
            })()}

            {tasks && tasks.length > 0 && (
              <div className="px-4 py-4">
                <div className="d-flex align-items-center gap-2 mb-3">
                  <FaClipboardList className="text-bar-500" />
                  <h6 className="fw-bold text-neutral-800 mb-0">Tareas</h6>
                </div>
                {tasks.map((task) => (
                  <Card key={task.id} className="mb-2">
                    <div className="d-flex align-items-start justify-content-between gap-3">
                      <div className="flex-grow-1 min-w-0">
                        <p className="fw-medium text-neutral-800 mb-0">{task.title}</p>
                        {task.description && <small className="text-muted">{task.description}</small>}
                        <div className="mt-2 d-flex flex-wrap gap-2">
                          {task.file_type === 'google_drive' && task.google_drive_link && (
                            <a href={task.google_drive_link} target="_blank" rel="noopener noreferrer" className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1"><FaExternalLinkAlt /> Ver en Google Drive</a>
                          )}
                          {task.file_type === 'upload' && task.file_url && (
                            <button onClick={() => downloadTaskFile(task.id)} className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1"><FaArrowUp /> Descargar</button>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </Card>
        </div>

        {lesson.video_content_url && (() => {
          const ytEmbed = getYoutubeEmbedUrl(lesson.video_content_url)
          const gId = getGoogleDriveId(lesson.video_content_url)
          const driveEmbed = gId ? `https://drive.google.com/file/d/${gId}/preview` : null
          const embedUrl = ytEmbed ?? driveEmbed ?? null
          return (
            <div className="col-12 col-xl-6">
              <div className="position-sticky" style={{ top: '1rem' }}>
                <Card padding={false}>
                  <div className="px-4 py-3 bg-content-50 rounded-top border-bottom">
                    <div className="d-flex align-items-center gap-1 small fw-medium text-muted">
                      <FaVideo className="text-danger-500" /> Video
                    </div>
                  </div>
                  <div className="px-4 py-4">
                    {embedUrl ? (
                      <div className="position-relative w-100" style={{ paddingBottom: '56.25%' }}>
                        <iframe src={embedUrl} className="position-absolute inset-0 w-100 h-100 rounded-3 border" allowFullScreen title={lesson.title} />
                      </div>
                    ) : (
                      <video controls src={lesson.video_content_url} className="rounded-3 border w-100" />
                    )}
                  </div>
                </Card>
              </div>
            </div>
          )
        })()}
      </div>

      <div className="mt-3">
        <Link to={`/courses/${courseIdNum}`} className="d-inline-flex align-items-center gap-1 small fw-medium text-bar-600 text-decoration-none">
          <FaArrowLeft /> Volver al curso
        </Link>
      </div>
    </div>
  )
}
