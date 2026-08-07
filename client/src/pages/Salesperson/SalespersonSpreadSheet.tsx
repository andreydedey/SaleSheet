import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { faMessage } from "@fortawesome/free-regular-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { cn } from "@/lib/utils"
import { Link, useParams } from "react-router"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getMySpreadsheet } from "@/lib/api/salesperson"
import { listProducts, markSold } from "@/lib/api/products"
import type { SpreadSheetStatus } from "@/types/api"

const statusLabel: Record<SpreadSheetStatus, string> = {
  DRAFT: "Rascunho",
  ACTIVE: "Ativo",
  INACTIVE: "Inativo",
}

import { formatCents } from "@/components/ui/currency-input"

export const SalespersonSpreadSheet = () => {
  const { id } = useParams<{ id: string }>()
  const spreadsheetId = Number(id)
  const queryClient = useQueryClient()

  const { data: spreadsheet } = useQuery({
    queryKey: ["salesperson", "spreadsheet", spreadsheetId],
    queryFn: () => getMySpreadsheet(spreadsheetId),
  })

  const { data: productsPage } = useQuery({
    queryKey: ["products", spreadsheetId],
    queryFn: () => listProducts(spreadsheetId, 0, 100),
  })

  const markSoldMutation = useMutation({
    mutationFn: ({ itemId, sold }: { itemId: number; sold: boolean }) =>
      markSold(spreadsheetId, itemId, sold),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products", spreadsheetId] })
    },
  })

  const products = productsPage?.content ?? []
  const totalPieces = products.length
  const soldPieces = products.filter((p) => p.sold).length
  const unsoldPieces = totalPieces - soldPieces
  const totalSold = products
    .filter((p) => p.sold)
    .reduce((sum, p) => sum + p.price, 0)
  const soldPercent = totalPieces > 0 ? Math.trunc((soldPieces / totalPieces) * 100) : 0

  return (
    <div className="flex flex-col gap-4">
      <div>
        <Breadcrumb className="mb-1">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/home">Minhas Planilhas</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{spreadsheet?.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex justify-between items-center">
          <h1 className="text-lg text-foreground font-bold">
            {spreadsheet?.name}
          </h1>
          <Badge className="bg-green-200 text-green-600 font-semibold">
            {spreadsheet ? statusLabel[spreadsheet.status] : ""}
          </Badge>
        </div>
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
      {products.map((item) => (
        <Card
          key={item.id}
          className={cn(
            "transition-colors",
            item.sold && "bg-green-50 ring-green-200",
          )}
        >
          <CardContent className="flex justify-between">
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">{item.reference}</p>
              <p className="text-sm text-foreground font-medium">
                {item.definition}
              </p>
              <p
                className={cn(
                  "text-sm font-bold",
                  item.sold ? "text-green-600" : "text-foreground",
                )}
              >
                {formatCents(item.price)}
              </p>
            </div>
            <div className="flex items-center gap-4">
              {item.observation && (
                <div className="rounded-full bg-green-100 h-8 w-8 flex items-center justify-center">
                  <FontAwesomeIcon
                    icon={faMessage}
                    className="text-green-600"
                  />
                </div>
              )}
              <Checkbox
                checked={item.sold}
                onCheckedChange={(checked) =>
                  markSoldMutation.mutate({
                    itemId: item.id,
                    sold: checked === true,
                  })
                }
                className="size-8 border-2 data-checked:border-green-600 data-checked:bg-green-600 data-checked:text-white *:data-[slot=checkbox-indicator]:[&>svg]:size-5!"
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
