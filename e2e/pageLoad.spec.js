import { test, expect } from '@playwright/test';

test.describe('Page load', () => {
  test('shows the leaderboard title', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('PING PONG')).toBeVisible();
    await expect(page.getByText('LEADERBOARD')).toBeVisible();
  });

  test('shows all four tabs', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('button', { name: /rankings/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /log match/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /history/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /players/i })).toBeVisible();
  });

  test('rankings tab is active by default', async ({ page }) => {
    await page.goto('/');
    const rankingsBtn = page.getByRole('button', { name: /rankings/i });
    await expect(rankingsBtn).toHaveClass(/tab-active/);
  });
});
