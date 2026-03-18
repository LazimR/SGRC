import {
  User,
  Users,
  Car,
  ParkingSquare,
  ListChecks
} from "lucide-react"

export const MENU_ITEMS = [
  {
    label: "Meu Perfil",
    to: "/profile",
    icon: User,
  },
  {
    label: "Estacionamentos",
    to: "/parking/list",
    icon: ParkingSquare,
  },
  {
    label: "Clientes",
    to: "/client/list/clients",
    icon: Users,
  },
  {
    label: "Veículos",
    to: "/vehicle/list/vehicles",
    icon: Car,
  },
  {
    label: "Alocações",
    to: "/parking/management",
    icon: ListChecks,
  },
]
