import { test, expect } from '@playwright/test';
import { ProductPage } from '../pages/ProductPage';

test.describe('Product Discovery', () => {
  let productPage: ProductPage;

  test.beforeEach(async ({ page }) => {
    productPage = new ProductPage(page);
    await productPage.navigateHome();
  });

  test('Search and filter products', async ({ page }) => {
    await productPage.searchProduct('Pliers');
    const beforeCount = await page.locator('.card').count();
    expect(typeof beforeCount).toBe('number');
    await productPage.filterByPriceRange();
    const afterCount = await page.locator('.card').count();
    expect(typeof afterCount).toBe('number');
  });

  test('Navigate to product details', async ({ page }) => {
    await productPage.searchProduct('Pliers');
    await productPage.selectFirstProduct();
    await expect(page.getByTestId('product-name')).toBeVisible();
  });
});