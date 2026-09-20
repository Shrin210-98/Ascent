import { useState } from "react"
import { GoogleOAuthProvider } from "@react-oauth/google"
import { Header } from "@/components/main/Header"
import { Dashboard } from "@/components/main/Dashboard"
import { CalendarView } from "@/components/main/CalendarView"
import { WorkCard } from "@/components/main/WorkCard"
import { ChoresCard } from "@/components/main/ChoresCard"
import { ExerciseCard } from "@/components/main/ExerciseCard"
import { useAppData } from "@/hooks/useAppData"

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string

function Inner() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

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

  return (
    <div className="min-h-svh bg-background">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 p-4 sm:p-6">
        <Header
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          level={level}
          lifetimeXP={lifetimeXP}
          data={data}
          onPull={replaceData}
        />

        <Dashboard
          level={level}
          lifetimeXP={lifetimeXP}
          dayXP={dayXP}
          streaks={streaks}
          selectedDate={selectedDate}
          day={day}
        />

        <CalendarView
          data={data}
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
        />

        <ExerciseCard sets={day.sets} onChange={setExercise} />

        <WorkCard
          workHours={day.workHours}
          workNotes={day.workNotes}
          onHoursChange={setWorkHours}
          onNotesChange={setWorkNotes}
        />

        <ChoresCard
          completedChores={day.completedChores}
          onToggle={toggleChore}
        />

        <footer className="pb-4 text-center text-xs text-muted-foreground">
          Press <kbd className="rounded border px-1.5 py-0.5 font-mono">d</kbd>{" "}
          to toggle dark mode
        </footer>
      </div>
    </div>
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