function formatDateTime(dateString: string) {
  const date = new Date(dateString)

  const datePart = date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })

  const timePart = date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })

  return `${datePart} às ${timePart}`
}

function formatPhone(phone: string) {
    const cleaned = phone.replace(/\D/g, "")

    if (cleaned.length !== 11) return phone

    const ddd = cleaned.slice(0, 2)
    const firstPart = cleaned.slice(2, 7)
    const secondPart = cleaned.slice(7)

    return `(${ddd}) ${firstPart}-${secondPart}`
}

function formatCPF(cpf: string) {
  if (cpf.length !== 11) return cpf

  return cpf.replace(
    /(\d{3})(\d{3})(\d{3})(\d{2})/,
    '$1.$2.$3-$4'
  )
}

function formatMinutesToDaysHHMM(minutes: number): string {
  const days = Math.floor(minutes / 1440)
  const remaining = minutes % 1440
  const hours = Math.floor(remaining / 60)
  const mins = remaining % 60

  const time = `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`

  return days > 0 ? `${days}d ${time}` : time
}

type PaymentType = "hour" | "day" | "month"

const PAYMENT_LABELS: Record<PaymentType, string> = {
  hour: "Por hora",
  day: "Diária",
  month: "Mensal",
}

function formatPayment(payment: PaymentType): string {
  return PAYMENT_LABELS[payment]
}



export { formatDateTime, formatPhone, formatCPF, formatMinutesToDaysHHMM, formatPayment }
