const { test, expect } = require('@playwright/test');
const path = require('path');

test.describe('Focus-Visible Button Set', () => {
  test('keyboard tab reveals focus outline while mouse click does not', async ({ page }) => {
    const filePath = path.resolve(__dirname, 'index.html');
    await page.goto(`file://${filePath}`);

    const primaryButton = page.locator('button', { hasText: 'Primary' });
    const ghostButton = page.locator('button', { hasText: 'Ghost' });

    // Step 1: Press Tab to focus the first button via keyboard navigation
    await page.keyboard.press('Tab');
    await expect(primaryButton).toBeFocused();

    // Verify the outline is visible under :focus-visible
    const primaryOutline = await primaryButton.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return {
        outlineStyle: style.outlineStyle,
        outlineWidth: style.outlineWidth,
      };
    });
    expect(primaryOutline.outlineStyle).not.toBe('none');
    expect(parseFloat(primaryOutline.outlineWidth)).toBeGreaterThan(0);

    // Step 2: Click the second button with the mouse
    await ghostButton.click();
    await expect(ghostButton).toBeFocused();

    // Mouse click must not trigger :focus-visible, outline should not be shown
    const ghostOutline = await ghostButton.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return {
        outlineStyle: style.outlineStyle,
        outlineWidth: style.outlineWidth,
      };
    });
    expect(
      ghostOutline.outlineStyle === 'none' ||
      parseFloat(ghostOutline.outlineWidth) === 0
    ).toBe(true);
  });
});
