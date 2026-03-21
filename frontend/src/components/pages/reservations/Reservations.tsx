import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, Trash2, X } from "lucide-react"

import { requestData } from "../../../services/requestApi"
import useFlashMessage from "../../../hooks/useFlashMessage"

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

export default function Reservations() {
  const navigate       = useNavigate()
  const { id: userId } = useParams<{ id: string }>()
  const { setFlashMessage } = useFlashMessage()

  const [reservations,    setReservations]    = useState<ReservationResponse[]>([])
  const [isLoading,       setIsLoading]       = useState(true)
  const [error,           setError]           = useState<string | null>(null)
  const [confirmId,       setConfirmId]       = useState<number | null>(null)
  const [isCancelling,    setIsCancelling]    = useState(false)

  useEffect(() => {
    if (!userId) { navigate("/"); return }

    async function fetchReservations() {
      setIsLoading(true)
      setError(null)

      const response = await requestData<ReservationResponse[]>(
        `/reservations/user/${userId}`,
        "GET",
        {},
        true
      )

      if (response.success && response.data) {
        setReservations(response.data)
        return
      }

      setError(response.message ?? "Não foi possível carregar as reservas.")
      setReservations([])
    }

    fetchReservations().finally(() => setIsLoading(false))
  }, [navigate, userId])

  async function handleCancel(reservationId: number) {
    setIsCancelling(true)

    const token = localStorage.getItem("jwt_token")

    const response = await requestData(
      `/reservations/${reservationId}`,
      "DELETE",
      {},
      true,
      { Authorization: `Bearer ${token}` }
    )

    if (response.success) {
      setReservations(prev => prev.filter(r => r.id !== reservationId))
      setFlashMessage("success", "Reserva cancelada com sucesso.")
    } else {
      setFlashMessage("error", response.message || "Não foi possível cancelar a reserva.")
    }

    setConfirmId(null)
    setIsCancelling(false)
  }

  const confirmReservation = reservations.find(r => r.id === confirmId)

  return (
    <div className="min-h-screen bg-zinc-950 font-serif flex flex-col">

      {/* ── Nav ── */}
      <nav className="sticky top-0 z-40 bg-zinc-950/98 border-b border-zinc-900 px-4 sm:px-6 h-14 flex items-center shrink-0">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-1.5 bg-white/5 border border-zinc-800 text-zinc-400 text-xs px-3 py-1.5 rounded-xl hover:text-white hover:bg-white/10 transition-colors shrink-0"
        >
          <ArrowLeft size={13} />
          <span className="hidden sm:inline">Voltar</span>
        </button>

        <div className="absolute left-1/2 -translate-x-1/2 text-center">
          <span className="block text-white font-bold text-sm">Minhas Reservas</span>
        </div>
      </nav>

      {/* ── Content ── */}
      <div className="flex-1 px-4 sm:px-6 py-6 max-w-2xl mx-auto w-full">

        {isLoading && (
          <div className="flex items-center justify-center h-48 text-zinc-500 text-sm">
            Carregando reservas...
          </div>
        )}

        {!isLoading && error && (
          <div className="bg-red-950/40 border border-red-900/60 rounded-2xl px-6 py-4 text-sm text-red-300 text-center">
            {error}
          </div>
        )}

        {!isLoading && !error && reservations.length === 0 && (
          <div className="flex flex-col items-center justify-center h-48 gap-2">
            <p className="text-zinc-400 text-sm">Nenhuma reserva encontrada.</p>
            <button
              onClick={() => navigate("/")}
              className="text-amber-500 text-xs hover:text-amber-400 transition-colors"
            >
              Ver sessões disponíveis
            </button>
          </div>
        )}

        {!isLoading && !error && reservations.length > 0 && (
          <div className="flex flex-col gap-3">
            <p className="text-zinc-500 text-[11px] uppercase tracking-[3px] mb-1">
              {reservations.length} reserva{reservations.length !== 1 ? "s" : ""}
            </p>

            {reservations.map(reservation => (
              <button
                key={reservation.id}
                type="button"
                onClick={() => setConfirmId(reservation.id)}
                className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 flex items-center gap-4 hover:border-zinc-700 hover:bg-zinc-900 transition-all text-left w-full group"
              >
                {/* Seat badge */}
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-sm shrink-0">
                  {reservation.chairLabel}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-white font-bold text-sm truncate">
                    {reservation.roomName}
                  </p>
                  <p className="text-zinc-500 text-[11px] mt-0.5 truncate">
                    {reservation.sessionTime}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                    Confirmado
                  </span>
                  <Trash2
                    size={14}
                    className="text-zinc-700 group-hover:text-red-400 transition-colors"
                  />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Confirm modal ── */}
      {confirmId !== null && confirmReservation && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 pb-4 sm:pb-0">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm"
            onClick={() => setConfirmId(null)}
          />

          {/* Modal */}
          <div className="relative w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl shadow-black/60 p-5">
            {/* Close */}
            <button
              onClick={() => setConfirmId(null)}
              className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-lg text-zinc-500 hover:text-white hover:bg-white/5 transition-colors"
            >
              <X size={14} />
            </button>

            {/* Icon */}
            <div className="w-11 h-11 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
              <Trash2 size={18} className="text-red-400" />
            </div>

            <p className="text-white font-bold text-base mb-1">Cancelar reserva?</p>
            <p className="text-zinc-400 text-sm mb-1">
              Assento <span className="text-white font-semibold">{confirmReservation.chairLabel}</span> · {confirmReservation.roomName}
            </p>
            <p className="text-zinc-500 text-[11px] mb-5">{confirmReservation.sessionTime}</p>

            <div className="flex gap-2">
              <button
                onClick={() => setConfirmId(null)}
                className="flex-1 py-2.5 rounded-xl border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-600 transition-colors text-sm font-medium"
              >
                Manter
              </button>
              <button
                onClick={() => handleCancel(confirmId)}
                disabled={isCancelling}
                className="flex-1 py-2.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 hover:bg-red-500/25 hover:text-red-300 transition-colors text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCancelling ? "Cancelando..." : "Cancelar reserva"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
