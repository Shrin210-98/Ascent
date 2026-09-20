interface QuoteContext {
  todayXP: number
  activeTasks: number
}

const EMPTY_DAY_QUOTES = [
  "One action. Then the next.",
  "The hardest part is the first five minutes.",
  "You don't have to feel like it. You just have to start.",
  "Start small. Stay steady.",
  "One small thing is enough.",
]

const LOW_OUTPUT_QUOTES = [
  "Small things compound. Every day counts.",
  "Half-done is still progress.",
  "Done is better than perfect.",
  "You don't need motivation. You need momentum.",
  "Progress, not perfection.",
]

const HIGH_OUTPUT_QUOTES = [
  "You're building something.",
  "Future you thanks present you.",
  "You went all in today.",
  "Consistency beats intensity.",
  "The body remembers.",
]

const GENERIC_QUOTES = [
  "You are not lazy. You are building a system.",
  "Effort today is ease tomorrow.",
  "Discipline is remembering what you want.",
  "Showing up is the win.",
  "Every streak started with day one.",
]

const pick = (arr: string[]): string =>
  arr[Math.floor(Math.random() * arr.length)]

export const pickQuote = (context?: QuoteContext): string => {
  if (!context) return pick(GENERIC_QUOTES)

  const { todayXP, activeTasks } = context

  if (todayXP === 0) return pick(EMPTY_DAY_QUOTES)
  if (todayXP < 50) return pick(LOW_OUTPUT_QUOTES)
  if (activeTasks >= 2) return pick(HIGH_OUTPUT_QUOTES)
  return pick(GENERIC_QUOTES)
}
