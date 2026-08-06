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
import { useQuery } from "@tanstack/react-query"
import { listSpreadsheets } from "@/lib/api/spreadsheets"
import { useState } from "react"
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
  const [nameFilter, setNameFilter] = useState("")

  const { data: spreadsheetsPage } = useQuery({
    queryKey: ["spreadsheets", nameFilter],
    queryFn: () => listSpreadsheets({ name: nameFilter || undefined }),
  })

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
            Gerencie todas as planilhas das revendedoras
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
      <div className="flex gap-2">
        {activeSpreadsheets.map((s) => (
          <Card key={s.id} className="min-w-90">
            <CardHeader className="flex justify-between items-center">
              <span className="font-medium">{s.name}</span>
              <Badge className="bg-green-100 text-green-600 font-semibold">
                Ativa
              </Badge>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-xs mb-2">
                Emitida em{" "}
                {s.issuedAt
                  ? new Date(s.issuedAt).toLocaleDateString("pt-BR")
                  : "-"}
              </p>
              <div className="grid grid-cols-3 grid-rows-2 w-fit">
                <span className="text-muted-foreground">Peças</span>
                <span className="text-muted-foreground">Vendidas</span>
                <span className="text-muted-foreground">Em aberto</span>
                <span className="text-base font-bold">{s.totalPieces}</span>
                <span className="text-base font-bold text-green-500">
                  {s.soldPieces}
                </span>
                <span className="text-base font-bold text-red-500">
                  {s.totalPieces - s.soldPieces}
                </span>
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
              className="w-2xs"
              id="search-name"
              type="text"
              placeholder="Buscar por nome na planilha..."
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
            />
          </div>
        </CardHeader>
      </Card>
      <Table className="ring-0 border border-t">
        <TableHeader>
          <TableRow>
            <TableHead>Planilha</TableHead>
            <TableHead>Emitida em</TableHead>
            <TableHead>Peças</TableHead>
            <TableHead>Vendidas</TableHead>
            <TableHead>Em aberto</TableHead>
            <TableHead>Total Vendido</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {spreadsheetsPage?.content.map((s) => (
            <TableRow key={s.id}>
              <TableCell className="font-medium">
                <Link
                  to={
                    s.status === "DRAFT"
                      ? `editor?id=${s.id}`
                      : `issued/${s.id}`
                  }
                  className="hover:underline"
                >
                  {s.name}
                </Link>
              </TableCell>
              <TableCell>
                {s.issuedAt
                  ? new Date(s.issuedAt).toLocaleDateString("pt-BR")
                  : "-"}
              </TableCell>
              <TableCell>{s.totalPieces}</TableCell>
              <TableCell className="text-green-600 font-semibold">
                {s.soldPieces}
              </TableCell>
              <TableCell className="text-red-500 font-semibold">
                {s.totalPieces - s.soldPieces}
              </TableCell>
              <TableCell>
                R${" "}
                {/* totalSold is derived in frontend - needs product data */}
                -
              </TableCell>
              <TableCell>
                <Badge className={`${statusStyle[s.status]} font-semibold`}>
                  {statusLabel[s.status]}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}
