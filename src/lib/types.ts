export interface Chore {
  name: string
  xp: number
}

export interface Level {
  min: number
  max: number
  title: string
}

export interface LevelInfo extends Level {
  number: number
  progress: number
}

export interface Streaks {
  work: number
  chores: number
  exercise: number
}

export interface ExerciseSets {
  push: number
  pull: number
  legs: number
  weights: number
}

export interface DayData {
  workHours: number
  workNotes: string
  completedChores: string[]
  sets: ExerciseSets
}

export interface AppData {
  days: Record<string, DayData> // key = "YYYY-MM-DD"
}
