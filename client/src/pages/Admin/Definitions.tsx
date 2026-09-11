import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPen, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { useMutation, useQuery } from "@tanstack/react-query"
import { listDefinitionsDetailed, deleteDefinition } from "@/lib/api/definitions"
import { DefinitionDialog } from "@/components/DefinitionDialog"
import { DeleteConfirmDialog } from "@/components/DeleteConfirmDialog"
import { useState } from "react"
import type { ProductDefinitionListDTO } from "@/types/api"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Tags } from "lucide-react"

export const Definitions = () => {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingDefinition, setEditingDefinition] = useState<ProductDefinitionListDTO | undefined>()

  const { data: definitions = [], refetch } = useQuery({
    queryKey: ["definitions", "detailed"],
    queryFn: listDefinitionsDetailed,
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteDefinition(id),
    onSuccess: () => {
      toast.success("Definição removida.")
      refetch()
    },
    onError: (error: any) => {
      const message = error?.response?.data?.detail || error?.response?.data?.message
      if (error?.response?.status === 409) {
        toast.error("Não é possível excluir esta definição.", { description: message })
      } else {
        toast.error("Erro ao remover definição.")
      }
    },
  })

  const openCreate = () => {
    setEditingDefinition(undefined)
    setDialogOpen(true)
  }

  const openEdit = (def: ProductDefinitionListDTO) => {
    setEditingDefinition(def)
    setDialogOpen(true)
  }

  const emptyState = (
    <Empty>
      <EmptyHeader>
        <EmptyMedia>
          <Tags className="size-10 text-muted-foreground" />
        </EmptyMedia>
        <EmptyTitle>Nenhuma definição cadastrada</EmptyTitle>
        <EmptyDescription>
          Adicione categorias para organizar seus produtos.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  )

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Definições</h1>

      {/* Desktop: table */}
      <div className="hidden md:block">
        <Card className="ring-0 border border-b-0 rounded-b-none">
          <CardHeader className="flex justify-between items-center">
            <p className="font-bold">Definições de Produto</p>
            <Button size="lg" onClick={openCreate}>
              <FontAwesomeIcon icon={faPlus} />
              Adicionar
            </Button>
          </CardHeader>
        </Card>
        <Table className="ring-0 border border-t">
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Produtos Vinculados</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {definitions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3}>{emptyState}</TableCell>
              </TableRow>
            ) : (
              definitions.map((def) => (
                <TableRow key={def.id}>
                  <TableCell className="font-medium">{def.name}</TableCell>
                  <TableCell>{def.productCount} produtos</TableCell>
                  <TableCell className="flex gap-2 justify-end">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-blue-500 hover:text-blue-600"
                      onClick={() => openEdit(def)}
                    >
                      <FontAwesomeIcon icon={faPen} />
                    </Button>
                    <DeleteConfirmDialog
                      trigger={
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-red-500 hover:text-red-600"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </Button>
                      }
                      title={`Excluir "${def.name}"?`}
                      description="Tem certeza que deseja excluir esta definição? Esta ação não pode ser desfeita."
                      onConfirm={() => deleteMutation.mutate(def.id)}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile: card list */}
      <div className="md:hidden space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-base">Definições de Produto</h2>
          <Button size="lg" onClick={openCreate}>
            <FontAwesomeIcon icon={faPlus} />
            Adicionar
          </Button>
        </div>
        {definitions.length === 0 ? (
          emptyState
        ) : (
          definitions.map((def) => (
            <Card
              key={def.id}
              className="cursor-pointer active:bg-muted/50"
              onClick={() => openEdit(def)}
            >
              <CardContent className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-foreground">{def.name}</p>
                  <p className="text-xs text-muted-foreground">{def.productCount} produtos</p>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <DefinitionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        definition={editingDefinition}
        onSuccess={refetch}
      />
    </>
  )
}
