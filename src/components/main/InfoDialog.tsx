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
import { Info } from "lucide-react"
import { LEVELS } from "@/lib/constants"
import type { LevelInfo } from "@/lib/types"

interface InfoDialogProps {
  level: LevelInfo
  lifetimeXP: number
  monthlyTarget?: number
}

const XP_RULES = [
  { label: "Work", detail: "10 XP per hour · +20 bonus at 5+ hours" },
  { label: "Chores", detail: "List value per chore · +10 bonus at 3+ chores" },
  { label: "Exercise", detail: "5 XP per set · +20 bonus if all 4 categories" },
  { label: "Quest list done", detail: "+20 XP" },
]

const STREAK_RULES = [
  { label: "🔥 Work streak", detail: "Any work logged that day" },
  { label: "🧹 Chore streak", detail: "3 or more chores that day" },
  { label: "💪 Exercise streak", detail: "At least 1 set that day" },
]

const GRACE_RULES = [
  "Today doesn't break your streak just because you haven't done the thing yet.",
  "Streaks only break after 2 consecutive missed days.",
  "Never lose a level. Only lose progress toward the next one.",
  "Missing 1 day = no penalty. Missing 3+ days = XP decay toward next level.",
]

export function InfoDialog({
  level,
  lifetimeXP,
  monthlyTarget = 1000,
}: InfoDialogProps) {
  const monthlyProgress = Math.min(
    100,
    ((lifetimeXP % monthlyTarget) / monthlyTarget) * 100
  )

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
          {/* ─── XP RULES ─────────────────────────── */}
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

          {/* ─── LEVEL LADDER ─────────────────────── */}
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
                    className={`flex items-center justify-between rounded-md px-3 py-1.5 text-xs ${
                      isCurrent
                        ? "bg-primary/10 font-semibold text-primary"
                        : "text-muted-foreground"
                    }`}
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

          {/* ─── MONTHLY TARGET ───────────────────── */}
          <section className="flex flex-col gap-2">
            <h3 className="text-sm font-semibold">🎯 Monthly target</h3>
            <div className="flex flex-col gap-2 rounded-md border px-3 py-3">
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-muted-foreground">
                  Silver tier
                </span>
                <span className="text-sm font-semibold tabular-nums">
                  {monthlyTarget} XP
                </span>
              </div>
              <Progress value={monthlyProgress} className="h-1.5" />
              <div className="grid grid-cols-2 gap-1 text-xs text-muted-foreground sm:grid-cols-4">
                <span>🥉 750 Bronze</span>
                <span>🥈 1,000 Silver</span>
                <span>🥇 1,500 Gold</span>
                <span>💎 2,000 Platinum</span>
              </div>
            </div>
          </section>

          {/* ─── STREAKS ──────────────────────────── */}
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

          {/* ─── GRACE RULES ──────────────────────── */}
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
        </div>
      </DialogContent>
    </Dialog>
  )
}
