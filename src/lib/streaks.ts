import { calcDayXP, calcWorkXP, calcChoreXP, calcExerciseXP } from "./xp"
import { lastNDays } from "./date"
import type { DayData, Streaks } from "./types"

// ─── RULES ───────────────────────────────────────────────
//
// WORK STREAK:     Day counts if workHours > 0
// CHORE STREAK:    Day counts if completedChores.length >= 3
// EXERCISE STREAK: Day counts if total sets > 0
//
// A streak counts consecutive days ending at `endDate` (usually today).
// If today hasn't qualified yet, we look at yesterday onward — so the
// streak doesn't reset just because you haven't worked YET today.
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

// Count consecutive qualifying days going backwards from `endDate`.
// If the most recent day (today) does NOT qualify, we still count the
// streak up to yesterday — so your streak isn't broken just because
// you haven't done the thing yet today.
const countStreak = (
  days: Record<string, DayData>,
  qualifies: Qualifier,
  endDate: Date = new Date()
): number => {
  const keys = lastNDays(365, endDate) // look back up to 1 year

  let streak = 0
  let started = false

  for (const key of keys) {
    const day = days[key]
    const ok = qualifies(day)

    if (ok) {
      streak++
      started = true
    } else {
      // If we haven't started counting yet (i.e. today isn't qualified),
      // skip the first miss and keep looking. After that, a miss ends it.
      if (!started) continue
      break
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
