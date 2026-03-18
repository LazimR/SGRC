import { Copyright } from "lucide-react"

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-zinc-900 border-t border-zinc-800 py-6 relative">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

        {/* Links (canto esquerdo ou direito) */}
        <div className="flex items-center gap-6 text-sm text-amber-200">
          <a href="#" className="hover:text-amber-400 transition-colors">Privacidade</a>
          <a href="#" className="hover:text-amber-400 transition-colors">Termos</a>
          <a href="#" className="hover:text-amber-400 transition-colors">Contato</a>
        </div>

        {/* Copyright centralizado */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 text-sm text-amber-300">
          <Copyright className="w-4 h-4 text-amber-400" />
          <span>
            {currentYear} CinemaReserve. Todos os direitos reservados.
          </span>
        </div>

      </div>
    </footer>
  )
}

export default Footer
