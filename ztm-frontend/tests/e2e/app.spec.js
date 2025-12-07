import { test, expect } from '@playwright/test'

const API_URL = 'http://localhost:5000/api'
const FRONTEND_URL = 'http://localhost:5173'

test.describe('ZTM App E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(FRONTEND_URL)
  })

  test('should display login page', async ({ page }) => {
    await expect(page).toHaveURL(/.*login/)
    await expect(page.locator('h1, h2')).toContainText(/login/i)
  })

  test('should register a new user', async ({ page }) => {
    // Przejdź do strony rejestracji
    await page.click('text=/.*register.*/i')
    await expect(page).toHaveURL(/.*register/)

    // Wypełnij formularz rejestracji
    const timestamp = Date.now()
    const testLogin = `testuser${timestamp}`
    const testPassword = 'TestPassword123!'

    await page.fill('input[type="text"], input[name="login"]', testLogin)
    await page.fill('input[type="password"]', testPassword)

    // Wyślij formularz
    await page.click('button[type="submit"]')

    // Powinno przekierować do logowania lub dashboardu
    await page.waitForTimeout(1000)
    expect(page.url()).toMatch(/(login|dashboard)/)
  })

  test('should login and view dashboard', async ({ page }) => {
    // Najpierw zarejestruj użytkownika
    await page.goto(`${FRONTEND_URL}/register`)
    const timestamp = Date.now()
    const testLogin = `e2euser${timestamp}`
    const testPassword = 'TestPassword123!'

    await page.fill('input[type="text"], input[name="login"]', testLogin)
    await page.fill('input[type="password"]', testPassword)
    await page.click('button[type="submit"]')
    await page.waitForTimeout(1000)

    // Teraz zaloguj się
    await page.goto(`${FRONTEND_URL}/login`)
    await page.fill('input[type="text"], input[name="login"]', testLogin)
    await page.fill('input[type="password"]', testPassword)
    await page.click('button[type="submit"]')

    // Powinno przekierować do dashboardu
    await page.waitForURL(/.*dashboard/)
    await expect(page).toHaveURL(/.*dashboard/)
  })

  test('should add a stop and view live data', async ({ page }) => {
    // Najpierw zaloguj się 
    await page.goto(`${FRONTEND_URL}/login`)
    await page.fill('input[type="text"]', 'testuser')
    await page.fill('input[type="password"]', 'Test123!')
    await page.click('button[type="submit"]')
    
    await page.waitForTimeout(1000)

    // Przejdź do strony przystanków
    await page.goto(`${FRONTEND_URL}/stops`)

    // Dodaj przystanek
    await page.fill('input[placeholder*="Stop ID"]', '2019')
    await page.fill('input[placeholder*="Description"]', 'Miszewskiego')
    await page.click('button[type="submit"]')

    // Poczekaj aż przystanek zostanie dodany
    await page.waitForTimeout(2000)

    // Sprawdź czy karta przystanku jest wyświetlona
    await expect(page.locator('text=Miszewskiego')).toBeVisible()
  })

  test('should delete a stop', async ({ page }) => {
    // Zaloguj się
    await page.goto(`${FRONTEND_URL}/login`)
    await page.fill('input[type="text"]', 'testuser')
    await page.fill('input[type="password"]', 'Test123!')
    await page.click('button[type="submit"]')
    
    await page.waitForTimeout(1000)

    // Przejdź do strony przystanków
    await page.goto(`${FRONTEND_URL}/stops`)

    // Sprawdź czy są jakieś przystanki
    const stopCards = page.locator('[data-test="stop-card"]')
    const count = await stopCards.count()

    if (count > 0) {
      // Kliknij przycisk usuń przy pierwszym przystanku
      await page.click('[data-test="delete-button"]')
      
      // Poczekaj na usunięcie
      await page.waitForTimeout(1000)

      // Zweryfikuj że przystanek został usunięty
      const newCount = await stopCards.count()
      expect(newCount).toBe(count - 1)
    }
  })

  test('should logout successfully', async ({ page }) => {
    // Najpierw zaloguj się
    await page.goto(`${FRONTEND_URL}/login`)
    await page.fill('input[type="text"]', 'testuser')
    await page.fill('input[type="password"]', 'Test123!')
    await page.click('button[type="submit"]')
    
    await page.waitForTimeout(1000)

    // Kliknij przycisk wylogowania
    await page.click('text=/.*logout.*/i')

    // Powinno przekierować do logowania
    await expect(page).toHaveURL(/.*login/)
  })
})
