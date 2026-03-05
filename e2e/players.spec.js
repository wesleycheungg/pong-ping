import { test, expect } from '@playwright/test';
import { goToTab, addPlayer, deleteAllPlayers } from './helpers';

// ─────────────────────────────────────────────
// Adding players
// ─────────────────────────────────────────────

test.describe('Adding players', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('can add a player and see them in the list', async ({ page }) => {
    await addPlayer(page, 'TestPlayer_A');
    await expect(page.getByText('TestPlayer_A')).toBeVisible();
  });

  test('new player appears in rankings', async ({ page }) => {
    await addPlayer(page, 'TestPlayer_B');
    await goToTab(page, /rankings/i);
    await expect(page.getByText('TestPlayer_B')).toBeVisible();
  });

  test('new player starts with 1000 ELO', async ({ page }) => {
    await addPlayer(page, 'TestPlayer_C');
    await goToTab(page, /rankings/i);
    // Find the row containing TestPlayer_C
    const playerRow = page.locator(':has(:text("TestPlayer_C"))');
    // Check the ELO number within that row
    const eloNum = playerRow.locator('.elo-num').first();
    await expect(eloNum).toContainText('1000');
  });

  test('shows flash message after adding player', async ({ page }) => {
    await goToTab(page, /players/i);
    await page.getByPlaceholder('Player name...').fill('TestPlayer_D');
    await page.getByRole('button', { name: 'ADD' }).click();
    await expect(page.locator('.flash')).toBeVisible();
  });

  test('can add a player by pressing Enter', async ({ page }) => {
    await goToTab(page, /players/i);
    await page.getByPlaceholder('Player name...').fill('TestPlayer_E');
    await page.getByPlaceholder('Player name...').press('Enter');
    await expect(page.getByText('TestPlayer_E')).toBeVisible();
  });

  test('input clears after adding a player', async ({ page }) => {
    await goToTab(page, /players/i);
    const input = page.getByPlaceholder('Player name...');
    await input.fill('TestPlayer_F');
    await page.getByRole('button', { name: 'ADD' }).click();
    await expect(input).toHaveValue('');
  });

  test.afterEach(async ({ page }) => {
    await deleteAllPlayers(page);
  });
});

// ─────────────────────────────────────────────
// Deleting players
// ─────────────────────────────────────────────

test.describe('Deleting players', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await addPlayer(page, 'DeleteMe');
  });

  test('player is removed from list after deletion', async ({ page }) => {
    await goToTab(page, /players/i);
    page.once('dialog', dialog => dialog.accept());
    await page.locator('.delete-btn').first().click();
    await expect(page.getByText('DeleteMe')).not.toBeVisible();
  });

  test('player is removed from rankings after deletion', async ({ page }) => {
    await goToTab(page, /players/i);
    page.once('dialog', dialog => dialog.accept());
    await page.locator('.delete-btn').first().click();
    await goToTab(page, /rankings/i);
    await expect(page.getByText('DeleteMe')).not.toBeVisible();
  });

  test('cancelling delete keeps the player', async ({ page }) => {
    await goToTab(page, /players/i);
    page.once('dialog', dialog => dialog.dismiss());
    await page.locator('.delete-btn').first().click();
    await expect(page.getByText('DeleteMe')).toBeVisible();
  });

  test.afterEach(async ({ page }) => {
    await deleteAllPlayers(page);
  });
});
