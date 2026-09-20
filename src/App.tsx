import { useState } from "react"
import { GoogleOAuthProvider } from "@react-oauth/google"
import { Header } from "@/components/main/Header"
import { Dashboard } from "@/components/main/Dashboard"
import { WorkCard } from "@/components/main/WorkCard"
import { ChoresCard } from "@/components/main/ChoresCard"
import { ExerciseCard } from "@/components/main/ExerciseCard"
import { Confetti } from "@/components/main/Confetti"
import { LevelUpToast } from "@/components/main/LevelUpToast"
import { StreakToast } from "@/components/main/StreakToast"
import { SavePulse } from "@/components/main/SavePulse"
import { StatsPage } from "@/components/stats/StatsPage"
import { StatsTransition } from "@/components/stats/StatsTransition"
import { useAppData } from "@/hooks/useAppData"
import { useLevelUp } from "@/hooks/useLevelUp"
import { useStreakMilestones } from "@/hooks/useStreakMilestones"
import { MiniWeeklyDots } from "./components/main/MiniWeeklyDots"
import { BackdatedBadge } from "./components/main/BackdatedBadge"

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string

function Inner() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [showStats, setShowStats] = useState(false)

  const {
    data,
    day,
    lifetimeXP,
    dayXP,
    level,
    streaks,
    setWorkHours,
    setWorkNotes,
    toggleChore,
    setExercise,
    replaceData,
  } = useAppData(selectedDate)

  const levelUp = useLevelUp(level.number, level.title)
  const { milestone, clear } = useStreakMilestones(streaks)

  // ─── MAIN PAGE ─────────────────────────────────────
  const mainPage = (
    <div className="min-h-svh bg-background">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 p-4 sm:p-6">
        <Header
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          level={level}
          lifetimeXP={lifetimeXP}
          data={data}
          onPull={replaceData}
          onOpenStats={() => setShowStats(true)}
        />

        <Dashboard
          level={level}
          lifetimeXP={lifetimeXP}
          dayXP={dayXP}
          streaks={streaks}
          selectedDate={selectedDate}
          day={day}
        />

        <MiniWeeklyDots data={data} />
        <BackdatedBadge selectedDate={selectedDate} />
        <SavePulse value={JSON.stringify(day.sets)}>
          <ExerciseCard sets={day.sets} onChange={setExercise} />
        </SavePulse>

        <SavePulse value={`${day.workHours}|${day.workNotes}`}>
          <WorkCard
            workHours={day.workHours}
            workNotes={day.workNotes}
            onHoursChange={setWorkHours}
            onNotesChange={setWorkNotes}
          />
        </SavePulse>

        <SavePulse value={JSON.stringify(day.completedChores)}>
          <ChoresCard
            completedChores={day.completedChores}
            onToggle={toggleChore}
          />
        </SavePulse>

        <footer className="pb-4 text-center text-xs text-muted-foreground">
          Press <kbd className="rounded border px-1.5 py-0.5 font-mono">d</kbd>{" "}
          to toggle dark mode
        </footer>
      </div>
    </div>
  )

  // ─── STATS PAGE ────────────────────────────────────
  const statsPage = (
    <StatsPage
      data={data}
      day={day}
      selectedDate={selectedDate}
      onDateChange={setSelectedDate}
      level={level}
      streaks={streaks}
      onClose={() => setShowStats(false)}
    />
  )

  return (
    <>
      <Confetti trigger={levelUp.trigger} />
      <LevelUpToast level={levelUp.newLevel} title={levelUp.newTitle} />
      <StreakToast milestone={milestone} onDismiss={clear} />

      <StatsTransition
        showStats={showStats}
        mainPage={mainPage}
        statsPage={statsPage}
      />
    </>
  )
}

export function App() {
  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <Inner />
    </GoogleOAuthProvider>
  )
}

export default App
