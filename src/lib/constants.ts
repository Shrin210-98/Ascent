import type { Chore, Level, DayData } from "./types"

export const STORAGE_KEY = "ascent_data"

export const DEFAULT_CHORES: Chore[] = [
  { name: "Make bed", xp: 5 },
  { name: "Wash dishes", xp: 10 },
  { name: "Cook meal", xp: 15 },
  { name: "Clean room (10 min)", xp: 15 },
  { name: "Bath/grooming", xp: 10 },
  { name: "Wash clothes", xp: 20 },
  { name: "Fold clothes", xp: 10 },
  { name: "Take out trash", xp: 10 },
  { name: "Grocery shopping", xp: 25 },
  { name: "Laundry put away", xp: 10 },
]

export const LEVELS: Level[] = [
  { min: 0, max: 500, title: "Initiate" },
  { min: 500, max: 1500, title: "Apprentice" },
  { min: 1500, max: 3000, title: "Earner" },
  { min: 3000, max: 6000, title: "Hunter" },
  { min: 6000, max: 10000, title: "Money Machine" },
  { min: 10000, max: 20000, title: "Quest Master" },
  { min: 20000, max: 50000, title: "Legend" },
  { min: 50000, max: Infinity, title: "Mythic" },
]

export const EMPTY_DAY: DayData = {
  workHours: 0,
  workNotes: "",
  completedChores: [],
  sets: { push: 0, pull: 0, legs: 0, weights: 0 },
}

export const QUEST_START_DATE = new Date("2026-09-20")
