import * as z from "zod"

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(4, "Sua senha deve ter no mínimo 4 caracteres"),
})
