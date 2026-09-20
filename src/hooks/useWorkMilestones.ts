import { useEffect, useRef, useState } from "react"

const MILESTONE_HOURS = 10

export function useWorkMilestone(workHours: number) {
  const [trigger, setTrigger] = useState(0)
  const prevRef = useRef<number>(workHours)

  useEffect(() => {
    const wasBelow = prevRef.current < MILESTONE_HOURS
    const isNowAtOrAbove = workHours >= MILESTONE_HOURS

    if (wasBelow && isNowAtOrAbove) {
      setTrigger((t) => t + 1)
    }

    prevRef.current = workHours
  }, [workHours])

  return { trigger }
}
