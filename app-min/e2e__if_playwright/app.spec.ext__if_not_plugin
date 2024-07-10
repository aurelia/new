import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:9000');
});

test.describe('MyApp', () => {
  test('shows message', async ({ page }) => {
    await expect(page.locator('my-app div')).toHaveText('Hello World!');
  });
});
