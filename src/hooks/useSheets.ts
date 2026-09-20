import { useState, useCallback } from "react"
import { useGoogleLogin } from "@react-oauth/google"
import { fetchAllData, pushAllData, upsertDay } from "@/lib/sheets"
import type { AppData, DayData } from "@/lib/types"

const TOKEN_KEY = "ascent_google_token"

export function useSheets() {
  const [accessToken, setAccessToken] = useState<string | null>(() =>
    localStorage.getItem(TOKEN_KEY)
  )
  const [syncing, setSyncing] = useState(false)
  const [lastSync, setLastSync] = useState<Date | null>(null)
  const [error, setError] = useState<string | null>(null)

  // ─── LOGIN ─────────────────────────────────────────────
  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      const token = tokenResponse.access_token
      setAccessToken(token)
      localStorage.setItem(TOKEN_KEY, token)
      setError(null)
    },
    onError: () => setError("Login failed"),
    scope: "https://www.googleapis.com/auth/spreadsheets",
  })

  // ─── LOGOUT ────────────────────────────────────────────
  const logout = useCallback(() => {
    setAccessToken(null)
    localStorage.removeItem(TOKEN_KEY)
  }, [])

  // ─── PULL (sheets → local) ─────────────────────────────
  const pullFromSheets = useCallback(async (): Promise<AppData | null> => {
    if (!accessToken) return null
    setSyncing(true)
    setError(null)
    try {
      const data = await fetchAllData(accessToken)
      setLastSync(new Date())
      return data
    } catch (e) {
      setError(e instanceof Error ? e.message : "Sync failed")
      return null
    } finally {
      setSyncing(false)
    }
  }, [accessToken])

  // ─── PUSH (local → sheets) ─────────────────────────────
  const pushToSheets = useCallback(
    async (data: AppData) => {
      if (!accessToken) return
      setSyncing(true)
      setError(null)
      try {
        await pushAllData(accessToken, data)
        setLastSync(new Date())
      } catch (e) {
        setError(e instanceof Error ? e.message : "Sync failed")
      } finally {
        setSyncing(false)
      }
    },
    [accessToken]
  )

  // ─── SYNC ONE DAY (used on every save) ────────────────
  const syncDay = useCallback(
    async (key: string, day: DayData) => {
      if (!accessToken) return
      try {
        await upsertDay(accessToken, key, day)
        setLastSync(new Date())
      } catch (e) {
        // Silent — retry happens on next change
        console.warn("Sync failed for", key)
      }
    },
    [accessToken]
  )

  return {
    accessToken,
    isLoggedIn: !!accessToken,
    syncing,
    lastSync,
    error,
    login,
    logout,
    pullFromSheets,
    pushToSheets,
    syncDay,
  }
}
