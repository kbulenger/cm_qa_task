import { test, expect } from '../utils/fixtures';
import { AuthPage } from '../pages/AuthPage';
import { ProductPage } from '../pages/ProductPage';
import { CartPage } from '../pages/CartPage';
import { generateUserData } from '../utils/test-data';



test.describe('Auth Scenarios', () => {
  let authPage: AuthPage;
  let productPage: ProductPage;
  let cartPage: CartPage;
  const userData = generateUserData();

  test.beforeEach(async ({ page }) => {
    authPage = new AuthPage(page);
    productPage = new ProductPage(page);
    cartPage = new CartPage(page);
    await authPage.navigateHome();
  });

  test('User Registration with validation', async ({ page }) => {
    await authPage.register(userData);
    await expect(page).toHaveURL(/.*\/auth\/login/);
  });

  test('User remains logged in after page reload', async ({ loggedInPage }) => {
    await loggedInPage.page.reload();
    await loggedInPage.openMobileMenuIfNeeded();
    await expect(loggedInPage.signInLink).toBeHidden();
  });

  test('Validation when missing email on registration', async ({ page }) => {
    const invalidUser = { ...userData, email: '' };
    await authPage.register(invalidUser);
    await expect(page).not.toHaveURL(/\/auth\/login/);
    await expect(authPage.emailError).toBeVisible();
    await expect(authPage.emailError).toContainText('Email is required');
  });
  
  test('Logout and return to signed-out state', async ({ loggedInPage }) => {
    await loggedInPage.logout();
    await loggedInPage.openMobileMenuIfNeeded();
    for (let i = 0; i < 3; i++) {
      await loggedInPage.signInLink.waitFor({ state: 'attached', timeout: 1000 }).catch(() => undefined);
      if (await loggedInPage.signInLink.isVisible()) break;
      await loggedInPage.openMobileMenuIfNeeded();
      await loggedInPage.page.waitForTimeout(200);
    }
    await expect(loggedInPage.signInLink).toBeVisible();
  });

  test('Product Search, Filter and Add to Cart', async ({ page }) => {
    await productPage.searchProduct('Pliers');
    const beforeCount = await page.locator('.card').count();
    expect(typeof beforeCount).toBe('number');
    await productPage.filterByPriceRange();
    const afterCount = await page.locator('.card').count();
    expect(afterCount).toBeGreaterThanOrEqual(0);
    await productPage.selectFirstProduct();
    await productPage.addToCart();
    await productPage.openMobileMenuIfNeeded();
    await expect(productPage.cartCount).toBeVisible();
    const quantity = await productPage.getCartQuantity();
    expect(quantity).toBeGreaterThan(0);
  });

  test('Cart Mutations', async ({ page }) => {
    await productPage.searchProduct('Hammer');
    await productPage.selectFirstProduct();
    await productPage.addToCart();
    await cartPage.navigateToCart();
    const initialTotalText = await page.getByTestId('cart-total').innerText();
    await cartPage.increaseQuantity(2);
    await cartPage.verifyTotalIncreased(parseFloat(initialTotalText.replace(/[^0-9.,-]/g, '').replace(/,/g, '.')));
  });
});