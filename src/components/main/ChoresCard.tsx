import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { SectionWarning } from "@/components/main/SectionWarning"
import { ChoresLogDialog } from "@/components/main/ChoresLogDialog"
import { DEFAULT_CHORES } from "@/lib/constants"
import { calcChoreXP } from "@/lib/xp"
import { choreWarning } from "@/lib/warnings"
import type { DayData, AppData } from "@/lib/types"

interface ChoresCardProps {
  completedChores: string[]
  onToggle: (name: string) => void
  data: AppData
}

const EMPTY_DAY: DayData = {
  workHours: 0,
  workNotes: "",
  completedChores: [],
  sets: { push: 0, pull: 0, legs: 0, weights: 0 },
}

export function ChoresCard({
  completedChores,
  onToggle,
  data,
}: ChoresCardProps) {
  const { base, bonus, total } = calcChoreXP(completedChores)
  const warning = choreWarning({ ...EMPTY_DAY, completedChores })

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-base">🧹 Chores</CardTitle>
        <ChoresLogDialog data={data} />
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {warning && (
          <SectionWarning level={warning.level} message={warning.message} />
        )}

        <div className="flex flex-col gap-2">
          {DEFAULT_CHORES.map((chore) => (
            <label
              key={chore.name}
              className="flex cursor-pointer items-center justify-between gap-3 rounded-md px-2 py-1.5 hover:bg-muted/50"
            >
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={completedChores.includes(chore.name)}
                  onCheckedChange={() => onToggle(chore.name)}
                />
                <span className="text-sm">{chore.name}</span>
              </div>
              <span className="text-xs text-muted-foreground tabular-nums">
                +{chore.xp}
              </span>
            </label>
          ))}
        </div>

        <div className="flex items-center justify-between border-t pt-3 text-xs text-muted-foreground">
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
