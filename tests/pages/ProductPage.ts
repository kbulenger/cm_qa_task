import { BasePage } from './BasePage';
import { Page, expect, Locator } from '@playwright/test';
import { StringUtils } from '../utils/StringUtils';   

export class ProductPage extends BasePage {
  readonly searchInput: Locator;
  readonly searchSubmit: Locator;
  readonly productCardTitle: Locator;
  readonly filterCheckbox: Locator;
  readonly sortSelect: Locator;
  readonly addToCartButton: Locator;
  readonly alertToast: Locator;
  readonly productNameTestId: Locator;
  readonly productNameH1: Locator;
  readonly productNameClass: Locator;
  readonly productCardTitleFallback: Locator;
  readonly filtersToggle: Locator;
  readonly productPriceTestId: Locator;
  readonly productPriceClass: Locator;
  readonly productPriceGeneric: Locator;
  readonly productCardPrice: Locator;

  constructor(page: Page) {
    super(page);
    this.searchInput = page.getByTestId('search-query');
    this.searchSubmit = page.getByTestId('search-submit');
    this.productCardTitle = page.locator('.card-title'); 
    this.filterCheckbox = page.getByRole('checkbox', { name: 'Hand Tools' });
    this.sortSelect = page.getByRole('combobox');
    this.addToCartButton = page.getByTestId('add-to-cart');
    this.alertToast = page.getByRole('alert');
    this.productNameTestId = page.getByTestId('product-name');
    this.productNameH1 = page.locator('h1');
    this.productNameClass = page.locator('.product-title');
    this.productCardTitleFallback = page.locator('.card-title');
    this.filtersToggle = page.getByTestId('filters');
    this.productPriceTestId = page.getByTestId('product-price');
    this.productPriceClass = page.locator('.product-price');
    this.productPriceGeneric = page.locator('.price');
    this.productCardPrice = page.locator('.card-price');
  }

  async searchProduct(keyword: string) {
    try {
      if ((await this.filtersToggle.count()) > 0 && await this.filtersToggle.isVisible()) {
        await this.filtersToggle.first().click().catch(() => undefined);
        await this.page.waitForTimeout(150);
      }
    } catch {}

    
    await this.searchInput.first().waitFor({ state: 'attached', timeout: 2000 }).catch(() => undefined);
    if (!(await this.searchInput.first().isVisible())) {
      try {
        if ((await this.filtersToggle.count()) > 0) {
          await this.filtersToggle.first().evaluate((el: HTMLElement) => el.scrollIntoView({ block: 'center' })).catch(() => undefined);
          await this.filtersToggle.first().click({ force: true }).catch(() => undefined);
          await this.page.waitForTimeout(250);
        }
      } catch {}
    }
    await this.searchInput.first().waitFor({ state: 'visible', timeout: 3000 }).catch(() => undefined);
    if (!(await this.searchInput.first().isVisible())) {
      try {
        const el = await this.searchInput.first().elementHandle();
        if (el) {
          await el.evaluate((e, v) => {
            (e as HTMLInputElement).value = v;
            e.dispatchEvent(new Event('input', { bubbles: true }));
          }, keyword);
          await this.searchSubmit.click().catch(() => undefined);
          await expect(this.productCardTitle.first()).toBeVisible();
          return;
        }
      } catch {}
    }
    await this.searchInput.fill(keyword);
    await this.searchSubmit.click();
    await expect(this.productCardTitle.first()).toBeVisible();
  }

  async applyFilters() {
    if ((await this.filterCheckbox.count()) > 0) {
      await this.filterCheckbox.check().catch(() => undefined);
      return;
    }
    if ((await this.sortSelect.count()) > 0) {
      await this.sortSelect.first().selectOption({ label: 'Price (Low - High)' }).catch(() => undefined);
      return;
    }
    await this.page.waitForTimeout(200);
  }

  async selectFirstProduct() {
    const title = this.productCardTitle.first();
    await title.waitFor({ state: 'visible', timeout: 7000 });
    try {
      await title.evaluate((el: HTMLElement) => el.scrollIntoView({ block: 'center', inline: 'center' }));
    } catch {
    }
    for (let attempt = 0; attempt < 3; attempt++) {
      await title.click().catch(() => undefined);
      try {
        await expect(this.productNameTestId).toBeVisible({ timeout: 5000 });
        return;
      } catch (e) {
        if (attempt === 2) throw e;
        await this.page.waitForTimeout(500);
      }
    }
  }

  async addToCart() {
    await this.addToCartButton.click();
    await expect(this.alertToast).toContainText('Product added to shopping cart');
    await expect(this.alertToast).toBeHidden({ timeout: 15000 });
  }

  async getProductDetails() {
    let name = '';
    const nameCandidates = [
      this.productNameTestId, 
      this.productNameH1, 
      this.productNameClass, 
      this.productCardTitleFallback
    ];

    for (const cand of nameCandidates) {
      if ((await cand.count()) > 0) {
        try {
          name = (await cand.first().innerText()).trim();
          if (name) break;
        } catch {}
      }
    }
    let price = 0;
    const priceCandidates = [
      this.productPriceTestId, 
      this.productPriceClass, 
      this.productPriceGeneric, 
      this.productCardPrice
    ];

    for (const cand of priceCandidates) {
      if ((await cand.count()) > 0) {
        try {
          const txt = await cand.first().innerText();
          const val = StringUtils.parseCurrency(txt); 
          if (!Number.isNaN(val)) { price = val; break; }
        } catch {}
      }
    }

    return { name, price };
  }
}

