import { format } from "date-fns"
import type { AppData } from "./types"
import { calcDayXP, calcLifetimeXP } from "./xp"

export interface BackupFile {
  version: number
  exportedAt: string
  days: AppData["days"]
}

const BACKUP_VERSION = 1

/**
 * Serialize current app data to a backup object.
 */
export const buildBackup = (data: AppData): BackupFile => ({
  version: BACKUP_VERSION,
  exportedAt: new Date().toISOString(),
  days: data.days,
})

/**
 * Get a filename for the backup, e.g. "ascent-backup-2026-10-10-1430.json"
 */
export const getBackupFilename = (date: Date = new Date()): string => {
  return `ascent-backup-${format(date, "yyyy-MM-dd-HHmm")}.json`
}

/**
 * Trigger a browser download of the backup file.
 */
export const downloadBackup = (data: AppData) => {
  const backup = buildBackup(data)
  const blob = new Blob([JSON.stringify(backup, null, 2)], {
    type: "application/json",
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = getBackupFilename()
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/**
 * Validate and parse a backup file's contents.
 * Throws if the file doesn't look like an Ascent backup.
 */
export const parseBackupFile = (text: string): BackupFile => {
  let parsed: unknown
  try {
    parsed = JSON.parse(text)
  } catch {
    throw new Error("File is not valid JSON")
  }

  if (typeof parsed !== "object" || parsed === null) {
    throw new Error("File does not contain an Ascent backup")
  }

  const obj = parsed as Record<string, unknown>

  if (!obj.days || typeof obj.days !== "object") {
    throw new Error("Backup is missing 'days' data")
  }

  return {
    version: typeof obj.version === "number" ? obj.version : 1,
    exportedAt:
      typeof obj.exportedAt === "string"
        ? obj.exportedAt
        : new Date().toISOString(),
    days: obj.days as AppData["days"],
  }
}

/**
 * Convert a BackupFile back into AppData.
 */
export const backupToAppData = (backup: BackupFile): AppData => ({
  days: backup.days ?? {},
})

/**
 * Quick stats for display in confirmations.
 */
export interface DataStats {
  daysLogged: number
  activeDays: number
  lifetimeXP: number
  firstDate: string | null
  lastDate: string | null
}

export const getDataStats = (days: AppData["days"]): DataStats => {
  const keys = Object.keys(days).sort()
  const lifetimeXP = calcLifetimeXP(days)
  const activeDays = keys.filter((k) => calcDayXP(days[k]) > 0).length
  return {
    daysLogged: keys.length,
    activeDays,
    lifetimeXP,
    firstDate: keys[0] ?? null,
    lastDate: keys[keys.length - 1] ?? null,
  }
}
