import { Copyright } from "lucide-react"

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-zinc-900 border-t border-zinc-800 py-6">
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-4 md:flex-row md:justify-between md:gap-0">

        {/* Copyright */}
        <div className="flex items-center gap-2 text-sm text-amber-300 order-1 md:order-2 md:absolute md:left-1/2 md:-translate-x-1/2">
          <Copyright className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="text-center">
            {currentYear} CinemaReserve. Todos os direitos reservados.
          </span>
        </div>

        {/* Links */}
        <div className="flex items-center gap-6 text-sm text-amber-200 order-2 md:order-1">
          <a href="#" className="hover:text-amber-400 transition-colors">Privacidade</a>
          <a href="#" className="hover:text-amber-400 transition-colors">Termos</a>
          <a href="#" className="hover:text-amber-400 transition-colors">Contato</a>
        </div>

      </div>
    </footer>
  )
}

export default Footer
