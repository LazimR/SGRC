export type SeatStatus = "available" | "occupied"
export type SeatCategory = "VIP" | "Normal"

export interface Chair {
  id: number
  roomId: number
  roomName?: string
  row: string
  number: number
  category: SeatCategory
  status: SeatStatus
}
