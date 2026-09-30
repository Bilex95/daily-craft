const { test, expect } = require('@playwright/test');
const path = require('path');
const { pathToFileURL } = require('url');

const htmlPath = path.resolve(
  'projects/2026-09-30-focus-visible-button-set/index.html'
);

const htmlUrl = pathToFileURL(htmlPath).href;

test.describe('Focus-visible button behavior', () => {
  test('shows a visible outline when focused with keyboard', async ({ page }) => {
    await page.goto(htmlUrl);

    const primaryButton = page.getByRole('button', { name: 'Primary' });

    await page.keyboard.press('Tab');

    await expect(primaryButton).toBeFocused();
    await expect(primaryButton).toHaveCSS(
     'outline',
     'rgb(232, 234, 240) solid 3px'
    );
  });

  test('does not show an outline when focused with mouse', async ({ page }) => {
    await page.goto(htmlUrl);

    const ghostButton = page.getByRole('button', { name: 'Ghost' });

    await ghostButton.click();

    await expect(ghostButton).toBeFocused();
    await expect(ghostButton).toHaveCSS('outline-style', 'none');
  });
});