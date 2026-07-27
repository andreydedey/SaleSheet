import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { faMessage } from "@fortawesome/free-regular-svg-icons"
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { useNavigate } from "react-router"

type Item = {
  id: number
  reference: string
  name: string
  price: number
  note: string
  filled: boolean
}

const mockItems: Item[] = [
  {
    id: 1,
    reference: "REF-001",
    name: "Blusa Floral manga Curta",
    price: 89.9,
    note: "",
    filled: true,
  },
  {
    id: 2,
    reference: "REF-002",
    name: "Calça Jeans Slim",
    price: 149.9,
    note: "Cliente pediu troca de tamanho",
    filled: false,
  },
  {
    id: 3,
    reference: "REF-003",
    name: "Vestido Midi",
    price: 199.9,
    note: "",
    filled: false,
  },
  {
    id: 4,
    reference: "REF-004",
    name: "Saia Plissada",
    price: 119.9,
    note: "",
    filled: false,
  },
  {
    id: 5,
    reference: "REF-005",
    name: "Conjunto Linho",
    price: 259.9,
    note: "Aguardando pagamento",
    filled: true,
  },
]

const formatCurrency = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })

export const SalespersonSpreadSheet = () => {
  const navigate = useNavigate()
  const [items, setItems] = useState(mockItems)

  const toggleFilled = (id: number, checked: boolean) =>
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, filled: checked } : item,
      ),
    )

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button
            variant="secondary"
            size="icon"
            onClick={() => navigate(-1)}
            aria-label="Voltar"
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </Button>
          <h1 className="text-lg text-foreground font-bold">PLN-008</h1>
        </div>
        <Badge className="bg-green-200 text-green-600 font-semibold">
          Ativo
        </Badge>
      </div>
      <hr className="-mx-4" />
      <div className="flex [&>div]:flex-1 [&>div]:pl-2 [&>div]:whitespace-nowrap [&>div:not(:first-child)]:border-l-2">
        <div>
          <p className="text-sm text-muted-foreground">Peças</p>
          <p className="font-bold text-foreground text-lg">18</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Vendidas</p>
          <p className="font-bold text-green-600 text-lg">18</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Em aberto</p>
          <p className="font-bold text-red-600 text-lg">18</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Total</p>
          <p className="font-bold text-lg text-violet-600">R$ 1832.21</p>
        </div>
      </div>
      <div className="space-y-1">
        <p className="text-muted-foreground text-xs">
          {Math.trunc((11 / 18) * 100)}% vendido
        </p>
        <Progress
          className="h-2 *:data-[slot=progress-indicator]:bg-green-600"
          value={33}
        />
      </div>
      <hr className="-mx-4" />
      {items.map((item) => (
        <Card
          key={item.id}
          className={cn(
            "transition-colors",
            item.filled && "bg-green-50 ring-green-200",
          )}
        >
          <CardContent className="flex justify-between">
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">
                {item.reference}
              </p>
              <p className="text-sm text-foreground font-medium">{item.name}</p>
              <p
                className={cn(
                  "text-sm font-bold",
                  item.filled ? "text-green-600" : "text-foreground",
                )}
              >
                {formatCurrency(item.price)}
              </p>
            </div>
            <div className="flex items-center gap-4">
              {item.note && (
                <div className="rounded-full bg-green-100 h-8 w-8 flex items-center justify-center">
                  <FontAwesomeIcon
                    icon={faMessage}
                    className="text-green-600"
                  />
                </div>
              )}
              <Checkbox
                checked={item.filled}
                onCheckedChange={(checked) =>
                  toggleFilled(item.id, checked === true)
                }
                className="size-8 border-2 data-checked:border-green-600 data-checked:bg-green-600 data-checked:text-white *:data-[slot=checkbox-indicator]:[&>svg]:size-5!"
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
