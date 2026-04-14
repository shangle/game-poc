const { test, expect } = require('@playwright/test');

test.describe('Retro Engine Studio E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Serve the local directory - in CI we might use a local server, 
    // but playwright can also load local files directly if configured,
    // or we can test the live URL. For this test, we'll test the local file.
    await page.goto(`file://${process.cwd()}/index.html`);
  });

  test('Boot screen loads and displays title', async ({ page }) => {
    await expect(page.locator('#boot-title')).toHaveText(/RETRO.*ENGINE/);
    await expect(page.locator('#boot-screen')).toBeVisible();
  });

  test('Clicking Play Game hides boot screen and shows game container', async ({ page }) => {
    await page.click('text=PLAY GAME');
    await expect(page.locator('#boot-screen')).toBeHidden();
    await expect(page.locator('#game-container')).toBeVisible();
  });

  test('Clicking Open Builder hides boot screen and shows editor', async ({ page }) => {
    // Reload page to reset state
    await page.reload();
    await page.click('text=OPEN BUILDER');
    await expect(page.locator('#boot-screen')).toBeHidden();
    await expect(page.locator('#editor-sidebar')).toBeVisible();
    
    // Check if toolbar is visible
    await expect(page.locator('#toolbar')).toBeVisible();
    await expect(page.locator('text=Home')).toBeVisible();
  });
});
