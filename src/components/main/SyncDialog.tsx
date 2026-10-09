import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  Cloud,
  ArrowDown,
  ArrowUp,
  RefreshCw,
  AlertTriangle,
} from "lucide-react"
import { getDataStats } from "@/lib/backup"
import type { AppData } from "@/lib/types"

interface SyncDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  data: AppData
  syncing: boolean
  onTwoWay: () => void
  onPushOnly: () => void
  onPullOnly: () => void
}

export function SyncDialog({
  open,
  onOpenChange,
  data,
  syncing,
  onTwoWay,
  onPushOnly,
  onPullOnly,
}: SyncDialogProps) {
  const stats = getDataStats(data.days)

  const close = () => onOpenChange(false)

  const handle = (fn: () => void) => {
    fn()
    close()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100vw-2rem)] max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Cloud className="h-5 w-5 text-cyan-500" />
            Sync with Google Sheets
          </DialogTitle>
          <DialogDescription>
            Choose how to sync. Two-way is the safest.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 pt-2">
          {/* Local data summary */}
          <div className="rounded-md border bg-muted/40 px-3 py-2 text-xs">
            <p className="mb-1 font-medium text-foreground">
              Current local data
            </p>
            <ul className="flex flex-col gap-0.5 text-muted-foreground">
              <li>· {stats.daysLogged} days logged</li>
              <li>· {stats.lifetimeXP.toLocaleString()} XP</li>
            </ul>
          </div>

          {/* Two-way */}
          <button
            type="button"
            disabled={syncing}
            onClick={() => handle(onTwoWay)}
            className="flex flex-col gap-1 rounded-md border border-cyan-500/30 bg-cyan-500/5 p-3 text-left transition-colors hover:bg-cyan-500/10 disabled:opacity-50"
          >
            <div className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
              <span className="text-sm font-semibold">Two-way (safest)</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Push local first, then pull. Nothing is lost.
            </p>
          </button>

          {/* Push only */}
          <button
            type="button"
            disabled={syncing}
            onClick={() => handle(onPushOnly)}
            className="flex flex-col gap-1 rounded-md border p-3 text-left transition-colors hover:bg-muted/50 disabled:opacity-50"
          >
            <div className="flex items-center gap-2">
              <ArrowUp className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-semibold">Push only</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Send local → Sheets. Overwrites the Sheet.
            </p>
          </button>

          {/* Pull only */}
          <button
            type="button"
            disabled={syncing}
            onClick={() => handle(onPullOnly)}
            className="flex flex-col gap-1 rounded-md border border-amber-500/30 p-3 text-left transition-colors hover:bg-amber-500/5 disabled:opacity-50"
          >
            <div className="flex items-center gap-2">
              <ArrowDown className="h-4 w-4 text-amber-600 dark:text-amber-500" />
              <span className="text-sm font-semibold">Pull only</span>
              <AlertTriangle className="h-3.5 w-3.5 text-amber-600 dark:text-amber-500" />
            </div>
            <p className="text-xs text-muted-foreground">
              Get Sheets → local. Overwrites local data.
            </p>
          </button>

          {syncing && (
            <p className="text-center text-xs text-muted-foreground">
              Syncing… please wait
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
