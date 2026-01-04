import { BasePage } from './BasePage';
import { Locator, Page, expect } from '@playwright/test';


export class AuthPage extends BasePage {
  readonly registerLink: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly dobInput: Locator;
  readonly addressInput: Locator;
  readonly postcodeInput: Locator;
  readonly cityInput: Locator;
  readonly stateInput: Locator;
  readonly countrySelect: Locator;
  readonly phoneInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly registerButton: Locator;
  readonly loginButton: Locator;
  readonly navMenu: Locator;
  readonly signOutLink: Locator;
  readonly emailError: Locator;

  constructor(page: Page) {
    super(page);
    this.registerLink = page.getByTestId('register-link');
    this.firstNameInput = page.getByTestId('first-name');
    this.lastNameInput = page.getByTestId('last-name');
    this.dobInput = page.getByTestId('dob');
    this.addressInput = page.getByTestId('street');
    this.postcodeInput = page.getByTestId('postal_code');
    this.cityInput = page.getByTestId('city');
    this.stateInput = page.getByTestId('state');
    this.countrySelect = page.getByLabel('Country');
    this.phoneInput = page.getByTestId('phone');
    this.emailInput = page.getByTestId('email');
    this.passwordInput = page.getByTestId('password');
    this.registerButton = page.getByTestId('register-submit');
    this.loginButton = page.getByTestId('login-submit');
    this.navMenu = page.getByTestId('nav-menu');
    this.signOutLink = page.getByTestId('nav-sign-out');
    this.emailError = page.locator('[data-test="email-error"]');
  }

  async register(user: any) {
    await this.openMobileMenuIfNeeded();
    await this.signInLink.click();
    await this.registerLink.click();
    await this.firstNameInput.fill(user.firstName);
    await this.lastNameInput.fill(user.lastName);
    await this.dobInput.fill(user.dob);
    await this.addressInput.fill(user.street);
    await this.postcodeInput.fill(user.postcode);
    await this.cityInput.fill(user.city);
    await this.stateInput.fill(user.state);
    await this.countrySelect.selectOption(user.country);
    await this.phoneInput.fill(user.phone);
    await this.emailInput.fill(user.email);
    await this.passwordInput.fill(user.password);
    await this.registerButton.click();
  }

  async login(email: string, password: string) {
    await this.openMobileMenuIfNeeded();
    await this.signInLink.click();
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await expect(this.signInLink).toBeHidden({ timeout: 10000 });
  }

  async verifyLoggedIn(firstName: string) {
    await expect(this.navMenu).toContainText(firstName);
  }

  async logout() {
    await this.openMobileMenuIfNeeded();
    try {
      if (!(await this.navMenu.isVisible())) {
        if ((await this.navToggle.count()) > 0) {
          await this.navToggle.click().catch(() => undefined);
          await this.page.waitForTimeout(200);
        }
      }
    } catch {}
    await this.navMenu.waitFor({ state: 'visible', timeout: 5000 }).catch(() => undefined);
    let clicked = false;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        await this.navMenu.click({ timeout: 2000 });
        clicked = true;
        break;
      } catch {
        try {
          await this.openMobileMenuIfNeeded();
        } catch {}
        try {
          if ((await this.navToggle.count()) > 0) await this.navToggle.click().catch(() => undefined);
        } catch {}
        await this.page.waitForTimeout(200);
      }
    }
    if (!clicked) {
      await this.navMenu.click().catch(() => undefined);
    }
    await this.signOutLink.waitFor({ state: 'visible', timeout: 5000 }).catch(() => undefined);
    await this.signOutLink.click();
  }
}
