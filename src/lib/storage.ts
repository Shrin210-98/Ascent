import { STORAGE_KEY } from "./constants"
import type { AppData } from "./types"

const EMPTY_DATA: AppData = { days: {} }

export const loadData = (): AppData => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return EMPTY_DATA
    const parsed = JSON.parse(raw) as AppData
    // Guard against old shape (had lifetimeXP / streaks at root)
    if (!parsed.days) return EMPTY_DATA
    return parsed
  } catch {
    return EMPTY_DATA
  }
}

export const saveData = (data: AppData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    // ignore quota errors for now
  }
}
