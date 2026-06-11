import { useState } from 'react'
import { Link } from 'react-router-dom'
import { config } from '../config'
import PublicFooter from '../components/organisms/PublicFooter'
import { FaCheckCircle, FaHeartbeat, FaHeart, FaShieldAlt, FaChevronDown, FaChevronRight } from 'react-icons/fa'

const faqs = [
  { q: '¿Cómo me inscribo a un curso?', a: 'Contáctanos por WhatsApp, selecciona el curso de tu interés, realiza el pago y envíanos tus datos personales. Te brindaremos certificación inmediata y acceso a la plataforma estudiantil para iniciar tu formación.' },
  { q: '¿Los cursos tienen certificación?', a: 'Sí, todos nuestros cursos incluyen certificación inmediata, y cuentan con acceso a plataforma virtual de estudios 24/7 para que puedas realizar tu formación a tu ritmo.' },
  { q: '¿Los certificados tienen verificación?', a: 'Sí, todos nuestros certificados cuentan con verificación inmediata mediante código QR, lo que permite validar su autenticidad de forma rápida y segura.' },
  { q: '¿Puedo acceder al curso desde cualquier dispositivo?', a: 'Sí, la plataforma es compatible con computadores, tabletas y teléfonos móviles.' },
  { q: '¿Tengo horario fijo para estudiar?', a: 'No, puedes avanzar a tu propio ritmo desde la plataforma virtual.' },
  { q: '¿Puedo realizar varios cursos al mismo tiempo?', a: 'Sí, puedes inscribirte en uno o varios cursos según tus necesidades.' },
]

export default function HomePage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-content-50">
      <header className="border-b border-bar-200 bg-bar-500">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <Link to="/">
            <img src="/logo.png" alt="EduCert" className="h-14 w-auto object-contain" />
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/search" className="text-sm font-medium text-bar-100 hover:text-white transition-colors">Verificar certificado</Link>
            <Link to="/catalog" className="text-sm font-medium text-bar-100 hover:text-white transition-colors">Catálogo</Link>
            <Link to="/login" className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-bar-600 hover:bg-bar-100 transition-colors">Iniciar sesión</Link>
          </div>
        </div>
      </header>

      <section className="bg-gradient-to-br from-bar-600 to-bar-800 py-16 lg:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <h1 className="text-4xl font-bold text-white leading-tight lg:text-5xl">Formación Virtual para el Sector Salud</h1>
              <p className="mt-4 text-lg text-bar-200 leading-relaxed">
                Cursos 100% virtuales con certificación inmediata y verificación mediante código QR.
                Capacítate desde cualquier dispositivo, a tu propio ritmo.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link to="/catalog" className="rounded-xl bg-white px-6 py-3 text-base font-semibold text-bar-700 hover:bg-bar-100 transition-colors shadow-lg">
                  Ver cursos
                </Link>
                <Link to="/search" className="rounded-xl border-2 border-bar-300 bg-transparent px-6 py-3 text-base font-semibold text-white hover:bg-bar-700 transition-colors">
                  Verificar certificado
                </Link>
              </div>
            </div>
            <div className="hidden lg:block">
              <img
                src="/hero-medical.jpg"
                alt="Formación salud"
                className="rounded-2xl shadow-2xl w-full h-auto object-cover"
                style={{ maxHeight: 400 }}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold text-neutral-800">Formación para el Sector Salud</h2>
              <p className="mt-3 text-neutral-600 leading-relaxed">
                EduCert es una plataforma integral de certificación educativa diseñada para instituciones,
                empresas y organizaciones del sector salud. Facilitamos la emisión, gestión y verificación
                de certificados académicos y profesionales con total seguridad y trazabilidad.
              </p>
              <p className="mt-3 text-neutral-600 leading-relaxed">
                Cada certificado incluye un código QR único para verificación en línea,
                garantizando autenticidad y transparencia.
              </p>
            </div>
            <div className="flex flex-col items-center gap-4">
              <a
                href={`https://wa.me/${config.contactPhone.replace(/[^\d]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full max-w-xs items-center justify-center gap-2 rounded-xl bg-bar-500 px-6 py-4 text-center text-base font-medium text-white hover:bg-bar-600 transition-colors shadow-md"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-1.096-1.016-1.837-2.262-2.052-2.644-.215-.382-.023-.59.162-.777.166-.166.372-.433.558-.65.186-.216.248-.363.372-.605.124-.242.062-.454-.031-.636-.093-.182-.67-1.617-.92-2.215-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Contáctanos por WhatsApp
              </a>
              <Link to="/search" className="w-full max-w-xs rounded-xl border border-bar-300 bg-white px-6 py-4 text-center text-base font-medium text-bar-600 hover:bg-content-100 transition-colors">
                Verificar certificado
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-content-50">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-10 lg:grid-cols-2">
            <div className="rounded-xl border border-bar-200 bg-white p-8 shadow-sm">
              <h3 className="text-xl font-bold text-neutral-800">Misión</h3>
              <p className="mt-3 text-neutral-600 leading-relaxed">
                Brindar formación complementaria virtual de calidad para el sector salud, facilitando
                el acceso al conocimiento y contribuyendo al crecimiento profesional de nuestros estudiantes.
              </p>
            </div>
            <div className="rounded-xl border border-bar-200 bg-white p-8 shadow-sm">
              <h3 className="text-xl font-bold text-neutral-800">Visión</h3>
              <p className="mt-3 text-neutral-600 leading-relaxed">
                Ser referentes en educación virtual para el sector salud, destacándonos por nuestra
                calidad, innovación y compromiso con la formación que transforma vidas.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-2xl font-bold text-neutral-800">Algunos de nuestros cursos</h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-neutral-500">Formación complementaria virtual para el sector salud</p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <div className="rounded-xl border border-bar-200 bg-white p-6 shadow-sm">
              <h3 className="font-semibold text-neutral-800">Cursos básicos</h3>
              <ul className="mt-3 space-y-2 text-sm text-neutral-600">
                <li className="flex items-start gap-2"><FaHeartbeat className="mt-0.5 text-bar-500 shrink-0" />Soporte vital básico</li>
                <li className="flex items-start gap-2"><FaHeart className="mt-0.5 text-danger-500 shrink-0" />Atención integral al adulto mayor</li>
                <li className="flex items-start gap-2"><FaShieldAlt className="mt-0.5 text-success-600 shrink-0" />Seguridad del paciente</li>
                <li className="flex items-start gap-2"><FaHeartbeat className="mt-0.5 text-warning-500 shrink-0" />Atención a víctimas de violencia y abuso sexual</li>
                <li className="flex items-start gap-2"><FaHeart className="mt-0.5 text-danger-500 shrink-0" />Primeros auxilios</li>
                <li className="flex items-start gap-2"><FaHeartbeat className="mt-0.5 text-info-500 shrink-0" />Atención a víctimas de ataques con agentes químicos</li>
              </ul>
            </div>
            <div className="rounded-xl border border-bar-200 bg-white p-6 shadow-sm">
              <h3 className="font-semibold text-neutral-800">Cursos avanzados</h3>
              <ul className="mt-3 space-y-2 text-sm text-neutral-600">
                <li className="flex items-start gap-2"><FaHeart className="mt-0.5 text-danger-500 shrink-0" />Soporte cardiovascular avanzado</li>
                <li className="flex items-start gap-2"><FaHeartbeat className="mt-0.5 text-bar-500 shrink-0" />Primeros auxilios psicológicos</li>
                <li className="flex items-start gap-2"><FaHeart className="mt-0.5 text-danger-500 shrink-0" />Atención avanzada al trauma</li>
              </ul>
            </div>
            <div className="rounded-xl border border-bar-200 bg-white p-6 shadow-sm">
              <h3 className="font-semibold text-neutral-800">Diplomados</h3>
              <ul className="mt-3 space-y-2 text-sm text-neutral-600">
                <li className="flex items-start gap-2"><FaHeart className="mt-0.5 text-danger-500 shrink-0" />Unidad de cuidados intensivos</li>
                <li className="flex items-start gap-2"><FaHeartbeat className="mt-0.5 text-success-600 shrink-0" />Gerontología y geriatría</li>
                <li className="flex items-start gap-2"><FaHeart className="mt-0.5 text-danger-500 shrink-0" />Urgencias</li>
                <li className="flex items-start gap-2"><FaHeartbeat className="mt-0.5 text-info-500 shrink-0" />Laboratorio clínico</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-content-50">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-center text-2xl font-bold text-neutral-800">¿Por qué elegirnos?</h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-neutral-500">Somos tu mejor opción para formación en el sector salud</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { text: 'Certificación inmediata en PDF' },
              { text: 'Verificación mediante código QR' },
              { text: 'Plataforma disponible 24/7' },
              { text: 'Cursos 100% virtuales' },
              { text: 'Formación alineada con la normativa vigente del sector salud' },
            ].map((item) => (
              <div key={item.text} className="flex items-start gap-3 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
                <FaCheckCircle className="mt-0.5 text-bar-500 shrink-0" />
                <span className="text-sm text-neutral-700">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-2xl font-bold text-neutral-800">Marco Normativo</h2>
          <p className="mx-auto mt-4 max-w-3xl text-neutral-600 leading-relaxed">
            Nuestros cursos se desarrollan conforme al Decreto 1075 de 2015 y demás lineamientos
            aplicables al sector salud, dentro del marco de la educación informal.
          </p>
        </div>
      </section>

      <section className="py-16 bg-content-50">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-2xl font-bold text-neutral-800">Reseñas</h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-neutral-500">Lo que dicen nuestros estudiantes</p>
          <div className="mt-10 grid gap-8 md:grid-cols-2">
            {[
              { img: 'sennoqui.png', href: 'https://www.facebook.com/share/p/1JhvduaZjT/' },
              { img: 'camila.png', href: 'https://www.facebook.com/share/p/1LjRpvFtPW/' },
              { img: 'miller.png', href: 'https://www.facebook.com/share/p/1D5v3xLaFD/' },
              { img: 'engerlin.png', href: 'https://www.facebook.com/share/p/1BGFP3GMUk/' },
            ].map((r) => (
              <a
                key={r.img}
                href={r.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                <img src={`/resenas/${r.img}`} alt={`Reseña`} className="w-full h-auto" loading="lazy" />
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-2xl font-bold text-neutral-800">Preguntas Frecuentes</h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-neutral-500">Resuelve tus dudas sobre nuestros cursos y certificaciones</p>
          <div className="row mx-0 mt-8 w-full">
            <div className="col-12 col-lg-8">
              <div className="space-y-3">
                {faqs.map((faq, i) => {
                  const open = openIndex === i
                  return (
                    <div key={i} className="rounded-xl border border-neutral-200 bg-white overflow-hidden transition-shadow hover:shadow-sm">
                      <button
                        onClick={() => setOpenIndex(open ? null : i)}
                        className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-content-100"
                      >
                        <span className="font-medium text-neutral-800">{faq.q}</span>
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
        </div>
      </section>

      <section className="py-16 bg-content-50">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-2xl font-bold text-neutral-800">Contacto</h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-neutral-500">Estamos aquí para ayudarte</p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href={`https://wa.me/${config.contactPhone.replace(/[^\d]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-xl border border-bar-200 bg-white px-6 py-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-bar-500">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-1.096-1.016-1.837-2.262-2.052-2.644-.215-.382-.023-.59.162-.777.166-.166.372-.433.558-.65.186-.216.248-.363.372-.605.124-.242.062-.454-.031-.636-.093-.182-.67-1.617-.92-2.215-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              <span className="text-sm text-neutral-700">{config.contactPhone}</span>
            </a>
            <div className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white px-6 py-4 shadow-sm">
              <span className="text-sm text-neutral-700">{config.contactEmail}</span>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white px-6 py-4 shadow-sm">
              <span className="text-sm text-neutral-700">{config.cityCountry}</span>
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  )
}
