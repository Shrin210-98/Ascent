import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { InfoDialog } from "@/components/main/InfoDialog"
import { SyncMenu } from "@/components/main/SyncMenu"
import { CalendarIcon, BarChart3 } from "lucide-react"
import { format } from "date-fns"
import type { LevelInfo, AppData } from "@/lib/types"

interface HeaderProps {
  selectedDate: Date
  onDateChange: (d: Date) => void
  level: LevelInfo
  lifetimeXP: number
  data: AppData
  onPull: (data: AppData) => void
  onOpenStats: () => void
}

export function Header({
  selectedDate,
  onDateChange,
  level,
  lifetimeXP,
  data,
  onPull,
  onOpenStats,
}: HeaderProps) {
  return (
    <header className="flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Ascent
          </h1>
          <InfoDialog data={data} level={level} lifetimeXP={lifetimeXP} />
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={onOpenStats}
            aria-label="Stats"
          >
            <BarChart3 className="h-4 w-4" />
          </Button>
          <SyncMenu data={data} onPull={onPull} />
        </div>
      </div>

      <p className="text-xs text-muted-foreground sm:text-sm">
        the Dopamine Quest
      </p>

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
