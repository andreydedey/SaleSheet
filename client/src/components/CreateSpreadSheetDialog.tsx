import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Button } from "./ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"
import { faPlusSquare } from "@fortawesome/free-regular-svg-icons"

export const CreateSpreadSheetDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="lg">
          <FontAwesomeIcon icon={faPlusSquare} />
          Nova Planilha
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova Planilha</DialogTitle>
          <DialogDescription>
            Dê um nome à planilha. Você poderá adicionar produtos e associar uma
            revendedora antes de emiti-la.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
            <Button>Criar Planilha</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
