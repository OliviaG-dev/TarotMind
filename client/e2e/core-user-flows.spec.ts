import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test('tirage complet puis visible dans historique', async ({ page }) => {
  await page.route('**/api/interpret', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        interpretation: 'Interpretation E2E de test.',
        source: 'mock',
      }),
    })
  })

  await page.goto('/tirage')
  await page.locator('select.spread-schema__select').first().selectOption('0')
  await page.getByRole('button', { name: /generer/i }).click()

  await expect(page.getByText('Récapitulatif')).toBeVisible()
  await expect(page.getByText('Interpretation E2E de test.')).toBeVisible()

  await page.goto('/historique')
  await expect(page.getByText(/Tirage · 1 carte/)).toBeVisible()
})

test('carte du jour stable apres rechargement', async ({ page }) => {
  await page.goto('/carte-du-jour')

  const todayCard = page
    .locator('.daily-card__reveal')
    .first()
    .locator('.daily-card__card-name')
  const firstName = await todayCard.innerText()

  await page.reload()
  await expect(todayCard).toHaveText(firstName)
})

test('profil persiste apres reload', async ({ page }) => {
  await page.goto('/profil')

  const status = page.getByLabel('Statut amoureux')
  await status.selectOption('single')
  await page.reload()
  await expect(status).toHaveValue('single')
})

test('analyse historique affiche le resultat IA', async ({ page }) => {
  await page.route('**/api/interpret', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        interpretation: 'Interpretation pour peupler historique.',
        source: 'mock',
      }),
    })
  })
  await page.route('**/api/history-insights', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        interpretation: 'Analyse IA historique E2E.',
        source: 'mock',
      }),
    })
  })

  await page.goto('/tirage')
  await page.locator('select.spread-schema__select').first().selectOption('0')
  await page.getByRole('button', { name: /generer/i }).click()
  await expect(page.getByText('Récapitulatif')).toBeVisible()

  await page.goto('/historique')
  await page.getByRole('button', { name: /Analyser mon historique/i }).click()
  await expect(page.getByText('Analyse IA historique E2E.')).toBeVisible()
})
