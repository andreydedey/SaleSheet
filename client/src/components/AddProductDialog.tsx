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
import { Field, FieldGroup, FieldLabel } from "./ui/field"
import { Controller, useForm } from "react-hook-form"
import { Input } from "./ui/input"

export const AddProductDialog = () => {
  const { form, control } = useForm()

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm">
          <FontAwesomeIcon icon={faPlusSquare} />
          Adicionar Produto
        </Button>
      </DialogTrigger>
      <DialogContent
        className="min-w-md"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Adicionar Produto</DialogTitle>
          <DialogDescription>
            Adicione um novo produto à planilha. O número é gerado
            automaticamente.
          </DialogDescription>
        </DialogHeader>
        <form action="">
          <FieldGroup>
            <Controller
              name="reference"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="reference">Referência</FieldLabel>
                  <Input
                    id="reference"
                    placeholder="Ex: REF-004"
                    aria-invalid={fieldState.invalid}
                    {...field}
                  />
                </Field>
              )}
            />
            <Controller
              name="reference"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="reference">Definição</FieldLabel>
                  <Input
                    id="definition"
                    placeholder="Descrição do produto"
                    aria-invalid={fieldState.invalid}
                    {...field}
                  />
                </Field>
              )}
            />
            {/* for the value input i need to find a money input component */}
            <Controller
              name="value"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="value">Valor (R$)</FieldLabel>
                  <Input
                    id="value"
                    placeholder="0,00"
                    aria-invalid={fieldState.invalid}
                    {...field}
                  />
                </Field>
              )}
            />
          </FieldGroup>
        </form>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button>Adicionar Produto</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
