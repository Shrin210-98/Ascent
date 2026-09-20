import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Info, ChevronLeft, ChevronRight, ListChecks } from "lucide-react"
import { dateKey } from "@/lib/date"
import { calcChoreXP } from "@/lib/xp"
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  addMonths,
  subMonths,
} from "date-fns"
import type { AppData } from "@/lib/types"

interface ChoresLogDialogProps {
  data: AppData
}

export function ChoresLogDialog({ data }: ChoresLogDialogProps) {
  const [viewMonth, setViewMonth] = useState<Date>(new Date())

  const monthStart = startOfMonth(viewMonth)
  const monthEnd = endOfMonth(viewMonth)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const rows = days.map((date) => {
    const key = dateKey(date)
    const day = data.days[key]
    const chores = day?.completedChores ?? []
    const xp = calcChoreXP(chores).total
    return {
      key,
      label: format(date, "dd-MM"),
      count: chores.length,
      chores,
      xp,
    }
  })

  const totalChores = rows.reduce((s, r) => s + r.count, 0)
  const totalXP = rows.reduce((s, r) => s + r.xp, 0)
  const activeDays = rows.filter((r) => r.count > 0).length

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Chores log"
          className="h-7 w-7"
        >
          <Info className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[95vh] max-w-2xl overflow-y-auto p-0 sm:max-h-[90vh]">
        <DialogHeader className="border-b px-4 py-3 sm:px-6">
          <DialogTitle>Chores Log</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 p-4 sm:p-6">
          {/* Month nav */}
          <div className="flex items-center justify-between gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMonth(subMonths(viewMonth, 1))}
              aria-label="Previous month"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <span className="text-sm font-medium">
              {format(viewMonth, "MMMM yyyy")}
            </span>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMonth(addMonths(viewMonth, 1))}
              aria-label="Next month"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Day rows */}
          <div className="flex flex-col gap-1 text-xs">
            {rows.map((r) => (
              <div
                key={r.key}
                className={[
                  "flex items-center justify-between gap-3 rounded px-2 py-1.5",
                  r.count === 0 && "text-muted-foreground/40",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <span className="shrink-0 font-mono tabular-nums">
                    {r.label}
                  </span>
                  <span className="shrink-0 font-mono tabular-nums">
                    {r.count} chore{r.count === 1 ? "" : "s"}
                  </span>

                  {r.chores.length > 0 && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <button
                          type="button"
                          className="flex min-w-0 items-center gap-1 text-muted-foreground transition-colors hover:text-foreground"
                        >
                          <ListChecks className="h-3 w-3 shrink-0" />
                          <span className="max-w-[120px] truncate sm:max-w-[200px]">
                            {r.chores.join(", ")}
                          </span>
                        </button>
                      </PopoverTrigger>
                      <PopoverContent
                        side="bottom"
                        align="start"
                        className="max-h-64 w-72 overflow-y-auto text-xs"
                      >
                        <div className="flex flex-col gap-1.5">
                          <span className="text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
                            {r.label} · Chores
                          </span>
                          <ul className="flex flex-col gap-1">
                            {r.chores.map((c, i) => (
                              <li key={i} className="flex items-start gap-1.5">
                                <span className="text-cyan-500">•</span>
                                <span>{c}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </PopoverContent>
                    </Popover>
                  )}
                </div>

                <span className="shrink-0 font-mono font-semibold tabular-nums">
                  {r.xp > 0 ? `${r.xp} XP` : "·"}
                </span>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="flex flex-col gap-1 border-t pt-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Active days</span>
              <span className="font-mono font-medium tabular-nums">
                {activeDays}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Total chores</span>
              <span className="font-mono font-medium tabular-nums">
                {totalChores}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Month total</span>
              <span className="font-mono font-semibold text-cyan-600 tabular-nums dark:text-cyan-400">
                {totalXP} XP
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
