import { Button } from "./ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog"
import { Field, FieldError, FieldGroup, FieldLabel } from "./ui/field"
import { Controller, useForm } from "react-hook-form"
import { Input } from "./ui/input"
import { useMutation } from "@tanstack/react-query"
import { createDefinition, updateDefinition } from "@/lib/api/definitions"
import { toast } from "sonner"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import type { ProductDefinitionListDTO } from "@/types/api"

const schema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
})

type FormData = z.infer<typeof schema>

interface DefinitionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  definition?: ProductDefinitionListDTO
  onSuccess?: () => void
}

export const DefinitionDialog: React.FC<DefinitionDialogProps> = ({
  open,
  onOpenChange,
  definition,
  onSuccess,
}) => {
  const isEdit = !!definition

  const { control, handleSubmit, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: definition?.name ?? "" },
  })

  const mutation = useMutation({
    mutationFn: (data: FormData) =>
      isEdit
        ? updateDefinition(definition!.id, data)
        : createDefinition(data),
    onSuccess: () => {
      toast.success(isEdit ? "Definição atualizada." : "Definição criada.")
      reset()
      onOpenChange(false)
      onSuccess?.()
    },
    onError: () =>
      toast.error(isEdit ? "Erro ao atualizar definição." : "Erro ao criar definição."),
  })

  const onSubmit = (data: FormData) => mutation.mutate(data)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="md:min-w-md"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Editar Definição" : "Adicionar Definição"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="name"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="def-name">Nome</FieldLabel>
                  <Input
                    id="def-name"
                    placeholder="Ex: Brinco, Cordão, Pulseira"
                    aria-invalid={fieldState.invalid}
                    {...field}
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
            <Button type="submit" disabled={mutation.isPending}>
              {isEdit ? "Salvar Alterações" : "Adicionar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
