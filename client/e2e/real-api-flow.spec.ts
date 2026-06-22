import { expect, test } from '@playwright/test'

test('tirage complet avec API Express reelle (mock IA serveur)', async ({ page }) => {
  await page.goto('/tirage')
  await page.locator('select.spread-schema__select').first().selectOption('0')
  await page.getByRole('button', { name: /générer/i }).click()

  await expect(page.getByText('Récapitulatif')).toBeVisible({ timeout: 20_000 })
  await expect(page.getByText(/Cartes reçues \(validation OK\)/i)).toBeVisible()
})
