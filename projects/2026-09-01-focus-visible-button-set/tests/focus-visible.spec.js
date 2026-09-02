const path = require('path');
const { test, expect } = require('@playwright/test');

test('keyboard focus shows outline and mouse focus does not', async ({ page }) => {
  await page.goto('file://' + path.join(__dirname, '..', 'index.html'));

  const primaryButton = page.getByRole('button', { name: 'Primary' });
  const ghostButton = page.getByRole('button', { name: 'Ghost' });

  // Press Tab to focus the first button
  await page.keyboard.press('Tab');

  // Make sure the first button received focus
  await expect(primaryButton).toBeFocused();

  // Keyboard focus should show the focus outline
  const keyboardOutline = await primaryButton.evaluate((button) => {
    return getComputedStyle(button).outlineStyle;
  });

  expect(keyboardOutline).not.toBe('none');

  // Click the second button with the mouse
  await ghostButton.click();

  // Make sure the second button received focus
  await expect(ghostButton).toBeFocused();

  // Mouse focus should not show the focus outline
  const mouseOutline = await ghostButton.evaluate((button) => {
    return getComputedStyle(button).outlineStyle;
  });

  expect(mouseOutline).toBe('none');
});