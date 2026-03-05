import { test, expect } from '@playwright/test';
import { goToTab } from './helpers';

test.describe('Tab navigation', () => {
  test('clicking Log Match tab shows the match form', async ({ page }) => {
    await page.goto('/');
    await goToTab(page, /log match/i);
    await expect(page.getByText('LOG A MATCH')).toBeVisible();
  });

  test('clicking History tab shows match history', async ({ page }) => {
    await page.goto('/');
    await goToTab(page, /history/i);
    await expect(page.getByText('MATCH HISTORY')).toBeVisible();
  });

  test('clicking Players tab shows add player form', async ({ page }) => {
    await page.goto('/');
    await goToTab(page, /players/i);
    await expect(page.getByPlaceholder('Player name...')).toBeVisible();
  });
});
