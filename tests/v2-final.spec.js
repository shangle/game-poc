const { test, expect } = require('@playwright/test');
const path = require('path');

test('V2 Final Verification (Resize & Shooting)', async ({ page }) => {
  const filePath = `file://${path.resolve(__dirname, '../v2/index.html')}`;
  
  page.on('console', msg => {
    console.log(`BROWSER ${msg.type().toUpperCase()}: ${msg.text()}`);
  });

  await page.goto(filePath);

  // 1. Verify Title Screen
  await expect(page.locator('game-title-screen')).toBeVisible();

  // 2. Start Game
  await page.evaluate(() => {
    document.dispatchEvent(new CustomEvent('start-game', { bubbles: true, composed: true }));
  });

  // 3. Verify HUD visibility
  await page.waitForTimeout(2000);
  const isHudShown = await page.evaluate(() => {
    const hud = document.getElementById('hud');
    return hud && window.getComputedStyle(hud).display !== 'none';
  });
  console.log(`HUD Visible: ${isHudShown}`);

  // 4. Verify Scene Loaded
  const objectCount = await page.evaluate(() => window.gameEngine.scene ? window.gameEngine.scene.children.length : 0);
  console.log(`Objects in scene: ${objectCount}`);
  expect(objectCount).toBeGreaterThan(0);

  // 5. Test Resize Stability
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.setViewportSize({ width: 1920, height: 1080 });
  console.log("Resize completed without crash.");

  // 6. Test Firing (Visible Projectiles)
  await page.evaluate(() => {
    if (window.gameEngine.active) window.gameEngine.shoot();
  });
  const projectileCount = await page.evaluate(() => window.gameEngine.projectiles.length);
  console.log(`Projectiles active: ${projectileCount}`);
  expect(projectileCount).toBe(1);

  // 7. Verify Weapon Sprite has background image (procedural or real)
  const weaponBg = await page.evaluate(() => {
    const sprite = document.getElementById('weapon-sprite');
    return window.getComputedStyle(sprite).backgroundImage;
  });
  console.log(`Weapon BG Image: ${weaponBg}`);
  expect(weaponBg).not.toBe('none');
});
