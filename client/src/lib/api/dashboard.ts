import { api } from "@/lib/api"
import type { DashboardDTO } from "@/types/dashboard"
import type { SalespersonDTO } from "@/types/salesperson"
import type { Page } from "@/types/common"

export function getStats() {
  return api.get<DashboardDTO>("/api/dashboard").then((r) => r.data)
}

export function getSalespersons(page = 0, size = 20) {
  return api
    .get<Page<SalespersonDTO>>("/api/dashboard/salespersons", {
      params: { page, size },
    })
    .then((r) => r.data)
}
