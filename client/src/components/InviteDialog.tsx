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
import { faPlus } from "@fortawesome/free-solid-svg-icons"
import { Field, FieldGroup, FieldLabel } from "./ui/field"
import { Controller, useForm } from "react-hook-form"
import { Input } from "./ui/input"
import { useMutation } from "@tanstack/react-query"
import { inviteSalesperson } from "@/lib/api/users"
import { useState } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

const inviteSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
})

type InviteFormData = z.infer<typeof inviteSchema>

interface InviteDialogProps {
  onInvited?: () => void
}

export const InviteDialog: React.FC<InviteDialogProps> = ({ onInvited }) => {
  const [open, setOpen] = useState(false)
  const { control, handleSubmit, reset } = useForm<InviteFormData>({
    resolver: zodResolver(inviteSchema),
    defaultValues: { name: "", email: "" },
  })

  const mutation = useMutation({
    mutationFn: (data: InviteFormData) => inviteSalesperson(data),
    onSuccess: () => {
      reset()
      setOpen(false)
      onInvited?.()
    },
  })

  const onSubmit = (data: InviteFormData) => mutation.mutate(data)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg">
          <FontAwesomeIcon icon={faPlus} />
          Convidar Revendedora
        </Button>
      </DialogTrigger>
      <DialogContent
        className="min-w-md"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Convidar Revendedora</DialogTitle>
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
                    placeholder="Nome da revendedora"
                    aria-invalid={fieldState.invalid}
                    {...field}
                  />
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
            <Button type="submit">Convidar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
