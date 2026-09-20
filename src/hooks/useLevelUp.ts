import { useEffect, useRef, useState } from "react"

interface LevelUpInfo {
  /** Increments each time a level-up happens. Use as key to Confetti. */
  trigger: number
  /** The level you just reached */
  newLevel: number | null
  /** The title of the new level */
  newTitle: string | null
}

export function useLevelUp(
  currentLevel: number,
  currentTitle: string
): LevelUpInfo {
  const [trigger, setTrigger] = useState(0)
  const [newLevel, setNewLevel] = useState<number | null>(null)
  const [newTitle, setNewTitle] = useState<string | null>(null)
  const prevLevelRef = useRef<number | null>(null)

  useEffect(() => {
    // First render — just remember the level, don't celebrate
    if (prevLevelRef.current === null) {
      prevLevelRef.current = currentLevel
      return
    }

    // Level went up
    if (currentLevel > prevLevelRef.current) {
      setTrigger((t) => t + 1)
      setNewLevel(currentLevel)
      setNewTitle(currentTitle)

      // Clear the toast after 3s
      const t = setTimeout(() => {
        setNewLevel(null)
        setNewTitle(null)
      }, 3000)

      prevLevelRef.current = currentLevel
      return () => clearTimeout(t)
    }

    prevLevelRef.current = currentLevel
  }, [currentLevel, currentTitle])

  return { trigger, newLevel, newTitle }
}
