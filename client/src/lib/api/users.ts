import { api } from "@/lib/api"

export function inviteSalesperson(data: { email: string; name: string }) {
  return api.post("/api/user/invite", data)
}
