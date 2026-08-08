import { Navigate, Outlet } from "react-router"
import { useAuth } from "@/context/AuthContext"
import type { Role } from "@/types/User"

type Props = {
  role?: Role
}

const roleHome: Record<Role, string> = {
  ADMIN: "/dashboard",
  SALESPERSON: "/salesperson/home",
}

export function ProtectedRoute({ role }: Props) {
  const { user, loading } = useAuth()

  if (loading) return null
  if (!user) return <Navigate to="/login" replace />
  if (role && user.role !== role) return <Navigate to={roleHome[user.role]} replace />

  return <Outlet />
}
