import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button, Alert } from 'react-bootstrap'
import { FaSearch, FaUser, FaIdCard, FaCalendarAlt, FaClock, FaExclamationCircle, FaFilePdf, FaQrcode } from 'react-icons/fa'
import Badge from '../components/atoms/Badge'
import Skeleton from '../components/atoms/Skeleton'
import PublicFooter from '../components/organisms/PublicFooter'
import { useCertificateTypes } from '../hooks/useCertificateTypes'
import { certificateStatusVariant } from '../lib/statusVariant'
import { formatDate } from '../lib/dates'
import { config } from '../config'
import api from '../services/api'
import type { Certificate } from '../types'

interface SearchResult {
  user_name: string | null
  user_email: string | null
  identity_number: string | null
  certificates: Certificate[]
}

export default function SearchPage() {
  const [identityNumber, setIdentityNumber] = useState('')
  const [result, setResult] = useState<SearchResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { data: certTypes } = useCertificateTypes()
  const typeMap = useMemo(() => {
    if (!certTypes) return {} as Record<number, string>
    return Object.fromEntries(certTypes.map((t) => [t.id, t.name]))
  }, [certTypes])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!identityNumber.trim()) return
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const { data } = await api.get<SearchResult[]>(`/certificates/search-by-identity/${encodeURIComponent(identityNumber.trim())}`)
      if (data.length > 0) setResult(data[0])
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { status?: number; data?: { detail?: string } } }
        if (axiosErr.response?.status === 404) {
          setError('No se encontraron certificados para esta identidad.')
        } else {
          setError(axiosErr.response?.data?.detail || 'Error al consultar los certificados.')
        }
      } else {
        setError('Error de conexión. Intente nuevamente.')
      }
    } finally {
      setLoading(false)
    }
  }

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

      <div className="container-fluid">
        <div className="row min-vh-70">
          <div className="col-12 col-lg-6 d-flex flex-column justify-content-center p-5">
            <div className="mx-auto" style={{ maxWidth: 480 }}>
              <h1 className="fw-bold text-neutral-800">Verificar Certificados</h1>
              <p className="text-muted mb-4">Ingresa tu número de identificación para consultar tus certificados</p>

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="Número de identificación"
                    value={identityNumber}
                    onChange={(e) => setIdentityNumber(e.target.value)}
                    required
                    size="lg"
                  />
                </Form.Group>
                <Button type="submit" variant="primary" size="lg" className="w-100" disabled={loading}>
                  {loading ? 'Consultando…' : (
                    <><FaSearch className="me-2" />Consultar</>
                  )}
                </Button>
              </Form>

              {loading && (
                <div className="mt-4">
                  <Skeleton count={3} className="h-16 w-full" />
                </div>
              )}

              {error && (
                <Alert variant="danger" className="mt-4 d-flex align-items-center gap-2">
                  <FaExclamationCircle />
                  {error}
                </Alert>
              )}

              {result && (
                <div className="mt-4">
                  <div className="border rounded-3 p-4 bg-white shadow-sm mb-3">
                    <div className="d-flex align-items-center gap-3">
                      <FaUser className="text-muted" />
                      <div>
                        <p className="fw-medium mb-0 text-neutral-800">{result.user_name || 'Usuario'}</p>
                        <small className="text-muted d-flex align-items-center gap-1">
                          <FaIdCard /> {result.identity_number}
                        </small>
                      </div>
                    </div>
                  </div>

                  <h6 className="fw-semibold mb-3">Certificados encontrados ({result.certificates.length})</h6>

                  {result.certificates.map((cert) => (
                    <div key={cert.id} className="border rounded-3 p-4 bg-white shadow-sm mb-3">
                      <div className="d-flex align-items-start justify-content-between gap-3">
                        <div>
                          <div className="d-flex align-items-center gap-2 mb-2">
                            <Badge variant={certificateStatusVariant(cert.status)}>{cert.status}</Badge>
                            {cert.certificate_type_id != null && typeMap[cert.certificate_type_id] && (
                              <span className="fw-bold text-neutral-800">{typeMap[cert.certificate_type_id]}</span>
                            )}
                          </div>
                          <div className="d-flex gap-4 small text-muted">
                            <span className="d-flex align-items-center gap-1"><FaCalendarAlt /> Emitido: {formatDate(cert.issued_at)}</span>
                            <span className="d-flex align-items-center gap-1"><FaClock /> Expira: {cert.expires_at ? formatDate(cert.expires_at) : '—'}</span>
                          </div>
                          <small className="text-muted font-monospace">ID: {cert.unique_id.slice(0, 8)}…</small>
                        </div>
                        <div className="d-flex gap-2">
                          <a href={`${config.apiUrl}/certificates/view/${cert.unique_id}`} target="_blank" rel="noopener noreferrer" className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1">
                            <FaFilePdf /> PDF
                          </a>
                          <a href={`${config.apiUrl}/certificates/view/${cert.unique_id}/qr`} target="_blank" rel="noopener noreferrer" className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1">
                            <FaQrcode /> QR
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="d-none d-lg-block col-lg-6 p-0">
            <div
              className="h-100 w-100"
              style={{
                backgroundImage: "url('/search-bg.jpg')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
          </div>
        </div>
      </div>

      <PublicFooter />
    </div>
  )
}
