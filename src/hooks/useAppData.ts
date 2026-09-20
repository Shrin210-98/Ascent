import { useState, useEffect, useMemo, useCallback } from "react"
import { loadData, saveData } from "@/lib/storage"
import { EMPTY_DAY } from "@/lib/constants"
import { calcLifetimeXP, calcDayXP } from "@/lib/xp"
import { calcLevel } from "@/lib/level"
import { calcStreaks } from "@/lib/streaks"
import { dateKey } from "@/lib/date"
import { useSheets } from "./useSheets"
import type { AppData, DayData, ExerciseSets } from "@/lib/types"

export function useAppData(selectedDate: Date) {
  const [data, setData] = useState<AppData>(loadData)
  const { syncDay } = useSheets()

  // Persist to localStorage on every change
  useEffect(() => {
    saveData(data)
  }, [data])

  const key = dateKey(selectedDate)
  const day: DayData = data.days[key] ?? EMPTY_DAY

  // Derived values
  const lifetimeXP = useMemo(() => calcLifetimeXP(data.days), [data.days])
  const dayXP = useMemo(() => calcDayXP(day), [day])
  const level = useMemo(() => calcLevel(lifetimeXP), [lifetimeXP])
  const streaks = useMemo(() => calcStreaks(data.days), [data.days])

  // Mutators
  const updateDay = useCallback(
    (patch: Partial<DayData>): void => {
      setData((prev) => {
        const current = prev.days[key] ?? EMPTY_DAY
        const next = { ...current, ...patch }
        // Fire-and-forget sync to Sheets
        syncDay(key, next)
        return { ...prev, days: { ...prev.days, [key]: next } }
      })
    },
    [key, syncDay]
  )

  const setWorkHours = (hours: number) => updateDay({ workHours: hours })
  const setWorkNotes = (notes: string) => updateDay({ workNotes: notes })

  const toggleChore = (name: string) => {
    const current = day.completedChores
    const next = current.includes(name)
      ? current.filter((c) => c !== name)
      : [...current, name]
    updateDay({ completedChores: next })
  }

  const setExercise = (type: keyof ExerciseSets, value: number) => {
    updateDay({ sets: { ...day.sets, [type]: value } })
  }

  // Replace all data (used by pull)
  const replaceData = (fresh: AppData) => setData(fresh)

  return {
    data,
    day,
    lifetimeXP,
    dayXP,
    level,
    streaks,
    setWorkHours,
    setWorkNotes,
    toggleChore,
    setExercise,
    replaceData,
  }
}