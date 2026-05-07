const { test, expect } = require('@playwright/test');
const path = require('path');

test('V2 Stability and Progression Test', async ({ page }) => {
  const filePath = `file://${path.resolve(__dirname, '../v2/index.html')}`;
  
  page.on('console', msg => {
    console.log(`BROWSER ${msg.type().toUpperCase()}: ${msg.text()}`);
  });

  await page.goto(filePath);

  // 1. Verify Title Screen
  const titleScreen = page.locator('game-title-screen');
  await expect(titleScreen).toBeVisible();

  // 2. Start Level 1
  // Use a more direct click on the button element itself
  await page.evaluate(() => {
    const ts = document.querySelector('game-title-screen');
    const btn = ts.shadowRoot.getElementById('start-btn');
    btn.click();
  });

  // Give some time for DOM and Engine to react
  await page.waitForTimeout(2000);

  // 3. Verify HUD and Scene for Level 1
  const isHudShown = await page.evaluate(() => {
    const hud = document.getElementById('hud');
    return hud && window.getComputedStyle(hud).display !== 'none';
  });
  console.log(`HUD Visible via Computed Style: ${isHudShown}`);
  
  const sceneDataLvl1 = await page.evaluate(() => {
    if (!window.gameEngine || !window.gameEngine.scene) return { lvlName: "N/A", children: 0 };
    return {
      lvlName: window.Cartridge.levels[window.gameEngine.currentLevelIndex].name,
      children: window.gameEngine.scene.children.length
    };
  });
  console.log(`Level 1 Loaded: ${sceneDataLvl1.lvlName}, Objects: ${sceneDataLvl1.children}`);
  
  // 4. Cheat to end of Level 1 to unlock selector
  await page.evaluate(() => {
    const goal = window.gameEngine.goalMesh;
    if (goal) {
        window.gameEngine.camera.position.set(goal.position.x, goal.position.y, goal.position.z);
        console.log("Cheated to goal at:", goal.position.x, goal.position.z);
    } else {
        console.error("Goal mesh not found!");
    }
  });

  // Wait for clear
  await page.waitForTimeout(2000);

  // 5. Back to Title Screen (restart)
  await page.evaluate(() => {
    console.log("LocalStorage Unlocked:", localStorage.getItem('retroQuest_unlocked'));
    window.restartGame();
  });
  await page.waitForTimeout(1000);
  await expect(page.locator('game-title-screen')).toBeVisible();

  // 6. Verify Level Selector is visible
  const selectorVisible = await page.evaluate(() => {
    const ts = document.querySelector('game-title-screen');
    return !!ts.shadowRoot.querySelector('.level-grid');
  });
  console.log(`Level Selector Visible: ${selectorVisible}`);
  expect(selectorVisible).toBe(true);

  // 7. Select Level 7
  await page.evaluate(() => {
    const ts = document.querySelector('game-title-screen');
    ts.selectLevel(6); // Index 6 is Level 7
  });

  await page.waitForTimeout(1000);
  const sceneDataLvl7 = await page.evaluate(() => {
    return {
      lvlName: window.Cartridge.levels[window.gameEngine.currentLevelIndex].name,
      children: window.gameEngine.scene.children.length
    };
  });
  console.log(`Level 7 Loaded: ${sceneDataLvl7.lvlName}, Objects: ${sceneDataLvl7.children}`);
  expect(sceneDataLvl7.lvlName).toBe("Final Descent");
});
