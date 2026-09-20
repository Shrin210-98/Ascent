import { useEffect, useState } from "react"

interface Particle {
  id: string
  left: number
  delay: number
  duration: number
  color: string
  size: number
  rotate: number
}

const COLORS = [
  "#22c55e", // green
  "#16a34a",
  "#eab308", // yellow
  "#f97316", // orange
  "#3b82f6", // blue
  "#a855f7", // purple
]

interface ConfettiProps {
  /** When this increments, confetti fires */
  trigger: number
  /** How long to render before cleaning up (ms) */
  duration?: number
}

export function Confetti({ trigger, duration = 3500 }: ConfettiProps) {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    if (trigger === 0) return

    // Generate particles
    const next: Particle[] = Array.from({ length: 80 }, (_, i) => ({
      id: `${trigger}-${i}`,
      left: Math.random() * 100,
      delay: Math.random() * 400,
      duration: 2000 + Math.random() * 1500,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: 6 + Math.random() * 8,
      rotate: Math.random() * 360,
    }))

    setParticles(next)

    const t = setTimeout(() => setParticles([]), duration)
    return () => clearTimeout(t)
  }, [trigger, duration])

  if (particles.length === 0) return null

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[100] overflow-hidden"
      aria-hidden="true"
    >
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute top-[-10vh] block"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: Math.random() > 0.5 ? "50%" : "2px",
            transform: `rotate(${p.rotate}deg)`,
            animation: `confetti-fall ${p.duration}ms ${p.delay}ms ease-in forwards`,
          }}
        />
      ))}
    </div>
  )
}
