import { FileX } from "lucide-react"
import { useNavigate } from "react-router"
import { Button } from "@/components/ui/button"

export function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-6 bg-zinc-100 p-8">
      <div className="flex items-center justify-center w-20 h-20 rounded-full bg-zinc-50">
        <FileX className="w-9 h-9 text-neutral-500" />
      </div>
      <div className="flex flex-col items-center gap-2 text-center">
        <span className="text-5xl font-extrabold text-neutral-500">404</span>
        <h1 className="text-xl font-semibold text-neutral-950">Página não encontrada</h1>
        <p className="text-sm text-neutral-500">
          A página que você está procurando não existe ou foi movida.
        </p>
      </div>
      <div className="flex gap-3">
        <Button variant="outline" onClick={() => navigate(-1)}>
          Voltar
        </Button>
        <Button onClick={() => navigate("/")}>
          Ir para Dashboard
        </Button>
      </div>
    </div>
  )
}
