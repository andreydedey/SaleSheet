import { api } from "@/lib/api"

export function inviteSalesperson(data: { email: string; name: string }) {
  return api.post("/api/user/invite", data)
}

export function updateSalesperson(id: string, data: { name: string; email: string }) {
  return api.put(`/api/user/${id}`, data)
}

export function deleteSalesperson(id: string) {
  return api.delete(`/api/user/${id}`)
}
