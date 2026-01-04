import { Page, Locator, expect } from '@playwright/test';

export class BasePage {
  readonly page: Page;
  readonly signInLink: Locator;
  readonly homeLink: Locator;
  readonly cartCount: Locator;
  readonly navToggle: Locator;

  constructor(page: Page) {
    this.page = page;
    this.signInLink = page.getByTestId('nav-sign-in');
    this.homeLink = page.getByTestId('nav-home');
    this.cartCount = page.getByTestId('cart-quantity');
    this.navToggle = page.getByRole('button', { name: 'Toggle navigation' });
  }

  async navigateHome() {
    await this.page.goto('/');
  }

  async getCartQuantity(): Promise<number> {
    await this.openMobileMenuIfNeeded();
    if ((await this.cartCount.count()) === 0) return 0;
    try {
      const text = (await this.cartCount.first().innerText()).trim();
      const digits = text.replace(/[^0-9-]/g, '');
      const val = parseInt(digits, 10);
      return Number.isNaN(val) ? 0 : val;
    } catch {
      try {
        const handle = await this.cartCount.first().elementHandle();
        if (handle) {
          const text = await this.page.evaluate(e => (e as HTMLElement).textContent || '', handle);
          const digits = (text || '').replace(/[^0-9-]/g, '');
          const val = parseInt(digits, 10);
          return Number.isNaN(val) ? 0 : val;
        }
      } catch {}
    }
    return 0;
  }

  async openMobileMenuIfNeeded() {
    if (await this.signInLink.count() > 0 && await this.signInLink.isVisible()) return;
    if ((await this.navToggle.count()) > 0) {
      try {
        await this.navToggle.click();
        await this.page.waitForTimeout(200);
      } catch {
      }
    }
  }
}
