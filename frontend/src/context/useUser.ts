import { useContext } from "react"
import { UserContext } from "./UserContext"

export function useUser() {
  const ctx = useContext(UserContext)
  if (!ctx) {
    throw new Error("useUser deve ser usado dentro de <UserProvider>")
  }
  return ctx
}
