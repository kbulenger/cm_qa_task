# Developer Notes & Architecture Decisions

This document outlines the architectural choices, assumptions, and known limitations of the QA suite. It serves as a guide to understanding how the tests handle responsive design, authentication, and data management.

## Architecture & Key Choices

- **Playwright + Page Object Model**: I chose this structure to keep the code modular. It allows us to reuse logic across Desktop and Mobile configurations without code duplication.
- **Custom Fixtures (`loggedInPage`)**: Instead of repeating login steps in every test, a custom fixture handles the entire authentication flow in the background. This keeps the test files clean and focused purely on business logic.
- **Dynamic Test Data**: Registration tests use timestamp-based email generation (via `test-data.ts`) to ensure we never hit "User already exists" errors during repeated runs.

## Mobile Responsiveness Strategy
Testing on mobile (simulated iPhone/Pixel) introduced specific challenges, primarily hidden elements and navigation drawers. Here is how the suite handles them:

- **The "Hamburger" Menu**: Navigation elements are often hidden behind a toggle on mobile. I implemented a helper `openMobileMenuIfNeeded()` that automatically detects if the menu is closed and opens it before attempting navigation.
- **Resilient Search**: On mobile views, search inputs can be tricky (sometimes covered by filters). The `searchProduct()` method tries standard interactions first, but falls back to JavaScript execution (`evaluate`) to force-set the value if standard input fails.
- **Retry Logic**: Mobile animations can be flaky. Critical interactions (like logging out or checking cart counts) include smart retry loops to wait for UI stability.

## Known Limitations & Scope Gaps

Some scenarios were intentionally omitted or limited due to technical constraints of the test environment:

1.  **"Path B" (Category/Featured Products)**: These flows were not implemented because the necessary UI elements (specific category filters or reliable "featured" sections) are currently missing or inconsistent on the application homepage.
2.  **Checkout & Payment**: The suite verifies the cart and proceeds to checkout, but does not finalize payment. This avoids the complexity of managing sandbox credit cards and payment gateway interactions.
3.  **Coupons**: The discount code flow is skipped as the input field was not present in the default checkout view.

## Assumptions (The "Contract")
The stability of these tests relies on specific DOM attributes. If these change, tests will likely fail:
- **Selectors**: We rely heavily on `data-test` attributes (e.g., `nav-sign-in`, `cart-quantity`, `search-query`).
- **Structure**: Product listings are expected to be within `.card` containers.

## Environment & Credentials
- **Security**: Credentials are **never** hardcoded.
- **Setup**: You must create a `.env` file in the root directory with `TEST_USER_EMAIL` and `TEST_USER_PASSWORD`.
- **CI/CD**: For pipeline execution, ensure these variables are added to the repository secrets.