import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
} from "lucide-react"
import { format, addMonths, subMonths } from "date-fns"
import { getCalendarDays, getCellColor } from "@/lib/calendar"
import { dateKey } from "@/lib/date"
import type { AppData } from "@/lib/types"

interface CalendarViewProps {
  data: AppData
  selectedDate: Date
  onDateChange: (d: Date) => void
}

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"]

export function CalendarView({
  data,
  selectedDate,
  onDateChange,
}: CalendarViewProps) {
  const [expanded, setExpanded] = useState(false)
  const [viewMonth, setViewMonth] = useState<Date>(new Date())

  const days = getCalendarDays(viewMonth, data.days)
  const selectedKey = dateKey(selectedDate)

  // ─── COLLAPSED STATE ─────────────────────────────────
  if (!expanded) {
    return (
      <Button
        variant="outline"
        className="w-full"
        onClick={() => setExpanded(true)}
      >
        <CalendarIcon className="mr-2 h-4 w-4" />
        Show Calendar
      </Button>
    )
  }

  // ─── EXPANDED STATE ──────────────────────────────────
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-base">
          {format(viewMonth, "MMMM yyyy")}
        </CardTitle>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setViewMonth(subMonths(viewMonth, 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setViewMonth(addMonths(viewMonth, 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-xs"
            onClick={() => setExpanded(false)}
          >
            Hide
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-3">
        {/* ─── WEEKDAY HEADERS ─────────────────────── */}
        <div className="grid grid-cols-7 gap-1">
          {WEEKDAYS.map((d, i) => (
            <div
              key={i}
              className="text-center text-xs font-medium text-muted-foreground"
            >
              {d}
            </div>
          ))}
        </div>

        {/* ─── DAY GRID ────────────────────────────── */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day) => {
            const isSelected = day.key === selectedKey
            return (
              <button
                key={day.key}
                onClick={() => onDateChange(day.date)}
                className={[
                  "relative flex aspect-square flex-col items-center justify-center rounded-md text-xs transition",
                  "hover:ring-2 hover:ring-primary/50",
                  getCellColor(day.xp),
                  !day.isCurrentMonth && "opacity-30",
                  isSelected && "ring-2 ring-primary",
                  day.isToday && !isSelected && "ring-2 ring-primary/60",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <span className="font-medium tabular-nums">
                  {format(day.date, "d")}
                </span>
                {day.xp > 0 && (
                  <span className="text-[9px] leading-tight tabular-nums opacity-80">
                    {day.xp}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* ─── LEGEND ──────────────────────────────── */}
        <div className="flex flex-wrap items-center justify-center gap-3 border-t pt-3 text-[10px] text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded-sm bg-muted/40" />
            <span>0</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded-sm bg-green-200 dark:bg-green-900/50" />
            <span>1-49</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded-sm bg-green-300 dark:bg-green-800/60" />
            <span>50-99</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded-sm bg-green-400 dark:bg-green-700/70" />
            <span>100-149</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded-sm bg-green-600 dark:bg-green-600/80" />
            <span>150+</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
