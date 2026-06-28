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
import { Button } from "@/components/ui/button"
import { faPlusSquare } from "@fortawesome/free-regular-svg-icons"
import { Link } from "react-router"

const mockSpreadsheets = [
  {
    id: "PLN-010",
    revendedora: "Ana Silva",
    emitidaEm: "Jan 2026",
    pecas: 20,
    vendidas: 6,
    emAberto: 14,
    totalVendido: 540.0,
    status: "Inativa",
  },
  {
    id: "PLN-007",
    revendedora: "Carla Mendes",
    emitidaEm: "Fev 2026",
    pecas: 35,
    vendidas: 35,
    emAberto: 0,
    totalVendido: 1820.0,
    status: "Inativa",
  },
  {
    id: "PLN-004",
    revendedora: "Jhenifer Trindade",
    emitidaEm: "Mar 2026",
    pecas: 15,
    vendidas: 10,
    emAberto: 5,
    totalVendido: 870.5,
    status: "Inativa",
  },
]

export const SpreadSheet = () => {
  return (
    <>
      <div className="flex justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold">Planilhas</h1>
          <h3 className="text-muted-foreground">
            Gerencie todas as planilhas das revendedoras
          </h3>
        </div>
        <Button asChild size="lg">
          <Link to={"editor"}>
            <FontAwesomeIcon icon={faPlusSquare} />
            Nova Planilha
          </Link>
        </Button>
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
          3 ativas
        </Badge>
      </div>
      <div className="flex gap-2">
        <Card className="min-w-90">
          <CardHeader className="flex justify-between items-center">
            <span className="font-medium">PLN-009</span>
            <Badge className="bg-green-100 text-green-600 font-semibold">
              Ativa
            </Badge>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-2 text-[14px]">Ana Silva</p>
            <p className="text-muted-foreground text-xs mb-2">
              Emitida em Jun 2026
            </p>
            <div className="grid grid-cols-3 grid-rows-2 w-fit">
              <span className="text-muted-foreground">Peças</span>
              <span className="text-muted-foreground">Vendidas</span>
              <span className="text-muted-foreground">Em aberto</span>
              <span className="text-base font-bold">20</span>
              <span className="text-base font-bold text-green-500">6</span>
              <span className="text-base font-bold text-red-500">14</span>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="flex items-center gap-3 my-4">
        <hr className="flex-1" />
        <span className="text-sm text-muted-foreground">
          Planilhas Inativas
        </span>
        <hr className="flex-1" />
      </div>
      <Card className="ring-0 border border-b-0 rounded-b-none">
        <CardHeader className="flex gap-3">
          <div className="space-y-2">
            <Label htmlFor="spreadsheet">Planilha</Label>
            <Input
              className="w-2xs"
              id="spreadsheet"
              type="text"
              placeholder="Buscar por nome na planilha..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="spreadsheet">Revendedora</Label>
            <Input
              id="spreadsheet"
              type="text"
              placeholder="Todas as revendedoras"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="spreadsheet">Status</Label>
            <Input id="spreadsheet" type="text" placeholder="Todos os Status" />
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
            <TableHead>Em aberto</TableHead>
            <TableHead>Total Vendido</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockSpreadsheets.map((s) => (
            <TableRow key={s.id}>
              <TableCell className="font-medium">{s.id}</TableCell>
              <TableCell>{s.revendedora}</TableCell>
              <TableCell>{s.emitidaEm}</TableCell>
              <TableCell>{s.pecas}</TableCell>
              <TableCell className="text-green-600 font-semibold">
                {s.vendidas}
              </TableCell>
              <TableCell className="text-red-500 font-semibold">
                {s.emAberto}
              </TableCell>
              <TableCell>R$ {s.totalVendido.toFixed(2)}</TableCell>
              <TableCell>
                <Badge className="bg-gray-100 text-gray-600 font-semibold">
                  {s.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}
