import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { calcDayXP, calcWorkXP, calcChoreXP, calcExerciseXP } from "@/lib/xp"
import { dateKey } from "@/lib/date"
import {
  format,
  getDaysInMonth,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
} from "date-fns"
import type { AppData, DayData, LevelInfo, Streaks } from "@/lib/types"

interface StatsSummaryProps {
  data: AppData
  day: DayData
  selectedDate: Date
  level: LevelInfo
  streaks: Streaks
}

const MONTHLY_TIERS = [
  { name: "Bronze", xp: 750, emoji: "🥉" },
  { name: "Silver", xp: 1000, emoji: "🥈" },
  { name: "Gold", xp: 1500, emoji: "🥇" },
  { name: "Platinum", xp: 2000, emoji: "💎" },
  { name: "Diamond", xp: 3000, emoji: "🏆" },
]

const getTierForXP = (xp: number) => {
  // Highest tier achieved
  let tier = { name: "—", xp: 0, emoji: "·" }
  for (const t of MONTHLY_TIERS) {
    if (xp >= t.xp) tier = t
  }
  return tier
}

export function StatsSummary({
  data,
  selectedDate,
  level,
  streaks,
}: StatsSummaryProps) {
  // ─── SCOPE: SELECTED MONTH ───────────────────────────
  const monthStart = startOfMonth(selectedDate)
  const monthEnd = endOfMonth(selectedDate)
  const daysInMonth = getDaysInMonth(selectedDate)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Aggregate
  let monthXP = 0
  let workXP = 0
  let choreXP = 0
  let exerciseXP = 0
  let workHours = 0
  let choresCount = 0
  let exerciseSets = 0
  let activeDays = 0
  let bestDay = { key: "", xp: 0 }

  const today = new Date()

  for (const d of days) {
    const key = dateKey(d)
    const dayData = data.days[key]
    if (!dayData) continue

    const xp = calcDayXP(dayData)
    if (xp > 0) activeDays++

    monthXP += xp
    workXP += calcWorkXP(dayData.workHours).total
    choreXP += calcChoreXP(dayData.completedChores).total
    exerciseXP += calcExerciseXP(dayData.sets).total

    workHours += dayData.workHours
    choresCount += dayData.completedChores.length
    exerciseSets += Object.values(dayData.sets).reduce((a, b) => a + b, 0)

    if (xp > bestDay.xp) {
      bestDay = { key, xp }
    }
  }

  const tier = getTierForXP(monthXP)
  const bestDayLabel = bestDay.key
    ? format(new Date(bestDay.key), "MMM d")
    : "—"

  // XP split
  const totalForSplit = workXP + choreXP + exerciseXP || 1
  const workPct = Math.round((workXP / totalForSplit) * 100)
  const chorePct = Math.round((choreXP / totalForSplit) * 100)
  const exercisePct = 100 - workPct - chorePct

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">
          {format(selectedDate, "MMMM yyyy")} Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        {/* ─── HERO ────────────────────────────────── */}
        <div className="flex flex-col items-center gap-1 rounded-lg border-y py-5">
          <p className="text-xs tracking-wider text-muted-foreground uppercase">
            This month
          </p>
          <p className="text-5xl leading-none font-bold tabular-nums">
            {monthXP.toLocaleString()}
          </p>
          <p className="text-sm font-medium text-muted-foreground">XP earned</p>
          {tier.name !== "—" && (
            <p className="mt-1 text-sm font-semibold">
              {tier.emoji} {tier.name}
            </p>
          )}
        </div>

        {/* ─── HEADLINE GRID ──────────────────────── */}
        <div className="grid grid-cols-3 gap-3">
          <div className="flex flex-col items-center gap-0.5 rounded-md bg-muted/40 px-2 py-3">
            <p className="text-[10px] tracking-wide text-muted-foreground uppercase">
              Level
            </p>
            <p className="text-sm font-semibold tabular-nums">{level.number}</p>
          </div>
          <div className="flex flex-col items-center gap-0.5 rounded-md bg-muted/40 px-2 py-3">
            <p className="text-[10px] tracking-wide text-muted-foreground uppercase">
              Active
            </p>
            <p className="text-sm font-semibold tabular-nums">
              {activeDays}/{daysInMonth}
            </p>
          </div>
          <div className="flex flex-col items-center gap-0.5 rounded-md bg-muted/40 px-2 py-3">
            <p className="text-[10px] tracking-wide text-muted-foreground uppercase">
              Best day
            </p>
            <p className="text-sm font-semibold tabular-nums">
              {bestDay.xp > 0 ? bestDay.xp : "—"}
            </p>
            <p className="text-[10px] text-muted-foreground">{bestDayLabel}</p>
          </div>
        </div>

        {/* ─── STREAKS ────────────────────────────── */}
        <div className="flex flex-col gap-2">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Streaks
          </p>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">🔥 Work</p>
              <p className="text-base font-semibold tabular-nums">
                {streaks.work}d
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">🧹 Chores</p>
              <p className="text-base font-semibold tabular-nums">
                {streaks.chores}d
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">💪 Exercise</p>
              <p className="text-base font-semibold tabular-nums">
                {streaks.exercise}d
              </p>
            </div>
          </div>
        </div>

        {/* ─── ACTIVITY ───────────────────────────── */}
        <div className="flex flex-col gap-2">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Activity
          </p>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Work</p>
              <p className="text-base font-semibold tabular-nums">
                {workHours}h
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Chores</p>
              <p className="text-base font-semibold tabular-nums">
                {choresCount}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Sets</p>
              <p className="text-base font-semibold tabular-nums">
                {exerciseSets}
              </p>
            </div>
          </div>
        </div>

        {/* ─── XP SPLIT ──────────────────────────── */}
        <div className="flex flex-col gap-2">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            XP split
          </p>
          <div className="flex h-2 w-full overflow-hidden rounded-full">
            <div
              className="bg-green-500"
              style={{ width: `${workPct}%` }}
              title={`Work ${workPct}%`}
            />
            <div
              className="bg-blue-500"
              style={{ width: `${chorePct}%` }}
              title={`Chores ${chorePct}%`}
            />
            <div
              className="bg-purple-500"
              style={{ width: `${exercisePct}%` }}
              title={`Exercise ${exercisePct}%`}
            />
          </div>
          <div className="flex flex-wrap justify-between text-[10px] text-muted-foreground">
            <span>Work {workPct}%</span>
            <span>Chores {chorePct}%</span>
            <span>Exercise {exercisePct}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
