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
  HardDrive,
  ArrowLeftRight,
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { useSheets } from "@/hooks/useSheets"
import { BackupDialog } from "@/components/main/BackupDialog"
import { SyncDialog } from "@/components/main/SyncDialog"
import type { AppData } from "@/lib/types"

interface SyncMenuProps {
  data: AppData
  onReplace: (fresh: AppData) => void
}

export function SyncMenu({ data, onReplace }: SyncMenuProps) {
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

  const [confirmSignOut, setConfirmSignOut] = useState(false)
  const [syncOpen, setSyncOpen] = useState(false)

  // ─── SYNC ACTIONS ───────────────────────────────────
  const handleTwoWay = async () => {
    await pushToSheets(data)
    const fresh = await pullFromSheets()
    if (fresh) onReplace(fresh)
  }

  const handlePushOnly = async () => {
    await pushToSheets(data)
  }

  const handlePullOnly = async () => {
    const fresh = await pullFromSheets()
    if (fresh) onReplace(fresh)
  }

  // ─── RECONNECT STATE ─────────────────────────────────
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

  // ─── LOGGED IN ───────────────────────────────────────
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

        <DropdownMenuContent align="end" className="w-60">
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
            onSelect={(e) => {
              e.preventDefault()
              setSyncOpen(true)
            }}
          >
            <ArrowLeftRight className="mr-2 h-4 w-4" />
            Sync now…
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <BackupDialog
            data={data}
            onReplace={onReplace}
            trigger={
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                className="cursor-pointer"
              >
                <HardDrive className="mr-2 h-4 w-4" />
                Backup & Restore…
              </DropdownMenuItem>
            }
          />

          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="text-red-600 focus:text-red-600"
            onSelect={(e) => {
              e.preventDefault()
              setConfirmSignOut(true)
            }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* ─── SYNC DIALOG ────────────────────────── */}
      <SyncDialog
        open={syncOpen}
        onOpenChange={setSyncOpen}
        data={data}
        syncing={syncing}
        onTwoWay={handleTwoWay}
        onPushOnly={handlePushOnly}
        onPullOnly={handlePullOnly}
      />

      {/* ─── SIGN OUT CONFIRM ───────────────────── */}
      <AlertDialog open={confirmSignOut} onOpenChange={setConfirmSignOut}>
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
                setConfirmSignOut(false)
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
