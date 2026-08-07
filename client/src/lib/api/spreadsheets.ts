import { api } from "@/lib/api"
import type {
  SpreadSheetDTO,
  SpreadSheetListDTO,
  SpreadSheetStatus,
  Page,
} from "@/types/api"

type ListParams = {
  salespersonId?: string
  status?: SpreadSheetStatus
  name?: string
  page?: number
  size?: number
}

export function listSpreadsheets(params: ListParams = {}) {
  return api
    .get<Page<SpreadSheetListDTO>>("/api/spreadsheets", { params })
    .then((r) => r.data)
}

export function getSpreadsheet(id: number) {
  return api
    .get<SpreadSheetDTO>(`/api/spreadsheets/${id}`)
    .then((r) => r.data)
}

export function createSpreadsheet(data: {
  salespersonId: string
  name: string
}) {
  return api
    .post<SpreadSheetDTO>("/api/spreadsheets", data)
    .then((r) => r.data)
}

export function updateStatus(id: number, status: SpreadSheetStatus) {
  return api
    .patch<SpreadSheetDTO>(`/api/spreadsheets/${id}`, { status })
    .then((r) => r.data)
}

export function deleteSpreadsheet(id: number) {
  return api.delete(`/api/spreadsheets/${id}`)
}

export function emitSpreadsheet(id: number) {
  return api
    .post<SpreadSheetDTO>(`/api/spreadsheets/${id}/emit`)
    .then((r) => r.data)
}

export function updateSpreadsheetSalesperson(id: number, salespersonId: string) {
  return api
    .patch<SpreadSheetDTO>(`/api/spreadsheets/${id}/salesperson`, { salespersonId })
    .then((r) => r.data)
}
