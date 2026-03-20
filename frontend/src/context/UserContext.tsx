import {
  createContext,
  useState,
  useEffect,
  type ReactNode,
} from "react"

import useAuth from "../hooks/userAuth"
import { requestData, supabase } from "../services/requestApi"

import type { LoginData, RegisterFormData } from "../hooks/userAuth"
import type { ApiResponse } from "../types/api"
import type {
  RegisterResponse,
  LoginResponse,
  LogoutResponse,
} from "../types/authResponses"
import type { Client } from "../types/client/client"

const AUTH_USER_STORAGE_KEY = "auth_user"
const JWT_STORAGE_KEY = "jwt_token"

interface UserContextType {
  authenticated: boolean
  user: Client | null
  loading: boolean
  sessionExpired: boolean
  setSessionExpired: (value: boolean) => void

  register: (
    data: RegisterFormData
  ) => Promise<ApiResponse<RegisterResponse>>

  login: (
    data: LoginData
  ) => Promise<ApiResponse<LoginResponse>>

  logout: () => Promise<ApiResponse<LogoutResponse>>
}

export const UserContext = createContext<UserContextType | null>(null)



interface ProviderProps {
  children: ReactNode
}

export function UserProvider({ children }: ProviderProps) {
  const [authenticated, setAuthenticated] = useState(false)
  const [user, setUser] = useState<Client | null>(null)
  const [loading, setLoading] = useState(true)
  const [sessionExpired, setSessionExpired] = useState(false)

  const {
    login: authLogin,
    register: authRegister,
    logout: authLogout,
  } = useAuth({
    setAuthenticated,
    setUser,
  })

  useEffect(() => {
    async function restoreSession() {
      const { data } = await supabase.auth.getSession()
      const session = data.session
      const storedUser = localStorage.getItem(AUTH_USER_STORAGE_KEY)

      if (!session?.access_token) {
        localStorage.removeItem(JWT_STORAGE_KEY)
        localStorage.removeItem(AUTH_USER_STORAGE_KEY)
        setAuthenticated(false)
        setUser(null)
        setLoading(false)
        return
      }

      localStorage.setItem(JWT_STORAGE_KEY, session.access_token)

      const meResponse = await requestData<Client>(
        "/users/me",
        "GET",
        {},
        true,
        { Authorization: `Bearer ${session.access_token}` }
      )

      if (meResponse.success && meResponse.data) {
        setAuthenticated(true)
        setUser(meResponse.data)
        localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(meResponse.data))
        setLoading(false)
        return
      }

      if (storedUser) {
        const parsedUser = JSON.parse(storedUser) as Client
        setAuthenticated(true)
        setUser(parsedUser)
      } else {
        setAuthenticated(false)
        setUser(null)
      }

      setLoading(false)
    }

    restoreSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.access_token) {
        localStorage.removeItem(JWT_STORAGE_KEY)
        localStorage.removeItem(AUTH_USER_STORAGE_KEY)
        setAuthenticated(false)
        setUser(null)
        return
      }

      localStorage.setItem(JWT_STORAGE_KEY, session.access_token)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

 
  useEffect(() => {
    function handleExpired() {
      localStorage.removeItem(JWT_STORAGE_KEY)
      localStorage.removeItem(AUTH_USER_STORAGE_KEY)
      setSessionExpired(true)
      setAuthenticated(false)
      setUser(null)
    }

    window.addEventListener("SESSION_EXPIRED", handleExpired)
    return () => {
      window.removeEventListener("SESSION_EXPIRED", handleExpired)
    }
  }, [])


  async function login(data: LoginData) {
    return authLogin(data)
  }

  async function register(data: RegisterFormData) {
    return authRegister(data)
  }

  async function logout() {
    return authLogout()
  }

  
  return (
    <UserContext.Provider
      value={{
        authenticated,
        user,
        loading,
        sessionExpired,
        setSessionExpired,
        register,
        login,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}
