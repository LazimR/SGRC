import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Calendar, Clock, MapPin, ChevronRight } from "lucide-react"
import { requestData } from "../../../services/requestApi"

import { type Session } from "../../../types/session/session"
import { formatDateLong, formatTime } from "../../../utils/formations"

const GENRE_COLOR: Record<string, string> = {
  "Sci-Fi": "#818cf8",
  "Drama":  "#34d399",
  "Ação":   "#f59e0b",
}

export default function SessionsScreen() {
  const navigate = useNavigate()
  const [sessions, setSessions] = useState<Session[]>([])

  function handleSelectSession(session: Session): void {
    navigate("/seats", { state: { session } })
  }

  useEffect(() => {
    async function fetchSessions() {
      const token = localStorage.getItem("jwt_token")
      const response = await requestData<Session[]>(
        "/sessions", "GET", {}, true,
        token ? { Authorization: `Bearer ${token}` } : undefined
      )
      if (response.success && response.data) setSessions(response.data)
    }
    fetchSessions()
  }, [])

  const grouped = sessions
    .filter(s => !!s.startTime)
    .reduce<Record<string, Session[]>>((acc, s) => {
      const day = s.startTime.split("T")[0]
      if (!acc[day]) acc[day] = []
      acc[day].push(s)
      return acc
    }, {})

  return (
    <div className="min-h-screen bg-zinc-950 font-serif">
      <div className="max-w-3xl mx-auto px-6 py-10">

        <div className="mb-8">
          <h2 className="text-white text-2xl font-bold">Em Cartaz</h2>
          <p className="text-zinc-500 text-sm mt-1">
            Escolha uma sessão para reservar seu assento
          </p>
        </div>

        {sessions.length === 0 && (
          <p className="text-zinc-500 text-sm">Nenhuma sessão disponível.</p>
        )}

        {Object.entries(grouped).map(([day, daySessions]) => (
          <div key={day} className="mb-8">

            <div className="flex items-center gap-2.5 mb-4">
              <Calendar size={13} className="text-amber-500 shrink-0" />
              <span className="text-zinc-400 text-xs font-semibold uppercase tracking-widest">
                {formatDateLong(day + "T12:00:00")}
              </span>
            </div>

            <div className="flex flex-col gap-3">
              {daySessions.map((session: Session) => {
                const genreColor = GENRE_COLOR[session.genre] ?? "#a1a1aa"

                return (
                  <button
                    key={session.id}
                    onClick={() => handleSelectSession(session)}
                    className="group w-full bg-zinc-900/80 border border-zinc-800 hover:border-amber-500/60 rounded-2xl px-6 py-5 text-left flex items-center justify-between gap-4 transition-colors cursor-pointer"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2.5 mb-2 flex-wrap">
                        <span className="text-white font-bold text-base">
                          {session.movie}
                        </span>
                        <span
                          className="text-[11px] font-semibold px-2 py-0.5 rounded-md border"
                          style={{
                            color:       genreColor,
                            background:  `${genreColor}18`,
                            borderColor: `${genreColor}40`,
                          }}
                        >
                          {session.genre}
                        </span>
                      </div>

                      <div className="flex gap-4 flex-wrap">
                        <span className="text-zinc-500 text-xs flex items-center gap-1.5">
                          <Clock size={11} />
                          {formatTime(session.startTime)} – {formatTime(session.endTime)}
                        </span>
                        <span className="text-zinc-500 text-xs flex items-center gap-1.5">
                          <MapPin size={11} />
                          {session.roomName}
                        </span>
                      </div>
                    </div>

                    <ChevronRight
                      size={18}
                      className="text-zinc-600 group-hover:text-amber-500 shrink-0 transition-colors"
                    />
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
