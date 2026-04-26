# Development Guides

## 🎨 Asset Creation with PixUrl

Retro Engine Studio integrates **PixUrl** natively. This allows you to paint textures and sprites without leaving the editor.

### Step-by-Step
1.  Open the **Asset Wizard** (Plus icon in the library).
2.  Select a category (e.g., *Enemy*).
3.  Use the **PixUrl Tool** at the bottom of the form to draw your pixel art.
4.  Once you finish, the tool dispatches an `image-processed` event.
5.  The engine automatically encodes this as a Base64 string and adds it to your level.

---

## 🤖 The "One Prompt, One Image" Vision

We are iterating toward a system where an AI can generate a level blueprint as a 14x14 grid image.

### Image Blueprint Example
If an AI generates a small 14x14 image where:
- **Red Pixels** = Enemies
- **Black Pixels** = Walls
- **Blue Pixel** = Player

The engine parses this image and builds the level instantly.

### Implementation Logic
Developers can use the `ctx.getImageData()` API to parse AI-generated grids:
```javascript
const pixels = context.getImageData(0, 0, 14, 14).data;
for(let i = 0; i < pixels.length; i += 4) {
    const [r, g, b] = [pixels[i], pixels[i+1], pixels[i+2]];
    if(r === 255 && g === 0 && b === 0) spawnEnemy(x, z);
}
```

---

## 🧪 Testing Your Changes
Before pushing to GitHub, always run the local test suite:

### End-to-End UI Tests
```bash
npm run test:e2e
```
This uses **Playwright** to verify that the boot screen, editor, and game engine load correctly.

### Logic & State Tests
```bash
npm test
```
This uses **Jest** to verify that the `gameData` structure remains valid.
