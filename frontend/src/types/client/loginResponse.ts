import { type User } from "./user"

export interface LoginResponse {
  status: boolean
  user: User
}
