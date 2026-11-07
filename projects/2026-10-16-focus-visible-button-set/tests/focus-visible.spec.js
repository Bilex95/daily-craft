
const { test, expect } = require('@playwright/test');
const path = require('path');
const { pathToFileURL } = require('url');

const pageUrl = pathToFileURL(
  path.resolve(__dirname, '../index.html')
).href;

test('shows an outline when using keyboard navigation', async ({ page }) => {
  await page.goto(pageUrl);

  await page.keyboard.press('Tab');

  const firstButton = page.getByRole('button', { name: 'Primary' });

  await expect(firstButton).toBeFocused();
  await expect(firstButton).toHaveCSS('outline-style', 'solid');
  await expect(firstButton).toHaveCSS('outline-width', '3px');
});

test('does not show an outline after a mouse click', async ({ page }) => {
  await page.goto(pageUrl);

  const secondButton = page.getByRole('button', { name: 'Ghost' });

  await secondButton.click();

  await expect(secondButton).toBeFocused();
  await expect(secondButton).toHaveCSS('outline-style', 'none');
});
