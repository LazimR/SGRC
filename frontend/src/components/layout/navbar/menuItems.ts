import { User, CalendarCheck } from "lucide-react"

export function getMenuItems(userId: string) {
  return [
    {
      label: "Meu Perfil",
      to: "/profile",
      icon: User,
    },
    {
      label: "Minhas Reservas",
      to: `/reservations/${userId}`,
      icon: CalendarCheck,
    },
  ]
}