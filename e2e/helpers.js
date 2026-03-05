import { expect } from '@playwright/test';

/**
 * Navigate to a specific tab
 */
export async function goToTab(page, label) {
  await page.getByRole('button', { name: label }).click();
}

/**
 * Add a player with the given name
 */
export async function addPlayer(page, name) {
  await goToTab(page, /players/i);
  await page.getByPlaceholder('Player name...').fill(name);
  await page.getByRole('button', { name: 'ADD' }).click();
  // Wait for the player to appear in the player list (not in flash message)
  await expect(page.locator('.player-row', { has: page.getByText(name) }).first()).toBeVisible();
}

/**
 * Log a match between winner and loser
 */
export async function logMatch(page, winner, loser) {
  await goToTab(page, /log match/i);
  await page.locator('select').first().selectOption(winner);
  await page.locator('select').last().selectOption(loser);
  await page.getByRole('button', { name: 'SUBMIT MATCH' }).click();
}

/**
 * Clean up all test players
 */
export async function deleteAllPlayers(page) {
  await goToTab(page, /players/i);
  const deleteButtons = page.locator('.delete-btn');
  const count = await deleteButtons.count();
  for (let i = 0; i < count; i++) {
    page.once('dialog', dialog => dialog.accept());
    await deleteButtons.first().click();
  }
}
