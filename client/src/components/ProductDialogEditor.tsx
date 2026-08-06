import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Button } from "./ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"
import { faPlusSquare } from "@fortawesome/free-regular-svg-icons"
import { Field, FieldGroup, FieldLabel } from "./ui/field"
import { Controller, useForm } from "react-hook-form"
import { Input } from "./ui/input"
import { useMutation } from "@tanstack/react-query"
import { addProduct } from "@/lib/api/products"
import { useState } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

interface ProductDialogEditorProps {
  spreadsheetId: number
  onSaved?: () => void
}

const productSchema = z.object({
  reference: z.string().min(1, "Referência é obrigatória"),
  definition: z.string().min(1, "Definição é obrigatória"),
  price: z.coerce.number().positive("Valor deve ser maior que 0"),
})

type ProductFormData = z.infer<typeof productSchema>

export const ProductDialogEditor: React.FC<ProductDialogEditorProps> = ({
  spreadsheetId,
  onSaved,
}) => {
  const [open, setOpen] = useState(false)
  const { control, handleSubmit, reset } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: { reference: "", definition: "", price: 0 },
  })

  const mutation = useMutation({
    mutationFn: (data: ProductFormData) =>
      addProduct(spreadsheetId, data),
    onSuccess: () => {
      reset()
      setOpen(false)
      onSaved?.()
    },
  })

  const onSubmit = (data: ProductFormData) => mutation.mutate(data)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
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
              name="definition"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="definition">Definição</FieldLabel>
                  <Input
                    id="definition"
                    placeholder="Descrição do produto"
                    aria-invalid={fieldState.invalid}
                    {...field}
                  />
                </Field>
              )}
            />
            <Controller
              name="price"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="price">Valor (R$)</FieldLabel>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    placeholder="0,00"
                    aria-invalid={fieldState.invalid}
                    {...field}
                  />
                </Field>
              )}
            />
          </FieldGroup>
          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit">Adicionar Produto</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
