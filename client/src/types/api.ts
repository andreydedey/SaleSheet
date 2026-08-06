export type Page<T> = {
  content: T[]
  totalElements: number
  totalPages: number
  number: number
  size: number
  first: boolean
  last: boolean
}

export type SpreadSheetStatus = "DRAFT" | "ACTIVE" | "INACTIVE"

export type SpreadSheetListDTO = {
  id: number
  name: string
  issuedAt: string | null
  totalPieces: number
  soldPieces: number
  status: SpreadSheetStatus
}

export type SpreadSheetDTO = {
  id: number
  name: string
  createdAt: string
  issuedAt: string | null
  status: SpreadSheetStatus
}

export type ProductDTO = {
  id: number
  reference: string
  price: number
  definition: string
  sold: boolean
  observation: string | null
}

export type DashboardDTO = {
  totalSalespersons: number
  totalSold: number
  activeSpreadsheets: number
}

export type SalespersonDTO = {
  id: string
  name: string
  email: string
  sales: number
  spreadsheetsCount: number
}

export type SalespersonStatsDTO = {
  totalSold: number
  totalPieces: number
  totalSoldPieces: number
  totalSpreadsheets: number
}
