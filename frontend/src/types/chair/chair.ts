export type SeatStatus = "available" | "occupied"
export type SeatCategory = "VIP" | "Normal"

export interface Chair {
  id: string
  room_id: number
  row: string
  number: number
  category: SeatCategory
  status: SeatStatus
}
