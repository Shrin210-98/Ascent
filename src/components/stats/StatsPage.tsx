import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CalendarView } from "@/components/main/CalendarView"
import { XPGrowthChart } from "./XPGrowthChart"
import { StatsSummary } from "./StatsSummary"
import { WeeklyDots } from "./WeeklyDots"
import type { AppData, DayData, LevelInfo, Streaks } from "@/lib/types"

interface StatsPageProps {
  data: AppData
  day: DayData
  selectedDate: Date
  onDateChange: (d: Date) => void
  level: LevelInfo
  streaks: Streaks
  onClose: () => void
}

export function StatsPage({
  data,
  day,
  selectedDate,
  onDateChange,
  level,
  streaks,
  onClose,
}: StatsPageProps) {
  return (
    <div className="flex min-h-svh flex-col bg-background">
      {/* ─── STICKY HEADER ───────────────────────── */}
      <header className="sticky top-0 z-10 flex items-center gap-2 border-b bg-background/95 px-4 py-3 backdrop-blur sm:px-6">
        <Button variant="ghost" size="icon" onClick={onClose} aria-label="Back">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-lg font-semibold">Stats</h1>
      </header>

      {/* ─── SCROLLABLE CONTENT ──────────────────── */}
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 p-4 sm:p-6">
        {/* 1. Summary — hero at top */}
        <div className="animate-in delay-0 duration-300 fade-in slide-in-from-bottom-2">
          <StatsSummary
            data={data}
            day={day}
            selectedDate={selectedDate}
            level={level}
            streaks={streaks}
          />
        </div>
        {/* 2. Calendar */}
        <div className="animate-in delay-75 duration-300 fade-in slide-in-from-bottom-2">
          <CalendarView
            data={data}
            selectedDate={selectedDate}
            onDateChange={onDateChange}
          />
        </div>
        {/* 3. XP Growth Chart */}
        <div className="animate-in delay-150 duration-300 fade-in slide-in-from-bottom-2">
          <XPGrowthChart data={data} />
        </div>
        {/* 4. Weekly Dots */}
        <div className="animate-in delay-200 duration-300 fade-in slide-in-from-bottom-2">
          <WeeklyDots data={data} />
        </div>
      </div>
    </div>
  )
}
