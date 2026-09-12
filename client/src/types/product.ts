import type { ProductDefinitionDTO } from "@/types/definition"

export type ProductDTO = {
  id: number
  reference: string
  price: number
  definition: ProductDefinitionDTO
  sold: boolean
  observation: string | null
  observationUpdatedAt: string | null
}

export type ProductPageDTO = {
  content: ProductDTO[]
  totalElements: number
  totalPages: number
  number: number
  size: number
  totalCount: number
  soldCount: number
  unsoldCount: number
}
