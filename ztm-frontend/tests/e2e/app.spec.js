import { test, expect } from '@playwright/test'

const FRONTEND_URL = 'http://localhost:5173'

test.describe('ZTM App E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(FRONTEND_URL)
  })

  test('should display login page', async ({ page }) => {
    await expect(page).toHaveURL(/.*login/)
    await expect(page.locator('h1, h2')).toContainText(/logowanie|login/i)
  })

  test('should register a new user', async ({ page }) => {
    // Przejdź do strony rejestracji
    await page.click('text=/.*rejestra.*|.*register.*/i')
    await expect(page).toHaveURL(/.*register/)

    // Wypełnij formularz rejestracji
    const timestamp = Date.now()
    const testLogin = `testuser${timestamp}`
    const testPassword = 'TestPassword123!'

    await page.fill('input#login', testLogin)
    await page.fill('input#password', testPassword)

    // Wyślij formularz
    await page.click('button[type="submit"]')

    // Poczekaj na odpowiedź
    await page.waitForTimeout(2000)
    
    // Powinno przekierować do logowania lub dashboardu
    expect(page.url()).toMatch(/(login|dashboard)/)
  })

  test('should login and view dashboard', async ({ page }) => {
    // Najpierw zarejestruj użytkownika
    await page.goto(`${FRONTEND_URL}/register`)
    const timestamp = Date.now()
    const testLogin = `e2euser${timestamp}`
    const testPassword = 'TestPassword123!'

    await page.fill('input#login', testLogin)
    await page.fill('input#password', testPassword)
    await page.click('button[type="submit"]')
    await page.waitForTimeout(2000)

    // Teraz zaloguj się
    await page.goto(`${FRONTEND_URL}/login`)
    await page.fill('input#login', testLogin)
    await page.fill('input#password', testPassword)
    await page.click('button[type="submit"]')

    // Powinno przekierować do dashboardu
    await page.waitForTimeout(2000)
    await expect(page).toHaveURL(/.*dashboard/)
  })

  test('should add a stop and view live data', async ({ page }) => {
    // Najpierw zarejestruj i zaloguj
    const timestamp = Date.now()
    const testLogin = `stopuser${timestamp}`
    const testPassword = 'TestPassword123!'

    await page.goto(`${FRONTEND_URL}/register`)
    await page.fill('input#login', testLogin)
    await page.fill('input#password', testPassword)
    await page.click('button[type="submit"]')
    await page.waitForTimeout(2000)

    await page.goto(`${FRONTEND_URL}/login`)
    await page.fill('input#login', testLogin)
    await page.fill('input#password', testPassword)
    await page.click('button[type="submit"]')
    await page.waitForTimeout(2000)

    // Przejdź do strony przystanków
    await page.goto(`${FRONTEND_URL}/stops`)

    // Dodaj przystanek
    await page.fill('input#stopId', '2019')
    await page.fill('input#stopDesc', 'Miszewskiego')
    await page.click('button[type="submit"]')

    // Poczekaj aż przystanek zostanie dodany
    await page.waitForTimeout(3000)

    // Sprawdź czy karta przystanku jest wyświetlona
    await expect(page.locator('text=Miszewskiego')).toBeVisible()
  })

  test('should navigate to map view', async ({ page }) => {
    // Zarejestruj i zaloguj
    const timestamp = Date.now()
    const testLogin = `mapuser${timestamp}`
    const testPassword = 'TestPassword123!'

    await page.goto(`${FRONTEND_URL}/register`)
    await page.fill('input#login', testLogin)
    await page.fill('input#password', testPassword)
    await page.click('button[type="submit"]')
    await page.waitForTimeout(2000)

    await page.goto(`${FRONTEND_URL}/login`)
    await page.fill('input#login', testLogin)
    await page.fill('input#password', testPassword)
    await page.click('button[type="submit"]')
    await page.waitForTimeout(2000)

    // Przejdź do widoku mapy
    await page.goto(`${FRONTEND_URL}/map`)
    
    // Sprawdź czy jesteśmy na stronie mapy
    await expect(page).toHaveURL(/.*map/)
  })

  test('should logout successfully', async ({ page }) => {
    // Zarejestruj i zaloguj
    const timestamp = Date.now()
    const testLogin = `logoutuser${timestamp}`
    const testPassword = 'TestPassword123!'

    await page.goto(`${FRONTEND_URL}/register`)
    await page.fill('input#login', testLogin)
    await page.fill('input#password', testPassword)
    await page.click('button[type="submit"]')
    await page.waitForTimeout(2000)

    await page.goto(`${FRONTEND_URL}/login`)
    await page.fill('input#login', testLogin)
    await page.fill('input#password', testPassword)
    await page.click('button[type="submit"]')
    await page.waitForTimeout(2000)

    // Kliknij przycisk wylogowania
    await page.click('text=/.*wyloguj.*|.*logout.*/i')

    // Powinno przekierować do logowania
    await page.waitForTimeout(1000)
    await expect(page).toHaveURL(/.*login/)
  })
})
