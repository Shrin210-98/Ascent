import { useState, useCallback, useEffect, useRef } from "react"
import { useGoogleLogin } from "@react-oauth/google"
import {
  fetchAllData,
  pushAllData,
  upsertDay,
  SheetsAuthError,
} from "@/lib/sheets"
import type { AppData, DayData } from "@/lib/types"

const TOKEN_KEY = "ascent_google_token"

export function useSheets() {
  const [accessToken, setAccessToken] = useState<string | null>(
    () => localStorage.getItem(TOKEN_KEY)
  )
  const [syncing, setSyncing] = useState(false)
  const [lastSync, setLastSync] = useState<Date | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [needsReconnect, setNeedsReconnect] = useState(false)

  // ─── LOGIN ───────────────────────────────────────────
  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      const token = tokenResponse.access_token
      setAccessToken(token)
      localStorage.setItem(TOKEN_KEY, token)
      setError(null)
      setNeedsReconnect(false)
    },
    onError: () => setError("Login failed"),
    scope: "https://www.googleapis.com/auth/spreadsheets",
  })

  // ─── LOGOUT ──────────────────────────────────────────
  const logout = useCallback(() => {
    setAccessToken(null)
    localStorage.removeItem(TOKEN_KEY)
    setNeedsReconnect(false)
    setError(null)
  }, [])

  // ─── HANDLE AUTH FAILURE ─────────────────────────────
  const handleAuthFailure = useCallback(() => {
    setAccessToken(null)
    localStorage.removeItem(TOKEN_KEY)
    setNeedsReconnect(true)
    setError("Google session expired")
  }, [])

  // ─── PULL ────────────────────────────────────────────
  const pullFromSheets = useCallback(async (): Promise<AppData | null> => {
    if (!accessToken) return null
    setSyncing(true)
    setError(null)
    try {
      const data = await fetchAllData(accessToken)
      setLastSync(new Date())
      return data
    } catch (e) {
      if (e instanceof SheetsAuthError) {
        handleAuthFailure()
        return null
      }
      setError(e instanceof Error ? e.message : "Sync failed")
      return null
    } finally {
      setSyncing(false)
    }
  }, [accessToken, handleAuthFailure])

  // ─── PUSH ────────────────────────────────────────────
  const pushToSheets = useCallback(
    async (data: AppData) => {
      if (!accessToken) return
      setSyncing(true)
      setError(null)
      try {
        await pushAllData(accessToken, data)
        setLastSync(new Date())
      } catch (e) {
        if (e instanceof SheetsAuthError) {
          handleAuthFailure()
          return
        }
        setError(e instanceof Error ? e.message : "Sync failed")
      } finally {
        setSyncing(false)
      }
    },
    [accessToken, handleAuthFailure]
  )

  // ─── SYNC ONE DAY ────────────────────────────────────
  const syncDay = useCallback(
    async (key: string, day: DayData) => {
      if (!accessToken) return
      try {
        await upsertDay(accessToken, key, day)
        setLastSync(new Date())
      } catch (e) {
        if (e instanceof SheetsAuthError) {
          handleAuthFailure()
          return
        }
        // Silent otherwise — retry happens on next change
        console.warn("Sync failed for", key)
      }
    },
    [accessToken, handleAuthFailure]
  )

  return {
    accessToken,
    isLoggedIn: !!accessToken,
    syncing,
    lastSync,
    error,
    needsReconnect,
    login,
    logout,
    pullFromSheets,
    pushToSheets,
    syncDay,
  }
}