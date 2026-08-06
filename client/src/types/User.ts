export type Role = "ADMIN" | "SALESPERSON"

export type User = {
  id: string
  name: string
  email: string
  role: Role
}
