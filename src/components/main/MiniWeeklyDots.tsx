import { calcDayXP } from "@/lib/xp"
import { dateKey } from "@/lib/date"
import { format, subDays } from "date-fns"
import type { AppData } from "@/lib/types"

interface MiniWeeklyDotsProps {
  data: AppData
}

const DOT_COLOR = {
  empty: "bg-muted/40",
  low: "bg-cyan-200 dark:bg-cyan-900/50",
  mid: "bg-cyan-400 dark:bg-cyan-700/70",
  high: "bg-cyan-600 dark:bg-cyan-500",
}

const getDotColor = (xp: number): string => {
  if (xp === 0) return DOT_COLOR.empty
  if (xp < 50) return DOT_COLOR.low
  if (xp < 100) return DOT_COLOR.mid
  return DOT_COLOR.high
}

export function MiniWeeklyDots({ data }: MiniWeeklyDotsProps) {
  const today = new Date()
  const todayKey = dateKey(today)

  const days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(today, 6 - i)
    const key = dateKey(date)
    const day = data.days[key]
    return {
      date,
      key,
      xp: day ? calcDayXP(day) : 0,
      isToday: key === todayKey,
      label: format(date, "EEEEE"), // single letter, e.g. "M"
    }
  })

  return (
    <div className="flex items-center justify-between gap-1.5 px-1">
      {days.map((d) => (
        <div key={d.key} className="flex flex-1 flex-col items-center gap-1">
          <span className="text-[10px] font-medium text-muted-foreground">
            {d.label}
          </span>
          <div
            className={[
              "h-2.5 w-full rounded-full transition",
              getDotColor(d.xp),
              d.isToday &&
                "ring-2 ring-blue-500 ring-offset-1 ring-offset-background",
            ]
              .filter(Boolean)
              .join(" ")}
            title={`${format(d.date, "PPP")} · ${d.xp} XP`}
          />
        </div>
      ))}
    </div>
  )
}
