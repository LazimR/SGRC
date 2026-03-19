import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Star, Crown, X, ArrowLeft } from "lucide-react"

import { type Session } from "../../../types/session/session"
import { type Chair, type SeatCategory, type SeatStatus } from "../../../types/chair/chair"
import { type Room } from "../../../types/room/room"
import { formatTime } from "../../../utils/formations"

const MOCK_ROOMS: Room[] = [
  { id: 1, name: "Sala 1 — IMAX" },
  { id: 2, name: "Sala 2 — 4DX" },
  { id: 3, name: "Sala 3 — Standard" },
]

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

const PRICE: Record<SeatCategory, number> = {
  Normal: 28,
  VIP: 48,
}

function seatClasses(chair: Chair, selected: string | null): string {
  const isSel = selected === chair.id
  const isOcc = chair.status === "occupied"
  const isVip = chair.category === "VIP"

  const base =
    "relative w-11 h-11 rounded-xl font-bold text-xs flex items-center justify-center border-[1.5px] cursor-pointer transition-transform"

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

  const session = location.state?.session as Session | undefined

  if (!session) {
    navigate("/")
    return null
  }

  const room = MOCK_ROOMS.find(r => r.id === session.room_id)

  const [chairs, setChairs] = useState<Chair[]>(
    () => [...(MOCK_CHAIRS[session.room_id] ?? [])]
  )

  const [selected, setSelected] = useState<string | null>(null)

  const selectedChair = chairs.find(c => c.id === selected)

  const rows: string[] = [...new Set(chairs.map(c => c.row))].sort()

  const available = chairs.filter(c => c.status === "available").length
  const occupied = chairs.filter(c => c.status === "occupied").length

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
          user: {
            id: 1,
            name: "Cliente"
          }
        }
      }
    })
  }

  function handleBack() {
    navigate("/")
  }

  return (
    <div className="min-h-screen bg-zinc-950 font-serif">

      {/* NAVBAR */}
      <nav className="sticky top-0 z-40 bg-zinc-950/95 border-b border-zinc-900 px-6 py-4 flex items-center">

          {/* Botão esquerdo */}
          <button
            onClick={handleBack}
            className="flex items-center gap-1.5 bg-white/5 border border-zinc-800 text-zinc-400 text-xs px-3.5 py-2 rounded-xl hover:text-white hover:bg-white/10 transition-colors"
          >
            <ArrowLeft size={13} />
            Sessões
          </button>

          {/* Título central absoluto */}
          <div className="absolute left-1/2 -translate-x-1/2 text-center">
            <span className="block text-white font-bold text-sm">
              {session.movie}
            </span>

            <span className="text-zinc-500 text-xs">
              {formatTime(session.start_time)} · {room?.name}
            </span>
          </div>

        </nav>

      {/* BODY */}
      <div className="max-w-2xl mx-auto px-5 py-8">

        {/* STATS */}
        <div className="flex gap-4 justify-center mb-8">

          <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl px-6 py-3.5 text-center">
            <p className="text-2xl font-bold text-emerald-400">{available}</p>
            <p className="text-zinc-500 text-[11px] mt-0.5">Disponíveis</p>
          </div>

          <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl px-6 py-3.5 text-center">
            <p className="text-2xl font-bold text-red-400">{occupied}</p>
            <p className="text-zinc-500 text-[11px] mt-0.5">Ocupados</p>
          </div>

        </div>

        {/* SCREEN */}
        <div className="text-center mb-7">
          <div className="h-1 bg-linear-to-r from-transparent via-amber-500/60 to-transparent rounded-full mb-2" />
          <span className="text-zinc-600 text-[11px] tracking-[3px] uppercase">
            Assentos
          </span>
        </div>

        {/* SEATS */}
        <div className="flex flex-col gap-2 mb-8">

          {rows.map(row => {
            const rowChairs = chairs.filter(c => c.row === row)
            const isVipRow = rowChairs[0]?.category === "VIP"

            return (
              <div key={row} className="flex items-center justify-center gap-2">

                <span
                  className={`w-4 text-right text-[11px] font-bold shrink-0 ${
                    isVipRow ? "text-amber-500" : "text-zinc-600"
                  }`}
                >
                  {row}
                </span>

                <div className="flex gap-1.5 flex-wrap justify-center">

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
                          <Crown
                            size={8}
                            className="absolute top-0.5 right-0.5 text-amber-500"
                          />
                        )}

                        {isOcc && (
                          <X
                            size={11}
                            className="absolute text-red-500 pointer-events-none"
                          />
                        )}
                      </button>
                    )
                  })}

                </div>
              </div>
            )
          })}
        </div>

        {/* SELECTED PANEL */}
        {selectedChair && (
          <div className="bg-zinc-900/90 border border-zinc-700 rounded-2xl p-5">

            <div className="flex items-center justify-between mb-4">

              <div>
                <p className="text-white font-bold text-sm">
                  Assento {selectedChair.row}{selectedChair.number}
                </p>

                <p className="text-zinc-500 text-xs">
                  {selectedChair.category}
                </p>
              </div>

              <p className="text-amber-400 font-bold text-xl">
                R$ {PRICE[selectedChair.category]}
              </p>

            </div>

            <button
              onClick={handleReserve}
              disabled={selectedChair.status === "occupied"}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm bg-linear-to-r from-amber-500 to-amber-600 text-white hover:scale-[1.02]"
            >
              <Star size={16} />
              Confirmar Reserva
            </button>

          </div>
        )}

      </div>
    </div>
  )
}