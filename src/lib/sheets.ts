import { dateKey } from "./date"
import type { AppData, DayData } from "./types"

const SHEET_ID = import.meta.env.VITE_SHEET_ID as string
const BASE = "https://sheets.googleapis.com/v4/spreadsheets"

// ─── HELPERS ─────────────────────────────────────────────

const headers = (token: string) => ({
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json",
})

// Convert DayData to a row for the DailyLog sheet
const dayToRow = (key: string, day: DayData): (string | number)[] => [
  key,
  day.workHours,
  day.workNotes,
  day.completedChores.join(", "),
  day.sets.push,
  day.sets.pull,
  day.sets.legs,
  day.sets.weights,
]

// Convert a row from DailyLog back to DayData
const rowToDay = (row: string[]): { key: string; day: DayData } | null => {
  if (!row[0]) return null
  return {
    key: row[0],
    day: {
      workHours: Number(row[1]) || 0,
      workNotes: row[2] || "",
      completedChores: row[3]
        ? row[3]
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [],
      sets: {
        push: Number(row[4]) || 0,
        pull: Number(row[5]) || 0,
        legs: Number(row[6]) || 0,
        weights: Number(row[7]) || 0,
      },
    },
  }
}

// ─── READ ALL DATA ───────────────────────────────────────

export const fetchAllData = async (token: string): Promise<AppData> => {
  const res = await fetch(`${BASE}/${SHEET_ID}/values/DailyLog!A2:H`, {
    headers: headers(token),
  })

  if (!res.ok) {
    throw new Error(`Sheets read failed: ${res.status}`)
  }

  const json = (await res.json()) as { values?: string[][] }
  const rows = json.values ?? []

  const days: Record<string, DayData> = {}
  for (const row of rows) {
    const parsed = rowToDay(row)
    if (parsed) days[parsed.key] = parsed.day
  }

  return { days }
}

// ─── WRITE ONE DAY (upsert) ──────────────────────────────

// We use values.update with a range targeting the exact row for this date.
// First we need to know which row that is. We'll fetch the date column,
// find the index, then update that row.

export const upsertDay = async (
  token: string,
  key: string,
  day: DayData
): Promise<void> => {
  // 1. Find the row for this date
  const rangeRes = await fetch(`${BASE}/${SHEET_ID}/values/DailyLog!A:A`, {
    headers: headers(token),
  })
  const rangeJson = (await rangeRes.json()) as { values?: string[][] }
  const dateCol = rangeJson.values ?? []
  const rowIndex = dateCol.findIndex((r) => r[0] === key)

  const row = dayToRow(key, day)

  if (rowIndex === -1) {
    // Not found → append a new row
    await fetch(
      `${BASE}/${SHEET_ID}/values/DailyLog!A:H:append?valueInputOption=USER_ENTERED`,
      {
        method: "POST",
        headers: headers(token),
        body: JSON.stringify({ values: [row] }),
      }
    )
  } else {
    // Found → overwrite that row
    const sheetRow = rowIndex + 1 // A1 notation is 1-indexed
    await fetch(
      `${BASE}/${SHEET_ID}/values/DailyLog!A${sheetRow}:H${sheetRow}?valueInputOption=USER_ENTERED`,
      {
        method: "PUT",
        headers: headers(token),
        body: JSON.stringify({ values: [row] }),
      }
    )
  }
}

// ─── BULK UPLOAD (push everything local → sheets) ────────

export const pushAllData = async (
  token: string,
  data: AppData
): Promise<void> => {
  const rows = Object.entries(data.days).map(([key, day]) => dayToRow(key, day))

  if (rows.length === 0) return

  // Clear existing data first
  await fetch(`${BASE}/${SHEET_ID}/values/DailyLog!A2:H:clear`, {
    method: "POST",
    headers: headers(token),
  })

  // Write all rows
  await fetch(
    `${BASE}/${SHEET_ID}/values/DailyLog!A2:H?valueInputOption=USER_ENTERED`,
    {
      method: "PUT",
      headers: headers(token),
      body: JSON.stringify({ values: rows }),
    }
  )
}
