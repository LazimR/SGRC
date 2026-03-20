import { useCallback } from "react"
import { supabase } from "../services/requestApi"
import type { ApiResponse } from "../types/api"
import type { Client } from "../types/client/client"
import type {
  RegisterResponse,
  LoginResponse,
  LogoutResponse,
} from "../types/authResponses"
 
export interface AuthHookParams {
  setAuthenticated: (value: boolean) => void
  setUser: (value: Client | null) => void
}


export interface RegisterFormData {
  username: string
  email: string
  password: string
  confirmPassword: string
}

export interface LoginData {
  email: string
  password: string
}

export interface UseAuthReturn {
  register: (data: RegisterFormData) => Promise<ApiResponse<RegisterResponse>>
  login: (data: LoginData) => Promise<ApiResponse<LoginResponse>>
  logout: () => Promise<ApiResponse<LogoutResponse>>
}

const AUTH_USER_STORAGE_KEY = "auth_user"
const JWT_STORAGE_KEY = "jwt_token"

function persistAuth(user: Client | null, token?: string | null) {
  if (user) {
    localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(user))
  } else {
    localStorage.removeItem(AUTH_USER_STORAGE_KEY)
  }

  if (token) {
    localStorage.setItem(JWT_STORAGE_KEY, token)
  } else {
    localStorage.removeItem(JWT_STORAGE_KEY)
  }
}


export default function useAuth({
  setAuthenticated,
  setUser,
}: AuthHookParams): UseAuthReturn {


  const register = useCallback(async (data: RegisterFormData) => {
    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          username: data.username
        }
      }
    })

    if (error) {
      return {
        success: false,
        message: error.message,
      }
    }

    return {
      success: true,
      data: {
        id: authData.user!.id,
        email: authData.user!.email,
        username: authData.user!.user_metadata?.username ?? "",
      } as Client,
      message: "Usuário criado com sucesso",
    }
  }, [])



  const login = useCallback(async (data: LoginData) => {
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })

    if (error) {
      return {
        success: false,
        message: error.message,
      }
    }

    if (authData.user) {
      const authUser = {
        id: authData.user.id,
        email: authData.user.email,
        username: authData.user.user_metadata?.username ?? "",
        name: authData.user.user_metadata?.name ?? authData.user.user_metadata?.username ?? "",
      } as Client

      setAuthenticated(true)
      setUser(authUser)
      persistAuth(authUser, authData.session?.access_token)
    }

    return {
      success: true,
      data: {
        id: authData.user.id,
        email: authData.user.email,
        username: authData.user.user_metadata?.username ?? "",
        name: authData.user.user_metadata?.name ?? authData.user.user_metadata?.username ?? "",
      } as Client,
      message: "Login realizado com sucesso",
    }
  }, [setAuthenticated, setUser])



  const logout = useCallback(async () => {
    const { error } = await supabase.auth.signOut()

    if (error) {
      return {
        success: false,
        message: error.message,
      }
    }

    setAuthenticated(false)
    setUser(null)
    persistAuth(null)

    return {
      success: true,
      data: null,
      message: "Logout realizado com sucesso",
    }
  }, [setAuthenticated, setUser])



  return { register, login, logout }
}
