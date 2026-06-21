import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHexagonNodes } from "@fortawesome/free-solid-svg-icons/faHexagonNodes"
import { faTable } from "@fortawesome/free-solid-svg-icons/faTable"
import { faChartArea } from "@fortawesome/free-solid-svg-icons/faChartArea"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar"
import { useLocation, useNavigate } from "react-router"

export const AppSidebar = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const routes = [
    { title: "Dashboard", url: "/dashboard", icon: faTable },
    { title: "Planilhas", url: "/spreadsheets", icon: faChartArea },
  ]

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-4">
          <div className="bg-sidebar-accent flex items-center justify-center rounded-sm p-1 shrink-0">
            <FontAwesomeIcon className="text-2xl" icon={faHexagonNodes} />
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-medium">SaleSheet</span>
            <span className="text-sm">Administrator</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {routes.map((route) => (
              <SidebarMenuItem key={route.title}>
                <SidebarMenuButton
                  isActive={location.pathname === route.url}
                  onClick={() => {
                    navigate(route.url)
                  }}
                >
                  <FontAwesomeIcon icon={route.icon} />
                  <span>{route.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
