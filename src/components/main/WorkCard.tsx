import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { SectionWarning } from "@/components/main/SectionWarning"
import { calcWorkXP } from "@/lib/xp"
import { workWarning } from "@/lib/warnings"

interface WorkCardProps {
  workHours: number
  workNotes: string
  onHoursChange: (h: number) => void
  onNotesChange: (n: string) => void
}

export function WorkCard({
  workHours,
  workNotes,
  onHoursChange,
  onNotesChange,
}: WorkCardProps) {
  const { base, bonus, total } = calcWorkXP(workHours)
  const warning = workWarning({
    workHours,
    workNotes,
    completedChores: [],
    sets: { push: 0, pull: 0, legs: 0, weights: 0 },
  })

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">📋 Work</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {warning && (
          <SectionWarning level={warning.level} message={warning.message} />
        )}

        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            type="number"
            inputMode="decimal"
            step="0.5"
            min="0"
            placeholder="Hours"
            value={workHours || ""}
            onChange={(e) => onHoursChange(Number(e.target.value))}
            className="sm:w-32"
          />
          <Input
            placeholder="Notes (optional)"
            value={workNotes}
            onChange={(e) => onNotesChange(e.target.value)}
            className="flex-1"
          />
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {base} XP {bonus > 0 && `+ ${bonus} bonus`}
          </span>
          <span className="font-semibold text-foreground tabular-nums">
            {total} XP
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
