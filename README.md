# 🗺️ Timmy's Generic World Game (TGWG)

A premium, real-time 2D multiplayer world conquest strategy game set across historical eras, featuring tactical alliances, undercover espionage, advanced pathfinding, and styled as a glowing phosphor military radar console.

---

## 🎮 Game Features

### ⚡ Core Mechanics
- **BFS Empire Pathfinding**: Transport troops instantly between any connected territories in your empire, and launch border attacks against rival or neutral nodes connected to any part of your empire network.
- **Zero-Battle Neutral Claims**: Gray territories on the map are unclaimed neutral zones. Marching forces to a gray node claims it instantly with **zero defender resistance or troop casualties**, making early-game expansion snappy and rewarding.
- **Lewis & Clark Espionage**: Send undercover explorers to spy on adjacent territories. Success reveals exact defender counts and grants a **+25% attack bonus** (bypasses barriers). Capture triggers war, breaks alliances, and causes an immediate enemy counter-strike.
- **Tactical Barriers**: Key borders (e.g. *English Channel*, *The Alps*, *Pacific Ocean*) act as defensive barriers, multiplying defense for the holder unless scouted beforehand.
- **Vulnerability Cooldown**: Deploying troops leaves origin nodes disorganized and vulnerable (flashing red) for 5 seconds—freezing troop production and cutting defense in half.

### 📱 Interface & Experience
- **Interactive Zoom & Pan**: Click/touch and drag on the map background to slide the viewport. Use floating zoom controls to magnify dense tactical regions (up to 4x) or reset the view instantly.
- **Tuned Tap Targets**: Node hitboxes are optimized (Radius 20) for forgiving mobile taps without causing overlaps in dense clusters (e.g., Europe and East Asia).
- **Responsive Layout**: Sidebar grids collapse smoothly with custom handle controls (`◀` and `▶`) to maximize map real estate on any screen resolution.
- **Corner Badges**: Compact side badges for Action Mode (`top-left`) and Combat Resolution Toasts (`top-right`) keep the center of the screen completely clean and unblocked.
- **6 Historical Eras**: Match campaigns across Roman Antiquity, World War I, World War II, the Cold War, Modern Day, and Future Cyber Scenarios.

---

## 🚀 Setup & Installation

### 1. Clone & Install Dependencies
Navigate to the project root and install package dependencies:
```bash
npm install
```

### 2. Configure Database & Realtime (Optional)
The game comes **pre-configured out-of-the-box** with Supabase credentials. If you want to deploy your own database, run the SQL schema in [schema.sql](schema.sql) on your Supabase instance, then input your keys in the **Tactical Server Settings** drawer at the bottom of the main menu.

### 3. Run Locally
Launch the local development server:
```bash
npm run dev
```
Open `http://localhost:5173` in one or more browser tabs to play!

---

## 🛠️ Technology Stack
- **Framework**: [Vite](https://vite.dev) + [React](https://react.dev) + [TypeScript](https://www.typescriptlang.org)
- **Styling**: Tailwind CSS + Custom CSS Variables (retro-phosphor CRT radar theme)
- **Database/Realtime**: [Render Realtime Broadcast Channels]
- **Icons**: Lucide React
