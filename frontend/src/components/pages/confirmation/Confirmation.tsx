import { useLocation, useNavigate } from "react-router-dom"
import { Film, CheckCircle, ArrowLeft } from "lucide-react"

import { type Session } from "../../../types/session/session"
import { type Chair, type SeatCategory } from "../../../types/chair/chair"
import { type Client } from "../../../types/client/client"
import { type Room } from "../../../types/room/room"
import { formatDate, formatTime } from "../../../utils/formations"


interface Reservation {
  session: Session
  chair: Chair
  user: Client
}


const MOCK_ROOMS: Room[] = [
  { id: 1, name: "Sala 1 — IMAX" },
  { id: 2, name: "Sala 2 — 4DX" },
  { id: 3, name: "Sala 3 — Standard" },
]

const PRICE: Record<SeatCategory, number> = { Normal: 28, VIP: 48 }


export default function ConfirmationScreen() {
  const location = useLocation()
  const navigate = useNavigate()

  const reservation = location.state?.reservation as Reservation | undefined

  if (!reservation) {
    navigate("/")
    return null
  }

  function onHome() {
    navigate("/")
  }

  function onBack() {
    navigate(-1)
  }



  const { session, chair, user } = reservation
  const room = MOCK_ROOMS.find(r => r.id === session.room_id)

  const ticketFields = [
    { label: "Data",       val: formatDate(session.start_time) },
    { label: "Horário",    val: `${formatTime(session.start_time)} – ${formatTime(session.end_time)}` },
    { label: "Sala",       val: room?.name ?? "—" },
    { label: "Assento",    val: `${chair.row}${chair.number} (${chair.category})` },
    { label: "Passageiro", val: user.name },
    { label: "Valor",      val: `R$ ${PRICE[chair.category]}` },
  ]

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-6 font-serif">
      <div className="w-full max-w-md">

        {/* ── Success icon ── */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-emerald-500/15 border-2 border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="text-emerald-400" size={38} />
          </div>
          <h2 className="text-white text-2xl font-bold">Reserva Confirmada!</h2>
          <p className="text-zinc-500 text-sm mt-1.5">Seu ingresso foi reservado com sucesso</p>
        </div>

        {/* ── Ticket card ── */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl overflow-hidden">

          {/* Header */}
          <div className="bg-linear-to-br from-amber-500/15 to-amber-600/10 border-b border-dashed border-zinc-700 px-6 py-5">
            <div className="flex items-center gap-2.5 mb-1">
              <Film className="text-amber-500" size={16} />
              <span className="text-amber-500 font-bold text-xs tracking-widest uppercase">
                CinemaReserve
              </span>
            </div>
            <h3 className="text-white text-lg font-bold mt-1">{session.movie}</h3>
          </div>

          {/* Body */}
          <div className="grid grid-cols-2 gap-5 px-6 py-6">
            {ticketFields.map(item => (
              <div key={item.label}>
                <p className="text-zinc-600 text-[10px] font-semibold uppercase tracking-widest mb-1">
                  {item.label}
                </p>
                <p className="text-white text-sm font-semibold">{item.val}</p>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="border-t border-dashed border-zinc-700 px-6 py-4 flex justify-center">
            <span className="text-zinc-600 text-[11px] tracking-[3px]">
              #{Date.now().toString().slice(-8)}
            </span>
          </div>
        </div>

        {/* ── Actions ── */}
        <div className="flex flex-col gap-3 mt-6">
          <button
            onClick={onHome}
            className="w-full flex items-center justify-center gap-2 bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-sm py-3.5 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <Film size={16} /> Ver mais sessões
          </button>

          <button
            onClick={onBack}
            className="w-full flex items-center justify-center gap-2 bg-white/4 border border-zinc-800 text-zinc-400 hover:text-white text-sm py-3.5 rounded-xl hover:bg-white/8 transition-colors cursor-pointer"
          >
            <ArrowLeft size={14} /> Voltar para assentos
          </button>
        </div>

      </div>
    </div>
  )
}
