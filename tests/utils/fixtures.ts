import { test as base, expect } from '@playwright/test';
import { AuthPage } from '../pages/AuthPage';
import { ProductPage } from '../pages/ProductPage';
import { CartPage } from '../pages/CartPage';
import * as dotenv from 'dotenv';

dotenv.config();

type MyFixtures = {
    authPage: AuthPage;
    productPage: ProductPage;
    cartPage: CartPage;
  loggedInPage: AuthPage;
};

export const test = base.extend<MyFixtures>({
  authPage: async ({ page }, use) => {
    const authPage = new AuthPage(page);
    await authPage.navigateHome();
    await use(authPage);
  },

  productPage: async ({ page }, use) => {
    await use(new ProductPage(page));
  },

  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },

  loggedInPage: async ({ authPage}, use) => {
    const email = process.env.TEST_USER_EMAIL;
    const password = process.env.TEST_USER_PASSWORD;
    if (!email || !password) {
      throw new Error('Lack of credentials in .env');
    }
    await authPage.login(email, password);
    await expect(authPage.signInLink).toBeHidden(); 
    await use(authPage);
  },
});

export { expect } from '@playwright/test';


