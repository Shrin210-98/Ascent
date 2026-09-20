import { Sparkles } from "lucide-react"

interface LevelUpToastProps {
  level: number | null
  title: string | null
}

export function LevelUpToast({ level, title }: LevelUpToastProps) {
  if (level === null || title === null) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-[101] flex items-center justify-center p-4">
      <div className="animate-in rounded-2xl border-2 border-primary/30 bg-background/95 px-8 py-6 text-center shadow-2xl backdrop-blur-sm duration-500 zoom-in-95 fade-in">
        <Sparkles className="mx-auto mb-2 h-8 w-8 text-primary" />
        <p className="text-xs tracking-widest text-muted-foreground uppercase">
          Level {level}
        </p>
        <p className="mt-1 text-2xl font-bold">{title}</p>
        <p className="mt-2 text-xs text-muted-foreground">You ascended.</p>
      </div>
    </div>
  )
}
