import { DEFAULT_CHORES } from "./constants"
import type { DayData } from "./types"

// ─── WORK ────────────────────────────────────────────────

export const calcWorkXP = (hours: number) => {
  const base = hours * 10
  const bonus = hours >= 5 ? 20 : 0
  return { base, bonus, total: base + bonus }
}

// ─── CHORES ──────────────────────────────────────────────

export const calcChoreXP = (completedChores: string[]) => {
  const base = DEFAULT_CHORES.filter((c) =>
    completedChores.includes(c.name)
  ).reduce((sum, c) => sum + c.xp, 0)
  const bonus = completedChores.length >= 3 ? 10 : 0
  return { base, bonus, total: base + bonus }
}

// ─── EXERCISE ────────────────────────────────────────────

export const calcExerciseXP = (sets: DayData["sets"]) => {
  const totalSets = Object.values(sets).reduce((a, b) => a + b, 0)
  const base = totalSets * 5
  const bonus = Object.values(sets).every((s) => s > 0) ? 20 : 0
  return { base, bonus, total: base + bonus, totalSets }
}

// ─── DAY TOTAL ───────────────────────────────────────────

export const calcDayXP = (day: DayData): number => {
  return (
    calcWorkXP(day.workHours).total +
    calcChoreXP(day.completedChores).total +
    calcExerciseXP(day.sets).total
  )
}

export const calcLifetimeXP = (days: Record<string, DayData>): number =>
  Object.values(days).reduce((sum, day) => sum + calcDayXP(day), 0)
