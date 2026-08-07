import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUsers } from "@fortawesome/free-solid-svg-icons/faUsers"
import { faDollarSign } from "@fortawesome/free-solid-svg-icons/faDollarSign"
import { faTable } from "@fortawesome/free-solid-svg-icons/faTable"
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getStats, getSalespersons } from "@/lib/api/dashboard"
import { InviteDialog, InviteButton } from "@/components/InviteDialog"
import { DeleteConfirmDialog } from "@/components/DeleteConfirmDialog"
import { useState } from "react"
import type { SalespersonDTO } from "@/types/api"
import { deleteSalesperson } from "@/lib/api/users"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { formatCents } from "@/components/ui/currency-input"

export const Dashboard = () => {
  const queryClient = useQueryClient()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingSalesperson, setEditingSalesperson] = useState<SalespersonDTO | undefined>()

  const { data: stats } = useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: getStats,
  })

  const { data: salespersonsPage } = useQuery({
    queryKey: ["dashboard", "salespersons"],
    queryFn: () => getSalespersons(),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteSalesperson(id),
    onSuccess: () => {
      toast.success("Revendedor removido.")
      queryClient.invalidateQueries({ queryKey: ["dashboard"] })
    },
    onError: () => toast.error("Erro ao remover revendedor."),
  })

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["dashboard"] })

  const openCreate = () => {
    setEditingSalesperson(undefined)
    setDialogOpen(true)
  }

  const openEdit = (person: SalespersonDTO) => {
    setEditingSalesperson(person)
    setDialogOpen(true)
  }

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="flex gap-4 mb-4">
        <Card className="min-w-xs">
          <CardHeader className="flex items-center justify-between">
            <CardDescription>Total revendedores</CardDescription>
            <FontAwesomeIcon className="text-violet-600 " icon={faUsers} />
          </CardHeader>
          <CardContent className="text-3xl font-bold">
            {stats?.totalSalespersons ?? 0}
          </CardContent>
        </Card>
        <Card className="min-w-xs">
          <CardHeader className="flex items-center justify-between">
            <CardDescription>Total vendido</CardDescription>
            <FontAwesomeIcon className="text-green-600" icon={faDollarSign} />
          </CardHeader>
          <CardContent className="text-3xl font-bold">
            {formatCents(stats?.totalSold ?? 0)}
          </CardContent>
        </Card>
        <Card className="min-w-xs">
          <CardHeader className="flex items-center justify-between">
            <CardDescription>Planilhas Ativas</CardDescription>
            <FontAwesomeIcon className="text-blue-700" icon={faTable} />
          </CardHeader>
          <CardContent className="text-3xl font-bold">
            {stats?.activeSpreadsheets ?? 0}
          </CardContent>
        </Card>
      </div>
      <div>
        <Card className="ring-0 border border-b-0 rounded-b-none">
          <CardHeader className="flex justify-between items-center">
            <p className="font-bold">Revendedores</p>
            <InviteButton onClick={openCreate} />
          </CardHeader>
        </Card>
        <Table className="ring-0 border border-t">
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Total vendas</TableHead>
              <TableHead>Planilhas</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {salespersonsPage?.content.map((person) => (
              <TableRow key={person.id}>
                <TableCell>{person.name}</TableCell>
                <TableCell>{person.email}</TableCell>
                <TableCell className="font-semibold">{formatCents(person.sales)}</TableCell>
                <TableCell>{person.spreadsheetsCount}</TableCell>
                <TableCell className="flex gap-2 justify-end">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-blue-500 hover:text-blue-600"
                    onClick={() => openEdit(person)}
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
                    description="O revendedor será removido permanentemente."
                    onConfirm={() => deleteMutation.mutate(person.id)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <InviteDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        salesperson={editingSalesperson}
        onSuccess={invalidate}
      />
    </>
  )
}
