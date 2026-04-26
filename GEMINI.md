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
- [x] Modular JS structure
- [x] 3D Rendering Engine (Three.js)
- [x] Grid-based Level Editor
- [x] Asset Library & Inspector
- [x] Mobile HUD & Touch Controls
- [x] Audio Engine
- [x] URL-based level sharing (Base64)

## 📝 Recent Changes (Log)
- **2026-04-13:** 
    - **Global Standardization**: Created `~/.gemini/GEMINI.md` to establish cross-project rules.
    - **v0.2.2-alpha Release**: Rolled back versioning to reflect pre-1.0 development status.
    - **Documentation Site**: Created `docs.html` as a user-facing technical guide.
    - **GitHub README**: Added a comprehensive `README.md` with status warnings and navigation.
    - **Landing Page**: Created a modern, professional landing page (`index.html`) with a "Launch Engine" call-to-action.
    - **Project Documentation**: Created `DOCS.md` with a detailed breakdown of the `gameData` JSON structure.
    - **Embedded PixUrl**: Replaced external links with embedded `<pixurl-utility>` components in the Wizard and Inspector.
    - **Testing & CI/CD Pipeline**: Initialized npm, installed Jest for core logic tests, and Playwright for E2E UI testing. Added a GitHub Actions workflow.
    - **Developer Blog**: Built a 6-part blog series chronicling the engine's evolution.
    - **Code Audit & Simplification**: Centralized all screen transitions into a single `setUIMode(mode)` function.

## 📋 Roadmap / TODO

### 🐛 Bug Fixes
- [ ] **Mouse Capture:** Further testing on Chromebook/Mouse to ensure Pointer Lock is consistent.
- [ ] **Viewport Scaling:** Ensure Three.js canvas handles window resizing perfectly.

### 🎨 Title Screen & UX
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
