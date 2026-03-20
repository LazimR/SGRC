import api from "./api";
import axios, { type AxiosRequestConfig, type Method } from "axios";
import { type ApiResponse } from "../types/api";
import { createClient } from "@supabase/supabase-js";

export async function requestData<TResponse, TRequest = unknown>(
  endpoint: string,
  method: Method = "get",
  data?: TRequest,
  withCredentials: boolean = false,
  extraHeaders?: Record<string, string>
): Promise<ApiResponse<TResponse>> {
  try {
    const config: AxiosRequestConfig = {
      method: method.toLowerCase() as Method,
      url: endpoint,
      withCredentials,
      headers: {
        ...extraHeaders,
      },
    };

    if (method.toLowerCase() === "get") {
      config.params = data;
    } else {
      config.data = data;
    }

    if (data instanceof FormData) {
      config.headers = {
        ...config.headers,
        "Content-Type": "multipart/form-data",
      };
    }

    const response = await api<TResponse>(config);

    return {
      success: true,
      data: response.data,
      message: "",
    };
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      if (err.response?.status === 401) {
        window.dispatchEvent(new Event("SESSION_EXPIRED"));
      }

      return {
        success: false,
        message: err.response?.data?.message ?? "Erro inesperado. Tente novamente.",
      };
    }

    return {
      success: false,
      message: "Erro inesperado. Tente novamente.",
    };
  }
}

// Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase env variables are missing");
}

export const supabase = createClient(supabaseUrl, supabaseKey);
