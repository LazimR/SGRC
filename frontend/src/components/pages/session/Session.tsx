import { useNavigate } from "react-router-dom"
import { Calendar, Clock, MapPin, Ticket, ChevronRight } from "lucide-react"

import { type Session } from "../../../types/session/session"
import { type Room } from "../../../types/room/room"
import { type Chair, type SeatCategory, type SeatStatus } from "../../../types/chair/chair"
import { formatDateLong, formatTime } from "../../../utils/formations"


function generateChairs(roomId: number): Chair[] {
  const rows    = ["A", "B", "C", "D", "E", "F"]
  const cols    = [1, 2, 3, 4, 5, 6, 7, 8]
  const vipRows = ["A", "B"]
  return rows.flatMap(row =>
    cols.map(col => ({
      id:       `${roomId}-${row}${col}`,
      room_id:  roomId,
      row,
      number:   col,
      category: (vipRows.includes(row) ? "VIP" : "Normal") as SeatCategory,
      status:   (Math.random() < 0.3   ? "occupied" : "available") as SeatStatus,
    }))
  )
}

const MOCK_SESSIONS: Session[] = [
  { id: 1, start_time: "2026-03-18T14:00:00", end_time: "2026-03-18T16:10:00", room_id: 1, movie: "Duna: Parte Três",    genre: "Sci-Fi" },
  { id: 2, start_time: "2026-03-18T17:30:00", end_time: "2026-03-18T19:45:00", room_id: 2, movie: "Interstellar: Redux", genre: "Drama"  },
  { id: 3, start_time: "2026-03-18T20:00:00", end_time: "2026-03-18T22:20:00", room_id: 3, movie: "A Última Missão",     genre: "Ação"   },
  { id: 4, start_time: "2026-03-19T15:00:00", end_time: "2026-03-19T17:00:00", room_id: 1, movie: "Duna: Parte Três",    genre: "Sci-Fi" },
]

const MOCK_ROOMS: Room[] = [
  { id: 1, name: "Sala 1 — IMAX" },
  { id: 2, name: "Sala 2 — 4DX" },
  { id: 3, name: "Sala 3 — Standard" },
]

const MOCK_CHAIRS: Record<number, Chair[]> = {
  1: generateChairs(1),
  2: generateChairs(2),
  3: generateChairs(3),
}


const GENRE_COLOR: Record<string, string> = {
  "Sci-Fi": "#818cf8",
  "Drama":  "#34d399",
  "Ação":   "#f59e0b",
}


export default function SessionsScreen() {
  const navigate = useNavigate()

  function handleSelectSession(session: Session): void {
    navigate("/seats", { state: { session } })
  }

  const grouped = MOCK_SESSIONS.reduce<Record<string, Session[]>>((acc, s) => {
    const day = s.start_time.split("T")[0]
    if (!acc[day]) acc[day] = []
    acc[day].push(s)
    return acc
  }, {})

  return (
    <div className="min-h-screen bg-zinc-950 font-serif">
      <div className="max-w-3xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="mb-8">
          <h2 className="text-white text-2xl font-bold">Em Cartaz</h2>
          <p className="text-zinc-500 text-sm mt-1">
            Escolha uma sessão para reservar seu assento
          </p>
        </div>

        {/* Grouped by day */}
        {Object.entries(grouped).map(([day, sessions]) => (
          <div key={day} className="mb-8">

            {/* Day label */}
            <div className="flex items-center gap-2.5 mb-4">
              <Calendar size={13} className="text-amber-500 shrink-0" />
              <span className="text-zinc-400 text-xs font-semibold uppercase tracking-widest">
                {formatDateLong(day + "T12:00:00")}
              </span>
            </div>

            {/* Session cards */}
            <div className="flex flex-col gap-3">
              {sessions.map((session: Session) => {
                const room       = MOCK_ROOMS.find(r => r.id === session.room_id)
                const chairs     = MOCK_CHAIRS[session.room_id] ?? []
                const avail      = chairs.filter((c: Chair) => c.status === "available").length
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

                      {/* Meta info */}
                      <div className="flex gap-4 flex-wrap">
                        <span className="text-zinc-500 text-xs flex items-center gap-1.5">
                          <Clock size={11} />
                          {formatTime(session.start_time)} – {formatTime(session.end_time)}
                        </span>
                        <span className="text-zinc-500 text-xs flex items-center gap-1.5">
                          <MapPin size={11} />
                          {room?.name}
                        </span>
                        <span className={`text-xs flex items-center gap-1.5 ${avail < 10 ? "text-red-400" : "text-emerald-400"}`}>
                          <Ticket size={11} />
                          {avail} lugares disponíveis
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
