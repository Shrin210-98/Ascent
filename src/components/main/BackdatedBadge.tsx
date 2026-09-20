import { History } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { format, isToday } from "date-fns"

interface BackdatedBadgeProps {
  selectedDate: Date
}

export function BackdatedBadge({ selectedDate }: BackdatedBadgeProps) {
  if (isToday(selectedDate)) return null

  return (
    <div className="flex items-center justify-center">
      <Badge
        variant="outline"
        className="gap-1.5 border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300"
      >
        <History className="h-3 w-3" />
        Editing past day — {format(selectedDate, "MMM d")}
      </Badge>
    </div>
  )
}
