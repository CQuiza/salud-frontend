import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaChevronDown, FaChevronRight } from 'react-icons/fa'
import PublicFooter from '../components/organisms/PublicFooter'

const faqs = [
  { q: '¿Desde qué dispositivos puedo acceder a la plataforma?', a: 'Nuestra plataforma está diseñada para funcionar correctamente en computadores, tabletas y teléfonos inteligentes, permitiéndote estudiar desde cualquier lugar con conexión a internet.' },
  { q: '¿Debo conectarme en horarios específicos para estudiar?', a: 'No. Todos los cursos están disponibles en modalidad virtual y puedes ingresar cuando lo desees, avanzando según tu disponibilidad y ritmo de aprendizaje.' },
  { q: '¿Es posible matricularme en varios cursos al mismo tiempo?', a: 'Sí. Puedes realizar una o varias inscripciones simultáneamente y desarrollar diferentes procesos de formación de acuerdo con tus objetivos profesionales.' },
  { q: '¿Los programas incluyen certificado?', a: 'Sí. Al completar tu proceso de formación obtendrás un certificado digital y tendrás acceso permanente a la plataforma de aprendizaje durante el desarrollo del curso.' },
  { q: '¿Cómo se valida la autenticidad de los certificados?', a: 'Cada certificado emitido cuenta con un sistema de verificación mediante código QR, facilitando la consulta y confirmación de su validez de forma rápida y segura.' },
  { q: '¿Cuál es el proceso para inscribirme?', a: 'Para iniciar tu formación, comunícate con nuestro equipo a través de WhatsApp, selecciona el curso que deseas realizar, completa el proceso de pago y comparte la información solicitada para habilitar tu acceso a la plataforma virtual.' },
]

export default function FaqPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-content-50">
      <header className="bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-neutral-200/30 shadow-sm">
        <nav className="flex justify-between items-center w-full px-4 md:px-10 h-20 max-w-7xl mx-auto">
          <Link to="/" className="flex items-center gap-4">
            <img src="/logo.png" alt="Innova Center" className="h-30 w-auto" />
            {/* <span className="text-2xl font-bold text-bar-900">Innova Center</span> */}
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link to="/search" className="text-sm font-medium tracking-wide text-neutral-600 hover:text-bar-900 transition-colors">Verificar certificado</Link>
            <Link to="/catalog" className="text-sm font-medium tracking-wide text-neutral-600 hover:text-bar-900 transition-colors">Catálogo</Link>
            <Link to="/login" className="bg-bar-900 text-white px-6 py-2.5 rounded-full text-sm font-medium tracking-wide hover:opacity-90 transition-all scale-95 active:scale-90">
              Iniciar sesión
            </Link>
          </div>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-bar-900">
            <span className="material-symbols-outlined">{mobileMenuOpen ? 'close' : 'menu'}</span>
          </button>
        </nav>
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-neutral-200/30 bg-white px-4 py-6 space-y-4">
            <Link to="/search" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-medium text-neutral-600 hover:text-bar-900">Verificar certificado</Link>
            <Link to="/catalog" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-medium text-neutral-600 hover:text-bar-900">Catálogo</Link>
            <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block text-center bg-bar-900 text-white px-6 py-2.5 rounded-full text-sm font-medium">Iniciar sesión</Link>
          </div>
        )}
      </header>

      <section className="w-full px-6 py-16">
        <div className="row mx-0 w-full">
          <div className="col-12 col-lg-8">
            <Link to="/" className="mb-6 d-inline-flex text-sm text-bar-600 hover:text-bar-700 text-decoration-none transition-colors">&larr; Volver al inicio</Link>
            <h1 className="text-3xl fw-bold text-neutral-800">Preguntas Frecuentes</h1>
            <p className="mt-2 text-neutral-600 text-justify">Respuestas a las dudas más comunes sobre InnovaCenter.</p>

            <div className="mt-8 space-y-3">
              {faqs.map((faq, i) => {
                const open = openIndex === i
                return (
                  <div key={i} className="rounded-xl border border-neutral-200 bg-white overflow-hidden">
                    <button
                      onClick={() => setOpenIndex(open ? null : i)}
                      className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-content-100"
                    >
                      <span className="fw-medium text-neutral-800">{faq.q}</span>
                      {open ? <FaChevronDown className="h-5 w-5 text-neutral-400 shrink-0" /> : <FaChevronRight className="h-5 w-5 text-neutral-400 shrink-0" />}
                    </button>
                    {open && (
                      <div className="border-t border-neutral-100 px-5 py-4 text-sm text-neutral-600 leading-relaxed text-justify">
                        {faq.a}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          <div className="d-none d-lg-flex col-lg-4 align-items-center justify-content-center">
            <div className="w-full h-full min-h-[400px] rounded-2xl overflow-hidden shadow-lg" style={{ background: 'linear-gradient(135deg, #00A8E9 0%, #004D89 100%)' }}>
              <img
                src="/faq-bg.jpg"
                alt="Consultas médicas"
                className="w-full h-full object-cover opacity-70"
                style={{ mixBlendMode: 'overlay' }}
              />
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  )
}
