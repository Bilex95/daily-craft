const { test, expect } = require('@playwright/test');
const path = require('path');
const { pathToFileURL } = require('url');

test('focus-visible appears for keyboard navigation but not mouse click', async ({ page }) => {
    const filePath = path.join(__dirname, '..', 'index.html');
    const fileUrl = pathToFileURL(filePath).href;

    await page.goto(fileUrl);

    const buttons = page.locator('button');

    // Press Tab to focus the first button
    await page.keyboard.press('Tab');

    // First button should have keyboard focus
    await expect(buttons.nth(0)).toBeFocused();

    // First button should have a visible focus outline
    await expect(buttons.nth(0)).toHaveCSS('outline-style', 'solid');

    // Click the second button using the mouse
    await buttons.nth(1).click();

    // Second button should be focused
    await expect(buttons.nth(1)).toBeFocused();

    // Mouse focus should not show the focus-visible outline
    await expect(buttons.nth(1)).toHaveCSS('outline-style', 'none');
});