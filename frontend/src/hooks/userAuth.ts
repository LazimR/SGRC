import { useCallback } from "react"
import { requestData } from "../services/requestApi"
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
          username: data.username,
        },
      },
    })

    if (error) {
      return {
        success: false,
        message: error.message,
      }
    }

    return {
      success: true,
      data: authData.user,
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
      setAuthenticated(true)

      setUser({
        id: authData.user.id,
        email: authData.user.email,
        username: authData.user.user_metadata?.username ?? "",
      } as Client)
    }

    return {
      success: true,
      data: authData.user,
      message: "Login realizado com sucesso",
    }
  }, [setAuthenticated, setUser])



  const logout = useCallback(async () => {
    const response = await requestData<LogoutResponse>(
      "/user/logout",
      "POST",
      {},
      true
    )

    if (response.success) {
      setAuthenticated(false)
      setUser(null)
    }

    return response
  }, [setAuthenticated, setUser])



  return { register, login, logout }
}
