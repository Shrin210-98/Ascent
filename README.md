# Ascent — The Dopamine Quest

A mobile-installable, gamified XP tracker for work, chores, and exercise. Built for an ADHD brain.

**Install it on your phone like a native app. Works offline. Syncs to Google Sheets.**

---

## 📱 What Is It

Ascent turns boring daily tasks into a quiet, satisfying game. Every productive action earns **XP**. Every day is a new level. Every streak is a power-up.

No external rewards. No gimmicks. The number going up **is** the reward.

Designed specifically for an ADHD brain:
- Immediate visual feedback on every action
- Streaks with a grace period (one missed day won't break them)
- Warnings that only appear when they're actionable
- Fast input — tap buttons, don't type
- Mobile-first — always in your pocket

---

## ✨ Features

### Core Game Loop
- **XP system** — earn XP from work, chores, and exercise
- **8 levels** — Initiate → Apprentice → Earner → Hunter → Money Machine → Quest Master → Legend → Mythic
- **Lifetime XP** — accumulates forever, never goes down
- **Monthly tiers** — Bronze (750) → Silver (1,000) → Gold (1,500) → Platinum (2,000) → Diamond (3,000)

### XP Sources
| Source | XP |
|--------|-----|
| Work | 10 XP per hour · +20 bonus at 5+ hours |
| Chores | 5–25 XP per chore · +10 bonus at 3+ chores |
| Exercise | 5 XP per set · +20 bonus if all 4 categories hit |

### Streaks
- **Three independent streaks:** work, chores, exercise
- **Grace rule** — today doesn't break the streak if you haven't done the thing yet
- **Milestone toasts** at 7 / 30 / 90 days
- **Never lose a level** — only XP toward the next level decays

### Dashboard
- Big hero number: today's XP
- Level + title
- Progress bar toward next level
- Three streak counters
- Mini 7-day dot strip

### Input Cards
- **Work** — grouped `−1h` / `+0.5h` / `+1h` buttons, 10-segment visual meter, green pulse on tap
- **Chores** — default 10-chore checklist with per-chore XP
- **Exercise** — `Push / Pull / Legs / Weights` set tracking

### Stats Page
- **Monthly summary** — hero XP, tier badge, level start/end, active days, best day
- **Streak summary** — current counts
- **Activity breakdown** — work hours, chores count, exercise sets
- **XP split** — stacked bar chart (work/chores/exercise)
- **Calendar** — color-coded by XP, month navigation
- **Cumulative XP area chart** — cyan gradient with tooltip
- **Weekly dots** — last 7 days as pills
- **Exercise log dialog** — full month in 2-column layout, copyable text

### Feedback & Polish
- **Confetti on level-up** — fires when crossing a threshold
- **Confetti at 10-hour work** — celebrate a max-effort day
- **Save pulse** — green glow when data changes
- **Green flash** — number pulses when adjusted
- **Milestone toasts** — celebrate streaks

### Warnings (ADHD-friendly)
- **Amber warnings** inside cards only after 6 PM if a section is empty
- **Red streak-risk warnings** on Dashboard when a streak is at risk
- **Backdated badge** when editing a past day
- **No nagging before 6 PM** — prevents morning anxiety

### Data & Sync
- **localStorage** — instant saves, works offline
- **Google Sheets sync** — auto-sync with 1.5s debounce
- **Pull / Push** manual controls
- **Auto-reconnect prompt** when OAuth token expires
- **Sign-out confirmation dialog**

### Design
- **Mobile-first, responsive**
- **Dark/light mode** toggle
- **Single-page, no routing** — Stats slides in with animation
- **Back button handled** via history state
- **Custom logo** — mountain range in growth pattern
- **PWA** — installable on Android and iOS

---

## 🚀 Installation

### As a PWA (recommended)

**Android:**
1. Open the deployed URL in Chrome
2. Tap the menu → **"Install app"** or **"Add to Home screen"**
3. Icon appears on your home screen
4. Opens full-screen, no browser UI

**iOS:**
1. Open the URL in Safari
2. Tap **Share → Add to Home Screen**
3. Icon appears on your home screen

**Desktop (Chrome/Edge):**
1. Open the URL
2. Click the install icon in the address bar
3. Opens in a standalone window

### Local Development

```bash
# Clone the repo
git clone <repo-url>
cd ascent

# Install dependencies
npm install

# Set up environment variables
# Create .env.local with:
# VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
# VITE_SHEET_ID=your-google-sheet-id

# Run dev server
npm run dev

# Build for production
npm run build


## 🐛 Known Limitations

- **Token expiry** — Google OAuth tokens expire hourly. An auto-reconnect prompt appears when this happens.
- **Debounced sync** — Changes sync ~1.5s after the last edit, not instantly.
- **Sheets dependency** — Google Sheets must remain accessible. If the sheet is deleted, sync fails (local data stays safe).
- **No offline sync queue** — If offline, changes save locally but don't retry until the next edit.
- **Pull overwrites local** — Pulling from Sheets replaces local data. Push first if you have unsynced changes.

---

## 🙏 Acknowledgements

### Built with

- React + Vite
- shadcn/ui
- Recharts
- Tailwind CSS
- Google Sheets API

### Inspired by

- The Zeigarnik Effect (unfinished tasks drive completion)
- Implementation Intentions (Gollwitzer, 1999)
- Gamification and Dopamine (Hamari et al., 2014)
- ADHD-friendly design principles