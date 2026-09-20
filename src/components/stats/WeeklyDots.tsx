import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { calcDayXP } from "@/lib/xp"
import { dateKey } from "@/lib/date"
import { format, subDays } from "date-fns"
import type { AppData } from "@/lib/types"

interface WeeklyDotsProps {
  data: AppData
}

const DOT_STYLES = {
  empty: "bg-muted/40 border-muted",
  low: "bg-green-200 border-green-300 dark:bg-green-900/50 dark:border-green-800",
  mid: "bg-green-400 border-green-500 dark:bg-green-700/70 dark:border-green-600",
  high: "bg-green-600 border-green-700 dark:bg-green-600/80 dark:border-green-500",
  today: "ring-2 ring-primary ring-offset-1 ring-offset-background",
}

const getDotStyle = (xp: number): string => {
  if (xp === 0) return DOT_STYLES.empty
  if (xp < 50) return DOT_STYLES.low
  if (xp < 100) return DOT_STYLES.mid
  return DOT_STYLES.high
}

export function WeeklyDots({ data }: WeeklyDotsProps) {
  const today = new Date()
  const todayKey = dateKey(today)

  // Build last 7 days, oldest first
  const days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(today, 6 - i)
    const key = dateKey(date)
    const day = data.days[key]
    return {
      date,
      key,
      xp: day ? calcDayXP(day) : 0,
      isToday: key === todayKey,
      label: format(date, "EEE"),
      dayNum: format(date, "d"),
    }
  })

  const weekXP = days.reduce((sum, d) => sum + d.xp, 0)

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-baseline justify-between">
          <CardTitle className="text-base">This week</CardTitle>
          <span className="text-xs text-muted-foreground tabular-nums">
            {weekXP} XP
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between gap-2">
          {days.map((d) => (
            <div
              key={d.key}
              className="flex flex-1 flex-col items-center gap-2"
            >
              <span className="text-[10px] font-medium text-muted-foreground">
                {d.label}
              </span>
              <div
                className={[
                  "flex h-10 w-10 items-center justify-center rounded-full border-2 text-xs font-semibold tabular-nums transition",
                  getDotStyle(d.xp),
                  d.isToday && DOT_STYLES.today,
                ]
                  .filter(Boolean)
                  .join(" ")}
                title={`${format(d.date, "PPP")} · ${d.xp} XP`}
              >
                {d.dayNum}
              </div>
              <span className="text-[10px] text-muted-foreground tabular-nums">
                {d.xp > 0 ? d.xp : "·"}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
