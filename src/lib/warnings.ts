import type { DayData } from "./types"

export type WarningLevel = "info" | "warn" | "danger"

export interface SectionWarning {
  level: WarningLevel
  message: string
}

// ─── WORK WARNING ────────────────────────────────────────
// Shows only if today has no work logged AND it's late enough
// (6 PM+) that it's genuinely a concern. No nagging at 10 AM.

export const workWarning = (
  day: DayData,
  now = new Date()
): SectionWarning | null => {
  if (day.workHours > 0) return null

  const hour = now.getHours()
  if (hour < 18) return null // before 6 PM, silence

  return {
    level: "warn",
    message: "No work logged yet. Even 30 min counts (+5 XP).",
  }
}

// ─── CHORE WARNING ───────────────────────────────────────
// Chores are "3+ for streak", but any chore counts toward the day.
// Warn at end of day if nothing is done.

export const choreWarning = (
  day: DayData,
  now = new Date()
): SectionWarning | null => {
  if (day.completedChores.length > 0) return null

  const hour = now.getHours()
  if (hour < 18) return null

  return {
    level: "warn",
    message: "No chores logged. Do 3+ to keep your streak alive.",
  }
}

// ─── EXERCISE WARNING ────────────────────────────────────
// Most important warning. Ectomorph goal = don't skip.

export const exerciseWarning = (
  day: DayData,
  now = new Date()
): SectionWarning | null => {
  const totalSets = Object.values(day.sets).reduce((a, b) => a + b, 0)
  if (totalSets > 0) return null

  const hour = now.getHours()
  if (hour < 18) return null

  return {
    level: "warn",
    message: "No sets logged. Even 1 set keeps your streak alive.",
  }
}

// ─── STREAK AT RISK ──────────────────────────────────────
// If you HAD a streak and today isn't qualified yet, flag it.
// This is the "danger" warning — red, high priority.

export interface StreakRisk {
  type: "work" | "chores" | "exercise"
  streakDays: number
}

export const getStreakRisks = (
  day: DayData,
  streaks: { work: number; chores: number; exercise: number },
  now = new Date()
): StreakRisk[] => {
  const risks: StreakRisk[] = []
  const hour = now.getHours()

  // Only worry about streak risk in the evening. Morning anxiety is not helpful.
  if (hour < 18) return risks

  // Work streak at risk
  if (streaks.work > 0 && day.workHours === 0) {
    risks.push({ type: "work", streakDays: streaks.work })
  }

  // Chore streak at risk (needs 3+)
  if (streaks.chores > 0 && day.completedChores.length < 3) {
    risks.push({ type: "chores", streakDays: streaks.chores })
  }

  // Exercise streak at risk (needs 1+)
  const totalSets = Object.values(day.sets).reduce((a, b) => a + b, 0)
  if (streaks.exercise > 0 && totalSets === 0) {
    risks.push({ type: "exercise", streakDays: streaks.exercise })
  }

  return risks
}
