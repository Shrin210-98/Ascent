import { type ReactNode } from "react"

interface StatsTransitionProps {
  /** true = showing stats, false = showing main */
  showStats: boolean
  mainPage: ReactNode
  statsPage: ReactNode
}

export function StatsTransition({
  showStats,
  mainPage,
  statsPage,
}: StatsTransitionProps) {
  return (
    <div className="relative overflow-hidden">
      {/* Main page */}
      <div
        className={[
          "transition-all duration-300 ease-out",
          showStats
            ? "pointer-events-none translate-x-[-100%] opacity-0"
            : "translate-x-0 opacity-100",
        ].join(" ")}
        aria-hidden={showStats}
      >
        {mainPage}
      </div>

      {/* Stats page */}
      <div
        className={[
          "absolute inset-0 transition-all duration-300 ease-out",
          showStats
            ? "translate-x-0 opacity-100"
            : "pointer-events-none translate-x-[100%] opacity-0",
        ].join(" ")}
        aria-hidden={!showStats}
      >
        {statsPage}
      </div>
    </div>
  )
}
