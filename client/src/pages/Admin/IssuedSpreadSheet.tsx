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
import { Link, useNavigate, useParams, useSearchParams } from "react-router"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { getSpreadsheet, updateSpreadsheetSalesperson, updateDueDate } from "@/lib/api/spreadsheets"
import { getCountdownInfo, countdownColors, dueDateToDate, dateToDueDate } from "@/lib/utils/spreadsheet"
import { DatePicker } from "@/components/DatePicker"
import { DueDateBanner } from "@/components/DueDateBanner"
import { getSalespersons } from "@/lib/api/dashboard"
import { listProducts, markSold, deleteProduct, addNote } from "@/lib/api/products"
import { ProductDialogEditor } from "@/components/ProductDialogEditor"
import { ObservationPopover } from "@/components/ObservationPopover"
import { MobileProductCard } from "@/components/MobileProductCard"
import { FilterPills } from "@/components/FilterPills"
import { useState } from "react"
import { CalendarClock, ChevronLeft, UserRound } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { ProductDTO, ProductPageDTO } from "@/types/product"

type ProductFilter = "ALL" | "SOLD" | "UNSOLD"

export const IssuedSpreadSheet = () => {
  const { id } = useParams<{ id: string }>()
  const spreadsheetId = Number(id)
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const productFilter = (searchParams.get("filter") ?? "ALL") as ProductFilter

  const { data: spreadsheet, refetch: refetchSpreadsheet } = useQuery({
    queryKey: ["spreadsheet", spreadsheetId],
    queryFn: () => getSpreadsheet(spreadsheetId),
  })

  const soldParam =
    productFilter === "SOLD" ? true : productFilter === "UNSOLD" ? false : undefined

  const { data: productsPage, refetch: refetchProducts } = useQuery({
    queryKey: ["products", spreadsheetId, productFilter],
    queryFn: () => listProducts(spreadsheetId, { page: 0, size: 100, sold: soldParam }),
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
    onSettled: () => refetchProducts(),
  })

  const addNoteMutation = useMutation({
    mutationFn: ({ itemId, observation }: { itemId: number; observation: string }) =>
      addNote(spreadsheetId, itemId, observation),
    onSuccess: () => refetchProducts(),
    onError: () => toast.error("Erro ao salvar observação."),
  })

  const deleteMutation = useMutation({
    mutationFn: (itemId: number) => deleteProduct(spreadsheetId, itemId),
    onSuccess: () => {
      toast.success("Produto removido.")
      refetchProducts()
    },
    onError: () => toast.error("Erro ao remover produto."),
  })

  const { data: salespersonsPage } = useQuery({
    queryKey: ["dashboard", "salespersons"],
    queryFn: () => getSalespersons(0, 100),
  })

  const salespersons = salespersonsPage?.content ?? []

  const salespersonMutation = useMutation({
    mutationFn: (salespersonId: string) =>
      updateSpreadsheetSalesperson(spreadsheetId, salespersonId),
    onSuccess: () => {
      refetchSpreadsheet()
      toast.success("Revendedor atualizado.")
      setChangingSalesperson(false)
    },
    onError: () => toast.error("Erro ao alterar revendedor."),
  })

  const products = productsPage?.content ?? []
  const dueDateMutation = useMutation({
    mutationFn: (date: Date | undefined) =>
      updateDueDate(spreadsheetId, dateToDueDate(date)),
    onSuccess: () => {
      refetchSpreadsheet()
      toast.success("Data de vencimento atualizada.")
    },
    onError: () => toast.error("Erro ao atualizar data de vencimento."),
  })

  const countdown = getCountdownInfo(spreadsheet?.dueDate ?? null)

  const [editingProduct, setEditingProduct] = useState<ProductDTO | undefined>()
  const [editOpen, setEditOpen] = useState(false)
  const [changingSalesperson, setChangingSalesperson] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<ProductDTO | undefined>()

  const openEdit = (product: ProductDTO) => {
    setEditingProduct(product)
    setEditOpen(true)
  }

  const totalPieces = productsPage?.totalCount ?? products.length
  const soldPieces = productsPage?.soldCount ?? products.filter((p) => p.sold).length
  const unsoldPieces = productsPage?.unsoldCount ?? totalPieces - soldPieces
  const totalSold = products
    .filter((p) => p.sold)
    .reduce((sum, p) => sum + p.price, 0)

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      {/* Desktop: breadcrumb */}
      <div className="hidden md:block">
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
      </div>

      {/* Mobile: back header */}
      <div className="md:hidden flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="icon"
            onClick={() => navigate("/spreadsheets")}
            className="size-10 rounded-full"
          >
            <ChevronLeft className="size-5" />
          </Button>
          <div>
            <h1 className="text-lg font-bold text-foreground">
              {spreadsheet?.salespersonName ?? spreadsheet?.name}
            </h1>
            <p className="text-sm text-muted-foreground">{spreadsheet?.name}</p>
          </div>
        </div>
        {spreadsheet?.status === "ACTIVE" ? (
          <Badge className="bg-green-50 text-green-700">Emitida</Badge>
        ) : (
          <Badge className="bg-gray-100 text-gray-600">Inativa</Badge>
        )}
      </div>

      {/* Desktop: title + status */}
      <div className="hidden md:flex justify-between items-start">
        <div className="space-y-2">
          <div className="flex gap-2 items-center flex-wrap">
            <h1 className="text-2xl font-bold">
              Planilha - {spreadsheet?.name}
            </h1>
            {spreadsheet?.status === "ACTIVE" ? (
              <Badge className="bg-green-50 text-green-700">Emitida</Badge>
            ) : (
              <Badge className="bg-gray-100 text-gray-600">Inativa</Badge>
            )}
            {countdown && (
              <DatePicker
                value={dueDateToDate(spreadsheet?.dueDate ?? null)}
                onChange={(date) => dueDateMutation.mutate(date)}
                onClear={() => dueDateMutation.mutate(undefined)}
                trigger={
                  <Badge
                    className={`cursor-pointer ${countdownColors[countdown.color].bg} ${countdownColors[countdown.color].text} border ${countdownColors[countdown.color].border} hover:opacity-80`}
                  >
                    <CalendarClock className="size-3" />
                    {countdown.text}
                  </Badge>
                }
              />
            )}
            {!countdown && spreadsheet?.status === "ACTIVE" && (
              <DatePicker
                value={undefined}
                onChange={(date) => dueDateMutation.mutate(date)}
                trigger={
                  <Button variant="outline" size="sm">
                    <CalendarClock className="size-4" />
                    Definir vencimento
                  </Button>
                }
              />
            )}
          </div>
          <h3 className="text-muted-foreground text-sm">
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

      {/* Mobile: stats row */}
      <div className="md:hidden flex [&>div]:flex-1 [&>div]:pl-2 [&>div]:whitespace-nowrap [&>div:not(:first-child)]:border-l-2">
        <div>
          <p className="text-sm text-muted-foreground">Peças</p>
          <p className="font-bold text-foreground text-lg">{totalPieces}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Vendidos</p>
          <p className="font-bold text-green-600 text-lg">{soldPieces}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Em aberto</p>
          <p className="font-bold text-red-600 text-lg">{unsoldPieces}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Total</p>
          <p className="font-bold text-lg text-violet-600">{formatCents(totalSold)}</p>
        </div>
      </div>

      {/* Desktop: stat cards */}
      <div className="hidden md:flex gap-4 *:flex-1">
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

      {/* Mobile: due date banner */}
      <div className="md:hidden">
        {countdown ? (
          <DatePicker
            value={dueDateToDate(spreadsheet?.dueDate ?? null)}
            onChange={(date) => dueDateMutation.mutate(date)}
            onClear={() => dueDateMutation.mutate(undefined)}
            trigger={
              <div className="cursor-pointer">
                <DueDateBanner dueDate={spreadsheet?.dueDate ?? null} />
              </div>
            }
          />
        ) : spreadsheet?.status === "ACTIVE" ? (
          <DatePicker
            value={undefined}
            onChange={(date) => dueDateMutation.mutate(date)}
            trigger={
              <Button variant="outline" className="w-full">
                <CalendarClock className="size-4" />
                Definir vencimento
              </Button>
            }
          />
        ) : null}
      </div>

      {/* Mobile: salesperson section */}
      <div className="md:hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-muted flex items-center justify-center">
              <UserRound className="size-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Revendedor</p>
              <p className="text-sm font-semibold text-foreground">
                {spreadsheet?.salespersonName ?? "-"}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setChangingSalesperson(!changingSalesperson)}
          >
            Alterar
          </Button>
        </div>
        {changingSalesperson && (
          <div className="mt-3">
            <Select
              value={String(spreadsheet?.salespersonId ?? "")}
              onValueChange={(v) => salespersonMutation.mutate(v)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecionar revendedor" />
              </SelectTrigger>
              <SelectContent>
                {salespersons.map((s) => (
                  <SelectItem key={s.id} value={String(s.id)}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Mobile: products heading */}
      <div className="md:hidden flex items-center justify-between">
        <h2 className="font-semibold text-base">Produtos</h2>
      </div>

      {/* Mobile: filter pills */}
      <div className="md:hidden">
        <FilterPills
          options={[
            { label: "Todos", value: "ALL" as ProductFilter, count: totalPieces },
            { label: "Vendidos", value: "SOLD" as ProductFilter, count: soldPieces },
            { label: "Em aberto", value: "UNSOLD" as ProductFilter, count: unsoldPieces },
          ]}
          value={productFilter}
          onChange={(v) => setSearchParams(v === "ALL" ? {} : { filter: v }, { replace: true })}
        />
      </div>

      {/* Mobile: product cards */}
      <div className="md:hidden space-y-3">
        {products.map((item) => (
          <MobileProductCard
            key={item.id}
            product={item}
            onMarkSold={(sold) =>
              markSoldMutation.mutate({ itemId: item.id, sold })
            }
            onSaveObservation={(observation) =>
              addNoteMutation.mutate({ itemId: item.id, observation })
            }
            observationSaving={addNoteMutation.isPending}
            onEdit={() => openEdit(item)}
            onDelete={() => setDeleteTarget(item)}
          />
        ))}
      </div>

      <DeleteConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => { if (!open) setDeleteTarget(undefined) }}
        description="O produto será removido permanentemente da planilha."
        onConfirm={() => {
          if (deleteTarget) deleteMutation.mutate(deleteTarget.id)
          setDeleteTarget(undefined)
        }}
      />

      {/* Desktop: products table */}
      <div className="hidden md:block">
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
            {products.map((item) => (
              <TableRow key={item.id} className={item.sold ? "bg-green-50 hover:bg-green-50" : ""}>
                <TableCell className="font-medium">{item.id}</TableCell>
                <TableCell>{item.reference}</TableCell>
                <TableCell>{item.definition?.name}</TableCell>
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
        onSaved={refetchProducts}
      />
    </div>
  )
}
