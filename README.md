# 🗺️ Timmy's Generic World Game (TGWG)

A premium, real-time 2D multiplayer world conquest strategy game set across historical eras, featuring custom empire designation, tactical alliances, undercover espionage, advanced pathfinding, and styled as a glowing phosphor military radar console.

---

## 🎮 Game Features & Campaign Mechanics

### 🏛️ Custom Empire Designations & Drafting
- **Custom Empire Names**: Designate a custom title for your empire (e.g. *Obsidian Dominion*, *Crimson Imperium*) or inherit historical country titles. Includes an in-lobby and in-draft **`🎲` Random Empire Name Generator**.
- **Rock Paper Scissors Drafting**: Campaigns begin with a Rock Paper Scissors selection to determine starting territory selection order.
- **Star Brackets & Guerrilla Handicap**:
  - **3-Star Class (★3)**: Superpowers with maximum infrastructure.
  - **2-Star Class (★2)**: Regional powers with balanced positions.
  - **1-Star Class (★1 - Guerrilla)**: Receives **+15 extra starting troops** per node and a passive **+30% Guerrilla Defense bonus** on all home nodes!

### ⚡ Combat & Strategic Infrastructure
- **BFS Empire Pathfinding**: Transport troops instantly between any connected nodes in your empire network, and launch border attacks against rival or neutral nodes.
- **Zero-Battle Neutral Claims**: Gray territories are unclaimed neutral zones. Marching forces to a gray node claims it instantly with **zero defender resistance or casualties**.
- **Capital Integrity & Government Collapse**:
  - **Capitals (★)**: Produce +1.0 troops/s.
  - **Cities (🏙)**: Produce +0.8 troops/s.
  - **Military Bases (⚔)**: Produce +0.4 troops/s with built-in fortress defense.
  - **Government Collapse**: If your Capital node is captured, troop generation is cut by **-50% across all remaining empire sectors** until reclaimed!
- **Vulnerability Cooldown**: Launching troops leaves origin nodes disorganized for **5 seconds** (flashing red): troop generation halts and defense drops to **0.5x (Double Damage taken)**.
- **Fortification Mode**: Toggle Fortify on key nodes for **+50% defense** (+100% / 2.0x for 1★ class) at the cost of -50% troop production.

### 🕵️ Espionage & Coalitions
- **Lewis & Clark Espionage**: Send undercover scouts for 5 troops with 50/50 resolution:
  - **Success (50%)**: Reveals exact defender counts & fortification status, and grants a **+25% attack bonus** (bypasses natural barriers like the Alps or Great Wall).
  - **Captured (50%)**: Scout is executed, target mobilizes **+10 emergency troops**, launches a counter-strike, and triggers immediate war.
- **Coalitions & Shared Victory**: Form alliances via the scoreboard to share open borders. If all surviving players enter a formal Coalition, **Allied Victory** is declared! Disbanding a coalition triggers a 10-second Truce warning.

---

## ⌨️ Controls & Hotkeys

- **Select Node**: Left-click any node to open **NODE TELEMETRY** details.
- **Pan Map**: Left-click & drag empty map space.
- **Zoom Map**: Mouse scroll wheel (or floating zoom controls).
- **Keyboard Shortcuts**:
  - `[A]`: Toggle Launch Expedition / Attack mode
  - `[S]`: Toggle Lewis & Clark Scout mode
  - `[F]`: Toggle Fortify Shields
  - `[Esc]` or `[Space]`: Deselect current node
  - `[H]`: Toggle Hotkey Help bar

---

## 🚀 Setup & Commands

### 1. Install Dependencies
```bash
npm install
```

### 2. Development Server
Launch the local dev server with hot reloading:
```bash
npm run dev
```

### 3. Build for Production
Run full TypeScript type-checking (`tsc -b`) and bundle for production (`vite build`):
```bash
npm run build
```

### 4. Preview Build Locally
Preview the production build output:
```bash
npm run preview
```

---

## 🛠️ Technology Stack
- **Framework**: [Vite](https://vite.dev) + [React 19](https://react.dev) + [TypeScript](https://www.typescriptlang.org)
- **Styling**: Vanilla CSS + CSS Variables (Phosphor CRT radar theme & era themes)
- **Networking**: WebSockets / Broadcast Channels (Multiplayer & Offline AI Bots)
- **Icons**: Lucide React
