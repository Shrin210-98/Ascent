import { startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek } from "date-fns"
import { calcDayXP } from "./xp"
import { dateKey } from "./date"
import type { DayData } from "./types"

export interface CalendarDay {
  date: Date
  key: string
  xp: number
  isToday: boolean
  isCurrentMonth: boolean
}

// Get all days to render for a given month (includes leading/trailing
// days from adjacent months so the grid is always 6 weeks × 7 days)
export const getCalendarDays = (
  monthDate: Date,
  days: Record<string, DayData>
): CalendarDay[] => {
  const monthStart = startOfMonth(monthDate)
  const monthEnd = endOfMonth(monthDate)

  // Start from the Sunday of the week containing the 1st
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 0 })
  // End on the Saturday of the week containing the last day
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 0 })

  const today = dateKey(new Date())
  const currentMonth = monthDate.getMonth()

  const allDays = eachDayOfInterval({ start: gridStart, end: gridEnd })

  return allDays.map((date) => {
    const key = dateKey(date)
    const day = days[key]
    return {
      date,
      key,
      xp: day ? calcDayXP(day) : 0,
      isToday: key === today,
      isCurrentMonth: date.getMonth() === currentMonth,
    }
  })
}

// Get the color class for a day cell based on XP
export const getCellColor = (xp: number): string => {
  if (xp === 0) return "bg-muted/40"
  if (xp < 50) return "bg-green-200 dark:bg-green-900/50"
  if (xp < 100) return "bg-green-300 dark:bg-green-800/60"
  if (xp < 150) return "bg-green-400 dark:bg-green-700/70"
  return "bg-green-600 dark:bg-green-600/80"
}