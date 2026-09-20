import { useEffect, useRef, useState } from "react"
import type { Streaks } from "@/lib/types"

const MILESTONES = [7, 30, 90]

export interface StreakMilestone {
  type: "work" | "chores" | "exercise"
  days: number
}

export function useStreakMilestones(streaks: Streaks) {
  const [milestone, setMilestone] = useState<StreakMilestone | null>(null)
  const prevRef = useRef<Streaks | null>(null)

  useEffect(() => {
    // First render — remember, don't celebrate
    if (prevRef.current === null) {
      prevRef.current = streaks
      return
    }

    const types: (keyof Streaks)[] = ["work", "chores", "exercise"]

    for (const type of types) {
      const prev = prevRef.current[type]
      const curr = streaks[type]

      // Did we just cross a milestone?
      for (const m of MILESTONES) {
        if (prev < m && curr >= m) {
          setMilestone({ type, days: curr })
          const t = setTimeout(() => setMilestone(null), 4000)
          prevRef.current = streaks
          return () => clearTimeout(t)
        }
      }
    }

    prevRef.current = streaks
  }, [streaks])

  return { milestone, clear: () => setMilestone(null) }
}
