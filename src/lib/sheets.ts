import type { AppData, DayData } from "./types"

const SHEET_ID = import.meta.env.VITE_SHEET_ID as string
const BASE = "https://sheets.googleapis.com/v4/spreadsheets"

// ─── ERROR TYPE ──────────────────────────────────────────

export class SheetsAuthError extends Error {
  constructor() {
    super("Google auth expired")
    this.name = "SheetsAuthError"
  }
}

// ─── HELPERS ─────────────────────────────────────────────

const headers = (token: string) => ({
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json",
})

const checkResponse = async (res: Response) => {
  if (res.status === 401 || res.status === 403) {
    throw new SheetsAuthError()
  }
  if (!res.ok) {
    throw new Error(`Sheets error: ${res.status}`)
  }
  return res
}

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

// ─── READ ────────────────────────────────────────────────

export const fetchAllData = async (token: string): Promise<AppData> => {
  const res = await fetch(`${BASE}/${SHEET_ID}/values/DailyLog!A2:H`, {
    headers: headers(token),
  })
  await checkResponse(res)

  const json = (await res.json()) as { values?: string[][] }
  const rows = json.values ?? []

  const days: Record<string, DayData> = {}
  for (const row of rows) {
    const parsed = rowToDay(row)
    if (parsed) days[parsed.key] = parsed.day
  }
  return { days }
}

// ─── UPSERT ──────────────────────────────────────────────

export const upsertDay = async (
  token: string,
  key: string,
  day: DayData
): Promise<void> => {
  const rangeRes = await fetch(`${BASE}/${SHEET_ID}/values/DailyLog!A:A`, {
    headers: headers(token),
  })
  await checkResponse(rangeRes)

  const rangeJson = (await rangeRes.json()) as { values?: string[][] }
  const dateCol = rangeJson.values ?? []
  const rowIndex = dateCol.findIndex((r) => r[0] === key)

  const row = dayToRow(key, day)

  if (rowIndex === -1) {
    const appendRes = await fetch(
      `${BASE}/${SHEET_ID}/values/DailyLog!A:H:append?valueInputOption=USER_ENTERED`,
      {
        method: "POST",
        headers: headers(token),
        body: JSON.stringify({ values: [row] }),
      }
    )
    await checkResponse(appendRes)
  } else {
    const sheetRow = rowIndex + 1
    const updateRes = await fetch(
      `${BASE}/${SHEET_ID}/values/DailyLog!A${sheetRow}:H${sheetRow}?valueInputOption=USER_ENTERED`,
      {
        method: "PUT",
        headers: headers(token),
        body: JSON.stringify({ values: [row] }),
      }
    )
    await checkResponse(updateRes)
  }
}

// ─── BULK PUSH ───────────────────────────────────────────

export const pushAllData = async (
  token: string,
  data: AppData
): Promise<void> => {
  const rows = Object.entries(data.days).map(([key, day]) => dayToRow(key, day))
  if (rows.length === 0) return

  const clearRes = await fetch(
    `${BASE}/${SHEET_ID}/values/DailyLog!A2:H:clear`,
    {
      method: "POST",
      headers: headers(token),
    }
  )
  await checkResponse(clearRes)

  const writeRes = await fetch(
    `${BASE}/${SHEET_ID}/values/DailyLog!A2:H?valueInputOption=USER_ENTERED`,
    {
      method: "PUT",
      headers: headers(token),
      body: JSON.stringify({ values: rows }),
    }
  )
  await checkResponse(writeRes)
}
