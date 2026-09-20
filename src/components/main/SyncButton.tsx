import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Cloud, CloudOff, RefreshCw, LogOut } from "lucide-react"
import { useSheets } from "@/hooks/useSheets"
import { useAppData } from "@/hooks/useAppData"

interface SyncButtonProps {
  onPull: (data: ReturnType<typeof useAppData>["data"]) => void
}

export function SyncButton({ onPull }: SyncButtonProps) {
  const { isLoggedIn, syncing, login, logout, pullFromSheets } = useSheets()
  const { data } = useAppData(new Date())

  if (!isLoggedIn) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => login()}
        className="w-full"
      >
        <Cloud className="mr-2 h-4 w-4" />
        Connect Google Sheets
      </Button>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Badge variant="secondary" className="gap-1">
        {syncing ? (
          <>
            <RefreshCw className="h-3 w-3 animate-spin" />
            Syncing
          </>
        ) : (
          <>
            <Cloud className="h-3 w-3 text-green-600" />
            Synced
          </>
        )}
      </Badge>
      <Button
        variant="ghost"
        size="sm"
        onClick={async () => {
          const fresh = await pullFromSheets()
          if (fresh) onPull(fresh)
        }}
      >
        Pull
      </Button>
      <Button variant="ghost" size="icon" onClick={logout} className="h-8 w-8">
        <LogOut className="h-3.5 w-3.5" />
      </Button>
    </div>
  )
}
