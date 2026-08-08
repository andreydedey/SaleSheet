import { createContext, useContext } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import type { User } from "@/types/User"
import { api } from "@/lib/api"

type AuthContextType = {
  user: User | null
  loading: boolean
  login: () => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType>(null!)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient()

  const { data: user = null, isLoading: loading } = useQuery({
    queryKey: ["me"],
    queryFn: () => api.get<User>("/api/me").then((res) => res.data),
    retry: false,
    staleTime: Infinity,
  })

  const login = () => {
    window.location.href = "http://127.0.0.1:8080/api/oauth2/authorization/google"
  }

  const logout = () => {
    api.post("api/logout").then(() => {
      queryClient.clear()
      window.location.href = "/login"
    })
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
