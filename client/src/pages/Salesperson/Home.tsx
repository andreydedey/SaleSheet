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

export const Home = () => {
  const spreadsheets = [
    {
      title: "PLN-008",
      status: "active",
      date: "12/06/26",
      summary: {
        totalProducts: 20,
        sold: 11,
        total: 12940.0,
      },
    },
  ]

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-bold">
          Olá, Ana! <FontAwesomeIcon icon={faHandsClapping} />
        </h1>
        <h2 className="text-muted-foreground">Suas planilhas de vendas</h2>
      </div>
      <Card className="bg-primary">
        <CardHeader className="space-y-2">
          <CardDescription>Total acumulado de vendas</CardDescription>
          <p className="text-primary-foreground font-bold text-3xl">
            R$ 10.470
          </p>
        </CardHeader>
        <CardContent className="grid grid-cols-3 grid-rows-2 gap-y-0">
          <p className="text-muted-foreground text-xs leading-none">Peças</p>
          <p className="text-muted-foreground text-xs leading-none">Vendidas</p>
          <p className="text-muted-foreground text-xs leading-none">
            Planilhas
          </p>
          <p className="text-primary-foreground font-bold text-lg leading-none">
            34
          </p>
          <p className="text-primary-foreground font-bold text-lg leading-none">
            32
          </p>
          <p className="text-primary-foreground font-bold text-lg leading-none">
            2
          </p>
        </CardContent>
      </Card>
      <h2 className="font-semibold  text-foreground">Planilhas</h2>
      {spreadsheets.map((spreadsheet) => (
        <Card className="flex flex-col gap-1">
          <CardHeader className="flex justify-between">
            <span className="text-lg font-bold text-foreground">
              {spreadsheet.title}
            </span>
            <Badge className="bg-green-100 text-green-500 font-bold">
              Ativo
            </Badge>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-muted-foreground">
              Emitida em {spreadsheet.date}
            </p>
            <div className="flex border rounded-md *:flex-1 *:border-r *:last:border-r-0 *:p-2">
              <div>
                <p className="text-muted-foreground">Peças</p>
                <p className="text-lg font-bold">18</p>
              </div>
              <div>
                <p className="text-muted-foreground">Vendidas</p>
                <p className="text-lg font-bold text-green-600">18</p>
              </div>
              <div>
                <p className="text-muted-foreground">Total</p>
                <p className="text-lg font-bold text-violet-600">18</p>
              </div>
            </div>
            <Button size="lg" className="w-full py-6">
              Abrir Planilha
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
