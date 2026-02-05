import { Page, Locator } from '@playwright/test';
import { step } from '@core/reporting/allure';

/**
 * Generic Header component
 */
export class Header {
  constructor(protected page: Page) {}

  @step('Header: Get title')
  async getTitle(): Promise<string> {
    const title = this.page.locator('header h1');
    return await title.textContent() || '';
  }

  @step('Header: Check if visible')
  async isVisible(): Promise<boolean> {
    return await this.element.isVisible();
  }

  get element(): Locator {
    return this.page.locator('header');
  }
}