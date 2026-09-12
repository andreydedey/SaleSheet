import { CalendarClock } from "lucide-react"
import { getCountdownInfo, getSellerCountdownInfo, countdownColors } from "@/lib/spreadsheet-utils"

interface DueDateChipProps {
  dueDate: string | null
  sellerMode?: boolean
}

export function DueDateChip({ dueDate, sellerMode }: DueDateChipProps) {
  const info = sellerMode ? getSellerCountdownInfo(dueDate) : getCountdownInfo(dueDate)
  if (!info) return null
  const { text } = countdownColors[info.color]
  return (
    <p className={`text-sm flex items-center gap-1 ${text}`}>
      <CalendarClock className="size-3.5" />
      {info.text}
    </p>
  )
}
