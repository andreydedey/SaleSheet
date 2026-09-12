import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircle } from "@fortawesome/free-solid-svg-icons/faCircle"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CreateSpreadSheetDialog } from "@/components/CreateSpreadSheetDialog"
import { useNavigate, useSearchParams } from "react-router"
import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
import { ChevronDown, Search } from "lucide-react"
import { formatDueDate } from "@/lib/utils/spreadsheet"
import { DueDateChip } from "@/components/DueDateChip"
import dayjs from "dayjs"
import { Button } from "@/components/ui/button"
import { listSpreadsheets } from "@/lib/api/spreadsheets"
import { getSalespersons } from "@/lib/api/dashboard"
import { useCallback } from "react"
import { formatCents } from "@/components/ui/currency-input"
import { useDebounce } from "use-debounce"
import { FilterPills } from "@/components/FilterPills"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { SpreadSheetStatus } from "@/types/spreadsheet"

const statusLabel: Record<SpreadSheetStatus, string> = {
  DRAFT: "Rascunho",
  ACTIVE: "Ativa",
  INACTIVE: "Inativa",
}

const statusStyle: Record<SpreadSheetStatus, string> = {
  DRAFT: "bg-yellow-100 text-yellow-700",
  ACTIVE: "bg-green-100 text-green-600",
  INACTIVE: "bg-gray-100 text-gray-600",
}

type StatusFilter = SpreadSheetStatus | ""

export const SpreadSheet = () => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const nameFilter = searchParams.get("q") ?? ""
  const salespersonFilter = searchParams.get("salesperson") ?? ""
  const statusFilter = (searchParams.get("status") ?? "") as StatusFilter

  const [debouncedName] = useDebounce(nameFilter, 300)

  const setParam = useCallback(
    (key: string, value: string) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev)
        value ? next.set(key, value) : next.delete(key)
        return next
      }, { replace: true })
    },
    [setSearchParams],
  )

  const {
    data: spreadsheetsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["spreadsheets", debouncedName, salespersonFilter, statusFilter],
    queryFn: ({ pageParam }) =>
      listSpreadsheets({
        name: debouncedName || undefined,
        salespersonId: salespersonFilter || undefined,
        status: statusFilter || undefined,
        page: pageParam,
        size: 10,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.number + 1 >= lastPage.totalPages ? undefined : lastPage.number + 1,
  })

  const spreadsheets = spreadsheetsData?.pages.flatMap((p) => p.content) ?? []
  const firstPage = spreadsheetsData?.pages[0]
  const totalCount = firstPage?.totalCount ?? 0
  const activeCount = firstPage?.activeCount ?? 0
  const inactiveCount = firstPage?.inactiveCount ?? 0

  const { data: salespersonsPage } = useQuery({
    queryKey: ["dashboard", "salespersons"],
    queryFn: () => getSalespersons(0, 100),
  })

  const salespersons = salespersonsPage?.content ?? []

  const { data: activePage } = useQuery({
    queryKey: ["spreadsheets", "active"],
    queryFn: () => listSpreadsheets({ status: "ACTIVE" }),
  })

  const activeSpreadsheets = activePage?.content ?? []

  const hasFilters = Boolean(debouncedName || salespersonFilter || statusFilter)

  const clearFilters = () => {
    setSearchParams({}, { replace: true })
  }

  const navigateToSpreadsheet = (s: { id: number; status: SpreadSheetStatus }) => {
    navigate(s.status === "DRAFT" ? `editor?id=${s.id}` : `issued/${s.id}`)
  }

  return (
    <>
      <div className="flex justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold">Planilhas</h1>
          <h3 className="text-muted-foreground hidden md:block">
            Gerencie todas as planilhas dos revendedores
          </h3>
        </div>
        <div className="hidden md:block">
          <CreateSpreadSheetDialog />
        </div>
      </div>

      {/* Mobile: search + filter pills */}
      <div className="md:hidden space-y-3 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            className="pl-9"
            type="text"
            placeholder="Buscar por revendedora ou ID..."
            value={nameFilter}
            onChange={(e) => setParam("q", e.target.value)}
          />
        </div>
        <Select
          value={salespersonFilter}
          onValueChange={(v) => setParam("salesperson", v === "all" ? "" : v)}
        >
          <SelectTrigger className="w-full h-11 text-base">
            <SelectValue placeholder="Todas as revendedoras" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as revendedoras</SelectItem>
            {salespersons.map((s) => (
              <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <FilterPills
          options={[
            { label: "Todas", value: "" as StatusFilter, count: totalCount },
            { label: "Ativas", value: "ACTIVE" as StatusFilter, count: activeCount },
            { label: "Inativas", value: "INACTIVE" as StatusFilter, count: inactiveCount },
          ]}
          value={statusFilter}
          onChange={(v) => setParam("status", v)}
        />
      </div>

      {/* Mobile: card list */}
      <div className="md:hidden space-y-3">
        {spreadsheets.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia>
                <Search className="size-10 text-muted-foreground" />
              </EmptyMedia>
              <EmptyTitle>Nenhuma planilha encontrada</EmptyTitle>
              <EmptyDescription>
                Tente ajustar os filtros ou o termo de busca.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <>
            {spreadsheets.map((s) => (
              <Card
                key={s.id}
                className="cursor-pointer active:bg-muted/50"
                onClick={() => navigateToSpreadsheet(s)}
              >
                <CardContent className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-foreground">{s.name}</p>
                      <p className="text-sm text-muted-foreground">{s.salespersonName ?? "-"}</p>
                    </div>
                    <Badge className={`${statusStyle[s.status]} font-semibold`}>
                      {statusLabel[s.status]}
                    </Badge>
                  </div>
                  <div className="flex border rounded-md *:flex-1 *:border-r *:last:border-r-0 *:p-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Peças</p>
                      <p className="font-bold">{s.totalPieces}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Vendidos</p>
                      <p className="font-bold text-green-600">{s.soldPieces}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Total</p>
                      <p className="font-bold">{formatCents(s.totalSold)}</p>
                    </div>
                  </div>
                  <DueDateChip dueDate={s.dueDate} />
                </CardContent>
              </Card>
            ))}
            {hasNextPage && (
              <div className="flex justify-center pt-2">
                <Button
                  variant="outline"
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                >
                  <ChevronDown />
                  Carregar mais
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Desktop: active spreadsheets + filters + table */}
      <div className="hidden md:block">
        <div className="flex gap-2 items-center mb-3">
          <div>
            <FontAwesomeIcon
              className="text-green-600 text-xs mr-1"
              icon={faCircle}
            />
            <span className="font-semibold text-base">Planilhas Ativas</span>
          </div>
          <Badge className="bg-green-100 text-green-600 font-semibold">
            {activeSpreadsheets.length} ativas
          </Badge>
        </div>
        <div className="flex gap-2 overflow-x-auto pt-1 pb-3 px-1">
          {activeSpreadsheets.map((s) => (
            <Card key={s.id} className="min-w-90 shrink-0 hover:ring-2 hover:ring-blue-500 cursor-pointer" onClick={() => navigate(`issued/${s.id}`)}>
              <CardHeader className="flex justify-between items-center">
                <span className="font-semibold text-base">{s.name}</span>
                <Badge className="bg-green-100 text-green-600 font-semibold">
                  Ativa
                </Badge>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Emitida em{" "}
                  {s.issuedAt ? dayjs(s.issuedAt).format("DD/MM/YYYY") : "-"}
                </p>
                <DueDateChip dueDate={s.dueDate} />
                <div className="grid grid-cols-3 grid-rows-2 w-fit">
                  <span>Peças</span>
                  <span>Vendidas</span>
                  <span>Total Vendido</span>
                  <span className="text-base font-bold">{s.totalPieces}</span>
                  <span className="text-base font-bold">{s.soldPieces}</span>
                  <span className="text-base font-semibold">{formatCents(s.totalSold)}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="flex items-center gap-3 my-4">
          <hr className="flex-1" />
          <span className="text-sm text-muted-foreground">Planilhas</span>
          <hr className="flex-1" />
        </div>
        <Card className="ring-0 border border-b-0 rounded-b-none">
          <CardHeader className="flex gap-3">
            <div className="space-y-2">
              <Label htmlFor="search-name">Planilha</Label>
              <Input
                className="w-2xs py-4"
                id="search-name"
                type="text"
                placeholder="Buscar por nome na planilha..."
                value={nameFilter}
                onChange={(e) => setParam("q", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Revendedora</Label>
              <Select
                value={salespersonFilter || "all"}
                onValueChange={(v) => setParam("salesperson", v === "all" ? "" : v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todas as revendedoras" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as revendedoras</SelectItem>
                  {salespersons.map((s) => (
                    <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={statusFilter || "all"}
                onValueChange={(v) => setParam("status", v === "all" ? "" : v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="DRAFT">Rascunho</SelectItem>
                  <SelectItem value="ACTIVE">Ativa</SelectItem>
                  <SelectItem value="INACTIVE">Inativa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
        </Card>
        <Table className="ring-0 border border-t">
          <TableHeader>
            <TableRow>
              <TableHead>Planilha</TableHead>
              <TableHead>Revendedora</TableHead>
              <TableHead>Emitida em</TableHead>
              <TableHead>Peças</TableHead>
              <TableHead>Vendidas</TableHead>
              <TableHead>Total Vendido</TableHead>
              <TableHead>Vencimento</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {spreadsheets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-48">
                  <Empty>
                    <EmptyHeader>
                      <EmptyMedia>
                        <Search className="size-10 text-muted-foreground" />
                      </EmptyMedia>
                      <EmptyTitle>Nenhuma planilha encontrada</EmptyTitle>
                      <EmptyDescription>
                        Tente ajustar os filtros ou o termo de busca.
                        {hasFilters && (
                          <>
                            {" "}
                            <a href="#" onClick={(e) => { e.preventDefault(); clearFilters() }}>
                              Limpar filtros
                            </a>
                          </>
                        )}
                      </EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                </TableCell>
              </TableRow>
            ) : (
              spreadsheets.map((s) => (
                <TableRow
                  key={s.id}
                  className={`cursor-pointer ${s.status === "ACTIVE" ? "bg-green-50 hover:bg-green-50" : ""}`}
                  onClick={() => navigateToSpreadsheet(s)}
                >
                  <TableCell className="font-medium">{s.name}</TableCell>
                  <TableCell>{s.salespersonName ?? "-"}</TableCell>
                  <TableCell>
                    {s.issuedAt
                      ? new Date(s.issuedAt).toLocaleDateString("pt-BR", { month: "short", year: "numeric" }).replace(" de ", " ").replace(/^./, c => c.toUpperCase())
                      : "-"}
                  </TableCell>
                  <TableCell>{s.totalPieces}</TableCell>
                  <TableCell className="text-green-600 font-semibold">
                    {s.soldPieces}
                  </TableCell>
                  <TableCell className="font-semibold">{formatCents(s.totalSold)}</TableCell>
                  <TableCell>
                    {!s.dueDate ? (
                      <span className="text-muted-foreground">—</span>
                    ) : s.status !== "ACTIVE" ? (
                      <span className="text-muted-foreground">{formatDueDate(s.dueDate)}</span>
                    ) : (
                      <DueDateChip dueDate={s.dueDate} />
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge className={`${statusStyle[s.status]} font-semibold`}>
                      {statusLabel[s.status]}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        {hasNextPage && (
          <div className="flex justify-center mt-4">
            <Button
              variant="outline"
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
            >
              <ChevronDown />
              Carregar mais
            </Button>
          </div>
        )}
      </div>
    </>
  )
}
