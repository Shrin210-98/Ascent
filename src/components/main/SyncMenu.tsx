import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Cloud,
  CloudOff,
  RefreshCw,
  LogOut,
  Download,
  Upload,
  AlertTriangle,
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { useSheets } from "@/hooks/useSheets"
import type { AppData } from "@/lib/types"

interface SyncMenuProps {
  data: AppData
  onPull: (data: AppData) => void
}

export function SyncMenu({ data, onPull }: SyncMenuProps) {
  const {
    isLoggedIn,
    syncing,
    lastSync,
    needsReconnect,
    login,
    logout,
    pullFromSheets,
    pushToSheets,
  } = useSheets()

  const [confirmOpen, setConfirmOpen] = useState(false)

  // ─── RECONNECT STATE ─────────────────────────────────
  // If token expired, show a warning button instead of the menu
  if (needsReconnect) {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={() => login()}
        aria-label="Reconnect Google Sheets"
        className="relative"
        title="Google session expired — tap to reconnect"
      >
        <Cloud className="h-4 w-4 text-amber-500" />
        <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500" />
        </span>
      </Button>
    )
  }

  // ─── NOT LOGGED IN ───────────────────────────────────
  if (!isLoggedIn) {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={() => login()}
        aria-label="Connect Google Sheets"
      >
        <CloudOff className="h-4 w-4" />
      </Button>
    )
  }

  // ─── LOGGED IN, WORKING ──────────────────────────────
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Sync menu"
            className="relative"
          >
            {syncing ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Cloud className="h-4 w-4 text-green-600" />
            )}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="flex flex-col gap-0.5">
            <span className="text-xs font-medium">Google Sheets</span>
            <span className="text-[10px] font-normal text-muted-foreground">
              {syncing
                ? "Syncing…"
                : lastSync
                  ? `Synced ${formatDistanceToNow(lastSync, { addSuffix: true })}`
                  : "Connected"}
            </span>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            disabled={syncing}
            onClick={async () => {
              const fresh = await pullFromSheets()
              if (fresh) onPull(fresh)
            }}
          >
            <Download className="mr-2 h-4 w-4" />
            Pull from Sheets
          </DropdownMenuItem>

          <DropdownMenuItem
            disabled={syncing}
            onClick={() => pushToSheets(data)}
          >
            <Upload className="mr-2 h-4 w-4" />
            Push to Sheets
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="text-red-600 focus:text-red-600"
            onClick={() => setConfirmOpen(true)}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sign out of Google Sheets?</AlertDialogTitle>
            <AlertDialogDescription>
              Your local data stays on this device. You just won't sync to
              Sheets until you log back in.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                logout()
                setConfirmOpen(false)
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Sign Out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
