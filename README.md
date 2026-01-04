
# Playwright Automation - Tool Shop

Test automation suite for tool shop application using Playwright Test with Page Object pattern.

## Prerequisites
- Node.js (v16+)
- NPM or Yarn
- `.env` file with test credentials:
  ```
  TEST_USER_EMAIL=admin@practicesoftwaretesting.com
  TEST_USER_PASSWORD=welcome01
  ```

## Installation
```bash
npm install
npx playwright install
```

## Running Tests

### All tests (Desktop + Mobile)
```bash
npx playwright test
```

### Desktop only (Chromium)
```bash
npx playwright test --project=chromium
```

### Mobile Chrome
```bash
npx playwright test --project="Mobile Chrome"
```

### Mobile Safari
```bash
npx playwright test --project="Mobile Safari"
```

### Specific spec file
```bash
npx playwright test tests/specs/auth.spec.ts
```

### Single test by name
```bash
npx playwright test --grep "Logout and return to signed-out state"
```

### Debug mode (UI + headed)
```bash
npx playwright test --ui
npx playwright test --headed --debug
```

### With trace recording
```bash
npx playwright test --trace on
```

## Reports & Artifacts

### HTML Report
```bash
npx playwright show-report
```

### Allure Report (if configured)
```bash
allure generate allure-results -o allure-report
allure open allure-report
```

## Project Structure
```
tests/
  ├── pages/          # Page Objects (BasePage, AuthPage, ProductPage, CartPage)
  ├── specs/          # Test specs (auth.spec.ts, products.spec.ts, cart.spec.ts)
  └── utils/          # Helpers (fixtures, test-data, StringUtils)
playwright.config.ts  # Playwright configuration (projects, reporters, timeouts)
.env                  # Test credentials (local only, not committed)
NOTES.md              # Design decisions and known limitations
```

## Key Features
- **Page Object Pattern**: Reusable page classes with locators and methods
- **Mobile Testing**: Support for Pixel 5 (Chrome) and iPhone 12 (Safari) viewports
- **Robust Waits**: Retry logic and mobile-aware element visibility checks
- **HTML & Allure Reporters**: Detailed test results with screenshots, videos, and traces
- **Test Fixtures**: Custom `loggedInPage` fixture for authenticated flow testing

