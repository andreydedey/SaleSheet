import { NavLink, Outlet } from "react-router"

export function SalespersonLayout() {
  return (
    <div className="flex flex-col h-dvh w-full overflow-x-hidden bg-background">
      <header className="shrink-0 h-14 flex items-center px-4 border-b bg-background">
        <span className="font-semibold text-base">SaleSheet</span>
      </header>

      <main className="flex-1 overflow-y-auto p-4">
        <Outlet />
      </main>

      <nav className="shrink-0 h-16 flex items-center justify-around border-t bg-background pb-[env(safe-area-inset-bottom)]">
        <NavLink
          to="/salesperson/home"
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 text-xs ${isActive ? "text-primary" : "text-muted-foreground"}`
          }
        >
          <span>Home</span>
        </NavLink>
        <NavLink
          to="/salesperson/spreadsheets"
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 text-xs ${isActive ? "text-primary" : "text-muted-foreground"}`
          }
        >
          <span>Spreadsheets</span>
        </NavLink>
      </nav>
    </div>
  )
}
