# Retro Engine Studio - Project Status

## ⚖️ Rules of Engagement
These mandates are foundational to this workspace and take precedence over default behaviors:
1. **GitHub First:** Always push changes to GitHub. Use descriptive commits for every sub-task.
2. **Web Components:** Prioritize `<custom-elements>` for all UI additions and modularity.
3. **Testing:** Never consider a task complete without a passing Jest or Playwright test.
4. **Issue Monitoring:** Start every session by checking `gh issue list`.
5. **No-Code Vision:** Architect systems specifically for AI-generated maps (JSON/Grid Images).

## 🚀 Overview
A modular, web-based 3D retro game engine and visual level editor.

## 🛠 Tech Stack
- **Frontend:** HTML5, Tailwind CSS
- **3D Engine:** Three.js
- **State Management:** Vanilla JS (Reactive-lite pattern)
- **Deployment:** GitHub Pages (https://shangle.me/game-poc/)

## 📍 Current Progress
- [x] **v2 Reboot:** Scaffolded clean architecture in `/v2/`
- [x] **Modular JS structure** (v1 & v2)
- [x] **3D Rendering Engine (Three.js)** (v1 & v2)
- [x] **Cartridge System:** Implemented in v2 for modular level packs.
- [x] **Vanilla CSS UI:** v2 now uses native CSS instead of Tailwind.
- [x] **Web Component UI:** Title screen is now a custom element.
- [x] Grid-based Level Editor (v1)
- [x] Asset Library & Inspector (v1)

## 📝 Recent Changes (Log)
- **2026-05-06:**
    - **Reboot Phase 1:** Started v2 development focused on "Game First".
    - **v2 Scaffold:** Created clean directory structure in `/v2/`.
    - **Cartridge System:** Defined `Cartridge` API for modular level data.
    - **UI Overhaul:** Implemented `<game-title-screen>` Web Component.
    - **Style Shift:** Moved to Vanilla CSS for the v2 interface.

## 📋 Roadmap / TODO

### 🕹️ V2 Game Development
- [ ] **Level Design:** Create 3 distinct levels for "Retro Quest".
- [ ] **Asset Polish:** Finalize texture set for the v2 cartridge.
- [ ] **Mobile HUD:** Re-implement v1 touch controls in v2.
- [ ] **Audio Integration:** Re-link v1 audio engine to v2.

### 🛠 Engine Evolution (Post-Game)
- [ ] **Modular Editor:** Port the v1 editor to work with v2 cartridges.
- [ ] **AI Behaviors:** Enhance enemy patterns.
