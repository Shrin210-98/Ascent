import { calcDayXP } from "@/lib/xp"
import { dateKey } from "@/lib/date"
import { format, eachDayOfInterval, parseISO, startOfDay } from "date-fns"
import type { AppData, DayData } from "@/lib/types"

export interface ChartPoint {
  /** Short label for x-axis, e.g. "Sep 5" */
  label: string
  /** Full date key, e.g. "2026-09-05" — for tooltip */
  dateKey: string
  /** Cumulative XP up to and including this day */
  cumulativeXP: number
  /** XP earned on this day only */
  dailyXP: number
  /** Is this today? */
  isToday: boolean
}

/**
 * Build a chart-ready dataset from local storage days.
 * - Starts from the first day with any data
 * - Includes every day in between (so gaps become flat segments)
 * - Cumulative XP carries forward on empty days
 */
export const buildCumulativeXPData = (data: AppData): ChartPoint[] => {
  const days = data.days

  // No data at all → empty chart
  const allKeys = Object.keys(days).sort()
  if (allKeys.length === 0) return []

  const firstDay = parseISO(allKeys[0])
  const today = startOfDay(new Date())

  // If the first day is in the future (weird state), bail
  if (firstDay > today) return []

  // Generate every day from first day → today
  const everyDay = eachDayOfInterval({ start: firstDay, end: today })
  const todayKey = dateKey(today)

  let cumulative = 0
  const points: ChartPoint[] = []

  for (const d of everyDay) {
    const key = dateKey(d)
    const day: DayData | undefined = days[key]
    const dailyXP = day ? calcDayXP(day) : 0
    cumulative += dailyXP

    points.push({
      label: format(d, "MMM d"),
      dateKey: key,
      cumulativeXP: cumulative,
      dailyXP,
      isToday: key === todayKey,
    })
  }

  return points
}

/**
 * Return the earliest date with data, or null.
 * Used to decide if we should show "not enough data" state.
 */
export const firstEntryDate = (data: AppData): string | null => {
  const keys = Object.keys(data.days).sort()
  return keys[0] ?? null
}
