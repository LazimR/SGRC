import { type ClientVehicle } from "./clientVehicle"

export interface GroupedClientVehicle {
  clientId: number
  name: string
  phone: string
  vehicles: ClientVehicle[]
}
