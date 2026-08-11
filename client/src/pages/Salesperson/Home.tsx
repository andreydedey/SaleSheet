import { useState } from "react"
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
import { cn } from "@/lib/utils"
import type { SpreadSheetStatus } from "@/types/api"

const statusLabel: Record<SpreadSheetStatus, string> = {
  DRAFT: "Rascunho",
  ACTIVE: "Ativo",
  INACTIVE: "Inativo",
}

type StatusFilter = "ALL" | "ACTIVE" | "INACTIVE"

export const Home = () => {
  const { user } = useAuth()
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL")

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
      <div className="flex gap-2">
        {(
          [
            { label: "Todas", value: "ALL", count: totalCount },
            { label: "Ativas", value: "ACTIVE", count: activeCount },
            { label: "Inativas", value: "INACTIVE", count: inactiveCount },
          ] as { label: string; value: StatusFilter; count: number }[]
        ).map(({ label, value, count }) => (
          <button
            key={value}
            onClick={() => setStatusFilter(value)}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium border",
              statusFilter === value
                ? "bg-foreground text-background border-foreground"
                : "bg-background text-foreground border-border",
            )}
          >
            {label}
            <span
              className={cn(
                "text-xs rounded-full px-1.5 py-0.5 font-semibold",
                statusFilter === value
                  ? "bg-white/20 text-background"
                  : "bg-muted text-muted-foreground",
              )}
            >
              {count}
            </span>
          </button>
        ))}
      </div>
      {filteredSpreadsheets.map((spreadsheet) => (
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
