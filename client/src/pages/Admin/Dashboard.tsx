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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { getStats, getSalespersons } from "@/lib/api/dashboard"
import { InviteDialog } from "@/components/InviteDialog"

export const Dashboard = () => {
  const queryClient = useQueryClient()

  const { data: stats } = useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: getStats,
  })

  const { data: salespersonsPage } = useQuery({
    queryKey: ["dashboard", "salespersons"],
    queryFn: () => getSalespersons(),
  })

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="flex gap-4 mb-4">
        <Card className="min-w-xs">
          <CardHeader className="flex items-center justify-between">
            <CardDescription>Total revendedoras</CardDescription>
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
            {stats?.totalSold ?? 0}
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
            <p className="font-bold">Revendedoras</p>
            <InviteDialog
              onInvited={() => {
                queryClient.invalidateQueries({
                  queryKey: ["dashboard"],
                })
              }}
            />
          </CardHeader>
        </Card>
        <Table className="ring-0 border border-t">
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Total vendas</TableHead>
              <TableHead>Planilhas</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {salespersonsPage?.content.map((person) => (
              <TableRow key={person.id}>
                <TableCell>{person.name}</TableCell>
                <TableCell>{person.email}</TableCell>
                <TableCell>{person.sales}</TableCell>
                <TableCell>{person.spreadsheetsCount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  )
}
