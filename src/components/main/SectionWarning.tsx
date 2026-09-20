import { AlertTriangle, Info, Flame } from "lucide-react"
import type { WarningLevel } from "@/lib/warnings"

interface SectionWarningProps {
  level: WarningLevel
  message: string
  icon?: "info" | "warn" | "flame"
}

const STYLES: Record<WarningLevel, string> = {
  info: "border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-300",
  warn: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  danger: "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300",
}

export function SectionWarning({
  level,
  message,
  icon = "warn",
}: SectionWarningProps) {
  const Icon = icon === "info" ? Info : icon === "flame" ? Flame : AlertTriangle

  return (
    <div
      className={`flex items-start gap-2 rounded-md border px-3 py-2 text-xs ${STYLES[level]}`}
    >
      <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0" />
      <p className="leading-snug">{message}</p>
    </div>
  )
}
