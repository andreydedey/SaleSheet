import { Navigate, Outlet } from "react-router"
import { useAuth } from "../context/AuthContext"

export function ProtectedRoute() {
  const { user } = useAuth()
  return user ? <Outlet /> : <Navigate to="/login" replace />
}
