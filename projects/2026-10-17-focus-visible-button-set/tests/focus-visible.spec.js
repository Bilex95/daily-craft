const path = require('path');
const { pathToFileURL } = require('url');
const { test, expect } = require('@playwright/test');

const pageUrl = pathToFileURL(path.join(__dirname, '..', 'index.html')).href;

async function outlineOf(locator) {
  return locator.evaluate((el) => {
    const style = getComputedStyle(el);
    return {
      style: style.outlineStyle,
      width: parseFloat(style.outlineWidth) || 0,
    };
  });
}

test.describe('focus-visible button set', () => {
  test('keyboard focus draws a visible ring', async ({ page }) => {
    await page.goto(pageUrl);

    await page.keyboard.press('Tab');

    const first = page.locator('button').first();
    await expect(first).toBeFocused();

    const outline = await outlineOf(first);
    expect(outline.style).not.toBe('none');
    expect(outline.width).toBeGreaterThan(0);
  });

  test('mouse click does not draw a ring', async ({ page }) => {
    await page.goto(pageUrl);

    const second = page.locator('button').nth(1);
    await second.click();
    await expect(second).toBeFocused();

    const outline = await outlineOf(second);
    expect(outline.style === 'none' || outline.width === 0).toBe(true);
  });

  test('disabled button is skipped by tab order', async ({ page }) => {
    await page.goto(pageUrl);

    const focusOrder = [];
    for (let i = 0; i < 5; i += 1) {
      await page.keyboard.press('Tab');
      focusOrder.push(
        await page.evaluate(() => {
          const el = document.activeElement;
          return el && el.tagName === 'BUTTON' ? el.textContent.trim() : null;
        }),
      );
    }

    expect(focusOrder).not.toContain('Disabled');
  });
});
