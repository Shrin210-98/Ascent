import { useMemo } from "react"
import { differenceInCalendarDays } from "date-fns"
import { calcDayXP } from "@/lib/xp"
import { QUEST_START_DATE } from "@/lib/constants"
import { pickQuote } from "@/lib/quotes"
import { ADHDDialog } from "@/components/main/ADHDDialog"
import type { DayData, Streaks } from "@/lib/types"

interface FooterProps {
  day: DayData
  streaks: Streaks
}

export function Footer({ day, streaks }: FooterProps) {
  const daysSinceStart = useMemo(
    () =>
      Math.max(1, differenceInCalendarDays(new Date(), QUEST_START_DATE) + 1),
    []
  )

  const todayXP = calcDayXP(day)
  const activeTasks =
    (day.workHours > 0 ? 1 : 0) +
    (day.completedChores.length > 0 ? 1 : 0) +
    (Object.values(day.sets).some((s) => s > 0) ? 1 : 0)

  const quote = useMemo(
    () => pickQuote({ todayXP, activeTasks }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const dataLine = useMemo(() => {
    if (todayXP === 0) {
      return `Day ${daysSinceStart} of the quest · 0 XP so far`
    }
    if (activeTasks === 1) {
      return `1 task logged today · ${todayXP} XP. Keep going.`
    }
    if (activeTasks >= 2) {
      return `${activeTasks} tasks logged today · ${todayXP} XP. Keep going.`
    }
    return `${todayXP} XP today. Keep going.`
  }, [todayXP, activeTasks, daysSinceStart])

  const streakSummary = useMemo(() => {
    const parts: string[] = []
    if (streaks.work > 0) parts.push(`🔥 ${streaks.work}`)
    if (streaks.chores > 0) parts.push(`🧹 ${streaks.chores}`)
    if (streaks.exercise > 0) parts.push(`💪 ${streaks.exercise}`)
    return parts.join("  ")
  }, [streaks])

  const showStreaks = activeTasks > 0 && streakSummary

  return (
    <footer className="flex flex-col items-center gap-2 px-2 pt-4 pb-6 text-center">
      <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
        <span className="font-medium text-foreground/80">{dataLine}</span>
        {showStreaks && (
          <>
            <span className="text-muted-foreground/40">·</span>
            <span className="tabular-nums">{streakSummary}</span>
          </>
        )}
      </p>

      <p className="text-xs text-muted-foreground/70 italic">"{quote}"</p>

      <ADHDDialog />
    </footer>
  )
}
