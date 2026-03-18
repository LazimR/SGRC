import { Home, Film } from "lucide-react"
import { useNavigate } from "react-router-dom"

function PageNotFound() {
  const navigate = useNavigate()

  function handleGoHome() {
    navigate("/")
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-black via-zinc-900 to-black flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="bg-zinc-900/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-zinc-800 overflow-hidden">

          {/* Header */}
          <div className="relative px-8 py-10 text-center">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full" />

            {/* Logo */}
            <div className="relative flex justify-center mb-6">
              <div className="w-16 h-16 bg-amber-600/20 border border-amber-500/30 rounded-2xl flex items-center justify-center">
                <Film className="text-amber-500" size={32} />
              </div>
            </div>

            <h1 className="text-3xl font-bold text-white">CinemaReserve</h1>
            <p className="text-zinc-400 text-sm mt-2">Página não encontrada</p>
          </div>

          {/* Content */}
          <div className="px-8 pb-10 space-y-6">

            {/* 404 icon block */}
            <div className="flex flex-col items-center gap-4">

              <div className="text-center space-y-2">
                <p className="text-zinc-300 text-sm">
                  O endereço acessado não existe ou foi movido.
                </p>
                <p className="text-zinc-500 text-xs">
                  Verifique se o link está correto ou volte para a página inicial.
                </p>
              </div>
            </div>

            {/* Button */}
            <button
              onClick={handleGoHome}
              className="
                group
                w-full
                flex items-center justify-center gap-2
                bg-linear-to-r from-amber-500 to-amber-400
                hover:from-amber-600 hover:to-amber-500
                text-white font-semibold
                py-3 px-4
                rounded-xl
                transition-all
                hover:scale-[1.02]
                active:scale-[0.98]
                shadow-lg hover:shadow-amber-500/30
              "
            >
              <Home size={18} className="group-hover:-translate-x-1 transition-transform" />
              Voltar ao início
            </button>

          </div>
        </div>
      </div>
    </div>
  )
}

export default PageNotFound
