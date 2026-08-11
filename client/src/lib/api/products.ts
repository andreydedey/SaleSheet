import { api } from "@/lib/api"
import type { ProductDTO, ProductPageDTO } from "@/types/api"

export function listProducts(
  spreadsheetId: number,
  params: { page?: number; size?: number; sold?: boolean } = {},
) {
  return api
    .get<ProductPageDTO>(
      `/api/spreadsheets/${spreadsheetId}/items`,
      { params: { page: 0, size: 100, ...params } },
    )
    .then((r) => r.data)
}

export function addProduct(
  spreadsheetId: number,
  data: { reference: string; definition: string; price: number },
) {
  return api
    .post<ProductDTO>(`/api/spreadsheets/${spreadsheetId}/items`, data)
    .then((r) => r.data)
}

export function updateProduct(
  spreadsheetId: number,
  itemId: number,
  data: Partial<ProductDTO>,
) {
  return api
    .patch<ProductDTO>(
      `/api/spreadsheets/${spreadsheetId}/items/${itemId}`,
      data,
    )
    .then((r) => r.data)
}

export function deleteProduct(spreadsheetId: number, itemId: number) {
  return api.delete(`/api/spreadsheets/${spreadsheetId}/items/${itemId}`)
}

export function markSold(
  spreadsheetId: number,
  itemId: number,
  sold: boolean,
) {
  return api
    .patch<ProductDTO>(
      `/api/spreadsheets/${spreadsheetId}/items/${itemId}/sold`,
      { sold },
    )
    .then((r) => r.data)
}

export function addNote(
  spreadsheetId: number,
  itemId: number,
  observation: string,
) {
  return api
    .patch<ProductDTO>(
      `/api/spreadsheets/${spreadsheetId}/items/${itemId}/note`,
      { observation },
    )
    .then((r) => r.data)
}
