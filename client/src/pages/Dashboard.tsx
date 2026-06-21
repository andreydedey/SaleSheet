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

export default function Dashboard() {
  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="flex gap-4">
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
    </>
  )
}
