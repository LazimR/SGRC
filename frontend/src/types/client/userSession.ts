import { type User } from "./user"

export interface SessionResponse {
  status: boolean
  user: User
}
