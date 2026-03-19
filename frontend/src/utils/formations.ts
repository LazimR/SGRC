function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
}
function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "short" })
}
function formatDateLong(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })
}

function formatMinutesToDaysHHMM(minutes: number): string {
  const days = Math.floor(minutes / 1440)
  const remaining = minutes % 1440
  const hours = Math.floor(remaining / 60)
  const mins = remaining % 60

  const time = `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`

  return days > 0 ? `${days}d ${time}` : time
}




export { formatTime, formatDate, formatDateLong, formatMinutesToDaysHHMM }
