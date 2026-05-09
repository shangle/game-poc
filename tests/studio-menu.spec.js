const { test, expect } = require('@playwright/test');
const path = require('path');

test('Menu Editor UI Test', async ({ page }) => {
  const filePath = `file://${path.resolve(__dirname, '../studio/menu-editor/index.html')}`;
  await page.goto(filePath);

  // 1. Check Initial State
  const titleInput = page.locator('#game-title');
  await expect(titleInput).toHaveValue('RETRO QUEST');

  // 2. Change Title and Verify Preview
  await titleInput.fill('SUPER Michael BROS');
  
  const preview = page.locator('studio-preview');
  const previewTitle = await preview.evaluate(el => el.shadowRoot.querySelector('h1').innerText);
  console.log(`Preview Title: ${previewTitle}`);
  expect(previewTitle).toBe('SUPER MICHAEL BROS');

  // 3. Change Theme and Verify Attribute Update
  await page.locator('#color-accent').fill('#ff0000'); // Red
  const config = await preview.getAttribute('data-config');
  const parsed = JSON.parse(config);
  expect(parsed.theme.accentColor).toBe('#ff0000');

  // 4. Verify Author change
  await page.locator('#game-author').fill('Michael and Dad');
  const authorText = await preview.evaluate(el => el.shadowRoot.querySelector('.subtitle').innerText);
  expect(authorText).toBe('BY MICHAEL AND DAD');
});
