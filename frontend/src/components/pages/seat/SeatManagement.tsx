import { useState } from "react"
import { Film, ArrowLeft, Crown, Star, X, CheckCircle, AlertCircle } from "lucide-react"

type SeatStatus = "available" | "occupied"
type SeatCategory = "Normal" | "VIP"

interface Seat {
  id: string
  status: SeatStatus
  category: SeatCategory
}

function generateSeats(): Seat[] {
  const rows = ["A", "B", "C", "D", "E", "F"]
  const cols = [1, 2, 3, 4, 5, 6, 7, 8]
  const vipRows = ["A", "B"]

  return rows.flatMap((row) =>
    cols.map((col) => ({
      id: `${row}${col}`,
      status: Math.random() < 0.35 ? "occupied" : "available",
      category: vipRows.includes(row) ? "VIP" : "Normal",
    }))
  )
}

const initialSeats = generateSeats()

type FlashMessage = { type: "success" | "error"; message: string } | null

export default function SeatManagement() {
  const [seats, setSeats] = useState<Seat[]>(initialSeats)
  const [selected, setSelected] = useState<string | null>(null)
  const [flash, setFlash] = useState<FlashMessage>(null)
  const [filterStatus, setFilterStatus] = useState<"all" | SeatStatus>("all")
  const [filterCategory, setFilterCategory] = useState<"all" | SeatCategory>("all")

  function showFlash(type: "success" | "error", message: string) {
    setFlash({ type, message })
    setTimeout(() => setFlash(null), 3000)
  }

  function handleSelect(seatId: string) {
    setSelected((prev) => (prev === seatId ? null : seatId))
  }

  function handleReserve() {
    if (!selected) return
    setSeats((prev) =>
      prev.map((s) => (s.id === selected ? { ...s, status: "occupied" } : s))
    )
    showFlash("success", `Assento ${selected} reservado com sucesso!`)
    setSelected(null)
  }

  function handleCancel() {
    if (!selected) return
    setSeats((prev) =>
      prev.map((s) => (s.id === selected ? { ...s, status: "available" } : s))
    )
    showFlash("success", `Reserva do assento ${selected} cancelada!`)
    setSelected(null)
  }

  const selectedSeat = seats.find((s) => s.id === selected)

  const filtered = seats.filter((s) => {
    const matchStatus = filterStatus === "all" || s.status === filterStatus
    const matchCat = filterCategory === "all" || s.category === filterCategory
    return matchStatus && matchCat
  })

  const rows = [...new Set(filtered.map((s) => s.id[0]))].sort()

  const available = seats.filter((s) => s.status === "available").length
  const occupied = seats.filter((s) => s.status === "occupied").length
  const vip = seats.filter((s) => s.category === "VIP").length

  return (
    <div className="min-h-screen bg-linear-to-br from-black via-zinc-900 to-black flex items-center justify-center px-4 py-10">

      {/* Flash Message */}
      {flash && (
        <div
          className={`
            fixed top-6 right-6 z-50
            flex items-center gap-3
            px-5 py-4 rounded-xl
            shadow-2xl border
            transition-all duration-300
            ${flash.type === "success"
              ? "bg-zinc-900 border-green-500/40 text-green-400"
              : "bg-zinc-900 border-red-500/40 text-red-400"
            }
          `}
        >
          {flash.type === "success"
            ? <CheckCircle size={18} />
            : <AlertCircle size={18} />
          }
          <span className="text-sm font-medium">{flash.message}</span>
        </div>
      )}

      <div className="w-full max-w-3xl">
        <div className="bg-zinc-900/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-zinc-800 overflow-hidden">

          {/* Header */}
          <div className="relative px-8 py-10 text-center">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full" />

            <div className="relative flex justify-center mb-6">
              <div className="w-16 h-16 bg-amber-600/20 border border-amber-500/30 rounded-2xl flex items-center justify-center">
                <Film className="text-amber-500" size={32} />
              </div>
            </div>

            <h1 className="text-3xl font-bold text-white">CinemaReserve</h1>
            <p className="text-zinc-400 text-sm mt-2">Gestão de Assentos</p>

            {/* Stats */}
            <div className="relative flex justify-center gap-6 mt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-400">{available}</p>
                <p className="text-xs text-zinc-500">Disponíveis</p>
              </div>
              <div className="w-px bg-zinc-700" />
              <div className="text-center">
                <p className="text-2xl font-bold text-red-400">{occupied}</p>
                <p className="text-xs text-zinc-500">Ocupados</p>
              </div>
              <div className="w-px bg-zinc-700" />
              <div className="text-center">
                <p className="text-2xl font-bold text-amber-400">{vip}</p>
                <p className="text-xs text-zinc-500">VIP</p>
              </div>
            </div>
          </div>

          <div className="px-8 pb-10 space-y-6">

            {/* Filters */}
            <div className="flex flex-wrap justify-center gap-3">
              <div className="flex gap-2">
                {(["all", "available", "occupied"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilterStatus(f)}
                    className={`
                      px-3 py-1.5 rounded-lg text-xs font-medium transition-all border
                      ${filterStatus === f
                        ? "bg-amber-500/20 border-amber-500/50 text-amber-400"
                        : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-white"
                      }
                    `}
                  >
                    {f === "all" ? "Todos" : f === "available" ? "Disponíveis" : "Ocupados"}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                {(["all", "Normal", "VIP"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilterCategory(f)}
                    className={`
                      px-3 py-1.5 rounded-lg text-xs font-medium transition-all border
                      ${filterCategory === f
                        ? "bg-amber-500/20 border-amber-500/50 text-amber-400"
                        : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-white"
                      }
                    `}
                  >
                    {f === "all" ? "Todas" : f}
                  </button>
                ))}
              </div>
            </div>

            {/* Screen indicator */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-full h-1.5 bg-linear-to-r from-transparent via-amber-500/60 to-transparent rounded-full" />
              <span className="text-xs text-zinc-500 tracking-widest uppercase">Assentos</span>
            </div>

            {/* Seat Grid */}
            <div className="space-y-2">
              {rows.map((row) => {
                const rowSeats = filtered.filter((s) => s.id[0] === row)
                const isVipRow = rowSeats[0]?.category === "VIP"
                return (
                  <div key={row} className="flex items-center justify-center gap-3">
                    <span className={`w-5 text-xs font-bold text-right ${isVipRow ? "text-amber-400" : "text-zinc-500"}`}>
                      {row}
                    </span>
                    <div className="flex gap-2.5 flex-wrap justify-center">
                      {rowSeats.map((seat) => {
                        const isSelected = selected === seat.id
                        const isOccupied = seat.status === "occupied"
                        const isVip = seat.category === "VIP"

                        return (
                          <button
                            key={seat.id}
                            onClick={() => handleSelect(seat.id)}
                            title={`${seat.id} — ${seat.category} — ${isOccupied ? "Ocupado" : "Disponível"}`}
                            className={`
                              relative w-12 h-12 rounded-xl text-sm font-bold transition-all
                              border flex items-center justify-center
                              hover:scale-110 active:scale-95
                              ${isSelected
                                ? "bg-amber-500 border-amber-400 text-white shadow-lg shadow-amber-500/40 scale-110"
                                : isOccupied
                                  ? "bg-red-900/30 border-red-700/50 text-red-500 cursor-pointer"
                                  : isVip
                                    ? "bg-amber-900/30 border-amber-600/40 text-amber-400 hover:bg-amber-800/40"
                                    : "bg-green-900/30 border-green-700/50 text-green-400 hover:bg-green-800/40"
                              }
                            `}
                          >
                            {seat.id.slice(1)}
                            {isVip && !isOccupied && !isSelected && (
                              <Crown size={9} className="absolute top-1 right-1 text-amber-500" />
                            )}
                            {isOccupied && (
                              <X size={12} className="absolute inset-0 m-auto text-red-500 pointer-events-none" />
                            )}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap justify-center gap-4 text-xs text-zinc-400">
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded bg-green-900/30 border border-green-700/50" />
                Disponível
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded bg-amber-900/30 border border-amber-600/40" />
                VIP
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded bg-red-900/30 border border-red-700/50 flex items-center justify-center">
                  <X size={8} className="text-red-500" />
                </div>
                Ocupado
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded bg-amber-500 border border-amber-400" />
                Selecionado
              </div>
            </div>

            {/* Selected seat panel */}
            {selectedSeat && (
              <div className="bg-zinc-800/60 border border-zinc-700 rounded-xl p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`
                      w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm
                      ${selectedSeat.category === "VIP"
                        ? "bg-amber-500/20 border border-amber-500/40 text-amber-400"
                        : "bg-zinc-700 border border-zinc-600 text-white"
                      }
                    `}>
                      {selectedSeat.id}
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">Assento {selectedSeat.id}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`
                          text-xs px-2 py-0.5 rounded-full font-medium
                          ${selectedSeat.category === "VIP"
                            ? "bg-amber-500/20 text-amber-400"
                            : "bg-zinc-700 text-zinc-300"
                          }
                        `}>
                          {selectedSeat.category === "VIP" && <Crown size={10} className="inline mr-1" />}
                          {selectedSeat.category}
                        </span>
                        <span className={`
                          text-xs px-2 py-0.5 rounded-full font-medium
                          ${selectedSeat.status === "available"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-red-500/20 text-red-400"
                          }
                        `}>
                          {selectedSeat.status === "available" ? "Disponível" : "Ocupado"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelected(null)}
                    className="text-zinc-500 hover:text-white transition"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleReserve}
                    disabled={selectedSeat.status === "occupied"}
                    className={`
                      flex-1 flex items-center justify-center gap-2
                      py-2.5 rounded-xl font-semibold text-sm
                      transition-all
                      ${selectedSeat.status === "available"
                        ? "bg-linear-to-r from-amber-500 to-amber-400 hover:from-amber-600 hover:to-amber-500 text-white shadow-lg hover:shadow-amber-500/30 hover:scale-[1.02] active:scale-[0.98]"
                        : "bg-zinc-700 text-zinc-500 cursor-not-allowed"
                      }
                    `}
                  >
                    <Star size={16} />
                    Reservar
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={selectedSeat.status === "available"}
                    className={`
                      flex-1 flex items-center justify-center gap-2
                      py-2.5 rounded-xl font-semibold text-sm
                      transition-all
                      ${selectedSeat.status === "occupied"
                        ? "bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30 hover:scale-[1.02] active:scale-[0.98]"
                        : "bg-zinc-700 text-zinc-500 cursor-not-allowed"
                      }
                    `}
                  >
                    <X size={16} />
                    Cancelar Reserva
                  </button>
                </div>
              </div>
            )}

            {/* Back */}
            <div className="text-center pt-4 border-t border-zinc-800">
              <button
                className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition"
              >
                <ArrowLeft size={16} />
                Voltar para home
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}