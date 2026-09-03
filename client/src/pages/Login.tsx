import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faGoogle } from "@fortawesome/free-brands-svg-icons"
import { faCircleExclamation, faSpinner } from "@fortawesome/free-solid-svg-icons"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useAuth } from "@/context/AuthContext"
import { useState } from "react"
import { useSearchParams } from "react-router"

const loginErrorMessages: Record<string, string> = {
  not_invited:
    "Este email não tem acesso ao app. Peça um convite ao administrador.",
}

const defaultLoginErrorMessage =
  "Não foi possível entrar. Tente novamente em instantes."

export const Login = () => {
  const { login } = useAuth()
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [searchParams] = useSearchParams()

  const errorCode = searchParams.get("error")
  const errorMessage = errorCode
    ? (loginErrorMessages[errorCode] ?? defaultLoginErrorMessage)
    : null

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
        {errorMessage && (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive"
          >
            <FontAwesomeIcon className="mt-0.5" icon={faCircleExclamation} />
            <span>{errorMessage}</span>
          </div>
        )}
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
