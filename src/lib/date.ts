import { format, subDays } from "date-fns"

export const dateKey = (d: Date): string => format(d, "yyyy-MM-dd")

export const todayKey = (): string => dateKey(new Date())

// Returns array of last N date keys ending at `endDate` (inclusive)
export const lastNDays = (n: number, endDate: Date = new Date()): string[] => {
  const keys: string[] = []
  for (let i = 0; i < n; i++) {
    keys.push(dateKey(subDays(endDate, i)))
  }
  return keys
}
