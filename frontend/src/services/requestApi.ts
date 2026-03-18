import api from "./api"
import axios, { type AxiosRequestConfig, type Method } from "axios"
import { type ApiResponse } from "../types/api"

export async function requestData<TResponse, TRequest = unknown>(
  endpoint: string,
  method: Method = "get",
  data?: TRequest,
  withCredentials: boolean = false
): Promise<ApiResponse<TResponse>> {
  try {
    const config: AxiosRequestConfig = {
      method: method.toLowerCase() as Method,
      url: endpoint,
      withCredentials,
    }

    if (method.toLowerCase() === "get") {
      config.params = data
    } else {
      config.data = data
    }

    if (data instanceof FormData) {
      config.headers = {
        "Content-Type": "multipart/form-data",
      }
    }

    const response = await api<ApiResponse<TResponse>>(config)

    return response.data

  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      if (err.response?.status === 401) {
        window.dispatchEvent(new Event("SESSION_EXPIRED"))
      }

      return {
        success: false,
        message:
          err.response?.data?.message ??
          "Erro inesperado. Tente novamente.",
      }
    }
    
    return {
      success: false,
      message: "Erro inesperado. Tente novamente.",
    }
  }
}
