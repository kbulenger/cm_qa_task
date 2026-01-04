import { Page } from '@playwright/test';

export class NetworkUtils {
  static async waitForResponse(
    page: Page, 
    urlPart: string, 
    statusCode: number = 200, 
    timeout: number = 5000
  ): Promise<void> {
    await page.waitForResponse(
      (resp) => resp.url().includes(urlPart) && resp.status() === statusCode,
      { timeout }
    ).catch(() => {
    });
    await page.waitForTimeout(200);
  }
}