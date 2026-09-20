import { calcDayXP, calcWorkXP, calcChoreXP, calcExerciseXP } from "./xp"
import { lastNDays } from "./date"
import type { DayData, Streaks } from "./types"

// ─── RULES ───────────────────────────────────────────────
//
// WORK STREAK:     Day counts if workHours > 0
// CHORE STREAK:    Day counts if completedChores.length >= 3
// EXERCISE STREAK: Day counts if total sets > 0
//
// GRACE RULE:
// - Today's miss is skipped (you haven't done the thing YET today)
// - One additional missed day anywhere = grace, streak survives
// - Two consecutive missed days = streak breaks
//
// ─────────────────────────────────────────────────────────

type Qualifier = (day: DayData | undefined) => boolean

const qualifiesWork: Qualifier = (day) => !!day && day.workHours > 0

const qualifiesChores: Qualifier = (day) =>
  !!day && day.completedChores.length >= 3

const qualifiesExercise: Qualifier = (day) => {
  if (!day) return false
  return Object.values(day.sets).reduce((a, b) => a + b, 0) > 0
}

const countStreak = (
  days: Record<string, DayData>,
  qualifies: Qualifier,
  endDate: Date = new Date()
): number => {
  const keys = lastNDays(365, endDate)

  let streak = 0
  let misses = 0
  let started = false

  for (const key of keys) {
    const day = days[key]
    const ok = qualifies(day)

    if (ok) {
      streak++
      misses = 0
      started = true
    } else {
      misses++
      if (!started) {
        // Haven't started counting yet — this is today's miss. Skip.
        continue
      }
      if (misses >= 2) {
        // Two consecutive misses — streak ends here.
        break
      }
      // One miss = grace. Keep going.
    }
  }

  return streak
}

export const calcStreaks = (
  days: Record<string, DayData>,
  endDate: Date = new Date()
): Streaks => ({
  work: countStreak(days, qualifiesWork, endDate),
  chores: countStreak(days, qualifiesChores, endDate),
  exercise: countStreak(days, qualifiesExercise, endDate),
})