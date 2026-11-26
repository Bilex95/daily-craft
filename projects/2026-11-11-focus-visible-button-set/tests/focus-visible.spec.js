const { test, expect } = require('@playwright/test');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

const pageUrl = pathToFileURL(path.join(__dirname, '..', 'index.html')).href;

test.beforeEach(async ({ page }) => {
  await page.goto(pageUrl);
});

test('keyboard navigation shows the focus-visible outline', async ({ page }) => {
  const primary = page.getByRole('button', { name: 'Primary' });

  await page.keyboard.press('Tab');
  await expect(primary).toBeFocused();

  const focus = await primary.evaluate((el) => {
    const styles = getComputedStyle(el);
    return {
      focusVisible: el.matches(':focus-visible'),
      outlineStyle: styles.outlineStyle,
      outlineWidth: parseFloat(styles.outlineWidth),
    };
  });

  expect(focus.focusVisible).toBe(true);
  expect(focus.outlineStyle).not.toBe('none');
  expect(focus.outlineWidth).toBeGreaterThanOrEqual(3);
});

test('clicking with the pointer does not paint a focus outline', async ({ page }) => {
  const ghost = page.getByRole('button', { name: 'Ghost' });

  await ghost.click();

  const focus = await ghost.evaluate((el) => {
    const styles = getComputedStyle(el);
    return {
      focusVisible: el.matches(':focus-visible'),
      outlineStyle: styles.outlineStyle,
      outlineWidth: parseFloat(styles.outlineWidth),
    };
  });

  expect(focus.focusVisible).toBe(false);
  expect(focus.outlineStyle === 'none' || focus.outlineWidth === 0).toBe(true);
});
