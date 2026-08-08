import { useState } from "react"
import { MessageSquareText } from "lucide-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { addNote } from "@/lib/api/products"
import type { ProductDTO } from "@/types/api"

interface ObservationPopoverProps {
  spreadsheetId: number
  product: ProductDTO
}

export function ObservationPopover({ spreadsheetId, product }: ObservationPopoverProps) {
  const [open, setOpen] = useState(false)
  const [textareaValue, setTextareaValue] = useState(product.observation ?? "")
  const queryClient = useQueryClient()

  const hasObservation = Boolean(product.observation)

  const mutation = useMutation({
    mutationFn: (observation: string) => addNote(spreadsheetId, product.id, observation),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products", spreadsheetId] })
      setOpen(false)
    },
    onError: () => toast.error("Erro ao salvar observação."),
  })

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      setTextareaValue(product.observation ?? "")
    }
    setOpen(nextOpen)
  }

  const handleSave = () => {
    mutation.mutate(textareaValue)
  }

  const handleClear = () => {
    mutation.mutate("")
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button type="button" className="flex items-center justify-center">
          <MessageSquareText
            size={16}
            className={hasObservation ? "text-green-600" : "text-muted-foreground"}
          />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-3" align="end">
        <div className="flex flex-col gap-3">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <MessageSquareText size={14} className="text-green-600" />
              <span className="font-bold text-sm">Observação</span>
            </div>
            <span className="text-xs text-muted-foreground">{product.reference}</span>
          </div>

          {/* Body */}
          <Textarea
            value={textareaValue}
            onChange={(e) => setTextareaValue(e.target.value)}
            placeholder="Adicionar observação..."
            rows={3}
          />

          {/* Footer */}
          <div className="flex items-center justify-between">
            <div>
              {product.observationUpdatedAt && (
                <span className="text-[11px] text-muted-foreground">
                  Editado em{" "}
                  {new Date(product.observationUpdatedAt).toLocaleDateString("pt-BR")}
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClear}
                disabled={mutation.isPending}
              >
                Limpar
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={mutation.isPending}
              >
                Salvar
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
