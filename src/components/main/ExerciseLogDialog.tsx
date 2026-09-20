import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Copy, Check, Info, ChevronLeft, ChevronRight } from "lucide-react"
import { dateKey } from "@/lib/date"
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  addMonths,
  subMonths,
} from "date-fns"
import type { AppData } from "@/lib/types"

interface ExerciseLogDialogProps {
  data: AppData
}

export function ExerciseLogDialog({ data }: ExerciseLogDialogProps) {
  const [viewMonth, setViewMonth] = useState<Date>(new Date())
  const [copied, setCopied] = useState(false)

  const monthStart = startOfMonth(viewMonth)
  const monthEnd = endOfMonth(viewMonth)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const rows = days.map((date) => {
    const key = dateKey(date)
    const day = data.days[key]
    const sets = day?.sets ?? { push: 0, pull: 0, legs: 0, weights: 0 }
    const total = sets.push + sets.pull + sets.legs + sets.weights
    return {
      key,
      label: format(date, "dd-MM"),
      sets,
      total,
    }
  })

  const displayRows = rows

  const copyText = displayRows
    .map(
      (r) =>
        `${r.label} = ${r.sets.push}/${r.sets.pull}/${r.sets.legs}/${r.sets.weights}`
    )
    .join("\n")

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(copyText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // ignore
    }
  }

  const half = Math.ceil(displayRows.length / 2)
  const leftCol = displayRows.slice(0, half)
  const rightCol = displayRows.slice(half)

  const totals = displayRows.reduce(
    (acc, r) => ({
      push: acc.push + r.sets.push,
      pull: acc.pull + r.sets.pull,
      legs: acc.legs + r.sets.legs,
      weights: acc.weights + r.sets.weights,
      total: acc.total + r.total,
    }),
    { push: 0, pull: 0, legs: 0, weights: 0, total: 0 }
  )

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Exercise log"
          className="h-7 w-7"
        >
          <Info className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[95vh] max-w-2xl overflow-y-auto p-0 sm:max-h-[90vh]">
        {/* ─── HEADER: Title + Close (auto) ──────── */}
        <DialogHeader className="border-b px-4 py-3 sm:px-6">
          <DialogTitle>Exercise Log</DialogTitle>
        </DialogHeader>

        {/* ─── CONTENT ──────────────────────────── */}
        <div className="flex flex-col gap-4 p-4 sm:p-6 pt-0 sm:pt-0">
          {/* Month nav + Copy row */}
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

            <div className="flex items-center gap-1">
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
          </div>

          {/* 2-column grid */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-1 font-mono text-xs tabular-nums">
            <div className="flex flex-col gap-1">
              {leftCol.map((r) => (
                <div
                  key={r.key}
                  className={[
                    "rounded px-1.5 py-0.5",
                    r.total === 0 && "text-muted-foreground/40",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {r.label} = {r.sets.push}/{r.sets.pull}/{r.sets.legs}/
                  {r.sets.weights}
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-1">
              {rightCol.map((r) => (
                <div
                  key={r.key}
                  className={[
                    "rounded px-1.5 py-0.5",
                    r.total === 0 && "text-muted-foreground/40",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {r.label} = {r.sets.push}/{r.sets.pull}/{r.sets.legs}/
                  {r.sets.weights}
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="flex items-center justify-between border-t pt-3 text-xs">
            <span className="font-medium">Month total</span>
            <span className="font-mono font-semibold text-cyan-600 tabular-nums dark:text-cyan-400">
              {totals.push}/{totals.pull}/{totals.legs}/{totals.weights} ={" "}
              {totals.total}
            </span>
          </div>

          <Button
            size="sm"
            variant="outline"
            className="h-8 gap-1.5"
            onClick={handleCopy}
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-cyan-600" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                Copy
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
