import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { SectionWarning } from "@/components/main/SectionWarning"
import { calcWorkXP } from "@/lib/xp"
import { workWarning } from "@/lib/warnings"
import type { DayData } from "@/lib/types"

interface WorkCardProps {
  workHours: number
  workNotes: string
  onHoursChange: (h: number) => void
  onNotesChange: (n: string) => void
}

const EMPTY_DAY: DayData = {
  workHours: 0,
  workNotes: "",
  completedChores: [],
  sets: { push: 0, pull: 0, legs: 0, weights: 0 },
}

const MAX_HOURS = 10
const SEGMENTS = 10 // 10 segments = 1h each

export function WorkCard({
  workHours,
  workNotes,
  onHoursChange,
  onNotesChange,
}: WorkCardProps) {
  const { base, bonus, total } = calcWorkXP(workHours)
  const warning = workWarning({ ...EMPTY_DAY, workHours, workNotes })

  const [pulse, setPulse] = useState(false)

  useEffect(() => {
    if (!pulse) return
    const t = setTimeout(() => setPulse(false), 500)
    return () => clearTimeout(t)
  }, [pulse])

  const adjust = (delta: number) => {
    const next = Math.max(0, Number((workHours + delta).toFixed(2)))
    onHoursChange(next)
    setPulse(true)
  }

  // How many segments are filled (partial fill for last one)
  const clamped = Math.min(workHours, MAX_HOURS)
  const fillRatio = clamped / MAX_HOURS
  const filledSegments = Math.floor(fillRatio * SEGMENTS)
  const partialFill = fillRatio * SEGMENTS - filledSegments

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">📋 Work</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {warning && (
          <SectionWarning level={warning.level} message={warning.message} />
        )}

        {/* ─── ROW: Number + Meter ─────────────────── */}
        <div className="flex items-center gap-3">
          <span
            className={[
              "shrink-0 text-xl leading-none font-bold tabular-nums transition-colors duration-300",
              pulse ? "text-green-500" : "text-foreground",
            ].join(" ")}
          >
            {workHours > 0 ? workHours : 0}
            <span
              className={[
                "ml-0.5 text-xs font-medium transition-colors duration-300",
                pulse ? "text-green-500" : "text-muted-foreground",
              ].join(" ")}
            >
              h
            </span>
          </span>

          {/* Segmented meter */}
          <div className="flex min-w-0 flex-1 gap-0.5">
            {Array.from({ length: SEGMENTS }).map((_, i) => {
              // Segment fill: fully filled, partially filled, or empty
              let fill = 0
              if (i < filledSegments) fill = 1
              else if (i === filledSegments) fill = partialFill

              return (
                <div
                  key={i}
                  className="relative h-2 flex-1 overflow-hidden rounded-full bg-muted"
                >
                  <div
                    className={[
                      "absolute inset-y-0 left-0 transition-all duration-300",
                      pulse
                        ? "bg-green-500"
                        : workHours > 0
                          ? "bg-primary"
                          : "bg-muted-foreground/30",
                    ].join(" ")}
                    style={{ width: `${fill * 100}%` }}
                  />
                </div>
              )
            })}
          </div>

          <span className="shrink-0 text-[10px] font-medium text-muted-foreground tabular-nums">
            /{MAX_HOURS}h
          </span>
        </div>

        {/* ─── ROW: Buttons inline ────────────────── */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => adjust(-1)}
            disabled={workHours <= 0}
            className="h-8 flex-1 rounded-md border border-input text-xs font-medium text-muted-foreground tabular-nums transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
          >
            −1h
          </button>
          <button
            type="button"
            onClick={() => adjust(0.5)}
            className="h-8 flex-1 rounded-md border border-input text-xs font-medium text-muted-foreground tabular-nums transition-colors hover:bg-muted hover:text-foreground"
          >
            +0.5h
          </button>
          <button
            type="button"
            onClick={() => adjust(1)}
            className="h-8 flex-1 rounded-md border border-input text-xs font-medium text-muted-foreground tabular-nums transition-colors hover:bg-muted hover:text-foreground"
          >
            +1h
          </button>
        </div>

        {/* ─── NOTES (1 row) ───────────────────────── */}
        <Textarea
          rows={1}
          placeholder="Notes (optional)"
          value={workNotes}
          onChange={(e) => onNotesChange(e.target.value)}
          className="min-h-9 resize-none text-sm"
        />

        {/* ─── XP SUMMARY ──────────────────────────── */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {base} XP {bonus > 0 && `+ ${bonus} bonus`}
          </span>
          <span className="font-semibold text-foreground tabular-nums">
            {total} XP
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
