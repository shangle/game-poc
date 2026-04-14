# Retro Engine Studio - Project Status

## 🚀 Overview
A modular, web-based 3D retro game engine and visual level editor.

## 🛠 Tech Stack
- **Frontend:** HTML5, Tailwind CSS
- **3D Engine:** Three.js
- **State Management:** Vanilla JS (Reactive-lite pattern)
- **Deployment:** GitHub Pages (https://shangle.me/game-poc/)

## 📍 Current Progress
- [x] Modular JS structure
- [x] 3D Rendering Engine (Three.js)
- [x] Grid-based Level Editor
- [x] Asset Library & Inspector
- [x] Mobile HUD & Touch Controls
- [x] Audio Engine
## 📝 Recent Changes (Log)
- **2026-04-13:** 
    - **Landing Page**: Created a modern, professional landing page (`index.html`) with a "Launch Engine" call-to-action.
    - **Project Documentation**: Created `DOCS.md` with a detailed breakdown of the `gameData` JSON structure and a mandatory update reminder.
    - **Embedded PixUrl**: Replaced external links with embedded `<pixurl-utility>` components in the Wizard and Inspector. Added a global listener to handle processed images.
    - **Refactor**: Moved the core game engine to `launcher.html`.
...

    - **Pixurl Integration**: Added "CREATE WITH PIXURL" helper links to both the Asset Wizard and the Inspector texture fields.
    - **Code Audit & Simplification**: Centralized all screen transitions into a single `setUIMode(mode)` function in `main.js`. This eliminates the "UI Leak" where the editor would remain visible during gameplay.
...

    - **Toolbar Fix**: Corrected CSS flexbox behavior for the left toolbar. Buttons are now fixed at 64x64px with text labels centered below icons.
    - **Asset Wizard Fix**: Corrected Wizard visibility and ensured the "Add Asset" (+) button triggers the 2-step process correctly.
    - Added `.hidden { display: none !important; }` to the core CSS to prevent state conflicts.

## 📋 Roadmap / TODO

### 🚨 URGENT / REGRESSIONS
- [x] **UI Leak (Main Menu):** Resolved via `setUIMode`.
- [x] **Toolbar Layout:** Labels centered and buttons resized.
- [x] **Wizard visibility:** Asset Creation Wizard now triggers correctly from the UI.
- [x] **Code Audit:** UI state management centralized.

### 🐛 Bug Fixes
...

- [x] **Polished Title Screen:** Added versioning, controls guide, and GitHub link.
- [ ] **Control Configurator:** Allow users to remap movement/action keys. (Big Task)

### 🛠 Editor Enhancements
- [x] **Tool Clarity:** Added labels to the toolbar icons.
- [ ] **Editor Modes:** 
    - [ ] Easy Mode (Basic placement)
    - [ ] Normal Mode (Standard features)
    - [ ] Advanced Mode (Full JSON inspector & logic)

### 🚀 Advanced Features
- [ ] **Save/Load:** Implement LocalStorage persistence.
- [ ] **Level Packs:** Support for multiple levels and sequencing.
- [ ] **AI Patterns:** Add more complex enemy behaviors.
- [ ] **Texture Library:** Expand the default asset set.
