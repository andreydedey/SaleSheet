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
import { faCircleInfo, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { updateStatus } from "@/lib/api/spreadsheets"

type Props = {
  spreadsheetId: number
  salespersonName: string | null | undefined
}

export const InactivateSpreadsheetDialog = ({ spreadsheetId, salespersonName }: Props) => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: () => updateStatus(spreadsheetId, "INACTIVE"),
    onSuccess: () => {
      toast.success("Planilha inativada.")
      queryClient.invalidateQueries({ queryKey: ["spreadsheets"] })
      queryClient.invalidateQueries({ queryKey: ["spreadsheet", spreadsheetId] })
    },
    onError: () => toast.error("Erro ao inativar planilha."),
  })

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Inativar Planilha</Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader className="items-center text-center">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-2 mx-auto">
            <FontAwesomeIcon icon={faTriangleExclamation} className="text-red-500 text-xl" />
          </div>
          <AlertDialogTitle>Inativar Planilha</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja inativar a planilha
            {salespersonName ? ` de ${salespersonName}` : ""}?
            A revendedora não poderá mais registrar vendas nesta planilha.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex items-center gap-2 rounded-md bg-yellow-50 border border-yellow-200 px-3 py-2 text-sm text-yellow-800">
          <FontAwesomeIcon icon={faCircleInfo} className="text-yellow-500 shrink-0" />
          Você poderá reativar a planilha a qualquer momento.
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-white hover:bg-destructive/90"
            onClick={() => mutation.mutate()}
          >
            Inativar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
