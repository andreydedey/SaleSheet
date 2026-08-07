import axios from "axios"

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
