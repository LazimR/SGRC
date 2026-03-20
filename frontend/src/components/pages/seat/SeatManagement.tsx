import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Star, Crown, X, ArrowLeft } from "lucide-react"

import { type Session } from "../../../types/session/session"
import { type Chair, type SeatCategory, type SeatStatus } from "../../../types/chair/chair"
import { formatTime } from "../../../utils/formations"
import { requestData } from "../../../services/requestApi"

function generateChairs(roomId: number): Chair[] {
  const rows = ["A", "B", "C", "D", "E", "F"]
  const cols = [1, 2, 3, 4, 5, 6, 7, 8]
  const vipRows = ["A", "B"]

  return rows.flatMap(row =>
    cols.map(col => ({
      id: `${roomId}-${row}${col}`,
      room_id: roomId,
      row,
      number: col,
      category: (vipRows.includes(row) ? "VIP" : "Normal") as SeatCategory,
      status: (Math.random() < 0.3 ? "occupied" : "available") as SeatStatus,
    }))
  )
}

const MOCK_CHAIRS: Record<number, Chair[]> = {
  1: generateChairs(1),
  2: generateChairs(2),
  3: generateChairs(3),
}

function seatClasses(chair: Chair, selected: string | null): string {
  const isSel = selected === chair.id
  const isOcc = chair.status === "occupied"
  const isVip = chair.category === "VIP"

  const base =
    "relative w-11 h-11 sm:w-13 sm:h-13 md:w-16 md:h-16 rounded-xl font-bold text-sm flex items-center justify-center border-[1.5px] cursor-pointer transition-transform"

  if (isSel)
    return `${base} bg-amber-500 border-amber-400 text-white scale-110 shadow-lg shadow-amber-500/30`
  if (isOcc)
    return `${base} bg-red-950/60 border-red-700/50 text-red-500`
  if (isVip)
    return `${base} bg-amber-950/60 border-amber-600/40 text-amber-400 hover:bg-amber-900/50`

  return `${base} bg-emerald-950/60 border-emerald-700/40 text-emerald-400 hover:bg-emerald-900/40`
}

export default function SeatScreen() {
  const location = useLocation()
  const navigate = useNavigate()

  const [chair, setChair] = useState<Chair[]>([])

  useEffect(() => {
    async function fetchSessions() {
      const token = localStorage.getItem("jwt_token")
      const response = await requestData<Chair[]>(
        "/chairs", "GET", {}, true,
        token ? { Authorization: `Bearer ${token}` } : undefined
      )
      if (response.success && response.data) setChair(response.data)
    }
    fetchSessions()
  }, [])

  const session = location.state?.session as Session | undefined
  console.log("chair: ", chair)


  if (!session) {
    navigate("/")
    return null
  }

  const [chairs, setChairs] = useState<Chair[]>(
    () => [...(MOCK_CHAIRS[session.roomId] ?? [])]
  )

  const [selected, setSelected] = useState<string | null>(null)

  const selectedChair = chairs.find(c => c.id === selected)
  const rows: string[] = [...new Set(chairs.map(c => c.row))].sort()

  const available = chairs.filter(c => c.status === "available").length
  const occupied  = chairs.filter(c => c.status === "occupied").length
  const vip       = chairs.filter(c => c.category === "VIP" && c.status === "available").length

  function handleSelect(id: string): void {
    setSelected(prev => (prev === id ? null : id))
  }

  function handleReserve(): void {
    if (!selectedChair || selectedChair.status === "occupied") return

    setChairs(prev =>
      prev.map(c =>
        c.id === selectedChair.id ? { ...c, status: "occupied" } : c
      )
    )

    navigate("/confirmation", {
      state: {
        reservation: {
          session,
          chair: selectedChair,
          user: { id: 1, name: "Cliente" }
        }
      }
    })
  }

  return (
    <div className="min-h-screen bg-zinc-950 font-serif">

      <nav className="sticky top-0 z-40 bg-zinc-950/95 border-b border-zinc-900 px-4 sm:px-6 py-3 sm:py-4 flex items-center">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-1.5 bg-white/5 border border-zinc-800 text-zinc-400 text-xs px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl hover:text-white hover:bg-white/10 transition-colors shrink-0"
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

      <div className="max-w-2xl mx-auto px-3 sm:px-5 py-5 sm:py-8">

        <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6 sm:mb-8">
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl sm:rounded-2xl px-2 sm:px-6 py-2.5 sm:py-3.5 text-center">
            <p className="text-xl sm:text-2xl font-bold text-emerald-400">{available}</p>
            <p className="text-zinc-500 text-[9px] sm:text-[11px] mt-0.5">Disponíveis</p>
          </div>
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl sm:rounded-2xl px-2 sm:px-6 py-2.5 sm:py-3.5 text-center">
            <p className="text-xl sm:text-2xl font-bold text-red-400">{occupied}</p>
            <p className="text-zinc-500 text-[9px] sm:text-[11px] mt-0.5">Ocupados</p>
          </div>
          <div className="bg-zinc-900/80 border border-amber-900/40 rounded-xl sm:rounded-2xl px-2 sm:px-6 py-2.5 sm:py-3.5 text-center">
            <p className="text-xl sm:text-2xl font-bold text-amber-400">{vip}</p>
            <p className="text-zinc-500 text-[9px] sm:text-[11px] mt-0.5">VIP livres</p>
          </div>
        </div>

        <div className="text-center mb-5 sm:mb-7">
          <div className="h-1 bg-linear-to-r from-transparent via-amber-500/60 to-transparent rounded-full mb-2" />
          <span className="text-zinc-600 text-[10px] sm:text-[11px] tracking-[3px] uppercase">Assentos</span>
        </div>

        <div className="flex flex-col gap-1.5 sm:gap-3 mb-6 sm:mb-8 overflow-x-auto pb-2">
          {rows.map(row => {
            const rowChairs = chairs.filter(c => c.row === row)
            const isVipRow  = rowChairs[0]?.category === "VIP"

            return (
              <div key={row} className="flex items-center justify-center gap-1.5 sm:gap-2 min-w-0">
                <span className={`w-4 sm:w-5 text-right text-[10px] sm:text-xs font-bold shrink-0 ${isVipRow ? "text-amber-500" : "text-zinc-600"}`}>
                  {row}
                </span>
                <div className="flex gap-1 sm:gap-2 justify-center flex-wrap">
                  {rowChairs.map(chair => {
                    const isSel = selected === chair.id
                    const isOcc = chair.status === "occupied"
                    const isVip = chair.category === "VIP"

                    return (
                      <button
                        key={chair.id}
                        onClick={() => handleSelect(chair.id)}
                        className={seatClasses(chair, selected)}
                      >
                        {chair.number}
                        {isVip && !isOcc && !isSel && (
                          <Crown size={8} className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 text-amber-500" />
                        )}
                        {isOcc && (
                          <X size={10} className="absolute text-red-500 pointer-events-none" />
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        <div className="flex items-center justify-center gap-3 sm:gap-5 mb-5 sm:mb-6 flex-wrap">
          {[
            { color: "bg-emerald-500", label: "Disponível" },
            { color: "bg-amber-700",   label: "VIP" },
            { color: "bg-red-700",     label: "Ocupado" },
            { color: "bg-amber-400",   label: "Selecionado" },
          ].map(({ color, label }) => (
            <span key={label} className="flex items-center gap-1.5 text-zinc-400 text-[10px] sm:text-xs">
              <span className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full ${color} inline-block shrink-0`} />
              {label}
            </span>
          ))}
        </div>

        {selectedChair && (
          <div className="bg-zinc-900/90 border border-zinc-700 rounded-2xl p-4 sm:p-5">
            <div className="flex items-center gap-3 sm:gap-4 mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-white font-bold text-xs sm:text-sm shrink-0">
                {selectedChair.row}{selectedChair.number}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-white font-bold text-xs sm:text-sm mb-1.5">
                  Assento {selectedChair.row}{selectedChair.number}
                </p>
                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                  <span className="border border-zinc-600 text-zinc-400 text-[10px] sm:text-[11px] font-medium px-2 sm:px-2.5 py-0.5 rounded-md">
                    {selectedChair.category}
                  </span>
                  <span className={`text-[10px] sm:text-[11px] font-semibold px-2 sm:px-2.5 py-0.5 rounded-md border ${
                    selectedChair.status === "available"
                      ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400"
                      : "bg-red-500/10 border-red-500/40 text-red-400"
                  }`}>
                    {selectedChair.status === "available" ? "Disponível" : "Ocupado"}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handleReserve}
              disabled={selectedChair.status === "occupied"}
              className="w-full flex items-center justify-center gap-2 py-3 sm:py-3.5 rounded-xl font-bold text-sm bg-linear-to-r from-amber-500 to-amber-600 text-white hover:scale-[1.02] transition-transform disabled:from-zinc-700 disabled:to-zinc-700 disabled:text-zinc-500 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <Star size={15} />
              Confirmar Reserva
            </button>
          </div>
        )}

      </div>
    </div>
  )
}