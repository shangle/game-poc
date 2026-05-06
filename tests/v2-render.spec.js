const { test, expect } = require('@playwright/test');
const path = require('path');

test('V2 Game Rendering Test', async ({ page }) => {
  // Use the local file path
  const filePath = `file://${path.resolve(__dirname, '../v2/index.html')}`;
  console.log(`Loading: ${filePath}`);

  // Listen for console errors
  page.on('console', msg => {
    if (msg.type() === 'error') console.log(`BROWSER ERROR: ${msg.text()}`);
    else console.log(`BROWSER LOG: ${msg.text()}`);
  });

  await page.goto(filePath);

  // Wait for title screen
  await expect(page.locator('game-title-screen')).toBeVisible();

  // Take screenshot of title screen
  await page.screenshot({ path: 'test-results/v2-title.png' });

  // Click start (Shadow DOM)
  await page.evaluate(() => {
    const titleScreen = document.querySelector('game-title-screen');
    const startBtn = titleScreen.shadowRoot.getElementById('start-btn');
    startBtn.click();
  });

  // Wait for HUD
  await expect(page.locator('#hud')).toBeVisible();
  
  // Wait a bit for Three.js to render
  await page.waitForTimeout(2000);

  // Take screenshot of game
  await page.screenshot({ path: 'test-results/v2-game-start.png' });

  // Check scene objects via evaluate
  const sceneData = await page.evaluate(() => {
    if (!window.gameEngine || !window.gameEngine.scene) return "No Engine/Scene";
    return {
      childrenCount: window.gameEngine.scene.children.length,
      colliders: window.gameEngine.colliders.length,
      cameraPos: window.gameEngine.camera.position,
      fog: !!window.gameEngine.scene.fog
    };
  });

  console.log('Scene Data:', JSON.stringify(sceneData, null, 2));
});
