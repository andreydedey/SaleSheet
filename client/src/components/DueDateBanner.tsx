import { CalendarClock } from "lucide-react"
import { getCountdownInfo, getSellerCountdownInfo, countdownColors, formatDueDate } from "@/lib/spreadsheet-utils"

interface DueDateBannerProps {
  dueDate: string | null
  sellerMode?: boolean
}

export function DueDateBanner({ dueDate, sellerMode }: DueDateBannerProps) {
  const info = sellerMode ? getSellerCountdownInfo(dueDate) : getCountdownInfo(dueDate)
  if (!info) return null
  const { text, bg, border } = countdownColors[info.color]
  return (
    <div className={`flex items-center gap-2 rounded-lg border px-4 py-3 ${bg} ${border}`}>
      <CalendarClock className={`size-4 shrink-0 ${text}`} />
      <span className={`text-sm font-medium ${text}`}>
        {info.text}
        {dueDate && ` · ${formatDueDate(dueDate)}`}
      </span>
    </div>
  )
}
