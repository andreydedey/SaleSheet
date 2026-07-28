import { createContext, useContext, useState } from "react"
import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query"
import api from "@lib/api"
import type { User } from "@/types/User"

type AuthContextType = {
  user: User | null
  loading: boolean
  login: () => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType>(null!)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient()

  const {} = useQuery({
    queryKey: ["me"],
    queryFn: () => api.get<User>("/api/me").then((res) => res.data),
    retry: false,
    staleTime: Infinity,
  })

  const login = () => {
    window.location.href = "http://localhost:8080"
  }

  const logout = () => {
    api.post("api/logout").then(() => {
      queryClient.clear()
      window.location.href = "/login"
    })
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
