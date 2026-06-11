import { useAuth } from '../context/AuthContext'
import { useUsers } from '../hooks/useUsers'
import { useCertificates } from '../hooks/useCertificates'
import { useCourses } from '../hooks/useCourses'
import { useCertificateTypes } from '../hooks/useCertificateTypes'
import Card from '../components/molecules/Card'
import { FaUsers, FaAward, FaGraduationCap, FaFileAlt, FaCheckCircle, FaTimesCircle, FaClock } from 'react-icons/fa'

export default function DashboardPage() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'superuser' || user?.role === 'admin'

  const { data: users } = useUsers(undefined, { enabled: isAdmin })
  const { data: certificates } = useCertificates()
  const { data: courses } = useCourses()
  const { data: certTypes } = useCertificateTypes(undefined, { enabled: isAdmin })

  const activeCerts = certificates?.filter((c) => c.status === 'active').length ?? 0
  const expiredCerts = certificates?.filter((c) => c.status === 'expired').length ?? 0
  const revokedCerts = certificates?.filter((c) => c.status === 'revoked').length ?? 0

  const stats = [
    { label: 'Usuarios activos', value: isAdmin ? (users?.length ?? '—') : '—', icon: FaUsers, color: 'text-bar-600 bg-bar-50' },
    { label: 'Total certificados', value: certificates?.length ?? '—', icon: FaAward, color: 'text-success-600 bg-success-50' },
    { label: 'Cursos publicados', value: courses?.length ?? '—', icon: FaGraduationCap, color: 'text-warning-600 bg-warning-50' },
    { label: 'Tipos de certificado', value: isAdmin ? (certTypes?.length ?? '—') : '—', icon: FaFileAlt, color: 'text-info-600 bg-info-50' },
  ]

  const certStatusCards = [
    { label: 'Activos', value: activeCerts, icon: FaCheckCircle, color: 'text-success-600 bg-success-50' },
    { label: 'Expirados', value: expiredCerts, icon: FaClock, color: 'text-warning-600 bg-warning-50' },
    { label: 'Revocados', value: revokedCerts, icon: FaTimesCircle, color: 'text-danger-600 bg-danger-50' },
  ]

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl fw-bold text-neutral-800">
          Hola, {user?.name || 'Usuario'}
        </h1>
        <p className="mt-1 small text-muted">
          Panel principal de la plataforma EduCert
        </p>
      </div>

      <div className="d-flex flex-column flex-xl-row gap-4" style={{ maxWidth: '100%' }}>
        <div style={{ flex: '2 1 0%', minWidth: 0 }}>
          <div className="row g-3 mb-4">
            {stats.map((stat) => {
              const Icon = stat.icon
              return (
                <div key={stat.label} className="col-12 col-sm-6">
                  <Card>
                    <div className="d-flex align-items-center gap-3">
                      <div className={`d-flex align-items-center justify-content-center rounded-3 ${stat.color}`} style={{ width: 48, height: 48 }}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="fs-4 fw-bold text-neutral-800 mb-0">{stat.value}</p>
                        <p className="small text-muted mb-0">{stat.label}</p>
                      </div>
                    </div>
                  </Card>
                </div>
              )
            })}
          </div>

          <h2 className="mb-3 fs-5 fw-semibold text-neutral-800">Estado de Certificados</h2>
          <div className="row g-3">
            {certStatusCards.map((c) => {
              const Icon = c.icon
              return (
                <div key={c.label} className="col-12 col-sm-4">
                  <Card>
                    <div className="d-flex align-items-center gap-3">
                      <div className={`d-flex align-items-center justify-content-center rounded-3 ${c.color}`} style={{ width: 48, height: 48 }}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="fs-4 fw-bold text-neutral-800 mb-0">{c.value}</p>
                        <p className="small text-muted mb-0">{c.label}</p>
                      </div>
                    </div>
                  </Card>
                </div>
              )
            })}
          </div>
        </div>

        <div className="d-none d-xl-block" style={{ flex: '1 1 0%', minWidth: 0 }}>
          <div className="position-sticky" style={{ top: '1rem' }}>
            <img
              src="/panel-bg.jpg"
              alt="Panel EduCert"
              className="w-100 rounded-3 border shadow-sm"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
