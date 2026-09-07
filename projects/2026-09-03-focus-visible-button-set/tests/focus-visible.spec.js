const { test, expect } = require('@playwright/test');
const path = require('path');

test.describe('focus-visible button set', () => {
  test('keyboard tab shows outline, mouse click does not', async ({ page }) => {
    const filePath = path.join(__dirname, '..', 'index.html');
    await page.goto(`file://${filePath}`);

    const firstButton = page.getByRole('button', { name: 'Primary' });
    const secondButton = page.getByRole('button', { name: 'Ghost' });

    // 1. Press Tab and check the first button receives keyboard focus
    await page.keyboard.press('Tab');
    await expect(firstButton).toBeFocused();

    // Assert it has a visible outline (not "none", and width > 0)
    const firstOutline = await firstButton.evaluate((el) => {
      const style = getComputedStyle(el);
      return {
        style: style.outlineStyle,
        width: parseFloat(style.outlineWidth),
      };
    });
    expect(firstOutline.style).not.toBe('none');
    expect(firstOutline.width).toBeGreaterThan(0);

    // 2. Click the second button with the mouse
    await secondButton.click();
    await expect(secondButton).toBeFocused();

    // Assert no visible outline on mouse-focused button
    const secondOutline = await secondButton.evaluate((el) => {
      const style = getComputedStyle(el);
      return {
        style: style.outlineStyle,
        width: parseFloat(style.outlineWidth),
      };
    });
    const secondIsHidden =
      secondOutline.style === 'none' || secondOutline.width === 0;
    expect(secondIsHidden).toBe(true);
  });
});