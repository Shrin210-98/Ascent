import { useRef, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
import { Button } from "@/components/ui/button"
import {
  HardDrive,
  Upload,
  Download,
  Trash2,
  AlertTriangle,
  ExternalLink,
  Info,
} from "lucide-react"
import {
  downloadBackup,
  parseBackupFile,
  backupToAppData,
  getBackupFilename,
} from "@/lib/backup"
import { format } from "date-fns"
import type { AppData } from "@/lib/types"

interface BackupDialogProps {
  data: AppData
  onReplace: (fresh: AppData) => void
  trigger?: React.ReactNode
}

export function BackupDialog({ data, onReplace, trigger }: BackupDialogProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [message, setMessage] = useState<{
    kind: "ok" | "err"
    text: string
  } | null>(null)
  const [confirmClear, setConfirmClear] = useState(false)
  const [showDriveHelp, setShowDriveHelp] = useState(false)

  const flashMessage = (kind: "ok" | "err", text: string) => {
    setMessage({ kind, text })
    setTimeout(() => setMessage(null), 4000)
  }

  const handleDownload = () => {
    try {
      downloadBackup(data)
      flashMessage("ok", "Backup downloaded — save it anywhere safe")
    } catch {
      flashMessage("err", "Download failed")
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const text = ev.target?.result as string
        const parsed = parseBackupFile(text)
        const fresh = backupToAppData(parsed)
        onReplace(fresh)
        flashMessage("ok", "Backup restored from file")
      } catch (err) {
        flashMessage("err", err instanceof Error ? err.message : "Invalid file")
      }
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
    reader.readAsText(file)
  }

  const handleClear = () => {
    try {
      localStorage.removeItem("ascent_data")
      localStorage.removeItem("ascent_google_token")
      window.location.reload()
    } catch {
      flashMessage("err", "Could not clear data")
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger ?? (
          <button
            type="button"
            className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent"
          >
            <HardDrive className="h-4 w-4" />
            Backup & Restore…
          </button>
        )}
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] w-[calc(100vw-2rem)] max-w-2xl overflow-x-hidden overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Backup & Restore</DialogTitle>
          <DialogDescription>
            Keep your data safe. Restore it anywhere.
          </DialogDescription>
        </DialogHeader>

        <div className="flex min-w-0 flex-col gap-4 pt-2">
          {/* ─── MESSAGE FLASH ───────────────────── */}
          {message && (
            <div
              className={[
                "rounded-md border px-3 py-2 text-xs",
                message.kind === "ok"
                  ? "border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-400"
                  : "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-400",
              ].join(" ")}
            >
              {message.text}
            </div>
          )}

          {/* ─── BACKUP ──────────────────────────── */}
          <section className="flex min-w-0 flex-col gap-3 rounded-md border p-4">
            <div className="flex items-center gap-2">
              <Download className="h-4 w-4 text-cyan-500" />
              <p className="text-sm font-semibold">Backup</p>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Downloads a JSON file with all your data. Save it anywhere —
              Google Drive, Dropbox, email, USB stick. Keep it as long as you
              want.
            </p>

            <Button
              variant="default"
              size="sm"
              onClick={handleDownload}
              className="w-full gap-1.5 sm:w-auto"
            >
              <Download className="h-3.5 w-3.5" />
              Download backup
            </Button>

            {/* ─── DRIVE INSTRUCTIONS ───────────── */}
            <div className="rounded-md border bg-muted/30 p-3">
              <button
                type="button"
                onClick={() => setShowDriveHelp((s) => !s)}
                className="flex w-full items-center justify-between gap-2 text-left"
              >
                <div className="flex items-center gap-2">
                  <Info className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-xs font-medium">
                    How to save to Google Drive
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {showDriveHelp ? "Hide" : "Show"}
                </span>
              </button>

              {showDriveHelp && (
                <ol className="mt-3 flex flex-col gap-2 pl-1 text-xs text-muted-foreground">
                  <li className="flex gap-2">
                    <span className="font-medium text-foreground">1.</span>
                    <span>
                      Click{" "}
                      <span className="font-medium text-foreground">
                        Download backup
                      </span>{" "}
                      above.
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-medium text-foreground">2.</span>
                    <span>Find the file in your Downloads folder.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-medium text-foreground">3.</span>
                    <span>
                      Open{" "}
                      <a
                        href="https://drive.google.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-cyan-600 underline-offset-2 hover:underline dark:text-cyan-400"
                      >
                        drive.google.com
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-medium text-foreground">4.</span>
                    <span>
                      Drag the file into Drive, or click{" "}
                      <span className="font-medium text-foreground">
                        New → File upload
                      </span>
                      .
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-medium text-foreground">5.</span>
                    <span>
                      Done. The file lives in your Drive forever. Rename it
                      anytime.
                    </span>
                  </li>
                </ol>
              )}
            </div>
          </section>

          {/* ─── RESTORE ─────────────────────────── */}
          <section className="flex min-w-0 flex-col gap-3 rounded-md border p-4">
            <div className="flex items-center gap-2">
              <Upload className="h-4 w-4 text-cyan-500" />
              <p className="text-sm font-semibold">Restore</p>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Pick a backup file from this device. If the backup is on Google
              Drive, download it first from{" "}
              <a
                href="https://drive.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-0.5 text-cyan-600 underline-offset-2 hover:underline dark:text-cyan-400"
              >
                drive.google.com
                <ExternalLink className="h-3 w-3" />
              </a>
              .
            </p>

            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="w-full gap-1.5 sm:w-auto"
            >
              <Upload className="h-3.5 w-3.5" />
              Choose file
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={handleFileChange}
            />

            <div className="rounded-md border bg-muted/30 px-3 py-2 text-[11px] leading-relaxed text-muted-foreground">
              <span className="font-medium text-foreground">⚠ Heads up:</span>{" "}
              Restoring replaces your current local data with the backup. Make
              sure you've got a recent copy first.
            </div>
          </section>

          {/* ─── DANGER ZONE ─────────────────────── */}
          <section className="flex min-w-0 flex-col gap-3 rounded-md border border-red-500/30 p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <p className="text-sm font-semibold text-red-600 dark:text-red-400">
                Danger Zone
              </p>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Clear all data on this device. Your Google Sheet and any
              downloaded backups are untouched. Cannot be undone.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setConfirmClear(true)}
              className="w-full gap-1.5 border-red-500/30 text-red-600 hover:bg-red-500/10 sm:w-auto dark:text-red-400"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Clear local data
            </Button>
          </section>

          {/* ─── FOOTER INFO ─────────────────────── */}
          <p className="pt-1 text-center text-[10px] text-muted-foreground">
            Tip: back up once a month. Set a reminder in your calendar.
          </p>
        </div>
      </DialogContent>

      <AlertDialog open={confirmClear} onOpenChange={setConfirmClear}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear all local data?</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="flex flex-col gap-2 pt-2 text-sm">
                <p>
                  This removes all data from{" "}
                  <span className="font-semibold">this device only</span>.
                </p>
                <p className="text-muted-foreground">
                  Your Google Sheet and downloaded backups are untouched.
                </p>
                <p className="font-medium text-red-600 dark:text-red-400">
                  This cannot be undone.
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleClear}
              className="bg-red-600 hover:bg-red-700"
            >
              Clear everything
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  )
}
