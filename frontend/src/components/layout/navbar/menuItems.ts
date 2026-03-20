import {
  User,
  CalendarCheck,
} from "lucide-react"

export const MENU_ITEMS = [
  {
    label: "Meu Perfil",
    to: "/profile",
    icon: User,
  },
  {
    label: "Minhas Reservas",
    to: "/reservations",
    icon: CalendarCheck,
  },
]