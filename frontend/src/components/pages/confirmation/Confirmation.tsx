import { useLocation, useNavigate } from "react-router-dom"
import { Film, CheckCircle, ArrowLeft } from "lucide-react"

import { type Session } from "../../../types/session/session"
import { type Chair } from "../../../types/chair/chair"
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
  const room = MOCK_ROOMS.find(r => r.id === session.roomId)

  const ticketFields = [
    { label: "Data",       val: formatDate(session.startTime) },
    { label: "Horário",    val: `${formatTime(session.startTime)} – ${formatTime(session.endTime)}` },
    { label: "Sala",       val: room?.name ?? "—" },
    { label: "Assento",    val: `${chair.row}${chair.number} (${chair.category})` },
    { label: "Cliente",    val: user.name },
  ]

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-6 py-10 font-serif">
      <div className="w-full max-w-xl">

        {/* ── Success icon ── */}
        <div className="text-center mb-10">
          <div className="w-28 h-28 bg-emerald-500/15 border-2 border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="text-emerald-400" size={52} />
          </div>
          <h2 className="text-white text-3xl font-bold">Reserva Confirmada!</h2>
          <p className="text-zinc-500 text-base mt-2">Seu ingresso foi reservado com sucesso</p>
        </div>

        {/* ── Ticket card ── */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl overflow-hidden">

          {/* Header */}
          <div className="bg-linear-to-br from-amber-500/15 to-amber-600/10 border-b border-dashed border-zinc-700 px-8 py-6">
            <div className="flex items-center gap-3 mb-1.5">
              <Film className="text-amber-500" size={20} />
              <span className="text-amber-500 font-bold text-sm tracking-widest uppercase">
                CinemaReserve
              </span>
            </div>
            <h3 className="text-white text-2xl font-bold mt-1">{session.movie}</h3>
          </div>

          {/* Body */}
          <div className="grid grid-cols-2 gap-7 px-8 py-8">
            {ticketFields.map(item => (
              <div key={item.label}>
                <p className="text-zinc-600 text-xs font-semibold uppercase tracking-widest mb-1.5">
                  {item.label}
                </p>
                <p className="text-white text-base font-semibold">{item.val}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Actions ── */}
        <div className="flex flex-col gap-4 mt-8">
          <button
            onClick={onHome}
            className="w-full flex items-center justify-center gap-2.5 bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-base py-4 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <Film size={18} /> Ver mais sessões
          </button>

          <button
            onClick={onBack}
            className="w-full flex items-center justify-center gap-2.5 bg-white/4 border border-zinc-800 text-zinc-400 hover:text-white text-base py-4 rounded-xl hover:bg-white/8 transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} /> Voltar para assentos
          </button>
        </div>

      </div>
    </div>
  )
}
