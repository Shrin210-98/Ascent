import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { InfoDialog } from "@/components/main/InfoDialog"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import type { LevelInfo } from "@/lib/types"

interface HeaderProps {
  selectedDate: Date
  onDateChange: (d: Date) => void
  level: LevelInfo
  lifetimeXP: number
}

export function Header({
  selectedDate,
  onDateChange,
  level,
  lifetimeXP,
}: HeaderProps) {
  return (
    <header className="flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Ascent
          </h1>
          <p className="text-xs text-muted-foreground sm:text-sm">
            the Dopamine Quest
          </p>
        </div>
        <InfoDialog level={level} lifetimeXP={lifetimeXP} />
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start text-left font-normal sm:w-auto"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {format(selectedDate, "PPP")}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(d) => d && onDateChange(d)}
            // initialFocus
          />
        </PopoverContent>
      </Popover>
    </header>
  )
}
