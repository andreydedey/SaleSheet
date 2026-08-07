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
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { updateStatus } from "@/lib/api/spreadsheets"

type Props = {
  spreadsheetId: number
  salespersonName: string | null | undefined
}

export const ActivateSpreadsheetDialog = ({ spreadsheetId, salespersonName }: Props) => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: () => updateStatus(spreadsheetId, "ACTIVE"),
    onSuccess: () => {
      toast.success("Planilha reativada.")
      queryClient.invalidateQueries({ queryKey: ["spreadsheets"] })
      queryClient.invalidateQueries({ queryKey: ["spreadsheet", spreadsheetId] })
    },
    onError: () => toast.error("Erro ao reativar planilha."),
  })

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Reativar Planilha</Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader className="items-center text-center">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-2 mx-auto">
            <FontAwesomeIcon icon={faCircleInfo} className="text-green-600 text-xl" />
          </div>
          <AlertDialogTitle>Reativar Planilha</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja reativar a planilha
            {salespersonName ? ` de ${salespersonName}` : ""}?
            A revendedora voltará a poder registrar vendas nesta planilha.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={() => mutation.mutate()}>
            Reativar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
