import { api } from "@/lib/api"
import type { ProductDefinitionDTO, ProductDefinitionListDTO } from "@/types/api"

export function listDefinitions() {
  return api
    .get<ProductDefinitionDTO[]>("/api/product-definitions")
    .then((r) => r.data)
}

export function listDefinitionsDetailed() {
  return api
    .get<ProductDefinitionListDTO[]>("/api/product-definitions/detailed")
    .then((r) => r.data)
}

export function createDefinition(data: { name: string }) {
  return api
    .post<ProductDefinitionDTO>("/api/product-definitions", data)
    .then((r) => r.data)
}

export function updateDefinition(id: number, data: { name: string }) {
  return api
    .patch<ProductDefinitionDTO>(`/api/product-definitions/${id}`, data)
    .then((r) => r.data)
}

export function deleteDefinition(id: number) {
  return api.delete(`/api/product-definitions/${id}`)
}
