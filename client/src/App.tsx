import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router"
import { useAuth } from "./context/AuthContext"
import SignUp from "./pages/SignUp"
import { Dashboard } from "./pages/Dashboard"
import { Login } from "./pages/Login"
import { SidebarLayout } from "./layout/AppSidebarLayout"
import { SpreadSheet } from "./pages/SpreadSheet"
import { SpreadSheetEditor } from "./pages/SpreadSheetEditor"

function PublicRoute() {
  const { user } = useAuth()
  return user ? <Navigate to="/dashboard" replace /> : <Outlet />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Route>
        <Route element={<SidebarLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/spreadsheets" element={<SpreadSheet />} />
          <Route path="/spreadsheets/editor" element={<SpreadSheetEditor />} />
        </Route>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
