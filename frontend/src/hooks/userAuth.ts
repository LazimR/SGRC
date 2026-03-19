import { useCallback } from "react"
import { requestData } from "../services/requestApi"
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
    const payload = {
      username: data.username,
      email: data.email,
      password: data.password,
      confirmPassword: data.confirmPassword,
    }

    const response = await requestData<RegisterResponse>(
      "/register",
      "POST",
      payload,
      true
    )

    if (response.success) {
      setAuthenticated(true)
      setUser(response.data ?? null)
    }

    return response
  }, [])



  const login = useCallback(async (data: LoginData) => {
    const response = await requestData<LoginResponse>(
      "/login",
      "POST",
      data,
      true
    )

    if (response.success) {
      setAuthenticated(true)
      setUser(response.data ?? null)
    }

    return response
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
