import { Flame, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { StreakMilestone } from "@/hooks/useStreakMilestones"

interface StreakToastProps {
  milestone: StreakMilestone | null
  onDismiss: () => void
}

const LABEL: Record<StreakMilestone["type"], string> = {
  work: "Work",
  chores: "Chore",
  exercise: "Exercise",
}

export function StreakToast({ milestone, onDismiss }: StreakToastProps) {
  if (!milestone) return null

  return (
    <div className="fixed top-4 right-4 z-[102] max-w-xs animate-in rounded-lg border border-yellow-500/30 bg-background p-3 shadow-lg fade-in slide-in-from-right">
      <div className="flex items-start gap-3">
        <Flame className="mt-0.5 h-5 w-5 shrink-0 text-yellow-500" />
        <div className="flex-1">
          <p className="text-sm font-semibold">
            {milestone.days}-day {LABEL[milestone.type]} streak!
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">Keep it alive.</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 shrink-0"
          onClick={onDismiss}
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
    </div>
  )
}
