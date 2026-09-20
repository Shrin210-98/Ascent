import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { SectionWarning } from "@/components/main/SectionWarning"
import { ExerciseLogDialog } from "@/components/main/ExerciseLogDialog"
import { calcExerciseXP } from "@/lib/xp"
import { exerciseWarning } from "@/lib/warnings"
import type { ExerciseSets, DayData, AppData } from "@/lib/types"

interface ExerciseCardProps {
  sets: ExerciseSets
  onChange: (type: keyof ExerciseSets, value: number) => void
  data: AppData
}

const TYPES: (keyof ExerciseSets)[] = ["push", "pull", "legs", "weights"]

const EMPTY_DAY: DayData = {
  workHours: 0,
  workNotes: "",
  completedChores: [],
  sets: { push: 0, pull: 0, legs: 0, weights: 0 },
}

export function ExerciseCard({ sets, onChange, data }: ExerciseCardProps) {
  const { base, bonus, total, totalSets } = calcExerciseXP(sets)
  const warning = exerciseWarning({ ...EMPTY_DAY, sets })

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-base">💪 Exercise</CardTitle>
        <ExerciseLogDialog data={data} />
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {warning && (
          <SectionWarning level={warning.level} message={warning.message} />
        )}

        <div className="grid grid-cols-4 gap-3 sm:grid-cols-4">
          {TYPES.map((type) => (
            <div key={type} className="flex flex-col gap-1">
              <label className="text-xs text-muted-foreground capitalize">
                {type}
              </label>
              <Input
                type="number"
                inputMode="numeric"
                min="0"
                value={sets[type] || ""}
                onChange={(e) => onChange(type, Number(e.target.value))}
                className="text-center tabular-nums"
              />
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {totalSets} sets · {base} XP {bonus > 0 && `+ ${bonus} bonus`}
          </span>
          <span className="font-semibold text-foreground tabular-nums">
            {total} XP
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
