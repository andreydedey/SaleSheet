import { useRef } from "react"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { updateSpreadsheetName } from "@/lib/api/spreadsheets"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

type Props = {
  spreadsheetId: number
  currentName: string | undefined
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export const RenameSpreadsheetDialog = ({
  spreadsheetId,
  currentName,
  open,
  onOpenChange,
  onSuccess,
}: Props) => {
  const inputRef = useRef<HTMLInputElement>(null)

  const renameMutation = useMutation({
    mutationFn: (name: string) => updateSpreadsheetName(spreadsheetId, name),
    onSuccess: () => {
      toast.success("Planilha renomeada.")
      onOpenChange(false)
      onSuccess()
    },
    onError: () => toast.error("Erro ao renomear planilha."),
  })

  const handleSave = () => {
    const value = inputRef.current?.value.trim()
    if (value) renameMutation.mutate(value)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Renomear planilha</DialogTitle>
        </DialogHeader>
        <Input
          ref={inputRef}
          defaultValue={currentName}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSave()
          }}
        />
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={renameMutation.isPending}>
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
