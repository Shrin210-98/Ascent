import { useState, useEffect, useMemo, useCallback, useRef } from "react"
import { loadData, saveData } from "@/lib/storage"
import { EMPTY_DAY } from "@/lib/constants"
import { calcLifetimeXP, calcDayXP } from "@/lib/xp"
import { calcLevel } from "@/lib/level"
import { calcStreaks } from "@/lib/streaks"
import { dateKey } from "@/lib/date"
import { debounce } from "@/lib/debounce"
import { useSheets } from "./useSheets"
import type { AppData, DayData, ExerciseSets } from "@/lib/types"

const SYNC_DEBOUNCE_MS = 1500

export function useAppData(selectedDate: Date) {
  const [data, setData] = useState<AppData>(loadData)
  const { syncDay } = useSheets()

  useEffect(() => {
    saveData(data)
  }, [data])

  const key = dateKey(selectedDate)
  const day: DayData = data.days[key] ?? EMPTY_DAY

  const lifetimeXP = useMemo(() => calcLifetimeXP(data.days), [data.days])
  const dayXP = useMemo(() => calcDayXP(day), [day])
  const level = useMemo(() => calcLevel(lifetimeXP), [lifetimeXP])
  const streaks = useMemo(() => calcStreaks(data.days), [data.days])

  // ─── DEBOUNCED SYNC ──────────────────────────────────
  // Recreate the debounced function whenever syncDay changes
  // (syncDay changes when accessToken changes, which is rare)
  const debouncedSync = useRef(
    debounce((k: string, d: DayData) => syncDay(k, d), SYNC_DEBOUNCE_MS)
  ).current

  // Keep the debounced function pointed at the latest syncDay
  useEffect(() => {
    debouncedSync.cancel()
  }, [syncDay, debouncedSync])

  const updateDay = useCallback(
    (patch: Partial<DayData>): void => {
      setData((prev) => {
        const current = prev.days[key] ?? EMPTY_DAY
        const next = { ...current, ...patch }
        // Schedule a debounced sync
        debouncedSync(key, next)
        return { ...prev, days: { ...prev.days, [key]: next } }
      })
    },
    [key, debouncedSync]
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
