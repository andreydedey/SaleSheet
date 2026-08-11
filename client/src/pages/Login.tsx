import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faGoogle } from "@fortawesome/free-brands-svg-icons"
import { faSpinner } from "@fortawesome/free-solid-svg-icons"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useAuth } from "@/context/AuthContext"
import { useState } from "react"

export const Login = () => {
  const { login } = useAuth()
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  const handleGoogleLogin = () => {
    setIsLoggingIn(true)
    login()
  }

  return (
    <div className="flex items-center h-screen">
      <Card className="mx-auto my-auto w-full max-w-md p-8">
        <CardHeader>
          <CardTitle className="text-3xl mb-2">Bem-vindo de volta</CardTitle>
          <CardDescription>
            Acesse sua conta para continuar
          </CardDescription>
        </CardHeader>
        <Button
          className="w-full h-12 hover:cursor-pointer shadow-sm"
          variant="outline"
          onClick={handleGoogleLogin}
          disabled={isLoggingIn}
        >
          {isLoggingIn ? (
            <FontAwesomeIcon className="animate-spin" icon={faSpinner} />
          ) : (
            <FontAwesomeIcon className="text-blue-500" icon={faGoogle} />
          )}
          {isLoggingIn ? "Redirecionando..." : "Continuar com Google"}
        </Button>
      </Card>
    </div>
  )
}
