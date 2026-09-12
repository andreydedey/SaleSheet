import dayjs from "dayjs"

export type CountdownColor = "danger" | "warning" | "success"
export type CountdownInfo = { text: string; color: CountdownColor }

export const countdownColors: Record<CountdownColor, { text: string; bg: string; border: string }> = {
  danger:  { text: "text-red-600",   bg: "bg-red-50",   border: "border-red-200"   },
  warning: { text: "text-amber-500", bg: "bg-amber-50", border: "border-amber-200" },
  success: { text: "text-green-600", bg: "bg-green-50", border: "border-green-200" },
}

export function getCountdownInfo(dueDate: string | null): CountdownInfo | null {
  if (!dueDate) return null

  const diffDays = dayjs(dueDate).startOf("day").diff(dayjs().startOf("day"), "day")

  if (diffDays < 0)  return { text: `Vencida há ${Math.abs(diffDays)} dia${Math.abs(diffDays) !== 1 ? "s" : ""}`, color: "danger" }
  if (diffDays === 0) return { text: "Vence hoje",   color: "danger"  }
  if (diffDays === 1) return { text: "Vence amanhã", color: "warning" }
  if (diffDays <= 3)  return { text: `Vence em ${diffDays} dias`, color: "danger"  }
  if (diffDays <= 7)  return { text: `Vence em ${diffDays} dias`, color: "warning" }
  return                     { text: `Vence em ${diffDays} dias`, color: "success" }
}

export function getSellerCountdownInfo(dueDate: string | null): CountdownInfo | null {
  const info = getCountdownInfo(dueDate)
  if (!info) return null
  return {
    ...info,
    text: info.text
      .replace("Vence em",  "Devolução em")
      .replace("Vence hoje", "Devolução hoje")
      .replace("Vence amanhã", "Devolução amanhã")
      .replace("Vencida há", "Atrasada há"),
  }
}

export function dueDateToDate(dueDate: string | null): Date | undefined {
  return dueDate ? dayjs(dueDate).toDate() : undefined
}

export function dateToDueDate(date: Date | undefined): string | null {
  return date ? dayjs(date).startOf("day").format("YYYY-MM-DDTHH:mm:ss") : null
}

export function formatDueDate(dueDate: string): string {
  return dayjs(dueDate).format("DD/MM/YYYY")
}
