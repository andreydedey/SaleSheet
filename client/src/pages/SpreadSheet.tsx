import { Button } from "@/components/ui/button"
import { faPlusSquare } from "@fortawesome/free-regular-svg-icons/faPlusSquare"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircle } from "@fortawesome/free-solid-svg-icons/faCircle"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

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
        <Button size="lg">
          <FontAwesomeIcon icon={faPlusSquare} />
          Nova Planilha
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
    </>
  )
}
