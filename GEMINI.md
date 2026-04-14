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
    - Fixed "Black Box" terminal font rendering (User side).
    - Fixed **UI Leak**: Added `.hidden` with `!important` to ensure editor UI disappears during gameplay.
    - Added **Toolbar Labels**: Left toolbar now shows text labels (Home, Entities, etc.) for better clarity.
    - Implemented **Asset Wizard**: Replaced the simple prompt with a 2-step wizard for creating new assets (Category -> Details).
    - Added **Zoom Controls**: Grid editor now supports zooming in/out.

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
