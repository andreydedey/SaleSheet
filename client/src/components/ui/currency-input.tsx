import { cn } from "@/lib/utils"

type CurrencyInputFieldProps = {
  id?: string
  value?: number | ""
  onChange: (value: number | "") => void
  placeholder?: string
  "aria-invalid"?: boolean
  className?: string
}

export function formatCents(cents: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(cents / 100)
}

export function CurrencyInputField({
  id,
  value,
  onChange,
  placeholder = "R$ 0,00",
  className,
  "aria-invalid": ariaInvalid,
}: CurrencyInputFieldProps) {
  const cents = Number(value) || 0

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key >= "0" && e.key <= "9") {
      e.preventDefault()
      const next = cents * 10 + parseInt(e.key)
      onChange(next)
    } else if (e.key === "Backspace") {
      e.preventDefault()
      const next = Math.floor(cents / 10)
      onChange(next > 0 ? next : "")
    }
  }

  return (
    <input
      id={id}
      type="text"
      inputMode="numeric"
      value={cents === 0 ? "" : formatCents(cents)}
      placeholder={placeholder}
      onChange={() => {}}
      onKeyDown={handleKeyDown}
      aria-invalid={ariaInvalid}
      className={cn(
        "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
    />
  )
}
