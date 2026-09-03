import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft } from "lucide-react"
import { useNavigate, useParams, useSearchParams } from "react-router"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getMySpreadsheet } from "@/lib/api/salesperson"
import { listProducts, markSold, addNote } from "@/lib/api/products"
import type { SpreadSheetStatus, ProductPageDTO } from "@/types/api"
import { formatCents } from "@/components/ui/currency-input"
import { MobileProductCard } from "@/components/MobileProductCard"
import { FilterPills } from "@/components/FilterPills"

type ProductFilter = "ALL" | "SOLD" | "UNSOLD"

const statusLabel: Record<SpreadSheetStatus, string> = {
  DRAFT: "Rascunho",
  ACTIVE: "Ativo",
  INACTIVE: "Inativo",
}

export const SalespersonSpreadSheet = () => {
  const { id } = useParams<{ id: string }>()
  const spreadsheetId = Number(id)
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const productFilter = (searchParams.get("filter") ?? "ALL") as ProductFilter

  const { data: spreadsheet } = useQuery({
    queryKey: ["salesperson", "spreadsheet", spreadsheetId],
    queryFn: () => getMySpreadsheet(spreadsheetId),
  })

  const soldParam =
    productFilter === "SOLD" ? true : productFilter === "UNSOLD" ? false : undefined

  const { data: productsPage } = useQuery({
    queryKey: ["products", spreadsheetId, productFilter],
    queryFn: () => listProducts(spreadsheetId, { sold: soldParam }),
  })

  const markSoldMutation = useMutation({
    mutationFn: ({ itemId, sold }: { itemId: number; sold: boolean }) =>
      markSold(spreadsheetId, itemId, sold),
    onMutate: async ({ itemId, sold }) => {
      await queryClient.cancelQueries({ queryKey: ["products", spreadsheetId, productFilter] })
      const previous = queryClient.getQueryData<ProductPageDTO>(["products", spreadsheetId, productFilter])
      queryClient.setQueryData<ProductPageDTO>(["products", spreadsheetId, productFilter], (old) => {
        if (!old) return old
        return { ...old, content: old.content.map((p) => p.id === itemId ? { ...p, sold } : p) }
      })
      return { previous }
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["products", spreadsheetId, productFilter], context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["products", spreadsheetId] })
    },
  })

  const addNoteMutation = useMutation({
    mutationFn: ({ itemId, observation }: { itemId: number; observation: string }) =>
      addNote(spreadsheetId, itemId, observation),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products", spreadsheetId] })
    },
  })

  const isReadOnly = spreadsheet?.status !== "ACTIVE"

  const products = productsPage?.content ?? []
  const totalPieces = productsPage?.totalCount ?? 0
  const soldPieces = productsPage?.soldCount ?? 0
  const unsoldPieces = productsPage?.unsoldCount ?? 0
  const totalSold = products.filter((p) => p.sold).reduce((sum, p) => sum + p.price, 0)
  const soldPercent = totalPieces > 0 ? Math.trunc((soldPieces / totalPieces) * 100) : 0

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-muted"
          >
            <ChevronLeft className="size-5 text-foreground" />
          </button>
          <h1 className="text-lg font-bold text-foreground">{spreadsheet?.name}</h1>
        </div>
        <Badge className="bg-green-100 text-green-600 font-semibold">
          {spreadsheet ? statusLabel[spreadsheet.status] : ""}
        </Badge>
      </div>
      <hr className="-mx-4" />
      <div className="flex [&>div]:flex-1 [&>div]:pl-2 [&>div]:whitespace-nowrap [&>div:not(:first-child)]:border-l-2">
        <div>
          <p className="text-sm text-muted-foreground">Peças</p>
          <p className="font-bold text-foreground text-lg">{totalPieces}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Vendidas</p>
          <p className="font-bold text-green-600 text-lg">{soldPieces}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Em aberto</p>
          <p className="font-bold text-red-600 text-lg">{unsoldPieces}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Total</p>
          <p className="font-bold text-lg text-violet-600">
            {formatCents(totalSold)}
          </p>
        </div>
      </div>
      <div className="space-y-1">
        <p className="text-muted-foreground text-xs">{soldPercent}% vendido</p>
        <Progress
          className="h-2 *:data-[slot=progress-indicator]:bg-green-600"
          value={soldPercent}
        />
      </div>
      <hr className="-mx-4" />
      <FilterPills
        options={[
          { label: "Todos", value: "ALL" as ProductFilter, count: totalPieces },
          { label: "Vendidos", value: "SOLD" as ProductFilter, count: soldPieces },
          { label: "Em aberto", value: "UNSOLD" as ProductFilter, count: unsoldPieces },
        ]}
        value={productFilter}
        onChange={(v) => setSearchParams(v === "ALL" ? {} : { filter: v }, { replace: true })}
      />
      {products.map((item) => (
        <MobileProductCard
          key={item.id}
          product={item}
          onMarkSold={(sold) =>
            markSoldMutation.mutate({ itemId: item.id, sold })
          }
          soldDisabled={isReadOnly}
          onSaveObservation={
            !isReadOnly
              ? (observation) => addNoteMutation.mutate({ itemId: item.id, observation })
              : undefined
          }
          observationSaving={addNoteMutation.isPending}
        />
      ))}
    </div>
  )
}
