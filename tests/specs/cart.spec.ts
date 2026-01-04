import { test, expect } from '@playwright/test';
import { ProductPage } from '../pages/ProductPage';
import { CartPage } from '../pages/CartPage';

test.describe('Cart Operations', () => {
  test('Add product to cart and update quantity', async ({ page }) => {
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    await productPage.navigateHome();
    await productPage.searchProduct('Hammer');
    await productPage.selectFirstProduct();
    const details = await productPage.getProductDetails();
    await productPage.addToCart();
    const qty = await productPage.getCartQuantity();
    expect(qty).toBeGreaterThan(0);
    await cartPage.navigateToCart();
    const items = await cartPage.getCartItems();
    const match = items.find(i => i.name && details.name && i.name.includes(details.name));
    expect(match).toBeTruthy();
    if (match) {
      if (details.price > 0) {
        expect(Math.abs(match.price - details.price)).toBeLessThanOrEqual(Math.max(1, details.price * 0.05));
      }
      expect(match.quantity).toBeGreaterThanOrEqual(1);
    }
    const totalBefore = await cartPage.getTotal();
    await cartPage.increaseQuantity(2);
    await cartPage.verifyTotalIncreased(totalBefore);
    const qtyInput = page.getByTestId('product-quantity');
    await expect(qtyInput).toHaveValue('2');
  });
});