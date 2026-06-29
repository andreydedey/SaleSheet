import { AddProductDialog } from "@/components/AddProductDialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { faEdit, faTrashCan } from "@fortawesome/free-regular-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

const mockItems = [
  { id: 1, referencia: "REF-001", definicao: "Blusa Floral", valor: 89.9 },
  { id: 2, referencia: "REF-002", definicao: "Calça Jeans Slim", valor: 149.9 },
  { id: 3, referencia: "REF-003", definicao: "Vestido Midi", valor: 199.9 },
  { id: 4, referencia: "REF-004", definicao: "Saia Plissada", valor: 119.9 },
  { id: 5, referencia: "REF-005", definicao: "Conjunto Linho", valor: 259.9 },
]

export const SpreadSheetEditor = () => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between">
        <div className="space-y-2">
          <div className="flex gap-2 items-center">
            <h1 className="text-2xl font-bold">Nova Planilha</h1>
            <Badge className="bg-yellow-50 text-yellow-700 hover:bg-yellow-50">
              Rascunho
            </Badge>
          </div>
          <h3 className="text-muted-foreground text-[14px]">
            Criada em 18/06/2026 · não emitida
          </h3>
        </div>
        <Button size="lg">Emitir Planilha</Button>
      </div>
      <Card className="py-6">
        <CardContent className="flex justify-between">
          <div className="space-y-1">
            <p>Revendedora</p>
            <p>
              A planilha ficará visível para a revendedora somente após ser
              emitida
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="salesperson">Revendedor</Label>
            <Input
              className="w-2xs"
              id="salesperson"
              placeholder="Seleciona o revendedor"
            />
          </div>
        </CardContent>
      </Card>
      <div>
        <Card className="ring-0 border border-b-0 rounded-b-none">
          <CardHeader className="flex justify-between">
            <h4 className="text-base font-semibold">Produtos</h4>
            <div className="space-x-2">
              <Badge variant="secondary">3 produtos</Badge>
              <AddProductDialog />
            </div>
          </CardHeader>
        </Card>
        <Table className="ring-0 border border-t">
          <TableHeader>
            <TableRow>
              <TableHead>N</TableHead>
              <TableHead>Referência</TableHead>
              <TableHead>Definição</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead className="w-24"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.id}</TableCell>
                <TableCell>{item.referencia}</TableCell>
                <TableCell>{item.definicao}</TableCell>
                <TableCell>R$ {item.valor.toFixed(2)}</TableCell>
                <TableCell className="space-x-2 text-base w-px whitespace-nowrap">
                  <FontAwesomeIcon
                    className="text-blue-500 hover:cursor-pointer"
                    icon={faEdit}
                  />
                  <FontAwesomeIcon
                    className="text-red-500 hover:cursor-pointer"
                    icon={faTrashCan}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
