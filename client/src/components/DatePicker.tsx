import * as React from "react"
import { cn } from "@/lib/utils"
import { CalendarClock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import dayjs from "dayjs"
import { ptBR } from "react-day-picker/locale"

interface DatePickerProps {
  value: Date | undefined
  onChange: (date: Date | undefined) => void
  placeholder?: string
  disabled?: boolean
  fromDate?: Date
  trigger?: React.ReactNode
  onClear?: () => void
  className?: string
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Selecione a data",
  disabled,
  fromDate,
  trigger,
  onClear,
  className,
}: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        {trigger ?? (
          <Button variant="outline" disabled={disabled} className={cn("min-w-40 justify-start font-normal", className)}>
            <CalendarClock className="size-4 text-muted-foreground" />
            {value ? dayjs(value).format("DD/MM/YYYY") : <span className="text-muted-foreground">{placeholder}</span>}
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          locale={ptBR}
          selected={value}
          onSelect={onChange}
          disabled={fromDate ? { before: fromDate } : undefined}
          autoFocus
        />
        {onClear && (
          <div className="border-t p-2">
            <Button variant="ghost" size="sm" className="w-full text-muted-foreground" onClick={onClear}>
              Remover data
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
