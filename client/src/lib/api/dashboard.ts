import { api } from "@/lib/api"
import type { DashboardDTO, SalespersonDTO, Page } from "@/types/api"

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
