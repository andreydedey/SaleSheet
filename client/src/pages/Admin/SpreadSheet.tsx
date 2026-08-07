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
import { CreateSpreadSheetDialog } from "@/components/CreateSpreadsheetDialog"
import { Link, useNavigate } from "react-router"
import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { listSpreadsheets } from "@/lib/api/spreadsheets"
import { getSalespersons } from "@/lib/api/dashboard"
import { useState } from "react"
import { formatCents } from "@/components/ui/currency-input"
import { useDebounce } from "use-debounce"
import type { SpreadSheetStatus } from "@/types/api"

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

export const SpreadSheet = () => {
  const navigate = useNavigate()
  const [nameFilter, setNameFilter] = useState("")
  const [debouncedName] = useDebounce(nameFilter, 300)
  const [salespersonFilter, setSalespersonFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState<SpreadSheetStatus | "">("")

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
      lastPage.last ? undefined : lastPage.number + 1,
  })

  const spreadsheets = spreadsheetsData?.pages.flatMap((p) => p.content) ?? []

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

  return (
    <>
      <div className="flex justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold">Planilhas</h1>
          <h3 className="text-muted-foreground">
            Gerencie todas as planilhas dos revendedores
          </h3>
        </div>
        <CreateSpreadSheetDialog />
      </div>
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
              <p className="text-muted-foreground text-sm mb-2">
                Emitida em{" "}
                {s.issuedAt
                  ? new Date(s.issuedAt).toLocaleDateString("pt-BR")
                  : "-"}
              </p>
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
              onChange={(e) => setNameFilter(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="filter-salesperson">Revendedora</Label>
            <select
              id="filter-salesperson"
              className="border rounded-lg px-2.5 py-2 text-sm bg-background h-9"
              value={salespersonFilter}
              onChange={(e) => setSalespersonFilter(e.target.value)}
            >
              <option value="">Todas as revendedoras</option>
              {salespersons.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="filter-status">Status</Label>
            <select
              id="filter-status"
              className="border rounded-lg px-2.5 py-2 text-sm bg-background h-9"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as SpreadSheetStatus | "")}
            >
              <option value="">Todos os status</option>
              <option value="DRAFT">Rascunho</option>
              <option value="ACTIVE">Ativa</option>
              <option value="INACTIVE">Inativa</option>
            </select>
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
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {spreadsheets.map((s) => (
            <TableRow
              key={s.id}
              className={`cursor-pointer ${s.status === "ACTIVE" ? "bg-green-50 hover:bg-green-50" : ""}`}
              onClick={() =>
                navigate(s.status === "DRAFT" ? `editor?id=${s.id}` : `issued/${s.id}`)
              }
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
                <Badge className={`${statusStyle[s.status]} font-semibold`}>
                  {statusLabel[s.status]}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
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
    </>
  )
}
