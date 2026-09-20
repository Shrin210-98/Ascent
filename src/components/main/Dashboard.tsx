import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { SectionWarning } from "@/components/main/SectionWarning"
import { getStreakRisks } from "@/lib/warnings"
import { format } from "date-fns"
import type { LevelInfo, Streaks, DayData } from "@/lib/types"

interface DashboardProps {
  level: LevelInfo
  lifetimeXP: number
  dayXP: number
  streaks: Streaks
  selectedDate: Date
  day: DayData
}

export function Dashboard({
  level,
  lifetimeXP,
  dayXP,
  streaks,
  selectedDate,
  day,
}: DashboardProps) {
  const risks = getStreakRisks(day, streaks)

  return (
    <Card>
      <CardContent className="flex flex-col gap-4 pt-1">
        {/* ─── LEVEL + LIFETIME ──────────────────────── */}
        <div className="flex items-baseline justify-between">
          <div>
            <p className="text-xs text-muted-foreground">
              Level {level.number}
            </p>
            <p className="text-lg font-semibold">{level.title}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Lifetime XP</p>
            <p className="text-lg font-semibold tabular-nums">{lifetimeXP}</p>
          </div>
        </div>

        {/* ─── PROGRESS BAR ──────────────────────────── */}
        <div className="flex flex-col gap-1">
          <Progress value={level.progress} className="h-2 [&>div]:bg-cyan-500" />
          <p className="text-right text-xs text-muted-foreground tabular-nums">
            {lifetimeXP} / {level.max === Infinity ? "∞" : level.max}
          </p>
        </div>

        {/* ─── TODAY'S XP — HERO ─────────────────────── */}
        <div className="flex flex-col items-center gap-1 border-y py-5">
          <p className="text-xs tracking-wider text-muted-foreground uppercase">
            {format(selectedDate, "PPP")}
          </p>
          <p className="text-5xl leading-none font-bold tabular-nums">
            +{dayXP}
          </p>
          <p className="text-xs font-medium text-muted-foreground">XP today</p>
        </div>

        {/* ─── STREAKS ───────────────────────────────── */}
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Exercise</p>
            <p className="text-sm font-semibold tabular-nums">
              💪 {streaks.exercise}d
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Work</p>
            <p className="text-sm font-semibold tabular-nums">
              🔥 {streaks.work}d
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Chores</p>
            <p className="text-sm font-semibold tabular-nums">
              🧹 {streaks.chores}d
            </p>
          </div>
        </div>

        {/* ─── STREAK RISK WARNINGS ──────────────────── */}
        {risks.length > 0 && (
          <div className="flex flex-col gap-2">
            {risks.map((risk) => (
              <SectionWarning
                key={risk.type}
                level="danger"
                icon="flame"
                message={`Your ${risk.type} streak (${risk.streakDays} days) is at risk. Log something before midnight.`}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
