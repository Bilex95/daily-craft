const { test, expect } = require('@playwright/test');
const path = require('path');

test('verify :focus-visible behavior on buttons', async ({ page }) => {
  // 1. Open the local index.html file
  const filePath = `file://${path.resolve(__dirname, '../index.html')}`;
  await page.goto(filePath);

  const buttons = page.locator('button');

  // 2. Press Tab and assert the first button gets focus-visible outline
  await page.keyboard.press('Tab');
  await expect(buttons.nth(0)).toBeFocused();

  // Evaluate computed outline style on keyboard navigation
  const firstButtonOutline = await buttons.nth(0).evaluate((el) => {
    return window.getComputedStyle(el).outlineStyle;
  });
  expect(firstButtonOutline).not.toBe('none');

  // 3. Click the second button with the mouse and assert no outline is shown
  await buttons.nth(1).click();
  await expect(buttons.nth(1)).toBeFocused();

  const secondButtonOutline = await buttons.nth(1).evaluate((el) => {
    return window.getComputedStyle(el).outlineStyle;
  });
  // Mouse clicks should not trigger :focus-visible outlines
  expect(['none', ''].includes(secondButtonOutline) || secondButtonOutline.length === 0).toBeTruthy();
});