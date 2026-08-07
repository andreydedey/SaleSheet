import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { emitSpreadsheet } from "@/lib/api/spreadsheets"
import { useNavigate } from "react-router"

type Props = {
  spreadsheetId: number
  disabled?: boolean
}

export const EmitSpreadsheetDialog = ({ spreadsheetId, disabled }: Props) => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const mutation = useMutation({
    mutationFn: () => emitSpreadsheet(spreadsheetId),
    onSuccess: () => {
      toast.success("Planilha emitida.")
      queryClient.invalidateQueries({ queryKey: ["spreadsheets"] })
      navigate(`/spreadsheets/issued/${spreadsheetId}`)
    },
    onError: () => toast.error("Erro ao emitir planilha."),
  })

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="lg" disabled={disabled}>Emitir Planilha</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Emitir planilha?</AlertDialogTitle>
          <AlertDialogDescription>
            Após emitida, a planilha ficará visível para o revendedor e não poderá ser editada.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={() => mutation.mutate()}>
            Emitir
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
