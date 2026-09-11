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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"
import { CurrencyInputField } from "./ui/currency-input"
import { useMutation, useQuery } from "@tanstack/react-query"
import { addProduct, updateProduct } from "@/lib/api/products"
import { listDefinitions } from "@/lib/api/definitions"
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
  definitionId: z.number({ error: "Definição é obrigatória" }).int().positive("Definição é obrigatória"),
  price: z.number().int().positive("Valor deve ser maior que 0"),
})

type ProductFormData = z.infer<typeof productSchema>

export const ProductDialogEditor: React.FC<ProductDialogEditorProps> = ({
  spreadsheetId,
  product,
  open,
  onOpenChange,
  onSaved,
}) => {
  const isEdit = !!product

  const { data: definitions = [] } = useQuery({
    queryKey: ["definitions"],
    queryFn: listDefinitions,
  })

  const { control, handleSubmit, reset } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      reference: product?.reference ?? "",
      definitionId: product?.definition?.id ?? 0,
      price: (product?.price as number) ?? 0,
    },
  })

  const mutation = useMutation({
    mutationFn: (data: ProductFormData) => {
      const payload = {
        reference: data.reference,
        definition: { id: data.definitionId },
        price: data.price,
      }
      return isEdit
        ? updateProduct(spreadsheetId, product!.id!, payload)
        : addProduct(spreadsheetId, payload)
    },
    onSuccess: () => {
      toast.success(isEdit ? "Produto atualizado." : "Produto adicionado.")
      reset()
      onOpenChange?.(false)
      onSaved?.()
    },
    onError: () =>
      toast.error(isEdit ? "Erro ao atualizar produto." : "Erro ao adicionar produto."),
  })

  const onSubmit = (data: ProductFormData) => mutation.mutate(data)

  const dialogContent = (
    <DialogContent
      className="md:min-w-md"
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
            name="definitionId"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Definição</FieldLabel>
                <Select
                  value={field.value ? String(field.value) : undefined}
                  onValueChange={(val) => field.onChange(Number(val))}
                  disabled={definitions.length === 0}
                >
                  <SelectTrigger className="w-full" aria-invalid={fieldState.invalid}>
                    <SelectValue placeholder={definitions.length === 0 ? "Nenhuma definição cadastrada" : "Selecione uma definição"} />
                  </SelectTrigger>
                  <SelectContent>
                    {definitions.map((def) => (
                      <SelectItem key={def.id} value={String(def.id)}>
                        {def.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
            {isEdit ? "Salvar Alterações" : "Adicionar Produto"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {!isEdit && (
        <DialogTrigger asChild>
          <Button size="sm">
            <FontAwesomeIcon icon={faPlusSquare} />
            Adicionar Produto
          </Button>
        </DialogTrigger>
      )}
      {dialogContent}
    </Dialog>
  )
}
