import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
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
  faMessage,
  faTrashCan,
} from "@fortawesome/free-regular-svg-icons"
import { faBoxOpen, faDollarSign } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

const mockItems = [
  {
    id: 1,
    referencia: "REF-001",
    definicao: "Blusa Floral",
    valor: 89.9,
    vendido: true,
    observacao: "",
  },
  {
    id: 2,
    referencia: "REF-002",
    definicao: "Calça Jeans Slim",
    valor: 149.9,
    vendido: false,
    observacao: "Cliente pediu troca de tamanho",
  },
  {
    id: 3,
    referencia: "REF-003",
    definicao: "Vestido Midi",
    valor: 199.9,
    vendido: true,
    observacao: "",
  },
  {
    id: 4,
    referencia: "REF-004",
    definicao: "Saia Plissada",
    valor: 119.9,
    vendido: false,
    observacao: "",
  },
  {
    id: 5,
    referencia: "REF-005",
    definicao: "Conjunto Linho",
    valor: 259.9,
    vendido: true,
    observacao: "Aguardando pagamento",
  },
]

export const IssuedSpreadSheet = () => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between">
        <div className="space-y-2">
          <div className="flex gap-2 items-center">
            <h1 className="text-2xl font-bold">Planilha - Ana Silva</h1>
            <Badge className="bg-yellow-50 text-yellow-700 hover:bg-yellow-50">
              Rascunho
            </Badge>
          </div>
          <h3 className="text-muted-foreground text-[14px]">
            Emitida em 18/19/2026 · 18 peças
          </h3>
        </div>
        <Button size="lg">Emitir Planilha</Button>
      </div>
      <div className="flex gap-4 *:flex-1">
        <Card>
          <CardContent className="flex items-center gap-4">
            <FontAwesomeIcon className="text-xl" icon={faBoxOpen} />
            <div>
              <p className="text-muted-foreground text-xs">Total de peças</p>
              <p className="text-foreground text-xl">18</p>
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
              <p className="text-muted-foreground text-xs">Total de peças</p>
              <p className="text-foreground text-xl">18</p>
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
              <p className="text-muted-foreground text-xs">Total de peças</p>
              <p className="text-foreground text-xl">18</p>
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
              <p className="text-muted-foreground text-xs">Total de peças</p>
              <p className="text-foreground text-xl">18</p>
            </div>
          </CardContent>
        </Card>
      </div>
      <div>
        <Card className="ring-0 border border-b-0 rounded-b-none">
          <CardHeader className="flex justify-between">
            <h4 className="text-base font-semibold">Produtos</h4>
            <div className="space-x-2">
              <Badge variant="secondary">3 produtos</Badge>
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
              <TableHead>Vendido</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Observação</TableHead>
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
                <TableCell>{item.vendido ? "Sim" : "Não"}</TableCell>
                <TableCell>
                  <Badge
                    className={
                      item.vendido
                        ? "bg-green-50 text-green-700 hover:bg-green-50"
                        : "bg-red-50 text-red-700 hover:bg-red-50"
                    }
                  >
                    {item.vendido ? "Vendido" : "Em aberto"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {item.observacao && (
                    <Popover>
                      <PopoverTrigger>
                        <FontAwesomeIcon
                          className="text-green-600"
                          icon={faMessage}
                        />
                      </PopoverTrigger>
                      <PopoverContent className=" max-w-52">
                        <PopoverTitle>
                          <FontAwesomeIcon
                            className="text-green-600 mr-1.5"
                            icon={faMessage}
                          />
                          Observação:
                        </PopoverTitle>
                        <hr />
                        {item.observacao}
                        <PopoverDescription className="text-xs">
                          {item.referencia} · {item.definicao}
                        </PopoverDescription>
                      </PopoverContent>
                    </Popover>
                  )}
                </TableCell>
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
