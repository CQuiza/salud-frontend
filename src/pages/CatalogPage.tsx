import { useCourses } from '../hooks/useCourses'
import { Link } from 'react-router-dom'
import Skeleton from '../components/atoms/Skeleton'
import PublicFooter from '../components/organisms/PublicFooter'
import { FaGraduationCap, FaBookOpen, FaClock } from 'react-icons/fa'

export default function CatalogPage() {
  const { data: courses, isLoading } = useCourses({ limit: 50 })
  const published = (courses || []).filter((c) => c.status === 'published')

  return (
    <div className="min-h-screen bg-content-50">
      <header className="border-b border-bar-200 bg-bar-500">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <Link to="/">
            <img src="/logo.png" alt="EduCert" className="h-14 w-auto object-contain" />
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/" className="text-sm font-medium text-bar-100 hover:text-white transition-colors">Inicio</Link>
            <Link to="/login" className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-bar-600 hover:bg-bar-100 transition-colors">Iniciar sesión</Link>
          </div>
        </div>
      </header>

      <section className="bg-gradient-to-r from-bar-600 to-bar-800 py-12">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <h1 className="text-3xl font-bold text-white">Catálogo de Cursos</h1>
          <p className="mt-2 text-bar-200">Explora los cursos disponibles y encuentra el que mejor se ajuste a tus necesidades</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12">
        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-neutral-200 bg-white p-6">
                <Skeleton className="h-5 w-3/4 mb-3" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}
          </div>
        ) : published.length === 0 ? (
          <div className="rounded-xl border border-neutral-200 bg-white p-12 text-center">
            <FaGraduationCap className="mx-auto h-12 w-12 text-neutral-300" />
            <p className="mt-4 text-lg font-medium text-neutral-600">No hay cursos disponibles por el momento</p>
            <p className="mt-1 text-sm text-neutral-400">Vuelve a consultar más tarde.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {published.map((course) => (
              <div key={course.id} className="group rounded-xl border border-neutral-200 bg-white p-6 transition-shadow hover:shadow-md">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-bar-50 text-bar-500 mb-4">
                  <FaBookOpen className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 group-hover:text-bar-600 transition-colors">
                  {course.title}
                </h3>
                {course.description && (
                  <p className="mt-2 text-sm text-neutral-500 line-clamp-3">{course.description}</p>
                )}
                <div className="mt-4 flex items-center gap-1.5 text-xs text-neutral-400">
                  <FaClock className="h-3.5 w-3.5" />
                  <span>Curso disponible</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <PublicFooter />
    </div>
  )
}
