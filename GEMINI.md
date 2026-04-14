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
- [x] URL-based level sharing (Base64)

## 📝 Recent Changes (Log)
- **2026-04-13:** 
    - Initialized `GEMINI.md` for project tracking.
    - Categorized bugs and feature requests from user feedback.
    - Fixed "Black Box" terminal font rendering (User side).

## 📋 Roadmap / TODO

### 🐛 Bug Fixes
- [ ] **Builder Scaling:** Grid appears "zoomed out" or incorrectly scaled. Needs responsive centering/scaling.
- [x] **UI Leak:** Editor tools appearing during "Play Game" mode.
- [ ] **Mouse Capture:** Pointer Lock API failing on Chromebook/Mouse.
- [x] **Navigation:** No way to return to the Title Screen from Editor/Game.

### 🎨 Title Screen & UX
- [ ] **Polished Title Screen:** Add more info, versioning, and credits.
- [ ] **Controls Section:** Display current keybindings on the title screen.
- [ ] **Control Configurator:** Allow users to remap movement/action keys. (Big Task)

### 🛠 Editor Enhancements
- [ ] **Tool Clarity:** Add labels or tooltips to the toolbar icons.
- [ ] **Editor Modes:** 
    - [ ] Easy Mode (Basic placement)
    - [ ] Normal Mode (Standard features)
    - [ ] Advanced Mode (Full JSON inspector & logic)

### 🚀 Advanced Features
- [ ] **Save/Load:** Implement LocalStorage persistence.
- [ ] **Level Packs:** Support for multiple levels and sequencing.
- [ ] **AI Patterns:** Add more complex enemy behaviors.
- [ ] **Texture Library:** Expand the default asset set.
