import { useState } from 'react'
import { FaShieldAlt, FaStar, FaChevronDown, FaChevronRight } from 'react-icons/fa'
import { config } from '../config'
import type { ReactNode } from 'react'

interface SectionItem { title: string; content: ReactNode }
interface Section { title: string; icon: typeof FaStar; color: string; bg: string; border: string; items: SectionItem[] }

const sections: Record<string, Section> = {
  superuser: {
    title: 'Manual para Superusuario', icon: FaStar, color: 'text-warning-600', bg: 'bg-warning-50', border: 'border-warning-200',
    items: [
      { title: 'Gestión de Usuarios', content: (
        <div>
          <p><strong>Crear usuario:</strong> Todos los campos son obligatorios excepto el segundo apellido. El sistema envía automáticamente un correo con las credenciales al email registrado. Solo un superusuario puede crear a otro superusuario.</p>
          <p><strong>Editar usuario:</strong> Se puede modificar cualquier campo. Solo un superusuario puede cambiar el rol de un usuario a superusuario o editar a otro superusuario.</p>
          <p><strong>Desactivar usuario</strong> (recomendado en lugar de eliminar): En la edición del usuario, cambiar el campo "Activo" a "No". El usuario no podrá iniciar sesión pero toda su información se conserva íntegramente.</p>
          <p><strong>Eliminar usuario:</strong> Solo superusuarios y administradores. Se guarda volcado JSON completo en auditoría. Los certificados, inscripciones y progreso se eliminan en cascada.</p>
        </div>
      )},
      { title: 'Roles y Permisos', content: (
        <div>
          <p>Cada rol tiene acceso a diferentes funcionalidades:</p>
          <div className="d-grid gap-2">
            <div className="border rounded-2 p-3"><p className="fw-semibold mb-1">⭐ Superusuario</p><small className="text-muted">Acceso total. Crea/edita/elimina cualquier recurso, incluyendo otros superusuarios.</small></div>
            <div className="border rounded-2 p-3"><p className="fw-semibold mb-1">🛡️ Administrador</p><small className="text-muted">Gestiona usuarios (excepto superusuarios), cursos, tipos de certificado, emite certificados y accede a auditoría.</small></div>
            <div className="border rounded-2 p-3"><p className="fw-semibold mb-1">👨‍🏫 Docente</p><small className="text-muted">Gestiona módulos, lecciones y tareas de sus cursos asignados. Ve sus propios certificados.</small></div>
            <div className="border rounded-2 p-3"><p className="fw-semibold mb-1">🎓 Estudiante</p><small className="text-muted">Ve cursos inscritos, accede a lecciones, realiza tareas y consulta sus certificados.</small></div>
          </div>
        </div>
      )},
      { title: 'Gestión de Certificados', content: (
        <div>
          <p><strong>Workflow:</strong> Crear Tipo de certificado → Crear Usuario → Ir a Certificados → "Adicionar Nuevo Certificado". Seleccionar usuario y tipo. El sistema genera UUID, QR y PDF automáticamente.</p>
          <p><strong>Revocación:</strong> Editar certificado y cambiar estado a "revoked". El certificado sigue siendo consultable pero aparece como revocado.</p>
          <p><strong>Búsqueda pública:</strong> /search sin autenticación.</p>
        </div>
      )},
      { title: 'Cursos', content: (<div><p>Creación independiente por admins/superusuarios. Pueden tener docente asignado, tipo de certificado asociado. Estados: draft, published, archived. Módulos y lecciones con contenido multimedia.</p></div>) },
      { title: 'Auditoría', content: (<div><p>4 pestañas: Certificados (acciones), Trabajos (background), Usuarios eliminados (volcado JSON), Correos (envíos). Solo lectura.</p></div>) },
    ],
  },
  admin: {
    title: 'Manual para Administrador', icon: FaShieldAlt, color: 'text-bar-600', bg: 'bg-bar-50', border: 'border-bar-200',
    items: [
      { title: 'Gestión de Usuarios', content: (
        <div>
          <p><strong>Crear usuario:</strong> Todos los campos obligatorios excepto segundo apellido. Se envía correo automático. No se puede crear superusuarios.</p>
          <p><strong>Desactivar usuario:</strong> Cambiar "Activo" a "No". Preserva datos y relaciones.</p>
          <p><strong>Eliminar usuario:</strong> Guarda volcado JSON. No se puede si tiene tipos de certificado creados o auditoría asociada.</p>
        </div>
      )},
      { title: 'Tipos de Certificado', content: (<div><p>Cada tipo tiene: Nombre, Tipo (basic/advanced/diploma), Horas, Vigencia, Referencia opcional.</p></div>) },
      { title: 'Emisión y Revocación de Certificados', content: (
        <div>
          <p><strong>Emitir:</strong> Tener tipo de certificado + usuario registrado → Certificados → "Adicionar Nuevo Certificado".</p>
          <p><strong>Revocar:</strong> Editar certificado → estado "revoked".</p>
        </div>
      )},
      { title: 'Auditoría', content: (<div><p>4 pestañas con info de solo lectura: Certificados, Trabajos, Usuarios eliminados, Correos.</p></div>) },
      { title: 'Buenas Prácticas', content: (
        <div><ul><li>Desactivar en lugar de eliminar usuarios</li><li>Revocar en lugar de eliminar certificados</li><li>Archivar cursos en lugar de eliminarlos</li><li>No eliminar tipos de certificado en uso</li></ul></div>
      )},
    ],
  },
}

export default function ManualPage() {
  const [role, setRole] = useState<'superuser' | 'admin'>('superuser')
  const [openItems, setOpenItems] = useState<Set<number>>(new Set([0]))
  function toggleItem(idx: number) { setOpenItems((p) => { const n = new Set(p); if (n.has(idx)) n.delete(idx); else n.add(idx); return n }) }
  const current = sections[role]

  return (
    <div className="p-6 lg:p-8">
      <div className="row g-5">
        <div className="col-12 col-lg-8">
          <div className="mb-4">
            <h1 className="fs-2 fw-bold text-neutral-800 mb-0">Cómo usar la plataforma ?</h1>
            <p className="small text-muted mb-0">Guía completa de la plataforma {config.appName}</p>
          </div>

          <div className="d-flex gap-1 mb-4 p-1 bg-content-100 rounded-3 border">
            {(['superuser', 'admin'] as const).map((r) => {
              const active = role === r; const Icon = sections[r].icon
              return (
                <button key={r} onClick={() => setRole(r)} className={`btn btn-sm d-flex align-items-center gap-1 ${active ? 'btn-light shadow-sm' : 'btn-ghost text-muted'}`}>
                  <Icon /> {r === 'superuser' ? 'Superusuario' : 'Administrador'}
                </button>
              )
            })}
          </div>

          <div>
            {current.items.map((item, i) => {
              const open = openItems.has(i)
              return (
                <div key={i} className="border rounded-3 bg-white mb-2 overflow-hidden">
                  <button onClick={() => toggleItem(i)} className="w-100 d-flex align-items-center justify-content-between px-4 py-3 text-start border-0 bg-transparent hover-bg-light">
                    <span className="d-flex align-items-center gap-2 fw-semibold text-neutral-800">{item.title}</span>
                    {open ? <FaChevronDown className="text-muted flex-shrink-0" /> : <FaChevronRight className="text-muted flex-shrink-0" />}
                  </button>
                  {open && <div className="border-top px-4 py-3 small text-neutral-700">{item.content}</div>}
                </div>
              )
            })}
          </div>
        </div>

        <div className="d-none d-lg-flex col-lg-4">
          <div
            className="w-100 rounded-4 shadow-sm"
            style={{
              backgroundImage: "url('/manual-bg.jpg')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              minHeight: 500,
            }}
          />
        </div>
      </div>
    </div>
  )
}
