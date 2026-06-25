import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUsers } from "@fortawesome/free-solid-svg-icons/faUsers"
import { faDollarSign } from "@fortawesome/free-solid-svg-icons/faDollarSign"
import { faTable } from "@fortawesome/free-solid-svg-icons/faTAble"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function Dashboard() {
  const salesPersons = [
    {
      name: "Jhenifer",
      email: "jhenifer.trindade@gmail.com",
      sales: 2314,
      spreadsheetsCount: 1,
    },
    {
      name: "Andrey",
      email: "andrey.oliveira@gmail.com",
      sales: 4629,
      spreadsheetsCount: 2,
    },
  ]

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="flex gap-4 mb-4">
        <Card className="min-w-xs">
          <CardHeader className="flex items-center justify-between">
            <CardDescription>Total revendedoras</CardDescription>
            <FontAwesomeIcon className="text-violet-600 " icon={faUsers} />
          </CardHeader>
          <CardContent className="text-3xl font-bold">12</CardContent>
        </Card>
        <Card className="min-w-xs">
          <CardHeader className="flex items-center justify-between">
            <CardDescription>Total vendido</CardDescription>
            <FontAwesomeIcon className="text-green-600" icon={faDollarSign} />
          </CardHeader>
          <CardContent className="text-3xl font-bold">54.123</CardContent>
        </Card>
        <Card className="min-w-xs">
          <CardHeader className="flex items-center justify-between">
            <CardDescription>Planilhas Ativas</CardDescription>
            <FontAwesomeIcon className="text-blue-700" icon={faTable} />
          </CardHeader>
          <CardContent className="text-3xl font-bold">8</CardContent>
        </Card>
      </div>
      <div>
        <Card className="ring-0 border border-b-0 rounded-b-none">
          <CardHeader>Revendedoras</CardHeader>
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
            {salesPersons.map((person) => (
              <TableRow key={person.email}>
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
