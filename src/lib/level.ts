import { LEVELS } from "./constants"
import type { LevelInfo } from "./types"

export const calcLevel = (xp: number): LevelInfo => {
  const i = LEVELS.findIndex((l) => xp >= l.min && xp < l.max)
  const level = LEVELS[i] ?? LEVELS[LEVELS.length - 1]
  const progress =
    level.max === Infinity
      ? 100
      : ((xp - level.min) / (level.max - level.min)) * 100
  return { number: i + 1, ...level, progress }
}
