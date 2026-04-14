# 🕹️ Retro Engine Studio (v0.2.2-alpha)

> **⚠️ STATUS: PRE-ALPHA / IN DEVELOPMENT**
> This project is a proof-of-concept and is not yet close to a 1.0 release. Expect breaking changes, bugs, and evolving architectures.

Retro Engine Studio is a browser-native 3D game engine and visual level editor. It allows users to build, play, and share retro-style FPS experiences entirely within the browser using modern web technologies like Three.js and Tailwind CSS.

## 🚀 Quick Links
- **Live Demo:** [shangle.me/game-poc/](https://shangle.me/game-poc/)
- **Developer Blog:** [shangle.me/game-poc/blog/](https://shangle.me/game-poc/blog/)
- **Documentation:** [shangle.me/game-poc/docs.html](https://shangle.me/game-poc/docs.html)

## 🛠 Features (WIP)
- **Zero-Backend Architecture:** Levels are shared via Base64 encoded URLs.
- **Visual Grid Editor:** 14x14 top-down builder with real-time 3D preview.
- **Embedded PixUrl:** Native pixel art creation tool integrated directly into the workflow.
- **Automated Testing:** CI/CD pipeline powered by Jest and Playwright.

## 🏗 Developer Setup
1. Clone the repository.
2. Install dependencies: `npm install`
3. Run unit tests: `npm test`
4. Run E2E tests: `npm run test:e2e`

## 📋 Roadmap
- [ ] Multi-level sequencing and "Level Packs"
- [ ] LocalStorage persistence for projects
- [ ] Advanced AI-generated map importing (Image-to-Level)
- [ ] Expanded asset and texture library
- [ ] Customizable control remapping

## 📄 License
MIT
