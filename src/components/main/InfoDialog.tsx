import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Info, TrendingUp, TrendingDown, Minus } from "lucide-react"
import { LEVELS, QUEST_START_DATE } from "@/lib/constants"
import { calcDayXP } from "@/lib/xp"
import { format, subMonths } from "date-fns"
import type { AppData, LevelInfo } from "@/lib/types"

interface InfoDialogProps {
  level: LevelInfo
  lifetimeXP: number
  data: AppData
}

// ─── STATIC RULES ────────────────────────────────────────

const XP_RULES = [
  { label: "Exercise", detail: "5 XP per set, +20 bonus if all 4 categories." },
  { label: "Work", detail: "10 XP per hour, +20 bonus at 5+ hours" },
  { label: "Chores", detail: "List value per chore, +10 bonus at 3+ chores" },
  {
    label: "10-hour day",
    detail: "Confetti celebration when work hits 10h 🎉",
  },
]

const STREAK_RULES = [
  { label: "💪 Exercise streak", detail: "At least 1 set that day" },
  { label: "🔥 Work streak", detail: "Any work logged that day" },
  { label: "🧹 Chore streak", detail: "3 or more chores that day" },
]

const GRACE_RULES = [
  "Today doesn't break your streak just because you haven't done the thing yet.",
  "One missed day anywhere is grace — the streak survives.",
  "Two consecutive missed days break the streak.",
  "Never lose a level. Only lose progress toward the next one.",
]

const TIERS = [
  { name: "Bronze", emoji: "🥉", xp: 750 },
  { name: "Silver", emoji: "🥈", xp: 1000 },
  { name: "Gold", emoji: "🥇", xp: 1500 },
  { name: "Platinum", emoji: "💎", xp: 2000 },
  { name: "Diamond", emoji: "🏆", xp: 3000 },
]

// ─── PROJECTION CONSTANTS ────────────────────────────────

const LEVEL_8_THRESHOLD = 50000
const OPTIMISTIC_MONTHLY_XP = 3000
const MAX_MONTHLY_XP = 9300

// ─── HELPERS ─────────────────────────────────────────────

const getMonthKey = (d: Date): string => {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  return `${y}-${m}`
}

const calcMonthXP = (data: AppData, monthDate: Date): number => {
  const monthKey = getMonthKey(monthDate)
  return Object.entries(data.days)
    .filter(([key]) => key.startsWith(monthKey))
    .reduce((sum, [, day]) => sum + calcDayXP(day), 0)
}

interface MonthStat {
  key: string
  xp: number
  date: Date
}

const getAllMonthStats = (data: AppData): MonthStat[] => {
  const map = new Map<string, number>()
  for (const [key, day] of Object.entries(data.days)) {
    const monthKey = key.slice(0, 7)
    map.set(monthKey, (map.get(monthKey) ?? 0) + calcDayXP(day))
  }
  return Array.from(map.entries())
    .map(([key, xp]) => {
      const [y, m] = key.split("-").map(Number)
      return { key, xp, date: new Date(y, m - 1, 1) }
    })
    .sort((a, b) => b.key.localeCompare(a.key))
}

const getTier = (xp: number) => {
  let current = TIERS[0]
  let next: (typeof TIERS)[number] | null = TIERS[1]
  for (let i = 0; i < TIERS.length; i++) {
    if (xp >= TIERS[i].xp) {
      current = TIERS[i]
      next = TIERS[i + 1] ?? null
    } else {
      next = TIERS[i]
      break
    }
  }
  return { current, next }
}

const formatMonths = (months: number): string => {
  if (months <= 0) return "reached"
  if (months === 1) return "1 month"
  if (months < 12) return `${months} months`
  const years = Math.floor(months / 12)
  const rem = months % 12
  if (rem === 0) return `${years} year${years > 1 ? "s" : ""}`
  return `${years}y ${rem}m`
}

const monthsToLevel8 = (currentXP: number, monthlyXP: number): number => {
  if (monthlyXP <= 0) return Infinity
  const remaining = LEVEL_8_THRESHOLD - currentXP
  if (remaining <= 0) return 0
  return Math.ceil(remaining / monthlyXP)
}

// ─── COMPONENT ───────────────────────────────────────────

export function InfoDialog({ level, lifetimeXP, data }: InfoDialogProps) {
  const now = new Date()
  const thisMonth = calcMonthXP(data, now)
  const lastMonth = calcMonthXP(data, subMonths(now, 1))

  const allMonths = getAllMonthStats(data)
  const bestMonth =
    allMonths.length > 0
      ? allMonths.reduce((best, m) => (m.xp > best.xp ? m : best))
      : null

  const { current, next } = getTier(thisMonth)
  const nextProgress = next
    ? Math.min(100, ((thisMonth - current.xp) / (next.xp - current.xp)) * 100)
    : 100
  const xpToNext = next ? next.xp - thisMonth : 0

  // Comparison to last month
  const diff = thisMonth - lastMonth
  const diffLabel =
    lastMonth === 0 ? "—" : diff > 0 ? `+${diff}` : diff < 0 ? `${diff}` : "0"
  const TrendIcon =
    lastMonth === 0
      ? Minus
      : diff > 0
        ? TrendingUp
        : diff < 0
          ? TrendingDown
          : Minus
  const trendColor =
    lastMonth === 0
      ? "text-muted-foreground"
      : diff > 0
        ? "text-green-600 dark:text-green-400"
        : diff < 0
          ? "text-red-500"
          : "text-muted-foreground"

  // Projections
  const optimisticMonths = monthsToLevel8(lifetimeXP, OPTIMISTIC_MONTHLY_XP)
  const maxMonths = monthsToLevel8(lifetimeXP, MAX_MONTHLY_XP)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Game info">
          <Info className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[85vh] max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ascent — The Rules</DialogTitle>
          <DialogDescription>
            Everything you need to know about XP, levels, and streaks.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-6 pt-2">
          {/* ─── 1. XP RULES ──────────────────────── */}
          <section className="flex flex-col gap-2">
            <h3 className="text-sm font-semibold">⭐ How XP works</h3>
            <div className="flex flex-col gap-1.5">
              {XP_RULES.map((rule) => (
                <div
                  key={rule.label}
                  className="flex flex-col gap-0.5 rounded-md bg-muted/50 px-3 py-2"
                >
                  <span className="text-xs font-medium">{rule.label}</span>
                  <span className="text-xs text-muted-foreground">
                    {rule.detail}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* ─── 2. STREAKS ───────────────────────── */}
          <section className="flex flex-col gap-2">
            <h3 className="text-sm font-semibold">🔥 How streaks work</h3>
            <div className="flex flex-col gap-1.5">
              {STREAK_RULES.map((rule) => (
                <div
                  key={rule.label}
                  className="flex flex-col gap-0.5 rounded-md bg-muted/50 px-3 py-2"
                >
                  <span className="text-xs font-medium">{rule.label}</span>
                  <span className="text-xs text-muted-foreground">
                    {rule.detail}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* ─── 3. GRACE RULES ───────────────────── */}
          <section className="flex flex-col gap-2">
            <h3 className="text-sm font-semibold">🕊️ The grace rules</h3>
            <ul className="flex flex-col gap-1.5 text-xs text-muted-foreground">
              {GRACE_RULES.map((rule, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-foreground">•</span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* ─── 4. LEVEL LADDER ──────────────────── */}
          <section className="flex flex-col gap-2">
            <h3 className="text-sm font-semibold">📊 Level ladder</h3>
            <div className="flex flex-col gap-1">
              {LEVELS.map((l, i) => {
                const isCurrent = level.number === i + 1
                const range =
                  l.max === Infinity ? `${l.min}+` : `${l.min}–${l.max}`
                return (
                  <div
                    key={l.title}
                    className={[
                      "flex items-center justify-between rounded-md py-1.5 pr-3 pl-3 text-xs transition-colors",
                      isCurrent
                        ? "border-l-2 border-primary bg-primary/5 pl-2.5 font-semibold text-primary"
                        : "text-muted-foreground",
                    ].join(" ")}
                  >
                    <span>
                      {isCurrent && "→ "}Lv {i + 1} · {l.title}
                    </span>
                    <span className="tabular-nums">{range} XP</span>
                  </div>
                )
              })}
            </div>
          </section>

          {/* ─── 5. THIS MONTH ────────────────────── */}
          <section className="flex flex-col gap-2">
            <h3 className="text-sm font-semibold">🎯 This month</h3>
            <div className="flex flex-col gap-3 rounded-md border px-4 py-4">
              <div className="flex items-baseline justify-between">
                <div>
                  <p className="text-2xl leading-none font-bold tabular-nums">
                    {thisMonth.toLocaleString()}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    XP earned
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">
                    {current.emoji} {current.name}
                  </p>
                  <p className="text-xs text-muted-foreground">Current tier</p>
                </div>
              </div>

              {next ? (
                <div className="flex flex-col gap-1.5">
                  <Progress value={nextProgress} className="h-1.5" />
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      Next: {next.emoji} {next.name}
                    </span>
                    <span className="font-medium tabular-nums">
                      {xpToNext} XP to go
                    </span>
                  </div>
                </div>
              ) : (
                <div className="rounded-md bg-primary/10 px-3 py-2 text-center text-xs font-medium text-primary">
                  🏆 Maximum tier reached this month
                </div>
              )}

              <div className="flex flex-col gap-1.5 border-t pt-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Last month</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium tabular-nums">
                      {lastMonth.toLocaleString()} XP
                    </span>
                    <span
                      className={`flex items-center gap-0.5 tabular-nums ${trendColor}`}
                    >
                      <TrendIcon className="h-3 w-3" />
                      {diffLabel}
                    </span>
                  </div>
                </div>
                {bestMonth && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Best month</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium tabular-nums">
                        {bestMonth.xp.toLocaleString()} XP
                      </span>
                      <span className="text-muted-foreground">
                        ({format(bestMonth.date, "MMM yyyy")})
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-x-3 gap-y-1 border-t pt-3 text-[10px] text-muted-foreground">
                {TIERS.map((t) => (
                  <span key={t.name} className="tabular-nums">
                    {t.emoji} {t.xp.toLocaleString()}
                  </span>
                ))}
              </div>
            </div>
          </section>

          {/* ─── 6. LEVEL 8 PROJECTION ────────────── */}
          <section className="flex flex-col gap-2">
            <h3 className="text-sm font-semibold">📈 Level 8 projection</h3>
            <div className="flex flex-col gap-2 rounded-md border px-4 py-3">
              <div className="flex items-center justify-between text-[10px] tracking-wide text-muted-foreground uppercase">
                <span>Start</span>
                <span className="tabular-nums">
                  {format(QUEST_START_DATE, "MMM d, yyyy")}
                </span>
              </div>

              <div className="flex items-center justify-between border-t pt-2 text-xs">
                <span className="text-muted-foreground">
                  Optimistic ({OPTIMISTIC_MONTHLY_XP.toLocaleString()} XP/month)
                </span>
                <span className="font-medium tabular-nums">
                  {optimisticMonths === Infinity
                    ? "—"
                    : formatMonths(optimisticMonths)}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  Maximum ({MAX_MONTHLY_XP.toLocaleString()} XP/month)
                </span>
                <span className="font-medium tabular-nums">
                  {maxMonths === Infinity ? "—" : formatMonths(maxMonths)}
                </span>
              </div>

              <p className="border-t pt-2 text-[10px] leading-relaxed text-muted-foreground">
                Level 8 (Mythic) requires {LEVEL_8_THRESHOLD.toLocaleString()}{" "}
                lifetime XP.
                {lifetimeXP > 0 && (
                  <>
                    {" "}
                    You have {lifetimeXP.toLocaleString()} —{" "}
                    {Math.max(
                      0,
                      LEVEL_8_THRESHOLD - lifetimeXP
                    ).toLocaleString()}{" "}
                    to go.
                  </>
                )}
              </p>
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  )
}
