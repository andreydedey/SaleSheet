import { Outlet } from "react-router"
import { MobileTabBar } from "@/components/MobileTabBar"

export function SalespersonLayout() {
  return (
    <div className="flex flex-col h-dvh w-full overflow-x-hidden bg-background">
      <header className="shrink-0 h-14 flex items-center px-4 border-b bg-background">
        <span className="font-semibold text-base">SaleSheet</span>
      </header>

      <main className="flex-1 overflow-y-auto p-4 pb-24">
        <Outlet />
      </main>

      <footer className="fixed bottom-0 inset-x-0 flex justify-center pb-[env(safe-area-inset-bottom)]">
        <MobileTabBar />
      </footer>
    </div>
  )
}
