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
