import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  faCircleCheck,
  faCircleXmark,
  faEdit,
  faTrashCan,
} from "@fortawesome/free-regular-svg-icons"
import { faBoxOpen, faDollarSign, faCircleExclamation } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { DeleteConfirmDialog } from "@/components/DeleteConfirmDialog"
import { InactivateSpreadsheetDialog } from "@/components/InactivateSpreadsheetDialog"
import { ActivateSpreadsheetDialog } from "@/components/ActivateSpreadsheetDialog"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { formatCents } from "@/components/ui/currency-input"
import { Link, useParams } from "react-router"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { getSpreadsheet } from "@/lib/api/spreadsheets"
import { listProducts, markSold, deleteProduct } from "@/lib/api/products"
import { ProductDialogEditor } from "@/components/ProductDialogEditor"
import { ObservationPopover } from "@/components/ObservationPopover"
import { useState } from "react"
import type { ProductDTO } from "@/types/api"

export const IssuedSpreadSheet = () => {
  const { id } = useParams<{ id: string }>()
  const spreadsheetId = Number(id)
  const queryClient = useQueryClient()

  const { data: spreadsheet } = useQuery({
    queryKey: ["spreadsheet", spreadsheetId],
    queryFn: () => getSpreadsheet(spreadsheetId),
  })

  const { data: productsPage } = useQuery({
    queryKey: ["products", spreadsheetId],
    queryFn: () => listProducts(spreadsheetId, { page: 0, size: 100 }),
  })

  const markSoldMutation = useMutation({
    mutationFn: ({ itemId, sold }: { itemId: number; sold: boolean }) =>
      markSold(spreadsheetId, itemId, sold),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products", spreadsheetId] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (itemId: number) => deleteProduct(spreadsheetId, itemId),
    onSuccess: () => {
      toast.success("Produto removido.")
      queryClient.invalidateQueries({ queryKey: ["products", spreadsheetId] })
    },
    onError: () => toast.error("Erro ao remover produto."),
  })

  const products = productsPage?.content ?? []
  const [editingProduct, setEditingProduct] = useState<ProductDTO | undefined>()
  const [editOpen, setEditOpen] = useState(false)

  const openEdit = (product: ProductDTO) => {
    setEditingProduct(product)
    setEditOpen(true)
  }
  const totalPieces = products.length
  const soldPieces = products.filter((p) => p.sold).length
  const unsoldPieces = totalPieces - soldPieces
  const totalSold = products
    .filter((p) => p.sold)
    .reduce((sum, p) => sum + p.price, 0)

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/spreadsheets">Planilhas</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{spreadsheet?.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <div className="flex gap-2 items-center">
            <h1 className="text-2xl font-bold">
              Planilha - {spreadsheet?.name}
            </h1>
            {spreadsheet?.status === "ACTIVE" ? (
              <Badge className="bg-green-50 text-green-700">Emitida</Badge>
            ) : (
              <Badge className="bg-gray-100 text-gray-600">Inativa</Badge>
            )}
          </div>
          <h3 className="text-muted-foreground text-[14px]">
            Emitida em{" "}
            {spreadsheet?.issuedAt
              ? new Date(spreadsheet.issuedAt).toLocaleDateString("pt-BR")
              : "-"}{" "}
            · {totalPieces} peças
            {spreadsheet?.status === "INACTIVE" && " · Inativa"}
          </h3>
        </div>
        {spreadsheet?.status === "ACTIVE" ? (
          <InactivateSpreadsheetDialog
            spreadsheetId={spreadsheetId}
            salespersonName={spreadsheet.salespersonName}
          />
        ) : (
          <ActivateSpreadsheetDialog
            spreadsheetId={spreadsheetId}
            salespersonName={spreadsheet?.salespersonName}
          />
        )}
      </div>
      {spreadsheet?.status === "INACTIVE" && (
        <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
          <FontAwesomeIcon icon={faCircleExclamation} className="text-red-500 text-lg shrink-0" />
          <div>
            <p className="font-semibold text-red-700 text-sm">Esta planilha está inativa</p>
            <p className="text-red-600 text-sm">A revendedora não pode registrar vendas.</p>
          </div>
        </div>
      )}
      <div className="flex gap-4 *:flex-1">
        <Card>
          <CardContent className="flex items-center gap-4">
            <FontAwesomeIcon className="text-xl" icon={faBoxOpen} />
            <div>
              <p className="text-muted-foreground text-xs">Total de peças</p>
              <p className="text-foreground text-xl font-bold">{totalPieces}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4">
            <FontAwesomeIcon
              className="text-green-500 text-xl"
              icon={faCircleCheck}
            />
            <div>
              <p className="text-muted-foreground text-xs">Vendidas</p>
              <p className="text-foreground text-xl font-bold">{soldPieces}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4">
            <FontAwesomeIcon
              className="text-red-500 text-xl"
              icon={faCircleXmark}
            />
            <div>
              <p className="text-muted-foreground text-xs">Não vendidas</p>
              <p className="text-foreground text-xl font-bold">
                {unsoldPieces}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4">
            <FontAwesomeIcon
              className="text-violet-500 text-xl"
              icon={faDollarSign}
            />
            <div>
              <p className="text-muted-foreground text-xs">Total Vendido</p>
              <p className="text-foreground text-xl font-bold">
                {formatCents(totalSold)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      <div>
        <Card className="ring-0 border border-b-0 rounded-b-none">
          <CardHeader className="flex justify-between">
            <h4 className="text-base font-semibold">Produtos</h4>
            <div className="space-x-2">
              <Badge variant="secondary">{totalPieces} produtos</Badge>
            </div>
          </CardHeader>
        </Card>
        <Table className="ring-0 border border-t">
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Referência</TableHead>
              <TableHead>Definição</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Vendido</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Observação</TableHead>
              <TableHead className="w-24"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((item, _index) => (
              <TableRow key={item.id} className={item.sold ? "bg-green-50 hover:bg-green-50" : ""}>
                <TableCell className="font-medium">{item.id}</TableCell>
                <TableCell>{item.reference}</TableCell>
                <TableCell>{item.definition}</TableCell>
                <TableCell className="font-semibold">{formatCents(item.price)}</TableCell>
                <TableCell>
                  <Checkbox
                    checked={item.sold}
                    onCheckedChange={(checked) =>
                      markSoldMutation.mutate({
                        itemId: item.id,
                        sold: checked === true,
                      })
                    }
                  />
                </TableCell>
                <TableCell>
                  <Badge
                    className={
                      item.sold
                        ? "bg-green-50 text-green-700 hover:bg-green-50"
                        : "bg-red-50 text-red-700 hover:bg-red-50"
                    }
                  >
                    {item.sold ? "Vendido" : "Em aberto"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <ObservationPopover spreadsheetId={spreadsheetId} product={item} />
                </TableCell>
                <TableCell className="space-x-2 text-base w-px whitespace-nowrap">
                  <FontAwesomeIcon
                    className="text-blue-500 hover:cursor-pointer"
                    icon={faEdit}
                    onClick={() => openEdit(item)}
                  />
                  <DeleteConfirmDialog
                    trigger={
                      <FontAwesomeIcon
                        className="text-red-500 hover:cursor-pointer"
                        icon={faTrashCan}
                      />
                    }
                    description="O produto será removido permanentemente da planilha."
                    onConfirm={() => deleteMutation.mutate(item.id)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <ProductDialogEditor
        spreadsheetId={spreadsheetId}
        product={editingProduct}
        open={editOpen}
        onOpenChange={setEditOpen}
        onSaved={() =>
          queryClient.invalidateQueries({ queryKey: ["products", spreadsheetId] })
        }
      />
    </div>
  )
}
