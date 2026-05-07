const { test, expect } = require('@playwright/test');
const path = require('path');

test('V2 Stability and Progression Test', async ({ page }) => {
  const filePath = `file://${path.resolve(__dirname, '../v2/index.html')}`;
  
  page.on('console', msg => {
    if (msg.type() === 'error') console.log(`BROWSER ERROR: ${msg.text()}`);
  });

  await page.goto(filePath);

  // 1. Verify Title Screen
  await expect(page.locator('game-title-screen')).toBeVisible();

  // 2. Start Level 1
  await page.evaluate(() => {
    const titleScreen = document.querySelector('game-title-screen');
    const startBtn = titleScreen.shadowRoot.getElementById('start-btn');
    startBtn.click();
  });

  // 3. Verify HUD and Scene for Level 1
  await expect(page.locator('#hud')).toBeVisible();
  const sceneDataLvl1 = await page.evaluate(() => {
    return {
      lvlName: window.Cartridge.levels[window.gameEngine.currentLevelIndex].name,
      children: window.gameEngine.scene.children.length
    };
  });
  console.log(`Level 1 Loaded: ${sceneDataLvl1.lvlName}, Objects: ${sceneDataLvl1.children}`);
  expect(sceneDataLvl1.children).toBeGreaterThan(10);

  // 4. Cheat to end of Level 1 to unlock selector
  await page.evaluate(() => {
    const goal = window.gameEngine.goalMesh;
    window.gameEngine.camera.position.set(goal.position.x, goal.position.y, goal.position.z);
    console.log("Cheated to goal at:", goal.position.x, goal.position.z);
  });

  // Wait for Level 2 or Win screen - Win happens when distance < 5
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
    const titleScreen = document.querySelector('game-title-screen');
    return !!titleScreen.shadowRoot.querySelector('.level-grid');
  });
  console.log(`Level Selector Visible: ${selectorVisible}`);
  expect(selectorVisible).toBe(true);

  // 7. Select Level 7
  await page.evaluate(() => {
    const titleScreen = document.querySelector('game-title-screen');
    titleScreen.selectLevel(6); // Index 6 is Level 7
  });

  await page.waitForTimeout(500);
  const sceneDataLvl7 = await page.evaluate(() => {
    return {
      lvlName: window.Cartridge.levels[window.gameEngine.currentLevelIndex].name,
      children: window.gameEngine.scene.children.length
    };
  });
  console.log(`Level 7 Loaded: ${sceneDataLvl7.lvlName}, Objects: ${sceneDataLvl7.children}`);
  expect(sceneDataLvl7.lvlName).toBe("Final Descent");
});
