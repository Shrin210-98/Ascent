import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Copy, Check, Dumbbell } from "lucide-react"
import { dateKey } from "@/lib/date"
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  parseISO,
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

  // Build rows for the whole month
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

  // Filter: only days with data OR all days? Let's show all — timeline feel.
  // If you prefer only days with activity, change this to `rows.filter(r => r.total > 0)`
  const displayRows = rows

  // Build the copyable string:
  // "01-09 = 0/3/0/0\n02-09 = 2/0/0/0\n..."
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

  // Split rows into two columns
  const half = Math.ceil(displayRows.length / 2)
  const leftCol = displayRows.slice(0, half)
  const rightCol = displayRows.slice(half)

  // Monthly totals
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
        <Button variant="outline" className="w-full justify-start">
          <Dumbbell className="mr-2 h-4 w-4 text-cyan-600" />
          View exercise log
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[95vh] max-w-2xl overflow-y-auto p-0 sm:max-h-[90vh]">
        <DialogHeader className="sticky top-0 z-10 flex flex-row items-center justify-between border-b bg-background/95 px-4 py-3 backdrop-blur sm:px-6">
          <DialogTitle>Exercise Log</DialogTitle>
          <Button
            size="sm"
            variant="outline"
            className="mr-6 h-8 gap-1.5"
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
        </DialogHeader>

        <div className="flex flex-col gap-4 p-4 sm:p-6">
          {/* ─── MONTH NAV ─────────────────────────── */}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMonth(subMonths(viewMonth, 1))}
            >
              ← Prev
            </Button>
            <span className="text-sm font-medium">
              {format(viewMonth, "MMMM yyyy")}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMonth(addMonths(viewMonth, 1))}
            >
              Next →
            </Button>
          </div>

          {/* ─── 2-COLUMN GRID ─────────────────────── */}
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

          {/* ─── TOTALS ────────────────────────────── */}
          <div className="flex items-center justify-between border-t pt-3 text-xs">
            <span className="font-medium">Month total</span>
            <span className="font-mono font-semibold text-cyan-600 tabular-nums dark:text-cyan-400">
              {totals.push}/{totals.pull}/{totals.legs}/{totals.weights} ={" "}
              {totals.total}
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
