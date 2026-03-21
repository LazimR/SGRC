import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Star, Crown, X, ArrowLeft } from "lucide-react"

import { useUser } from "../../../context/useUser"
import useFlashMessage from "../../../hooks/useFlashMessage"
import { type Session } from "../../../types/session/session"
import { type Chair } from "../../../types/chair/chair"
import { type Client } from "../../../types/client/client"
import { formatTime } from "../../../utils/formations"
import { requestData } from "../../../services/requestApi"

interface ChairApiResponse {
  id: number
  roomId: number
  roomName: string
  number: number
  row: string
  category: "VIP" | "NORMAL"
  ocupped: boolean
}

interface ReservationRequest {
  chairId: number
  sessionId: number
}

interface ReservationResponse {
  id: number
  chairId: number
  chairLabel: string
  roomName: string
  sessionId: number
  sessionTime: string
  userId: string
  userName: string
}

function mapChair(apiChair: ChairApiResponse): Chair {
  return {
    id: apiChair.id,
    roomId: apiChair.roomId,
    roomName: apiChair.roomName,
    row: apiChair.row,
    number: apiChair.number,
    category: apiChair.category === "VIP" ? "VIP" : "Normal",
    status: apiChair.ocupped ? "occupied" : "available",
  }
}

function seatClasses(chair: Chair, selected: number | null): string {
  const isSel = selected === chair.id
  const isOcc = chair.status === "occupied"
  const isVip = chair.category === "VIP"

  const base =
    "relative w-10 h-10 rounded-xl font-bold text-xs flex items-center justify-center border transition-all shrink-0"

  if (isSel)
    return `${base} bg-amber-500 border-amber-400 text-white scale-110 shadow-lg shadow-amber-500/30`
  if (isOcc)
    return `${base} bg-red-950/60 border-red-800/40 text-red-800 cursor-not-allowed`
  if (isVip)
    return `${base} bg-amber-950/80 border-amber-700/50 text-amber-500 cursor-pointer hover:bg-amber-900/70 hover:border-amber-500/60`

  return `${base} bg-emerald-950/60 border-emerald-800/40 text-emerald-400 cursor-pointer hover:bg-emerald-900/50 hover:border-emerald-700/60`
}

export default function SeatScreen() {
  const location  = useLocation()
  const navigate  = useNavigate()
  const { authenticated, user } = useUser()
  const { setFlashMessage } = useFlashMessage()
  const session         = location.state?.session as Session | undefined
  const selectedChairId = location.state?.selectedChairId as number | undefined

  const [chairs,      setChairs]      = useState<Chair[]>([])
  const [selected,    setSelected]    = useState<number | null>(selectedChairId ?? null)
  const [isLoading,   setIsLoading]   = useState(true)
  const [isReserving, setIsReserving] = useState(false)
  const [error,       setError]       = useState<string | null>(null)

  useEffect(() => {
    if (!session) { navigate("/"); return }
    const currentSession = session

    async function fetchChairs() {
      setIsLoading(true)
      setError(null)
      const response = await requestData<ChairApiResponse[]>(
        `/chairs/findAll/${currentSession.roomId}/${currentSession.id}`,
        "GET"
      )
      if (response.success && response.data) {
        setChairs(
          response.data
            .map(mapChair)
            .sort((a, b) => a.row.localeCompare(b.row) || a.number - b.number)
        )
        return
      }
      setError(response.message ?? "Não foi possível carregar os assentos.")
      setChairs([])
    }

    fetchChairs().finally(() => setIsLoading(false))
  }, [navigate, session])

  useEffect(() => {
    if (selectedChairId) setSelected(selectedChairId)
  }, [selectedChairId])

  if (!session) return null

  const selectedChair = chairs.find(c => c.id === selected)
  const rows: string[] = [...new Set(chairs.map(c => c.row))].sort()

  const available = chairs.filter(c => c.status === "available").length
  const occupied  = chairs.filter(c => c.status === "occupied").length
  const vip       = chairs.filter(c => c.category === "VIP" && c.status === "available").length

  function handleSelect(id: number): void {
    setSelected(prev => prev === id ? null : id)
  }

  async function handleReserve(): Promise<void> {
    if (!selectedChair || selectedChair.status === "occupied") return
    const currentSession = session
    if (!currentSession) return

    if (!authenticated) {
      navigate("/login", { state: { redirectTo: "/seats", redirectState: { session: currentSession, selectedChairId: selectedChair.id } } })
      return
    }

    const token = localStorage.getItem("jwt_token")
    if (!token || !user?.id) {
      navigate("/login", { state: { redirectTo: "/seats", redirectState: { session: currentSession, selectedChairId: selectedChair.id } } })
      return
    }

    setIsReserving(true)

    const response = await requestData<ReservationResponse, ReservationRequest>(
      "/reservations", "POST",
      { chairId: selectedChair.id, sessionId: currentSession.id },
      true,
      { Authorization: `Bearer ${token}` }
    )

    if (!response.success) {
      setFlashMessage("error", response.message || "Não foi possível realizar a reserva.")
      setChairs(prev => prev.map(c => c.id === selectedChair.id ? { ...c, status: "occupied" } : c))
      setSelected(null)
      setIsReserving(false)
      return
    }

    setChairs(prev => prev.map(c => c.id === selectedChair.id ? { ...c, status: "occupied" } : c))
    navigate("/confirmation", {
      state: {
        reservation: {
          session: currentSession,
          chair: selectedChair,
          user: {
            ...(user ?? ({ id: "", name: "Cliente" } as Client)),
            name: response.data?.userName ?? user?.name ?? user?.username ?? "Cliente",
          }
        }
      }
    })
    setFlashMessage("success", "Reserva realizada com sucesso.")
    setIsReserving(false)
  }

  return (
    <div className="min-h-screen bg-zinc-950 font-serif flex flex-col">

      {/* ── Nav ── */}
      <nav className="sticky top-0 z-40 bg-zinc-950/98 border-b border-zinc-900 px-4 sm:px-6 h-14 flex items-center shrink-0">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-1.5 bg-white/5 border border-zinc-800 text-zinc-400 text-xs px-3 py-1.5 rounded-xl hover:text-white hover:bg-white/10 transition-colors shrink-0"
        >
          <ArrowLeft size={13} />
          <span className="hidden sm:inline">Sessões</span>
        </button>

        <div className="absolute left-1/2 -translate-x-1/2 text-center max-w-[55%] sm:max-w-xs">
          <span className="block text-white font-bold text-xs sm:text-sm truncate">
            {session.movie ?? session.roomName}
          </span>
          <span className="text-zinc-500 text-[10px] sm:text-xs truncate block">
            {formatTime(session.startTime)} · {session.roomName}
          </span>
        </div>
      </nav>

      {/* ── Stats ── */}
      <div className="shrink-0 px-4 sm:px-6 py-4">
        <div className="max-w-lg mx-auto grid grid-cols-3 gap-3">
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl py-3 text-center">
            <p className="text-xl font-bold text-emerald-400">{available}</p>
            <p className="text-zinc-500 text-[10px] mt-0.5">Disponíveis</p>
          </div>
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl py-3 text-center">
            <p className="text-xl font-bold text-red-400">{occupied}</p>
            <p className="text-zinc-500 text-[10px] mt-0.5">Ocupados</p>
          </div>
          <div className="bg-zinc-900/80 border border-amber-900/40 rounded-xl py-3 text-center">
            <p className="text-xl font-bold text-amber-400">{vip}</p>
            <p className="text-zinc-500 text-[10px] mt-0.5">VIP livres</p>
          </div>
        </div>
      </div>

      {/* ── Seat map ── */}
      <div className={`flex-1 overflow-y-auto ${selectedChair ? "pb-28" : "pb-8"}`}>

        {isLoading && (
          <div className="flex items-center justify-center h-48 text-zinc-500 text-sm">
            Carregando assentos...
          </div>
        )}

        {!isLoading && error && (
          <div className="flex items-center justify-center h-48 px-4">
            <div className="bg-red-950/40 border border-red-900/60 rounded-2xl px-6 py-4 text-sm text-red-300 text-center max-w-sm">
              {error}
            </div>
          </div>
        )}

        {!isLoading && !error && (
          <div className="px-2 sm:px-4">

            {/* Screen indicator */}
            <div className="flex flex-col items-center mb-6">
              <div className="w-48 sm:w-72 h-1.5 rounded-full bg-linear-to-r from-transparent via-amber-500/50 to-transparent mb-1.5" />
              <span className="text-zinc-600 text-[9px] tracking-[4px] uppercase">Tela</span>
            </div>

            {/* Rows */}
            <div className="flex flex-col gap-2">
              {rows.map((row, rowIdx) => {
                const rowChairs = chairs.filter(c => c.row === row)
                const isVipRow  = rowChairs[0]?.category === "VIP"
                const prevRow   = rows[rowIdx - 1]
                const prevIsVip = prevRow
                  ? chairs.find(c => c.row === prevRow)?.category === "VIP"
                  : null
                const showDivider = rowIdx > 0 && prevIsVip && !isVipRow

                return (
                  <div key={row}>
                    {/* VIP header */}
                    {rowIdx === 0 && isVipRow && (
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex-1 h-px bg-amber-900/30" />
                        <span className="text-amber-700 text-[9px] tracking-[3px] uppercase flex items-center gap-1">
                          <Crown size={8} /> VIP
                        </span>
                        <div className="flex-1 h-px bg-amber-900/30" />
                      </div>
                    )}

                    {/* Normal section divider */}
                    {showDivider && (
                      <div className="flex items-center gap-3 my-3">
                        <div className="flex-1 h-px bg-zinc-800" />
                        <span className="text-zinc-700 text-[9px] tracking-[3px] uppercase">Normal</span>
                        <div className="flex-1 h-px bg-zinc-800" />
                      </div>
                    )}

                    {/* Row: label + scrollable seats + label */}
                    <div className="flex items-center gap-2">

                      {/* Left label — fixed, never shrinks */}
                      <span className={`w-4 text-right text-[10px] font-bold shrink-0 tabular-nums ${isVipRow ? "text-amber-600" : "text-zinc-600"}`}>
                        {row}
                      </span>

                      {/* Scrollable seat strip — nowrap forces single line */}
                      <div className="flex-1 overflow-x-auto flex justify-center" style={{ scrollbarWidth: "none" }}>
                        <div className="flex gap-1.5" style={{ width: "max-content" }}>
                          {rowChairs.map(chair => {
                            const isOcc = chair.status === "occupied"
                            const isVip = chair.category === "VIP"
                            const isSel = selected === chair.id

                            return (
                              <button
                                key={chair.id}
                                type="button"
                                onClick={() => handleSelect(chair.id)}
                                disabled={isOcc}
                                className={seatClasses(chair, selected)}
                              >
                                {chair.number}
                                {isVip && !isOcc && !isSel && (
                                  <Crown size={6} className="absolute top-0.5 right-0.5 text-amber-500 opacity-70" />
                                )}
                                {isOcc && (
                                  <X size={9} className="absolute text-red-800 pointer-events-none" />
                                )}
                              </button>
                            )
                          })}
                        </div>
                      </div>

                      {/* Right label */}
                      <span className={`w-4 text-left text-[10px] font-bold shrink-0 tabular-nums ${isVipRow ? "text-amber-600" : "text-zinc-600"}`}>
                        {row}
                      </span>

                    </div>
                  </div>
                )
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-4 mt-8 mb-2 flex-wrap">
              {[
                { color: "bg-zinc-700 border border-zinc-600",      label: "Disponível" },
                { color: "bg-amber-950 border border-amber-700/50", label: "VIP" },
                { color: "bg-red-950/60 border border-red-800/40",  label: "Ocupado" },
                { color: "bg-amber-500 border border-amber-400",    label: "Selecionado" },
              ].map(({ color, label }) => (
                <span key={label} className="flex items-center gap-1.5 text-zinc-500 text-[10px]">
                  <span className={`w-3 h-3 rounded-sm ${color} inline-block shrink-0`} />
                  {label}
                </span>
              ))}
            </div>

          </div>
        )}
      </div>

      {/* ── Bottom reservation bar ── */}
      {selectedChair && (
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-zinc-800 bg-zinc-950/98 backdrop-blur-sm px-4 py-3 sm:px-6">
          <div className="max-w-lg mx-auto flex items-center gap-3">
            <div className={`w-11 h-11 rounded-xl flex flex-col items-center justify-center shrink-0 font-bold border ${
              selectedChair.category === "VIP"
                ? "bg-amber-950/80 border-amber-700/50 text-amber-400"
                : "bg-zinc-800 border-zinc-700 text-white"
            }`}>
              <span className="text-[9px] leading-none">{selectedChair.row}</span>
              <span className="text-sm leading-tight">{selectedChair.number}</span>
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-sm">
                Assento {selectedChair.row}{selectedChair.number}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-zinc-500 text-[11px]">{selectedChair.category}</span>
                <span className="text-zinc-700">·</span>
                <span className="text-emerald-400 text-[11px]">Disponível</span>
              </div>
            </div>

            <button
              onClick={handleReserve}
              disabled={isReserving}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.03] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 shrink-0"
            >
              <Star size={14} />
              {isReserving ? "Reservando..." : "Reservar"}
            </button>
          </div>
        </div>
      )}

    </div>
  )
}