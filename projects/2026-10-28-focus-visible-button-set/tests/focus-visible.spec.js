import { expect, test } from "@playwright/test";
import { resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const projectDir = fileURLToPath(new URL("..", import.meta.url));
const demoUrl = pathToFileURL(resolve(projectDir, "index.html")).href;

test("shows a focus ring when the first button receives keyboard focus", async ({ page }) => {
  await page.goto(demoUrl);
  const firstButton = page.getByRole("button").first();

  await page.keyboard.press("Tab");

  await expect(firstButton).toBeFocused();
  await expect(firstButton).toHaveCSS("outline-style", "solid");
  await expect(firstButton).toHaveCSS("outline-width", "3px");
});

test("does not show a focus ring when the second button receives mouse focus", async ({ page }) => {
  await page.goto(demoUrl);
  const secondButton = page.getByRole("button").nth(1);

  await secondButton.click();

  await expect(secondButton).toBeFocused();
  await expect(secondButton).toHaveCSS("outline-style", "none");
});
