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
import { CannotDeleteSalespersonDialog } from "@/components/CannotDeleteSalespersonDialog"
import { useMutation, useQuery } from "@tanstack/react-query"
import { getStats, getSalespersons } from "@/lib/api/dashboard"
import { InviteDialog, InviteButton } from "@/components/InviteDialog"
import { DeleteConfirmDialog } from "@/components/DeleteConfirmDialog"
import { useState } from "react"
import type { SalespersonDTO } from "@/types/salesperson"
import { deleteSalesperson } from "@/lib/api/users"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { formatCents } from "@/components/ui/currency-input"

export const Dashboard = () => {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingSalesperson, setEditingSalesperson] = useState<SalespersonDTO | undefined>()
  const [conflictWarning, setConflictWarning] = useState(false)

  const { data: stats, refetch: refetchStats } = useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: getStats,
  })

  const { data: salespersonsPage, refetch: refetchSalespersons } = useQuery({
    queryKey: ["dashboard", "salespersons"],
    queryFn: () => getSalespersons(),
  })

  const refetchAll = () => {
    refetchStats()
    refetchSalespersons()
  }

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteSalesperson(id),
    onSuccess: () => {
      toast.success("Revendedor removido.")
      refetchAll()
    },
    onError: (error: any) => {
      if (error?.response?.status === 409) {
        setConflictWarning(true)
      } else {
        toast.error("Erro ao remover revendedor.")
      }
    },
  })

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

      {/* Stats cards */}
      <div className="grid grid-cols-2 gap-3 md:flex md:gap-4 mb-4">
        <Card className="md:min-w-xs">
          <CardHeader className="flex items-center justify-between">
            <CardDescription>Total revendedores</CardDescription>
            <FontAwesomeIcon className="text-violet-600" icon={faUsers} />
          </CardHeader>
          <CardContent className="text-xl md:text-3xl font-bold">
            {stats?.totalSalespersons ?? 0}
          </CardContent>
        </Card>
        <Card className="md:min-w-xs">
          <CardHeader className="flex items-center justify-between">
            <CardDescription>Total vendido</CardDescription>
            <FontAwesomeIcon className="text-green-600" icon={faDollarSign} />
          </CardHeader>
          <CardContent className="text-xl md:text-3xl font-bold">
            {formatCents(stats?.totalSold ?? 0)}
          </CardContent>
        </Card>
        <Card className="col-span-2 md:col-span-1 md:min-w-xs">
          <CardHeader className="flex items-center justify-between">
            <CardDescription>Planilhas Ativas</CardDescription>
            <FontAwesomeIcon className="text-blue-700" icon={faTable} />
          </CardHeader>
          <CardContent className="text-xl md:text-3xl font-bold">
            {stats?.activeSpreadsheets ?? 0}
          </CardContent>
        </Card>
      </div>

      {/* Desktop: table */}
      <div className="hidden md:block">
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

      {/* Mobile: card list */}
      <div className="md:hidden space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-base">Revendedores</h2>
          <InviteButton onClick={openCreate} />
        </div>
        {salespersonsPage?.content.map((person) => (
          <Card
            key={person.id}
            className="cursor-pointer active:bg-muted/50"
            onClick={() => openEdit(person)}
          >
            <CardContent className="space-y-1">
              <p className="text-sm font-semibold text-foreground">{person.name}</p>
              <p className="text-xs text-muted-foreground truncate">{person.email}</p>
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs font-semibold text-green-600">
                  {formatCents(person.sales)}
                </span>
                <span className="text-xs text-muted-foreground">
                  Planilhas{" "}
                  <span className="font-semibold text-foreground">
                    {person.spreadsheetsCount}
                  </span>
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <InviteDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        salesperson={editingSalesperson}
        onSuccess={refetchAll}
        onDelete={editingSalesperson ? () => deleteMutation.mutate(editingSalesperson.id) : undefined}
      />
      <CannotDeleteSalespersonDialog
        open={conflictWarning}
        onOpenChange={setConflictWarning}
      />
    </>
  )
}
