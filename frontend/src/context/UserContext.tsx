import {
  createContext,
  useState,
  useEffect,
  type ReactNode,
} from "react"

import useAuth from "../hooks/userAuth"
//import { requestData } from "../services/requestApi"

import type { LoginData, RegisterFormData } from "../hooks/userAuth"
import type { ApiResponse } from "../types/api"
import type {
  RegisterResponse,
  LoginResponse,
  LogoutResponse,
} from "../types/authResponses"
import type { Client } from "../types/client/client"




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



  /*useEffect(() => {
    async function checkSession() {
      const response = await requestData<Client>(
        "/user/session",
        "GET",
        {},
        true
      )

      if (response.success) {
        setAuthenticated(true)
        setUser(response.data ?? null)
      } else {
        setAuthenticated(false)
        setUser(null)
        setSessionExpired(true)
      }

      setLoading(false)
    }

    checkSession()
  }, [])*/

 
  useEffect(() => {
    function handleExpired() {
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
