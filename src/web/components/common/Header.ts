import { Page, Locator } from '@playwright/test';
import { step } from '@core/reporting/allure';

/**
 * Generic Header component
 */
export class Header {
  constructor(protected page: Page) {}

  async getTitle(): Promise<string> {
    return await step('Header: Get title', async () => {
      const title = this.page.locator('header h1');
      return await title.textContent() || '';
    });
  }

  async isVisible(): Promise<boolean> {
    return await step('Header: Check if visible', async () => {
      return await this.element.isVisible();
    });
  }

  get element(): Locator {
    return this.page.locator('header');
  }
}