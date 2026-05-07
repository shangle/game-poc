# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: v2-polish.spec.js >> V2 Polish Verification Test
- Location: tests/v2-polish.spec.js:4:1

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: true
Received: false
```

# Page snapshot

```yaml
- generic [ref=e4]:
  - heading "RETRO QUEST" [level=1] [ref=e5]:
    - text: RETRO
    - text: QUEST
  - generic [ref=e6]: A New Beginning
  - generic [ref=e7]:
    - button "Start Game" [ref=e8] [cursor=pointer]
    - button "Options" [ref=e9] [cursor=pointer]
```

# Test source

```ts
  1  | const { test, expect } = require('@playwright/test');
  2  | const path = require('path');
  3  | 
  4  | test('V2 Polish Verification Test', async ({ page }) => {
  5  |   const filePath = `file://${path.resolve(__dirname, '../v2/index.html')}`;
  6  |   
  7  |   page.on('console', msg => {
  8  |     console.log(`BROWSER ${msg.type().toUpperCase()}: ${msg.text()}`);
  9  |   });
  10 | 
  11 |   await page.goto(filePath);
  12 | 
  13 |   // 1. Verify Title Screen
  14 |   await expect(page.locator('game-title-screen')).toBeVisible();
  15 | 
  16 |   // 2. Start Game (Simulate direct event if click fails)
  17 |   await page.evaluate(() => {
  18 |     document.dispatchEvent(new CustomEvent('start-game', { bubbles: true, composed: true }));
  19 |   });
  20 | 
  21 |   // 3. Verify HUD visibility
  22 |   await page.waitForTimeout(1000);
  23 |   const isHudShown = await page.evaluate(() => {
  24 |     const hud = document.getElementById('hud');
  25 |     return hud && window.getComputedStyle(hud).display !== 'none';
  26 |   });
  27 |   console.log(`HUD Visible: ${isHudShown}`);
> 28 |   expect(isHudShown).toBe(true);
     |                      ^ Error: expect(received).toBe(expected) // Object.is equality
  29 | 
  30 |   // 4. Verify Scene Loaded
  31 |   const objectCount = await page.evaluate(() => window.gameEngine.scene.children.length);
  32 |   console.log(`Objects in scene: ${objectCount}`);
  33 |   expect(objectCount).toBeGreaterThan(10);
  34 | 
  35 |   // 5. Test Firing (Visual Projectiles)
  36 |   await page.evaluate(() => {
  37 |     window.gameEngine.shoot();
  38 |   });
  39 |   const projectileCount = await page.evaluate(() => window.gameEngine.projectiles.length);
  40 |   console.log(`Projectiles active: ${projectileCount}`);
  41 |   expect(projectileCount).toBe(1);
  42 | 
  43 |   // 6. Test Level Selector Unlock
  44 |   await page.evaluate(() => {
  45 |     localStorage.setItem('retroQuest_unlocked', 'true');
  46 |     window.restartGame();
  47 |   });
  48 |   await page.waitForTimeout(500);
  49 |   const selectorVisible = await page.evaluate(() => {
  50 |     const ts = document.querySelector('game-title-screen');
  51 |     return !!ts.shadowRoot.querySelector('.level-grid');
  52 |   });
  53 |   console.log(`Level Selector Visible: ${selectorVisible}`);
  54 |   expect(selectorVisible).toBe(true);
  55 | 
  56 |   // 7. Test Options Menu
  57 |   await page.evaluate(() => {
  58 |     const ts = document.querySelector('game-title-screen');
  59 |     ts.setAttribute('mode', 'options');
  60 |   });
  61 |   const optionsTitle = await page.evaluate(() => {
  62 |     const ts = document.querySelector('game-title-screen');
  63 |     return ts.shadowRoot.querySelector('h1').innerText;
  64 |   });
  65 |   console.log(`Menu Mode: ${optionsTitle}`);
  66 |   expect(optionsTitle).toBe('OPTIONS');
  67 | });
  68 | 
```