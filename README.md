# NexusFlow — Modern Productivity & Focus Studio

NexusFlow is a high-performance, aesthetically refined productivity workspace combining an interactive drag-and-drop **Kanban Board**, a **Habit Discipline Matrix**, an ambient **Pomodoro Focus Studio** (with synthesized binaural/ambient audio), and real-time **Velocity Analytics**.

---

## 🌟 Key Features

1. **Interactive Kanban Board**:
   - 4-lane workflow: *Backlog*, *In Progress*, *In Review*, and *Completed*.
   - Native HTML5 Drag-and-Drop with visual drop-zone feedback.
   - Quick-move dropdown selector for mobile and keyboard accessibility.
   - Priority filters (*Urgent*, *High*, *Medium*, *Low*), tag filters, and global instant search.

2. **Habit Discipline Matrix**:
   - 7-day rolling matrix with individual streak counters.
   - Categorized routines (Engineering, Mind & Learning, Fitness & Health, Focus & Flow).
   - Real-time habit adherence metrics and weekly consistency score.

3. **Focus & Pomodoro Studio**:
   - 25m Deep Work, 5m Short Break, and 15m Recharge modes.
   - Circular SVG progress ring gauge with smooth real-time animation.
   - Native Web Audio API ambient sound generator (Rain, 40Hz Gamma Binaural Beats, Brown Noise) — zero external audio dependencies.
   - Link active Kanban tasks directly to your sprint sessions.

4. **Performance Velocity Analytics**:
   - Work breakdown charts and task priority meters.
   - Total focus time logged and sprint telemetry.

5. **Local Persistence & Data Portability**:
   - Instant automatic synchronization with browser `localStorage`.
   - Full JSON Export and Import backup functionality.
   - Dark Mode / Light Mode with ambient glowing orbs.

---

## 🚀 Quick Start

NexusFlow requires no build step and runs instantly in any modern browser.

### Option 1: Launch Local Development Server
From the project folder:
```powershell
python -m http.server 3000
```
Then open: [http://localhost:3000](http://localhost:3000)

### Option 2: Direct File Launch
Simply double-click `index.html` to open it directly in your web browser.

---

## 🔗 How to Connect & Push to Your Remote GitHub Repository

NexusFlow has already been initialized as a local Git repository on branch `main`.

When you are ready to push it to your GitHub account:

1. **Create an empty repository on GitHub**:
   - Go to [github.com/new](https://github.com/new).
   - Enter a repository name (e.g., `nexus-flow`).
   - Do **not** initialize with README or .gitignore (we already have them).

2. **Link the remote and push**:
   Run the following commands in PowerShell from this directory:
   ```powershell
   git remote add origin https://github.com/<YOUR-USERNAME>/<YOUR-REPO-NAME>.git
   git push -u origin main
   ```
   *Windows Git Credential Manager will automatically open a browser window for a one-click login if you aren't already authenticated.*

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| <kbd>Ctrl</kbd> + <kbd>N</kbd> / <kbd>⌘</kbd> + <kbd>N</kbd> | Open New Task modal |
| <kbd>/</kbd> | Focus global search bar |
| <kbd>Space</kbd> | Start / Pause Pomodoro focus sprint |
| <kbd>1</kbd> | Navigate to Kanban Board |
| <kbd>2</kbd> | Navigate to Habit Matrix |
| <kbd>3</kbd> | Navigate to Focus Studio |
| <kbd>4</kbd> | Navigate to Velocity Analytics |
| <kbd>Esc</kbd> | Close active modal |

---

## 🏗️ Architecture & Tech Stack

- **Structure**: Semantic HTML5 with accessibility attributes and ARIA dialogs.
- **Styling**: Vanilla CSS Design System with custom HSL tokens, glassmorphism, and responsive CSS Grid/Flexbox layouts.
- **Logic**: Vanilla ES6+ JavaScript with decoupled state store and Web Audio API synthesis.
- **Persistence**: Browser `localStorage` with JSON serialization.
