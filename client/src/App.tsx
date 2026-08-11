import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router"
import { useAuth } from "./context/AuthContext"
import { ProtectedRoute } from "./components/ProtectedRoute"
import SignUp from "./pages/Salesperson/SignUp"
import { Dashboard } from "./pages/Admin/Dashboard"
import { Login } from "./pages/Login"
import { SidebarLayout } from "./layout/AppSidebarLayout"
import { SpreadSheet } from "./pages/Admin/SpreadSheet"
import { SpreadSheetEditor } from "./pages/Admin/SpreadSheetEditor"
import { IssuedSpreadSheet } from "./pages/Admin/IssuedSpreadSheet"
import { SalespersonLayout } from "./layout/SalespersonLayout"
import { Home } from "./pages/Salesperson/Home"
import { SalespersonSpreadSheet } from "./pages/Salesperson/SalespersonSpreadSheet"
import { NotFound } from "./pages/NotFound"

function PublicRoute() {
  const { user, loading } = useAuth()
  if (loading) return null
  if (!user) return <Outlet />
  return <Navigate to={user.role === "ADMIN" ? "/dashboard" : "/salesperson/home"} replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Route>
        <Route element={<ProtectedRoute role="ADMIN" />}>
          <Route element={<SidebarLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/spreadsheets" element={<SpreadSheet />} />
            <Route path="/spreadsheets/editor" element={<SpreadSheetEditor />} />
            <Route path="/spreadsheets/issued/:id" element={<IssuedSpreadSheet />} />
          </Route>
        </Route>
        <Route element={<ProtectedRoute role="SALESPERSON" />}>
          <Route path="/salesperson" element={<SalespersonLayout />}>
            <Route path="home" element={<Home />} />
            <Route path="spreadsheets" element={<Home />} />
            <Route path="spreadsheets/:id" element={<SalespersonSpreadSheet />} />
          </Route>
        </Route>
        <Route path="/" element={<ProtectedRoleRedirect />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

function ProtectedRoleRedirect() {
  const { user, loading } = useAuth()
  if (loading) return null
  if (!user) return <Navigate to="/login" replace />
  return <Navigate to={user.role === "ADMIN" ? "/dashboard" : "/salesperson/home"} replace />
}
