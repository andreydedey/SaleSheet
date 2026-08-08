import axios from "axios"
import { toast } from "sonner"

export const api = axios.create({
  baseURL: "http://127.0.0.1:8080",
  withCredentials: true,
})

api.interceptors.request.use((config) => {
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith("XSRF-TOKEN="))
  if (match) {
    config.headers["X-XSRF-TOKEN"] = decodeURIComponent(match.split("=")[1])
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 500) {
      const message = error.response?.data?.message ?? "Erro interno do servidor. Tente novamente mais tarde."
      toast.error(message)
    }
    return Promise.reject(error)
  }
)
