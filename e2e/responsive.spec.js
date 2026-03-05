import { test, expect } from '@playwright/test';

test.describe('Responsive layout', () => {
  test('renders correctly on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 }); // iPhone 14
    await page.goto('/');
    await expect(page.getByText('PING PONG')).toBeVisible();
    await expect(page.getByRole('button', { name: /rankings/i })).toBeVisible();
  });

  test('renders correctly on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 }); // iPad
    await page.goto('/');
    await expect(page.getByText('PING PONG')).toBeVisible();
  });

  test('renders correctly on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await expect(page.getByText('PING PONG')).toBeVisible();
  });
});
