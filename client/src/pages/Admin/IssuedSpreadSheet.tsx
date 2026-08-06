import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useParams } from "react-router"
import { getSpreadsheet } from "@/lib/api/spreadsheets"
import { listProducts, markSold, deleteProduct } from "@/lib/api/products"

export const IssuedSpreadSheet = () => {
  const { id } = useParams<{ id: string }>()
  const spreadsheetId = Number(id)
  const queryClient = useQueryClient()

  const { data: spreadsheet } = useQuery({
    queryKey: ["spreadsheet", spreadsheetId],
    queryFn: () => getSpreadsheet(spreadsheetId),
  })

  const { data: productsPage } = useQuery({
    queryKey: ["products", spreadsheetId],
    queryFn: () => listProducts(spreadsheetId, 0, 100),
  })

  const markSoldMutation = useMutation({
    mutationFn: ({ itemId, sold }: { itemId: number; sold: boolean }) =>
      markSold(spreadsheetId, itemId, sold),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products", spreadsheetId] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (itemId: number) => deleteProduct(spreadsheetId, itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products", spreadsheetId] })
    },
  })

  const products = productsPage?.content ?? []
  const totalPieces = products.length
  const soldPieces = products.filter((p) => p.sold).length
  const unsoldPieces = totalPieces - soldPieces
  const totalSold = products
    .filter((p) => p.sold)
    .reduce((sum, p) => sum + p.price, 0)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between">
        <div className="space-y-2">
          <div className="flex gap-2 items-center">
            <h1 className="text-2xl font-bold">
              Planilha - {spreadsheet?.name}
            </h1>
            <Badge className="bg-green-50 text-green-700">Emitida</Badge>
          </div>
          <h3 className="text-muted-foreground text-[14px]">
            Emitida em{" "}
            {spreadsheet?.issuedAt
              ? new Date(spreadsheet.issuedAt).toLocaleDateString("pt-BR")
              : "-"}{" "}
            · {totalPieces} peças
          </h3>
        </div>
      </div>
      <div className="flex gap-4 *:flex-1">
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
                R$ {totalSold.toFixed(2)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      <div>
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
            {products.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>{item.reference}</TableCell>
                <TableCell>{item.definition}</TableCell>
                <TableCell>R$ {item.price.toFixed(2)}</TableCell>
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
                  {item.observation && (
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
                        {item.observation}
                        <PopoverDescription className="text-xs">
                          {item.reference} · {item.definition}
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
                    onClick={() => deleteMutation.mutate(item.id)}
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
