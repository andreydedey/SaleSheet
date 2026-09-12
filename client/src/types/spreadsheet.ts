export type SpreadSheetStatus = "DRAFT" | "ACTIVE" | "INACTIVE"

export type SpreadSheetListDTO = {
  id: number
  name: string
  salespersonName: string | null
  issuedAt: string | null
  dueDate: string | null
  totalPieces: number
  soldPieces: number
  totalSold: number
  status: SpreadSheetStatus
}

export type SpreadSheetDTO = {
  id: number
  name: string
  createdAt: string
  issuedAt: string | null
  dueDate: string | null
  status: SpreadSheetStatus
  salespersonId: string | null
  salespersonName: string | null
}

export type SpreadSheetPageDTO = {
  content: SpreadSheetListDTO[]
  totalElements: number
  totalPages: number
  number: number
  size: number
  totalCount: number
  activeCount: number
  inactiveCount: number
}
