import { type ClientsDetails } from "./clientsDetail"

export interface PaginatedClientsResult {
  rows: ClientsDetails[]
  total: number
}
