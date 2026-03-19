import { createContext, useContext, useState } from "react"
import { type Client } from "../types/client/client"

interface AuthContextType {
  client: Client | null
  login: (client: Client) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [client, setClient] = useState<Client | null>(null)

  function login(c: Client) { setClient(c) }
  function logout() { setClient(null) }

  return (
    <AuthContext.Provider value={{ client, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
