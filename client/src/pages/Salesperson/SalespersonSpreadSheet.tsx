import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { faMessage } from "@fortawesome/free-regular-svg-icons"
import { faMessage as faMessageSolid, faCheck, faXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { cn } from "@/lib/utils"
import { ChevronLeft } from "lucide-react"
import { useNavigate, useParams } from "react-router"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getMySpreadsheet } from "@/lib/api/salesperson"
import { listProducts, markSold, addNote } from "@/lib/api/products"
import type { SpreadSheetStatus } from "@/types/api"
import { formatCents } from "@/components/ui/currency-input"

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
  const [productFilter, setProductFilter] = useState<ProductFilter>("ALL")
  const [editingObservationId, setEditingObservationId] = useState<number | null>(null)
  const [observationDraft, setObservationDraft] = useState("")

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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products", spreadsheetId] })
    },
  })

  const addNoteMutation = useMutation({
    mutationFn: ({ itemId, observation }: { itemId: number; observation: string }) =>
      addNote(spreadsheetId, itemId, observation),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products", spreadsheetId] })
      setEditingObservationId(null)
    },
  })

  const openObservation = (itemId: number, current: string | null) => {
    setEditingObservationId(itemId)
    setObservationDraft(current ?? "")
  }

  const cancelObservation = () => {
    setEditingObservationId(null)
    setObservationDraft("")
  }

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
      <div className="flex gap-2">
        {(
          [
            { label: "Todos", value: "ALL" as ProductFilter, count: totalPieces },
            { label: "Vendidos", value: "SOLD" as ProductFilter, count: soldPieces },
            { label: "Em aberto", value: "UNSOLD" as ProductFilter, count: unsoldPieces },
          ]
        ).map(({ label, value, count }) => (
          <button
            key={value}
            onClick={() => setProductFilter(value)}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium border",
              productFilter === value
                ? "bg-foreground text-background border-foreground"
                : "bg-background text-foreground border-border",
            )}
          >
            {label}
            <span
              className={cn(
                "text-xs rounded-full px-1.5 py-0.5 font-semibold",
                productFilter === value
                  ? "bg-white/20 text-background"
                  : "bg-muted text-muted-foreground",
              )}
            >
              {count}
            </span>
          </button>
        ))}
      </div>
      {products.map((item) => {
        const isEditing = editingObservationId === item.id
        return (
          <Card
            key={item.id}
            className={cn(
              "transition-colors",
              item.sold && "bg-green-50 ring-green-200",
            )}
          >
            <CardContent className="flex flex-col gap-3">
              <div className="flex justify-between">
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">{item.reference}</p>
                  <p className="text-sm text-foreground font-medium">{item.definition}</p>
                  <p
                    className={cn(
                      "text-sm font-bold",
                      item.sold ? "text-green-600" : "text-foreground",
                    )}
                  >
                    {formatCents(item.price)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {!isReadOnly && (
                    <button
                      onClick={() => openObservation(item.id, item.observation)}
                      className={cn(
                        "size-9 rounded-lg flex items-center justify-center transition-colors",
                        isEditing
                          ? "bg-green-500 text-white"
                          : item.observation
                            ? "bg-green-100 text-green-600"
                            : "bg-transparent border border-border text-muted-foreground",
                      )}
                    >
                      <FontAwesomeIcon
                        icon={isEditing ? faMessageSolid : faMessage}
                        className="text-sm"
                      />
                    </button>
                  )}
                  {item.observation && isReadOnly && (
                    <div className="size-9 rounded-lg flex items-center justify-center bg-green-100 text-green-600">
                      <FontAwesomeIcon icon={faMessage} className="text-sm" />
                    </div>
                  )}
                  <Checkbox
                    checked={item.sold}
                    disabled={isReadOnly}
                    onCheckedChange={(checked) =>
                      markSoldMutation.mutate({
                        itemId: item.id,
                        sold: checked === true,
                      })
                    }
                    className="size-8 border-2 data-checked:border-green-600 data-checked:bg-green-600 data-checked:text-white *:data-[slot=checkbox-indicator]:[&>svg]:size-5! disabled:opacity-50"
                  />
                </div>
              </div>
              {isEditing && (
                <div className="flex flex-col gap-2">
                  <textarea
                    autoFocus
                    value={observationDraft}
                    onChange={(e) => setObservationDraft(e.target.value)}
                    placeholder="Ex: Vendida para Maria das Graças..."
                    rows={3}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <div className="flex justify-end items-center gap-3">
                    <button
                      onClick={cancelObservation}
                      className="size-8 rounded-full flex items-center justify-center bg-muted text-foreground"
                    >
                      <FontAwesomeIcon icon={faXmark} className="text-sm" />
                    </button>
                    <button
                      onClick={() =>
                        addNoteMutation.mutate({
                          itemId: item.id,
                          observation: observationDraft,
                        })
                      }
                      disabled={addNoteMutation.isPending}
                      className="size-8 rounded-full flex items-center justify-center bg-green-500 text-white disabled:opacity-50"
                    >
                      <FontAwesomeIcon icon={faCheck} className="text-sm" />
                    </button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
