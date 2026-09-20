import { useEffect, useRef, useState, type ReactNode } from "react"

interface SavePulseProps {
  /** Any value. When it changes, pulse fires. */
  value: unknown
  children: ReactNode
  /** Optional className applied to wrapper */
  className?: string
}

export function SavePulse({ value, children, className }: SavePulseProps) {
  const [pulsing, setPulsing] = useState(false)
  const prevRef = useRef(value)

  useEffect(() => {
    if (prevRef.current !== value) {
      prevRef.current = value
      setPulsing(true)
      const t = setTimeout(() => setPulsing(false), 600)
      return () => clearTimeout(t)
    }
  }, [value])

  return (
    <div
      className={`rounded-lg ${pulsing ? "save-pulse" : ""} ${className ?? ""}`}
    >
      {children}
    </div>
  )
}
