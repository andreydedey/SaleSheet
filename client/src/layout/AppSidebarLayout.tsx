import { AppSidebar } from "@/components/AppSidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Outlet, NavLink, useLocation } from "react-router"
import { LayoutDashboard, Table2 } from "lucide-react"
import { cn } from "@/lib/utils"

const adminTabs = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/spreadsheets", label: "Planilhas", icon: Table2 },
]

export const SidebarLayout = () => {
  const { pathname } = useLocation()
  const showTabBar = pathname === "/dashboard" || pathname === "/spreadsheets"

  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex flex-1 min-w-0 flex-col h-dvh md:h-auto">
        <header className="md:hidden shrink-0 h-14 flex items-center px-4 border-b bg-background">
          <span className="font-semibold text-base">SaleSheet Admin</span>
        </header>

        <SidebarTrigger className="hidden md:flex" />

        <div className="flex-1 overflow-y-auto md:overflow-visible px-4 py-4 md:px-6 md:py-0">
          <Outlet />
        </div>

        {showTabBar && (
          <nav className="md:hidden shrink-0 border-t bg-background flex justify-around py-2">
            {adminTabs.map(({ to, label, icon: Icon }) => {
              const active = pathname === to
              return (
                <NavLink
                  key={to}
                  to={to}
                  className={cn(
                    "flex flex-col items-center gap-0.5 px-6 py-1",
                    active ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  <Icon className="size-5" />
                  <span className="text-xs font-medium">{label}</span>
                </NavLink>
              )
            })}
          </nav>
        )}
      </div>
    </SidebarProvider>
  )
}
