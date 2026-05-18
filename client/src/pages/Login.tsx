import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faGoogle } from "@fortawesome/free-brands-svg-icons"
import { faStar } from "@fortawesome/free-regular-svg-icons"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type z from "zod"
import { loginSchema } from "@/schemas/loginSchema"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export const Login = () => {
  const { handleSubmit, control } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
  })

  const apiLogin = (data: z.infer<typeof loginSchema>) => {
    console.log(data)
  }

  return (
    <div className="flex items-center h-screen">
      <Card className="mx-auto my-auto w-full max-w-md p-8">
        <CardHeader>
          <CardTitle className="text-3xl mb-2">Bem-vindo de volta</CardTitle>
          <CardDescription>
            Escolha como prefere acessar sua conta
          </CardDescription>
        </CardHeader>
        <div className="flex flex-col items-center gap-2">
          <h3 className="text-green-600 text-sm">
            <FontAwesomeIcon className="me-1" icon={faStar} />
            Opção recomendada
          </h3>
          <Button className="w-full h-12" variant="outline">
            <FontAwesomeIcon className="text-blue-500" icon={faGoogle} />
            Continuar com Google
          </Button>
        </div>
        <form onSubmit={handleSubmit(apiLogin)}>
          <FieldGroup>
            <Controller
              name="email"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    {...field}
                    aria-invalid={fieldState.invalid}
                    placeholder="seu@email.com"
                  />
                </Field>
              )}
            />
            <Controller
              name="password"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Input
                    id="password"
                    type="password"
                    {...field}
                    aria-invalid={fieldState.invalid}
                    placeholder="••••••••"
                  />
                </Field>
              )}
            />
          </FieldGroup>
          <Button
            variant="default"
            className="w-full mt-6 py-5 hover:cursor-pointer"
          >
            Entrar com email
          </Button>
        </form>
        <div className="flex gap-3 justify-center">
          <Button variant="link" className="bg-purple-300 text-purple-700">
            Admistrador
          </Button>
          <Button>Vendedor</Button>
        </div>
      </Card>
    </div>
  )
}
