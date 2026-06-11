import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaChevronDown, FaChevronRight } from 'react-icons/fa'
import PublicFooter from '../components/organisms/PublicFooter'

const faqs = [
  { q: '¿Cómo me inscribo a un curso?', a: 'Contáctanos por WhatsApp, selecciona el curso de tu interés, realiza el pago y envíanos tus datos personales. Te brindaremos certificación inmediata y acceso a la plataforma estudiantil para iniciar tu formación.' },
  { q: '¿Los cursos tienen certificación?', a: 'Sí, todos nuestros cursos incluyen certificación inmediata, y cuentan con acceso a plataforma virtual de estudios 24/7 para que puedas realizar tu formación a tu ritmo.' },
  { q: '¿Los certificados tienen verificación?', a: 'Sí, todos nuestros certificados cuentan con verificación inmediata mediante código QR, lo que permite validar su autenticidad de forma rápida y segura.' },
  { q: '¿Puedo acceder al curso desde cualquier dispositivo?', a: 'Sí, la plataforma es compatible con computadores, tabletas y teléfonos móviles.' },
  { q: '¿Tengo horario fijo para estudiar?', a: 'No, puedes avanzar a tu propio ritmo desde la plataforma virtual.' },
  { q: '¿Puedo realizar varios cursos al mismo tiempo?', a: 'Sí, puedes inscribirte en uno o varios cursos según tus necesidades.' },
]

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-content-50">
      <header className="border-b border-bar-200 bg-bar-500">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-3">
          <Link to="/">
            <img src="/logo.png" alt="EduCert" className="h-14 w-auto object-contain" />
          </Link>
          <Link to="/login" className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-bar-600 hover:bg-bar-100 transition-colors">Iniciar sesión</Link>
        </div>
      </header>

      <section className="w-full px-6 py-16">
        <div className="row mx-0 w-full">
          <div className="col-12 col-lg-8">
            <Link to="/" className="mb-6 d-inline-flex text-sm text-bar-600 hover:text-bar-700 text-decoration-none transition-colors">&larr; Volver al inicio</Link>
            <h1 className="text-3xl fw-bold text-neutral-800">Preguntas Frecuentes</h1>
            <p className="mt-2 text-neutral-600">Respuestas a las dudas más comunes sobre EduCert.</p>

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
                      <div className="border-t border-neutral-100 px-5 py-4 text-sm text-neutral-600 leading-relaxed">
                        {faq.a}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          <div className="d-none d-lg-flex col-lg-4 align-items-center justify-content-center">
            <div className="w-full h-full min-h-[400px] rounded-2xl overflow-hidden shadow-lg" style={{ background: 'linear-gradient(135deg, #5F9EA0 0%, #4D8486 100%)' }}>
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
