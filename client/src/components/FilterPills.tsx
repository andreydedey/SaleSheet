import { cn } from "@/lib/utils"

interface FilterPillsProps<T extends string> {
  options: { label: string; value: T; count: number }[]
  value: T
  onChange: (value: T) => void
}

export function FilterPills<T extends string>({
  options,
  value,
  onChange,
}: FilterPillsProps<T>) {
  return (
    <div className="flex gap-2">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={cn(
            "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium border",
            value === opt.value
              ? "bg-foreground text-background border-foreground"
              : "bg-background text-foreground border-border",
          )}
        >
          {opt.label}
          <span
            className={cn(
              "text-xs rounded-full px-1.5 py-0.5 font-semibold",
              value === opt.value
                ? "bg-white/20 text-background"
                : "bg-muted text-muted-foreground",
            )}
          >
            {opt.count}
          </span>
        </button>
      ))}
    </div>
  )
}
