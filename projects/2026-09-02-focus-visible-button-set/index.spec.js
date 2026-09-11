const { test, expect } = require('@playwright/test');
const path = require('path');

test.describe('Focus-visible button set', () => {
  test('keyboard focus shows outline, mouse click hides outline', async ({ page }) => {
    const filePath = path.resolve(__dirname, 'index.html');
    await page.goto(`file://${filePath}`);

    const buttons = page.locator('button');

    // 1. Tab enfoca el primer boton y muestra outline
    await page.keyboard.press('Tab');
    await expect(buttons.nth(0)).toBeFocused();
    await expect(buttons.nth(0)).not.toHaveCSS('outline-style', 'none');

    // 2. Clic con el raton en el segundo boton oculta el outline
    await buttons.nth(1).click();
    await expect(buttons.nth(1)).toBeFocused();
    await expect(buttons.nth(1)).toHaveCSS('outline-style', 'none');
  });
});
