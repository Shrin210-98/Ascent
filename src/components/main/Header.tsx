import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { InfoDialog } from "@/components/main/InfoDialog"
import { SyncMenu } from "@/components/main/SyncMenu"
import {
  CalendarIcon,
  BarChart3,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import {
  format,
  addDays,
  subDays,
  isToday,
  isAfter,
  startOfDay,
} from "date-fns"
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
  const canGoForward = !isToday(selectedDate)

  return (
    <header className="flex flex-col gap-3">
      <div>
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
      </div>

      {/* ─── DATE NAVIGATOR ───────────────────────── */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onDateChange(subDays(selectedDate, 1))}
          aria-label="Previous day"
          className="h-9 w-9 shrink-0"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="h-9 flex-1 justify-center text-center font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
              <span className="truncate">{format(selectedDate, "PPP")}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(d) => d && onDateChange(d)}
              disabled={(date) =>
                isAfter(startOfDay(date), startOfDay(new Date()))
              }
            />
          </PopoverContent>
        </Popover>

        <Button
          variant="outline"
          size="icon"
          onClick={() => onDateChange(addDays(selectedDate, 1))}
          disabled={!canGoForward}
          aria-label="Next day"
          className="h-9 w-9 shrink-0"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </header>
  )
}
