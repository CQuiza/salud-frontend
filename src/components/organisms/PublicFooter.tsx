import { Link } from 'react-router-dom'

export default function PublicFooter() {
  return (
    <footer className="border-t border-bar-200 bg-bar-500 py-8">
      <div className="mx-auto max-w-6xl px-6 text-center text-sm text-bar-100">
        <Link to="/" className="inline-flex mb-4">
          <img src="/logovector.svg" alt="EduCert" className="mx-auto h-16 w-auto brightness-0 invert" />
        </Link>
        <div className="flex justify-center gap-4 mb-3">
          <Link to="/search" className="text-white hover:text-bar-100 transition-colors">Verificar certificado</Link>
          <Link to="/catalog" className="text-white hover:text-bar-100 transition-colors">Catálogo</Link>
          <Link to="/faq" className="text-white hover:text-bar-100 transition-colors">Preguntas frecuentes</Link>
        </div>
        <p className="text-white text-opacity-75">&copy; {new Date().getFullYear()} EduCert. Todos los derechos reservados.</p>
      </div>
    </footer>
  )
}
