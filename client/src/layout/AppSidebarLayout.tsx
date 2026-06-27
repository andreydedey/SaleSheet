import { AppSidebar } from "@/components/AppSidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Outlet } from "react-router"

export const SidebarLayout = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1">
        <SidebarTrigger />
        <div className="flex-1 px-6">
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  )
}
