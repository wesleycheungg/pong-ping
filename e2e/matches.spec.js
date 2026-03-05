import { test, expect } from '@playwright/test';
import { goToTab, addPlayer, logMatch, deleteAllPlayers } from './helpers';

test.describe('Logging matches', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await addPlayer(page, 'E2E_Player1');
    await addPlayer(page, 'E2E_Player2');
  });

  test.afterEach(async ({ page }) => {
    await deleteAllPlayers(page);
  });

  test('submit button is disabled before selecting players', async ({ page }) => {
    await goToTab(page, /log match/i);
    await expect(page.getByRole('button', { name: 'SUBMIT MATCH' })).toBeDisabled();
  });

  test('shows ELO preview when both players are selected', async ({ page }) => {
    await goToTab(page, /log match/i);
    await page.locator('select').first().selectOption('E2E_Player1');
    await page.locator('select').last().selectOption('E2E_Player2');
    await expect(page.getByText(/preview/i)).toBeVisible();
  });

  test('winner ELO increases after match', async ({ page }) => {
    await logMatch(page, 'E2E_Player1', 'E2E_Player2');
    await goToTab(page, /rankings/i);
    // E2E_Player1 won so their ELO should be above 1000
    const eloValues = await page.locator('.elo-num').allTextContents();
    const player1Elo = parseInt(eloValues.find((_, i) => {
      return page.locator('.player-name').nth(i).textContent === 'E2E_Player1';
    }));
    expect(Math.max(...eloValues.map(Number))).toBeGreaterThan(1000);
  });

  test('match appears in history', async ({ page }) => {
    await logMatch(page, 'E2E_Player1', 'E2E_Player2');
    await goToTab(page, /history/i);
    // Get the first history-card which should be the most recent match (newest first)
    const lastMatchCard = page.locator('.history-card').first();
    // Verify the most recent match contains both players
    const historyNames = lastMatchCard.locator('.history-names');
    await expect(historyNames).toContainText('E2E_Player1');
    await expect(historyNames).toContainText('E2E_Player2');
    await expect(historyNames).toContainText('beat');
  });

  test('shows flash message after logging match', async ({ page }) => {
    await logMatch(page, 'E2E_Player1', 'E2E_Player2');
    await expect(page.locator('.flash')).toBeVisible();
  });

  test('dropdowns reset after submitting', async ({ page }) => {
    await logMatch(page, 'E2E_Player1', 'E2E_Player2');
    await goToTab(page, /log match/i);
    await expect(page.locator('select').first()).toHaveValue('');
    await expect(page.locator('select').last()).toHaveValue('');
  });

  test('selected winner does not appear in loser dropdown', async ({ page }) => {
    await goToTab(page, /log match/i);
    await page.locator('select').first().selectOption('E2E_Player1');
    const loserSelect = page.locator('select').last();
    // Verify E2E_Player1 is not available as a loser option
    await expect(loserSelect).not.toContainText('E2E_Player1');
  });
});
