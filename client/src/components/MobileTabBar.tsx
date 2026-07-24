import { NavLink, useLocation } from "react-router"
import { Table2, Home } from "lucide-react"
import { cn } from "@/lib/utils"

const tabs = [
  { to: "/salesperson/home", label: "Home", icon: Home },
  { to: "/salesperson/spreadsheets", label: "Planilhas", icon: Table2 },
]

export function MobileTabBar() {
  const { pathname } = useLocation()

  return (
    <div className="flex justify-center px-4 pb-3">
      <nav className="flex gap-1 rounded-full border border-border bg-white/90 p-1.5">
        {tabs.map(({ to, label, icon: Icon }) => {
          const active = pathname.startsWith(to)
          return (
            <NavLink
              key={to}
              to={to}
              className={cn(
                "flex flex-col items-center gap-0.5 rounded-full px-5 py-2 transition-colors",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground",
              )}
            >
              <Icon className="size-5" />
              <span className="text-xs">{label}</span>
            </NavLink>
          )
        })}
      </nav>
    </div>
  )
}
