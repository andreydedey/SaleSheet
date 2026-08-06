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
import { useMutation, useQuery } from "@tanstack/react-query"
import { createSpreadsheet } from "@/lib/api/spreadsheets"
import { getSalespersons } from "@/lib/api/dashboard"
import { useState } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate } from "react-router"

const createSpreadsheetSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  salespersonId: z.string().min(1, "Selecione um revendedor"),
})

type CreateSpreadsheetForm = z.infer<typeof createSpreadsheetSchema>

export const CreateSpreadSheetDialog = () => {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const { control, handleSubmit, reset } = useForm<CreateSpreadsheetForm>({
    resolver: zodResolver(createSpreadsheetSchema),
    defaultValues: { name: "", salespersonId: "" },
  })

  const { data: salespersonsPage } = useQuery({
    queryKey: ["dashboard", "salespersons", "all"],
    queryFn: () => getSalespersons(0, 1000),
    enabled: open,
  })

  const mutation = useMutation({
    mutationFn: (data: CreateSpreadsheetForm) => createSpreadsheet(data),
    onSuccess: (data) => {
      reset()
      setOpen(false)
      navigate(`/spreadsheets/editor?id=${data.id}`)
    },
  })

  const onSubmit = (data: CreateSpreadsheetForm) => mutation.mutate(data)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg">
          <FontAwesomeIcon icon={faPlusSquare} />
          Nova Planilha
        </Button>
      </DialogTrigger>
      <DialogContent
        className="min-w-md"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Nova Planilha</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="name"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="spreadsheet-name">
                    Nome da Planilha
                  </FieldLabel>
                  <Input
                    id="spreadsheet-name"
                    placeholder="Ex: PLN-001"
                    aria-invalid={fieldState.invalid}
                    {...field}
                  />
                </Field>
              )}
            />
            <Controller
              name="salespersonId"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="salesperson">Revendedor</FieldLabel>
                  <select
                    id="salesperson"
                    className="w-full border rounded-md px-3 py-2"
                    {...field}
                  >
                    <option value="">Selecione o revendedor</option>
                    {salespersonsPage?.content.map((sp) => (
                      <option key={sp.id} value={sp.id}>
                        {sp.name}
                      </option>
                    ))}
                  </select>
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
            <Button type="submit">Criar Planilha</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
