import { useState } from 'react'
import { useCertificateAudits } from '../hooks/useCertificateAudits'
import { useWorkerAudits } from '../hooks/useWorkerAudits'
import { useUserAudits } from '../hooks/useUserAudits'
import { useEmailAudits } from '../hooks/useEmailAudits'
import Card from '../components/molecules/Card'
import DataTable from '../components/molecules/DataTable'
import SearchBar from '../components/molecules/SearchBar'
import Pagination from '../components/molecules/Pagination'
import Badge from '../components/atoms/Badge'
import Skeleton from '../components/atoms/Skeleton'
import { FaClipboardList, FaServer, FaUserTimes, FaEnvelope } from 'react-icons/fa'
import { formatDate } from '../lib/dates'
import { auditStatusVariant } from '../lib/statusVariant'
import type { CertificateAudit, WorkerAudit, UserAudit, EmailAudit } from '../types'

const PAGE_SIZE = 15
type TabId = 'certificate' | 'worker' | 'user' | 'email'

const tabs: { id: TabId; label: string; icon: typeof FaClipboardList }[] = [
  { id: 'certificate', label: 'Certificados', icon: FaClipboardList },
  { id: 'worker', label: 'Trabajos', icon: FaServer },
  { id: 'user', label: 'Usuarios eliminados', icon: FaUserTimes },
  { id: 'email', label: 'Correos', icon: FaEnvelope },
]

export default function CertificateAuditPage() {
  const [tab, setTab] = useState<TabId>('certificate')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const { data: certAudits, isLoading: loadingCert } = useCertificateAudits()
  const { data: workerAudits, isLoading: loadingWorker } = useWorkerAudits()
  const { data: userAudits, isLoading: loadingUser } = useUserAudits()
  const { data: emailAudits, isLoading: loadingEmail } = useEmailAudits()
  const isLoading = tab === 'certificate' ? loadingCert : tab === 'worker' ? loadingWorker : tab === 'user' ? loadingUser : loadingEmail

  const actionVariant = (action: string) => {
    if (action === 'issued') return 'info' as const
    if (action === 'active') return 'success' as const
    if (action === 'revoked' || action === 'deleted') return 'danger' as const
    return 'warning' as const
  }

  const certColumns = [
    { key: 'id', header: 'ID' },
    { key: 'certificate_id', header: 'Certificado ID', render: (a: CertificateAudit) => a.certificate_id ?? '—' },
    { key: 'certificate_unique_id', header: 'UUID', render: (a: CertificateAudit) => <span className="font-monospace small text-muted cursor-pointer" title={a.certificate_unique_id ?? ''} onClick={() => { if (a.certificate_unique_id) navigator.clipboard.writeText(a.certificate_unique_id) }}>{a.certificate_unique_id?.slice(0, 8) || '—'}</span> },
    { key: 'action', header: 'Acción', render: (a: CertificateAudit) => <Badge variant={actionVariant(a.action || '')}>{a.action || '—'}</Badge> },
    { key: 'performed_by', header: 'Realizado por', render: (a: CertificateAudit) => a.performed_by ?? '—' },
    { key: 'timestamp', header: 'Fecha', render: (a: CertificateAudit) => formatDate(a.timestamp, { withTime: true }) },
  ]

  const workerColumns = [
    { key: 'id', header: 'ID' },
    { key: 'task_name', header: 'Tarea' },
    { key: 'status', header: 'Estado', render: (a: WorkerAudit) => <Badge variant={auditStatusVariant(a.status)}>{a.status}</Badge> },
    { key: 'started_at', header: 'Inicio', render: (a: WorkerAudit) => formatDate(a.started_at, { withTime: true }) },
    { key: 'finished_at', header: 'Fin', render: (a: WorkerAudit) => formatDate(a.finished_at, { withTime: true }) },
    { key: 'details', header: 'Detalles', render: (a: WorkerAudit) => <small className="text-muted line-clamp-1">{a.details || '—'}</small> },
  ]

  const userColumns = [
    { key: 'id', header: 'ID' },
    { key: 'user_id', header: 'Usuario ID', render: (a: UserAudit) => a.user_id ?? '—' },
    { key: 'deleted_by', header: 'Eliminado por', render: (a: UserAudit) => a.deleted_by ?? '—' },
    { key: 'deleted_at', header: 'Fecha de eliminación', render: (a: UserAudit) => formatDate(a.deleted_at, { withTime: true }) },
  ]

  const emailColumns = [
    { key: 'id', header: 'ID' },
    { key: 'user_name', header: 'Nombre', align: 'left' as const, render: (a: EmailAudit) => a.user_name || '—' },
    { key: 'email_to', header: 'Destinatario' },
    { key: 'email_type', header: 'Tipo', render: (a: EmailAudit) => {
      const labels: Record<string, string> = { credentials: 'Credenciales', certificate_issued: 'Certificado emitido', certificate_expired: 'Certificado expirado' }
      return labels[a.email_type] || a.email_type
    }},
    { key: 'status', header: 'Estado', render: (a: EmailAudit) => <Badge variant={auditStatusVariant(a.status)}>{a.status}</Badge> },
    { key: 'error', header: 'Error', render: (a: EmailAudit) => <small className="text-danger line-clamp-1">{a.error || '—'}</small> },
    { key: 'created_at', header: 'Creado', render: (a: EmailAudit) => formatDate(a.created_at, { withTime: true }) },
    { key: 'sent_at', header: 'Enviado', render: (a: EmailAudit) => formatDate(a.sent_at, { withTime: true }) },
  ]

  function getData() {
    const q = search.toLowerCase()
    switch (tab) {
      case 'certificate': {
        if (!certAudits) return []
        let rows = [...certAudits]
        if (q) rows = rows.filter((a) => a.action?.toLowerCase().includes(q) || String(a.certificate_id ?? '').includes(q) || String(a.performed_by ?? '').includes(q) || a.certificate_unique_id?.toLowerCase().includes(q))
        return rows.sort((a, b) => b.id - a.id)
      }
      case 'worker': {
        if (!workerAudits) return []
        let rows = [...workerAudits]
        if (q) rows = rows.filter((a) => a.task_name.toLowerCase().includes(q) || a.status.toLowerCase().includes(q) || (a.details && a.details.toLowerCase().includes(q)))
        return rows
      }
      case 'user': {
        if (!userAudits) return []
        let rows = [...userAudits]
        if (q) rows = rows.filter((a) => String(a.user_id ?? '').includes(q) || String(a.deleted_by ?? '').includes(q))
        return rows
      }
      case 'email': {
        if (!emailAudits) return []
        let rows = [...emailAudits]
        if (q) rows = rows.filter((a) => a.email_to.toLowerCase().includes(q) || a.email_type.toLowerCase().includes(q) || a.status.toLowerCase().includes(q) || (a.error && a.error.toLowerCase().includes(q)))
        return rows
      }
    }
  }

  const filtered = getData()
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const pageData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-4 d-flex align-items-center justify-content-between">
        <div>
          <h1 className="fs-2 fw-bold text-neutral-800 mb-0">Auditoría</h1>
          <p className="small text-muted mb-0">Registro de todas las acciones de la plataforma</p>
        </div>
      </div>

      <div className="d-flex flex-wrap gap-1 mb-4 p-1 bg-content-100 rounded-3 border">
        {tabs.map((t) => {
          const active = tab === t.id; const Icon = t.icon
          return (
            <button key={t.id} onClick={() => { setTab(t.id); setSearch(''); setPage(1) }} className={`btn btn-sm d-flex align-items-center gap-1 ${active ? 'btn-light shadow-sm' : 'btn-ghost text-muted'}`}>
              <Icon /> {t.label}
            </button>
          )
        })}
      </div>

      <Card padding={false}>
        <div className="border-bottom px-3 py-3">
          <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1) }} placeholder="Buscar..." />
        </div>
        {isLoading ? (
          <div className="p-4"><Skeleton count={5} className="h-10 w-full" /></div>
        ) : filtered.length === 0 ? (
          <p className="text-center py-5 small text-muted mb-0">No se encontraron registros.</p>
        ) : (
          <>
            {tab === 'certificate' && <DataTable columns={certColumns} data={pageData as CertificateAudit[]} />}
            {tab === 'worker' && <DataTable columns={workerColumns} data={pageData as WorkerAudit[]} />}
            {tab === 'user' && <DataTable columns={userColumns} data={pageData as UserAudit[]} />}
            {tab === 'email' && <DataTable columns={emailColumns} data={pageData as EmailAudit[]} />}
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </>
        )}
      </Card>
    </div>
  )
}
