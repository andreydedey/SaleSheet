import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
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
import { inviteSalesperson, updateSalesperson } from "@/lib/api/users"
import { useEffect } from "react"
import { toast } from "sonner"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import type { SalespersonDTO } from "@/types/api"
import { faPlus } from "@fortawesome/free-solid-svg-icons"

const schema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
})

type FormData = z.infer<typeof schema>

interface InviteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  salesperson?: SalespersonDTO
  onSuccess?: () => void
}

export const InviteDialog: React.FC<InviteDialogProps> = ({
  open,
  onOpenChange,
  salesperson,
  onSuccess,
}) => {
  const isEdit = !!salesperson

  const { control, handleSubmit, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "" },
  })

  useEffect(() => {
    if (open) {
      reset(
        salesperson
          ? { name: salesperson.name, email: salesperson.email }
          : { name: "", email: "" }
      )
    }
  }, [open, salesperson, reset])

  const mutation = useMutation({
    mutationFn: (data: FormData) =>
      isEdit
        ? updateSalesperson(salesperson!.id, data)
        : inviteSalesperson(data),
    onSuccess: () => {
      toast.success(isEdit ? "Revendedor atualizado." : "Revendedor convidado.")
      onOpenChange(false)
      onSuccess?.()
    },
    onError: () => {
      toast.error(isEdit ? "Erro ao atualizar revendedor." : "Erro ao convidar revendedor.")
    },
  })

  const onSubmit = (data: FormData) => mutation.mutate(data)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="min-w-md"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Editar Revendedor" : "Convidar Revendedor"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="name"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="invite-name">Nome</FieldLabel>
                  <Input
                    id="invite-name"
                    placeholder="Nome do revendedor"
                    aria-invalid={fieldState.invalid}
                    {...field}
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
            <Controller
              name="email"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="invite-email">Email</FieldLabel>
                  <Input
                    id="invite-email"
                    type="email"
                    placeholder="email@exemplo.com"
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
              {isEdit ? "Salvar" : "Convidar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

interface InviteButtonProps {
  onClick: () => void
}

export const InviteButton: React.FC<InviteButtonProps> = ({ onClick }) => (
  <Button size="lg" onClick={onClick}>
    <FontAwesomeIcon icon={faPlus} />
    Convidar Revendedor
  </Button>
)
