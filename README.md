# 🏓 Ping Pong Leaderboard

A real-time Elo-based ping pong leaderboard for you and your friends. Log matches, track rankings, view player profiles, and see who's on a hot streak.

---

## Features

- **Elo rating system** — beating a higher-ranked player earns more points than beating a lower-ranked one
- **Real-time updates** — data syncs instantly across all devices via Firebase
- **Player profiles** — click any player to see their Elo history chart, win streak, and best win
- **Streak indicators** — 🔥 for win streaks, 🥶 for loss streaks on the leaderboard
- **Match history** — last 50 matches logged with Elo changes
- **Rank tiers** — Rookie → Player → Expert → Master → Grand Master
- **Responsive** — works on desktop, tablet, and mobile

---

## Tech Stack

- **React** — UI
- **Vite** — build tool and dev server
- **Firebase Firestore** — real-time cloud database
- **Recharts** — Elo history line chart
- **Vitest** — unit tests
- **Playwright** — end-to-end tests

---

## Project Structure

```
src/
├── App.jsx                  # Root component — state & Firebase logic
├── firebase.js              # Firebase config and db export
├── utils/
│   ├── elo.js               # calcElo, getRank, DEFAULT_ELO
│   └── stats.js             # getStreak, getBestWin, getEloHistory
├── styles/
│   └── global.js            # All CSS
└── components/
    ├── Header.jsx
    ├── Tabs.jsx
    ├── Rankings.jsx          # Leaderboard with streak badges
    ├── LogMatch.jsx          # Match submission form
    ├── History.jsx           # Match history list
    ├── AddPlayers.jsx        # Add/remove players
    └── PlayerProfile.jsx     # Profile modal with chart and stats
e2e/
└── leaderboard.spec.js      # Playwright E2E tests
src/tests/
├── setup.js
├── elo.test.js
├── firebase.test.js
└── components/
    ├── Rankings.test.jsx
    ├── LogMatch.test.jsx
    └── AddPlayers.test.jsx
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- A Firebase project with Firestore enabled

### Installation

```bash
git clone https://github.com/YOUR_USERNAME/ping-pong.git
cd ping-pong
npm install
```

### Firebase Setup

1. Create a project at [firebase.google.com](https://firebase.google.com)
2. Enable Firestore in test mode
3. Replace the config in `src/firebase.js` with your own project credentials

### Run locally

```bash
npm run dev
```

App will be running at `http://localhost:5173`

---

## Running Tests

**Unit tests:**
```bash
npm test
```

**End-to-end tests** (requires dev server running):
```bash
npx playwright test

# Run with browser visible
npx playwright test --headed
```

---

## Deployment

This project is deployed on Vercel. Every push to `main` triggers an automatic redeploy.

To deploy your own instance:
1. Push the repo to GitHub
2. Import it at [vercel.com](https://vercel.com)
3. Vercel auto-detects Vite — just hit Deploy

---

## How Elo Works

Each player starts at **1000 Elo**. After every match:

- The winner gains points, the loser loses the same amount
- Beating a higher-rated player = bigger gain
- Beating a lower-rated player = smaller gain
- K-factor is set to **32** — meaning the maximum swing per match is 32 points

**Rank thresholds:**

| Rank | Elo |
|------|-----|
| 🥉 Rookie | < 950 |
| 🎯 Player | 950 – 1099 |
| ⚡ Expert | 1100 – 1249 |
| 💎 Master | 1250 – 1399 |
| 👑 Grand Master | 1400+ |

---

## Contributing

This is a private friends leaderboard — no auth required. Anyone with the URL can add players and log matches. Keep it honest! 🏓