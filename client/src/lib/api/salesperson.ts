import { api } from "@/lib/api"
import type {
  SpreadSheetDTO,
  SpreadSheetListDTO,
  SpreadSheetStatus,
  SalespersonStatsDTO,
  Page,
} from "@/types/api"

type ListParams = {
  status?: SpreadSheetStatus
  name?: string
  page?: number
  size?: number
}

export function getMySpreadsheets(params: ListParams = {}) {
  return api
    .get<Page<SpreadSheetListDTO>>("/api/salesperson/spreadsheets", {
      params,
    })
    .then((r) => r.data)
}

export function getMySpreadsheet(id: number) {
  return api
    .get<SpreadSheetDTO>(`/api/salesperson/spreadsheets/${id}`)
    .then((r) => r.data)
}

export function getMyStats() {
  return api
    .get<SalespersonStatsDTO>("/api/salesperson/stats")
    .then((r) => r.data)
}
