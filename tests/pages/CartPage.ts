import { BasePage } from './BasePage';
import { Page, expect, Locator } from '@playwright/test';
import { StringUtils } from '../utils/StringUtils';

export class CartPage extends BasePage {
  readonly navCartLink: Locator;
  readonly continueShoppingText: Locator;
  readonly productQuantityInput: Locator;
  readonly cartTotalById: Locator;
  readonly cartTotalByFallback: Locator;
  readonly cartTableRows: Locator;

  constructor(page: Page) {
    super(page);
    this.navCartLink = page.locator('a[data-test="nav-cart"]');
    this.continueShoppingText = page.getByText('Continue Shopping');
    this.productQuantityInput = page.getByTestId('product-quantity');
    this.cartTotalById = page.getByTestId('cart-total');
    this.cartTotalByFallback = page.locator('td').last();
    this.cartTableRows = page.locator('table tbody tr');
  }


  async navigateToCart() {
    await this.openMobileMenuIfNeeded();
    await this.navCartLink.click().catch(async () => {
      if ((await this.navToggle.count()) > 0) {
        await this.navToggle.click().catch(() => undefined);
        await this.page.waitForTimeout(150);
      }
      await this.navCartLink.click().catch(() => undefined);
    });
    await expect(this.continueShoppingText).toBeVisible();
  }

  async increaseQuantity(quantity = 2) {
    const input = this.productQuantityInput.first();
    await input.fill(String(quantity));
    await input.press('Enter');
    await expect(input).toHaveValue(String(quantity)); 
  }

  async getTotal(): Promise<number> {
    if ((await this.cartTotalById.count()) > 0) {
      await this.cartTotalById.first().waitFor({ state: 'visible', timeout: 3000 }).catch(() => undefined);
      const text = (await this.cartTotalById.first().innerText()).replace(/[^0-9.,-]/g, '');
      return StringUtils.parseCurrency(text);
    }
    if ((await this.cartTotalByFallback.count()) === 0) return 0;
    const totalText = (await this.cartTotalByFallback.innerText()).replace(/[^0-9.,-]/g, '');
    return StringUtils.parseCurrency(totalText);
  }

  async verifyTotalIncreased(previousTotal: number) {
    const deadline = Date.now() + 5000;
    let current = 0;
    while (Date.now() < deadline) {
      current = await this.getTotal();
      if (current > previousTotal) break;
      await this.page.waitForTimeout(300);
    }
    await expect(current).toBeGreaterThan(previousTotal);
  }

  async getCartItems(): Promise<Array<{ name: string; price: number; quantity: number }>> {
    const items: Array<{ name: string; price: number; quantity: number }> = [];
    const rowCount = await this.cartTableRows.count();

    for (let i = 0; i < rowCount; i++) {
      const row = this.cartTableRows.nth(i);
      const cells = row.locator('td');
      const cellsCount = await cells.count();
      let name = '';
      try {
        if (cellsCount > 0) name = (await cells.nth(0).innerText()).trim();
      } catch {}
      let price = 0;
      try {
        const priceCellIndex = Math.max(0, cellsCount - 2);
        const priceText = (await cells.nth(priceCellIndex).innerText()).replace(/[^0-9.,-]/g, '');
        price = StringUtils.parseCurrency(priceText);
      } catch {}
      let quantity = 1;
      try {
        const input = row.locator('input');
        if ((await input.count()) > 0) {
          const val = await input.first().inputValue();
          quantity = parseInt(val, 10) || 1;
        } else if (cellsCount > 1) {
          const qtyText = (await cells.nth(1).innerText()).replace(/[^0-9]/g, '');
          quantity = parseInt(qtyText, 10) || 1;
        }
      } catch {}
      items.push({ name, price, quantity });
    }
    return items;
  }
}