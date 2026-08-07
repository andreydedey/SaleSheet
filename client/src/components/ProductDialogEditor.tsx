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
import { Field, FieldError, FieldGroup, FieldLabel } from "./ui/field"
import { Controller, useForm } from "react-hook-form"
import { Input } from "./ui/input"
import { CurrencyInputField } from "./ui/currency-input"
import { useMutation } from "@tanstack/react-query"
import { addProduct, updateProduct } from "@/lib/api/products"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import type { ProductDTO } from "@/types/api"

interface ProductDialogEditorProps {
  spreadsheetId: number
  product?: ProductDTO
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onSaved?: () => void
}

const productSchema = z.object({
  reference: z.string().min(1, "Referência é obrigatória"),
  definition: z.string().min(1, "Definição é obrigatória"),
  price: z.number().int().positive("Valor deve ser maior que 0"),
})

type ProductFormData = z.infer<typeof productSchema>

export const ProductDialogEditor: React.FC<ProductDialogEditorProps> = ({
  spreadsheetId,
  product,
  open: controlledOpen,
  onOpenChange,
  onSaved,
}) => {
  const isEdit = !!product
  const isControlled = controlledOpen !== undefined
  const [internalOpen, setInternalOpen] = useState(false)
  const open = isControlled ? controlledOpen : internalOpen

  const { control, handleSubmit, reset } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: { reference: "", definition: "", price: 0 },
  })

  useEffect(() => {
    if (open) {
      reset(
        product
          ? { reference: product.reference, definition: product.definition, price: product.price as number }
          : { reference: "", definition: "", price: 0 },
      )
    }
  }, [open, product, reset])

  const setOpen = (val: boolean) => {
    if (isControlled) onOpenChange?.(val)
    else setInternalOpen(val)
  }

  const mutation = useMutation({
    mutationFn: (data: ProductFormData) =>
      isEdit
        ? updateProduct(spreadsheetId, product!.id!, data)
        : addProduct(spreadsheetId, data),
    onSuccess: () => {
      toast.success(isEdit ? "Produto atualizado." : "Produto adicionado.")
      reset()
      setOpen(false)
      onSaved?.()
    },
    onError: () =>
      toast.error(isEdit ? "Erro ao atualizar produto." : "Erro ao adicionar produto."),
  })

  const onSubmit = (data: ProductFormData) => mutation.mutate(data)

  const dialogContent = (
    <DialogContent
      className="min-w-md"
      onInteractOutside={(e) => e.preventDefault()}
    >
      <DialogHeader>
        <DialogTitle>{isEdit ? "Editar Produto" : "Adicionar Produto"}</DialogTitle>
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
                <FieldError errors={[fieldState.error]} />
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
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
          <Controller
            name="price"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="price">Valor (R$)</FieldLabel>
                <CurrencyInputField
                  id="price"
                  value={field.value}
                  onChange={field.onChange}
                  aria-invalid={fieldState.invalid}
                />
                <FieldError errors={[fieldState.error]} />
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
          <Button type="submit">
            {isEdit ? "Salvar" : "Adicionar Produto"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )

  if (isControlled) {
    return <Dialog open={open} onOpenChange={setOpen}>{dialogContent}</Dialog>
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <FontAwesomeIcon icon={faPlusSquare} />
          Adicionar Produto
        </Button>
      </DialogTrigger>
      {dialogContent}
    </Dialog>
  )
}
