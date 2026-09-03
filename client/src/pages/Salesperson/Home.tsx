import { useSearchParams } from "react-router"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card"
import { faHandsClapping } from "@fortawesome/free-solid-svg-icons/faHandsClapping"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useQuery } from "@tanstack/react-query"
import { getMyStats, getMySpreadsheets } from "@/lib/api/salesperson"
import { useAuth } from "@/context/AuthContext"
import { Link } from "react-router"
import { formatCents } from "@/components/ui/currency-input"
import type { SpreadSheetStatus } from "@/types/api"
import { FilterPills } from "@/components/FilterPills"
import { SearchX } from "lucide-react"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

const statusLabel: Record<SpreadSheetStatus, string> = {
  DRAFT: "Rascunho",
  ACTIVE: "Ativo",
  INACTIVE: "Inativo",
}

type StatusFilter = "ALL" | "ACTIVE" | "INACTIVE"

export const Home = () => {
  const { user } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const statusFilter = (searchParams.get("status") ?? "ALL") as StatusFilter

  const { data: stats } = useQuery({
    queryKey: ["salesperson", "stats"],
    queryFn: getMyStats,
  })

  const statusParam = statusFilter === "ALL" ? undefined : statusFilter

  const { data: page } = useQuery({
    queryKey: ["salesperson", "spreadsheets", statusFilter],
    queryFn: () => getMySpreadsheets({ status: statusParam }),
  })

  const filteredSpreadsheets = page?.content ?? []
  const totalCount = page?.totalCount ?? 0
  const activeCount = page?.activeCount ?? 0
  const inactiveCount = page?.inactiveCount ?? 0

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-bold">
          Olá, {user?.name}! <FontAwesomeIcon icon={faHandsClapping} />
        </h1>
        <h2 className="text-muted-foreground">Suas planilhas de vendas</h2>
      </div>
      <Card className="bg-primary">
        <CardHeader className="space-y-2">
          <CardDescription>Total acumulado de vendas</CardDescription>
          <p className="text-primary-foreground font-bold text-3xl">
            {formatCents(stats?.totalSold ?? 0)}
          </p>
        </CardHeader>
        <CardContent className="grid grid-cols-3 grid-rows-2 gap-y-0">
          <p className="text-muted-foreground text-xs leading-none">Peças</p>
          <p className="text-muted-foreground text-xs leading-none">Vendidas</p>
          <p className="text-muted-foreground text-xs leading-none">
            Planilhas
          </p>
          <p className="text-primary-foreground font-bold text-lg leading-none">
            {stats?.totalPieces ?? 0}
          </p>
          <p className="text-primary-foreground font-bold text-lg leading-none">
            {stats?.totalSoldPieces ?? 0}
          </p>
          <p className="text-primary-foreground font-bold text-lg leading-none">
            {stats?.totalSpreadsheets ?? 0}
          </p>
        </CardContent>
      </Card>
      <h2 className="font-semibold text-foreground">Planilhas</h2>
      <FilterPills
        options={[
          { label: "Todas", value: "ALL" as StatusFilter, count: totalCount },
          { label: "Ativas", value: "ACTIVE" as StatusFilter, count: activeCount },
          { label: "Inativas", value: "INACTIVE" as StatusFilter, count: inactiveCount },
        ]}
        value={statusFilter}
        onChange={(v) => setSearchParams(v === "ALL" ? {} : { status: v }, { replace: true })}
      />
      {filteredSpreadsheets.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia>
              <SearchX className="size-10 text-muted-foreground" />
            </EmptyMedia>
            <EmptyTitle>
              {statusFilter === "INACTIVE"
                ? "Nenhuma planilha inativa"
                : statusFilter === "ACTIVE"
                  ? "Nenhuma planilha ativa"
                  : "Nenhuma planilha encontrada"}
            </EmptyTitle>
            <EmptyDescription>
              {statusFilter !== "ALL"
                ? `Você não possui planilhas ${statusFilter === "INACTIVE" ? "inativas" : "ativas"} no momento. `
                : "Você ainda não possui planilhas."}
              {statusFilter !== "ALL" && (
                <a href="#" onClick={(e) => { e.preventDefault(); setSearchParams({}, { replace: true }) }}>
                  Ver todas as planilhas
                </a>
              )}
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : filteredSpreadsheets.map((spreadsheet) => (
        <Card key={spreadsheet.id} className="flex flex-col gap-1">
          <CardHeader className="flex justify-between items-center">
            <span className="text-lg font-bold text-foreground">
              {spreadsheet.name}
            </span>
            <Badge className="bg-green-100 text-green-500 font-bold">
              {statusLabel[spreadsheet.status]}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-muted-foreground">
              Emitida em{" "}
              {spreadsheet.issuedAt
                ? new Date(spreadsheet.issuedAt).toLocaleDateString("pt-BR")
                : "-"}
            </p>
            <div className="flex border rounded-md *:flex-1 *:border-r *:last:border-r-0 *:p-2">
              <div>
                <p className="text-muted-foreground">Peças</p>
                <p className="text-lg font-bold">{spreadsheet.totalPieces}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Vendidas</p>
                <p className="text-lg font-bold text-green-600">
                  {spreadsheet.soldPieces}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Em aberto</p>
                <p className="text-lg font-bold text-red-600">
                  {spreadsheet.totalPieces - spreadsheet.soldPieces}
                </p>
              </div>
            </div>
            <Button size="lg" className="w-full py-6" asChild>
              <Link to={`/salesperson/spreadsheets/${spreadsheet.id}`}>
                Abrir Planilha
              </Link>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
