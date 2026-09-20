import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Brain } from "lucide-react"

// ─── DATA ────────────────────────────────────────────────

const NEURO_COMPARISON = [
  {
    aspect: "Motivation",
    typical: "Interest, importance, reward",
    adhd: "Interest, novelty, urgency, challenge",
  },
  {
    aspect: "Starting tasks",
    typical: "Initiate → do → finish",
    adhd: "Initiate only if dopamine is available",
  },
  {
    aspect: "Time perception",
    typical: "Feels linear and continuous",
    adhd: "Feels like 'now' and 'not now'",
  },
  {
    aspect: "Boredom",
    typical: "Uncomfortable",
    adhd: "Physically painful",
  },
  {
    aspect: "Focus",
    typical: "Can direct at will",
    adhd: "0% or 200% — nothing in between",
  },
  {
    aspect: "Working memory",
    typical: "Holds 5-7 thoughts",
    adhd: "Drops thoughts mid-task",
  },
  {
    aspect: "Reward response",
    typical: "Delayed rewards work",
    adhd: "Requires immediate rewards",
  },
  {
    aspect: "Emotional regulation",
    typical: "Emotions pass with time",
    adhd: "Emotions hit harder, fade faster",
  },
]

const MYTHS = [
  {
    myth: "You're just lazy.",
    reality:
      "Laziness is a choice. ADHD is a neurological difference in the dopamine system. The brain isn't refusing to work — it isn't getting the chemical signal to start.",
  },
  {
    myth: "You're procrastinating on purpose.",
    reality:
      "In ADHD, procrastination is a symptom of executive dysfunction, not avoidance. The task feels physically impossible to begin — until urgency forces a dopamine spike.",
  },
  {
    myth: "You're overthinking everything.",
    reality:
      "The ADHD brain struggles to filter information. Everything feels equally urgent and important. This is called analysis paralysis, and it's a feature of the brain, not a personality flaw.",
  },
  {
    myth: "You just don't care enough.",
    reality:
      "Often the opposite — you care too much. The gap isn't caring; it's the ability to translate caring into action. That gap is neurochemical.",
  },
  {
    myth: "You'd focus if you tried harder.",
    reality:
      "Effort isn't the bottleneck. Attention regulation, dopamine availability, and executive function are. Willpower cannot override neurochemistry — it can only work with it.",
  },
]

const RESEARCH = [
  {
    title: "Dopamine transporter density",
    finding:
      "PET scans show increased dopamine transporter (DAT) density in the striatum of adults with ADHD — meaning dopamine is cleared from the synapse too quickly.",
    source: "Volkow et al., 2007; Fusar-Poli et al., 2012",
  },
  {
    title: "Prefrontal cortex activity",
    finding:
      "fMRI studies show reduced activation in the prefrontal cortex during executive function tasks — especially inhibition, working memory, and planning.",
    source: "Bush et al., 1999; Cubillo et al., 2012",
  },
  {
    title: "Default Mode Network",
    finding:
      "The brain's 'resting' network fails to shut off during tasks, causing mind-wandering and task-unrelated thoughts even when you want to focus.",
    source: "Raichle, 2015; Sonuga-Barke & Castellanos, 2007",
  },
  {
    title: "Delay aversion",
    finding:
      "People with ADHD show stronger neural response to immediate rewards and steeply discount delayed rewards — this is measurable, not moral.",
    source: "Sonuga-Barke, 2002; Luman et al., 2005",
  },
  {
    title: "Medication effect",
    finding:
      "Stimulant medications increase synaptic dopamine and improve executive function in ~70% of cases, confirming dopamine's role in the condition.",
    source: "Faraone, 2015; Swanson et al., 2017",
  },
  {
    title: "Sleep and circadian rhythm",
    finding:
      "~75% of adults with ADHD report delayed sleep phase. Sleep deprivation worsens dopamine signalling, executive function, and emotional regulation.",
    source: "Van Veen et al., 2010; Bijlenga et al., 2013",
  },
]

const APP_FEATURES = [
  { feature: "XP as score", why: "Immediate feedback — dopamine-friendly" },
  { feature: "Tap buttons", why: "Reduces task initiation friction" },
  {
    feature: "Streaks with grace",
    why: "Prevents all-or-nothing shame spirals",
  },
  { feature: "No daily XP decay", why: "Never punishes you into hopelessness" },
  { feature: "Visible progress", why: "Makes effort feel worthwhile" },
  { feature: "Confetti on wins", why: "Instant reward, not delayed" },
  { feature: "One-tap logging", why: "No long forms, no friction" },
]

// ─── COMPONENT ───────────────────────────────────────────

export function ADHDDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="text-[10px] text-muted-foreground/60 underline underline-offset-2 transition-colors hover:text-muted-foreground"
        >
          ADHD Brain · Tap to learn more
        </button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] max-w-2xl overflow-x-hidden overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-cyan-500" />
            The ADHD Brain
          </DialogTitle>
          <DialogDescription>
            What's actually happening, and why this app is built this way.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-6 pt-2">
          {/* ─── 1. WHAT ADHD IS ──────────────────── */}
          <section className="flex flex-col gap-2">
            <h3 className="text-sm font-semibold">What ADHD actually is</h3>
            <p className="text-xs leading-relaxed text-muted-foreground">
              ADHD is not a deficit of attention. It's a difference in{" "}
              <span className="font-medium text-foreground">
                executive function
              </span>{" "}
              — the brain's ability to start, plan, prioritize, and finish.
            </p>
            <p className="text-xs leading-relaxed text-muted-foreground">
              You can focus — sometimes too much (hyperfocus). The problem is{" "}
              <span className="font-medium text-foreground">choosing</span> what
              to focus on, and{" "}
              <span className="font-medium text-foreground">starting</span> it.
            </p>
            <p className="text-xs leading-relaxed text-muted-foreground">
              ADHD is a neurodevelopmental condition affecting roughly{" "}
              <span className="font-medium text-foreground">5-7%</span> of
              children and{" "}
              <span className="font-medium text-foreground">2.5-5%</span> of
              adults worldwide. It's not caused by laziness, screens, or bad
              parenting. It's largely genetic.
            </p>
          </section>

          {/* ─── 2. NEURO COMPARISON ─────────────── */}
          <section className="flex flex-col gap-2">
            <h3 className="text-sm font-semibold">
              Neurodivergent vs Neurotypical
            </h3>
            <div className="flex flex-col gap-2">
              {NEURO_COMPARISON.map((row) => (
                <div
                  key={row.aspect}
                  className="flex flex-col gap-1.5 rounded-md border px-3 py-2.5"
                >
                  <p className="text-xs font-semibold text-cyan-600 dark:text-cyan-400">
                    {row.aspect}
                  </p>
                  <div className="grid grid-cols-[80px_1fr] gap-x-2 gap-y-1 text-xs">
                    <span className="text-muted-foreground">Typical:</span>
                    <span className="text-foreground/90">{row.typical}</span>
                    <span className="text-muted-foreground">ADHD:</span>
                    <span className="text-foreground/90">{row.adhd}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ─── 3. MYTHS ────────────────────────── */}
          <section className="flex flex-col gap-2">
            <h3 className="text-sm font-semibold">Common ADHD myths</h3>
            <div className="flex flex-col gap-2">
              {MYTHS.map((m) => (
                <div
                  key={m.myth}
                  className="flex flex-col gap-1 rounded-md bg-muted/50 px-3 py-2.5"
                >
                  <p className="text-xs font-semibold text-red-500 dark:text-red-400">
                    "{m.myth}"
                  </p>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    <span className="font-medium text-foreground">
                      Reality:
                    </span>{" "}
                    {m.reality}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* ─── 4. WHAT'S HAPPENING ──────────────── */}
          <section className="flex flex-col gap-2">
            <h3 className="text-sm font-semibold">What's really happening</h3>
            <p className="text-xs leading-relaxed text-muted-foreground">
              <span className="font-medium text-foreground">
                Executive function
              </span>{" "}
              lives in the prefrontal cortex — the part of the brain that plans,
              prioritizes, and controls impulses. It coordinates attention,
              working memory, and self-regulation.
            </p>
            <p className="text-xs leading-relaxed text-muted-foreground">
              In ADHD, dopamine signalling in this region is{" "}
              <span className="font-medium text-foreground">underpowered</span>.
              Dopamine isn't just "the pleasure chemical" — it's the{" "}
              <span className="font-medium text-foreground">
                motivation and reward-prediction chemical
              </span>
              . It's what makes effort feel worthwhile and points attention
              toward the next step.
            </p>
            <p className="text-xs leading-relaxed text-foreground">
              No dopamine → no motivation → no action.
            </p>
            <p className="text-xs leading-relaxed text-muted-foreground">
              This is why boring tasks feel impossible, interesting tasks become
              hyperfocus, rewards must be immediate, and deadlines are often the
              only thing that works.
            </p>
            <p className="text-xs leading-relaxed text-muted-foreground">
              This isn't a character flaw. It's a measurable, neurological
              difference.
            </p>
          </section>

          {/* ─── 5. RESEARCH ─────────────────────── */}
          <section className="flex flex-col gap-2">
            <h3 className="text-sm font-semibold">What the research says</h3>
            <div className="flex flex-col gap-2">
              {RESEARCH.map((r) => (
                <div
                  key={r.title}
                  className="flex flex-col gap-1 rounded-md border px-3 py-2.5"
                >
                  <p className="text-xs font-semibold text-cyan-600 dark:text-cyan-400">
                    {r.title}
                  </p>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {r.finding}
                  </p>
                  <p className="text-[10px] text-muted-foreground/60 italic">
                    {r.source}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* ─── 6. WHY ASCENT WORKS ─────────────── */}
          <section className="flex flex-col gap-2">
            <h3 className="text-sm font-semibold">Why Ascent works this way</h3>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Everything in this app is designed around how the ADHD brain
              actually works — not how it "should."
            </p>
            <div className="flex flex-col gap-1.5">
              {APP_FEATURES.map((f) => (
                <div
                  key={f.feature}
                  className="flex items-baseline justify-between gap-3 rounded-md bg-muted/50 px-3 py-2"
                >
                  <span className="text-xs font-medium">{f.feature}</span>
                  <span className="text-right text-xs text-muted-foreground">
                    {f.why}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  )
}
