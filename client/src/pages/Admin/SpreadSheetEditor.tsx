import { ProductDialogEditor } from "@/components/ProductDialogEditor"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardHeader } from "@/components/ui/card"
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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useSearchParams, useNavigate } from "react-router"
import { getSpreadsheet, emitSpreadsheet } from "@/lib/api/spreadsheets"
import { listProducts, deleteProduct } from "@/lib/api/products"

export const SpreadSheetEditor = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const spreadsheetId = Number(searchParams.get("id"))

  const { data: spreadsheet } = useQuery({
    queryKey: ["spreadsheet", spreadsheetId],
    queryFn: () => getSpreadsheet(spreadsheetId),
  })

  const { data: productsPage } = useQuery({
    queryKey: ["products", spreadsheetId],
    queryFn: () => listProducts(spreadsheetId, 0, 100),
  })

  const emitMutation = useMutation({
    mutationFn: () => emitSpreadsheet(spreadsheetId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["spreadsheets"] })
      navigate(`/spreadsheets/issued/${spreadsheetId}`)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (itemId: number) => deleteProduct(spreadsheetId, itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products", spreadsheetId] })
    },
  })

  const products = productsPage?.content ?? []

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between">
        <div className="space-y-2">
          <div className="flex gap-2 items-center">
            <h1 className="text-2xl font-bold">{spreadsheet?.name}</h1>
          </div>
          <h3 className="text-muted-foreground text-[14px]">
            Criada em{" "}
            {spreadsheet
              ? new Date(spreadsheet.createdAt).toLocaleDateString("pt-BR")
              : ""}{" "}
            · não emitida
          </h3>
        </div>
        <Button size="lg" onClick={() => emitMutation.mutate()}>
          Emitir Planilha
        </Button>
      </div>
      <div>
        <Card className="ring-0 border border-b-0 rounded-b-none">
          <CardHeader className="flex justify-between">
            <h4 className="text-base font-semibold">Produtos</h4>
            <div className="space-x-2">
              <Badge variant="secondary">{products.length} produtos</Badge>
              <ProductDialogEditor
                spreadsheetId={spreadsheetId}
                onSaved={() =>
                  queryClient.invalidateQueries({
                    queryKey: ["products", spreadsheetId],
                  })
                }
              />
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
            {products.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>{item.reference}</TableCell>
                <TableCell>{item.definition}</TableCell>
                <TableCell>R$ {item.price.toFixed(2)}</TableCell>
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
