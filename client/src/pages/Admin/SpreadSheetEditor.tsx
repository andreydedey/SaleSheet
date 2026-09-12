import { ProductDialogEditor } from "@/components/ProductDialogEditor"
import { DeleteConfirmDialog } from "@/components/DeleteConfirmDialog"
import { EmitSpreadsheetDialog } from "@/components/EmitSpreadsheetDialog"
import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Package } from "lucide-react"
import { faEdit, faTrashCan } from "@fortawesome/free-regular-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useMutation, useQuery } from "@tanstack/react-query"
import { Link, useSearchParams } from "react-router"
import { useState } from "react"
import type { ProductDTO } from "@/types/product"
import {
  getSpreadsheet,
  updateSpreadsheetSalesperson,
  updateDueDate,
} from "@/lib/api/spreadsheets"
import { dueDateToDate, dateToDueDate } from "@/lib/utils/spreadsheet"
import { DatePicker } from "@/components/DatePicker"
import { listProducts, deleteProduct } from "@/lib/api/products"
import { getSalespersons } from "@/lib/api/dashboard"
import { toast } from "sonner"
import { formatCents } from "@/components/ui/currency-input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export const SpreadSheetEditor = () => {
  const [searchParams] = useSearchParams()
  const spreadsheetId = Number(searchParams.get("id"))

  const { data: spreadsheet, refetch: refetchSpreadsheet } = useQuery({
    queryKey: ["spreadsheet", spreadsheetId],
    queryFn: () => getSpreadsheet(spreadsheetId),
  })

  const { data: productsPage, refetch: refetchProducts } = useQuery({
    queryKey: ["products", spreadsheetId],
    queryFn: () => listProducts(spreadsheetId, { page: 0, size: 100 }),
  })

  const { data: salespersonsPage } = useQuery({
    queryKey: ["dashboard", "salespersons"],
    queryFn: () => getSalespersons(0, 100),
  })

  const salespersonMutation = useMutation({
    mutationFn: (salespersonId: string) =>
      updateSpreadsheetSalesperson(spreadsheetId, salespersonId),
    onSuccess: () => refetchSpreadsheet(),
    onError: () => toast.error("Erro ao atualizar revendedor."),
  })

  const dueDateMutation = useMutation({
    mutationFn: (date: Date | undefined) =>
      updateDueDate(spreadsheetId, dateToDueDate(date)),
    onSuccess: () => refetchSpreadsheet(),
    onError: () => toast.error("Erro ao atualizar data de vencimento."),
  })

  const deleteMutation = useMutation({
    mutationFn: (itemId: number) => deleteProduct(spreadsheetId, itemId),
    onSuccess: () => {
      toast.success("Produto removido.")
      refetchProducts()
    },
    onError: () => toast.error("Erro ao remover produto."),
  })

  const products = productsPage?.content ?? []
  const salespersons = salespersonsPage?.content ?? []
  const [editingProduct, setEditingProduct] = useState<ProductDTO | undefined>()
  const [editOpen, setEditOpen] = useState(false)

  const canEmit = products.length > 0 && !!spreadsheet?.salespersonId

  const openEdit = (product: ProductDTO) => {
    setEditingProduct(product)
    setEditOpen(true)
  }

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
      <div className="flex justify-between">
        <div className="space-y-2">
          <div className="flex gap-2 items-center">
            <h1 className="text-2xl font-bold">{spreadsheet?.name}</h1>
          </div>
          <h3 className="text-muted-foreground text-[14px]">
            Criada em{" "}
            {spreadsheet
              ? new Date(spreadsheet.createdAt).toLocaleDateString("pt-BR")
              : ""}{" "}
            · não emitida
          </h3>
        </div>
        <EmitSpreadsheetDialog spreadsheetId={spreadsheetId} disabled={!canEmit} />
      </div>
      <Card>
        <CardContent className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <p className="font-semibold text-base">Revendedor</p>
            <p className="text-muted-foreground text-sm">
              A planilha ficará visível para o revendedor somente após ser emitida.
            </p>
          </div>
          <div className="flex flex-col md:flex-row gap-4 md:items-start">
            <div className="flex flex-col gap-1 md:min-w-56">
              <label className="text-sm font-medium">Revendedor</label>
              <Select
                value={spreadsheet?.salespersonId ? String(spreadsheet.salespersonId) : undefined}
                onValueChange={(v) => salespersonMutation.mutate(v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o revendedor" />
                </SelectTrigger>
                <SelectContent>
                  {salespersons.map((s) => (
                    <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Vencimento</label>
              <DatePicker
                value={dueDateToDate(spreadsheet?.dueDate ?? null)}
                onChange={(date) => dueDateMutation.mutate(date)}
                fromDate={new Date()}
                className="w-full md:w-auto"
              />
            </div>
          </div>
        </CardContent>
      </Card>
      <div>
        <Card className="ring-0 border border-b-0 rounded-b-none">
          <CardHeader className="flex justify-between">
            <h4 className="text-base font-semibold">Produtos</h4>
            <div className="space-x-2">
              <Badge variant="secondary">{products.length} produtos</Badge>
              <ProductDialogEditor
                spreadsheetId={spreadsheetId}
                onSaved={refetchProducts}
              />
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
              <TableHead className="w-24"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5}>
                  <Empty>
                    <EmptyHeader>
                      <EmptyMedia>
                        <Package className="size-10 text-muted-foreground" />
                      </EmptyMedia>
                      <EmptyTitle>Nenhum produto cadastrado</EmptyTitle>
                      <EmptyDescription>
                        Adicione produtos para montar a planilha.
                      </EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                </TableCell>
              </TableRow>
            ) : (
              products.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.id}</TableCell>
                  <TableCell>{item.reference}</TableCell>
                  <TableCell>{item.definition?.name}</TableCell>
                  <TableCell className="font-semibold">{formatCents(item.price)}</TableCell>
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
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <ProductDialogEditor
        spreadsheetId={spreadsheetId}
        product={editingProduct}
        open={editOpen}
        onOpenChange={setEditOpen}
        onSaved={refetchProducts}
      />
    </div>
  )
}
