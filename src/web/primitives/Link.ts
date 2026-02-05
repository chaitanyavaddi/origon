import { Page, Locator } from '@playwright/test';
import { step } from '@core/reporting/allure';

export interface LinkConfig {
  selector?: string;
  text?: string;
  href?: string;
}

/**
 * Standalone Link primitive
 * No inheritance - just a concrete implementation
 */
export class Link {
  private readonly _locator: Locator;

  constructor(private page: Page, private config: LinkConfig) {
    this._locator = this.buildLocator();
  }

  @step('Link: Click')
  async click(): Promise<void> {
    await this._locator.click();
  }

  @step('Link: Check if visible')
  async isVisible(): Promise<boolean> {
    return await this._locator.isVisible();
  }

  @step('Link: Get href')
  async getHref(): Promise<string | null> {
    return await this._locator.getAttribute('href');
  }

  get element(): Locator {
    return this._locator;
  }

  private buildLocator(): Locator {
    if (this.config.selector) {
      return this.page.locator(this.config.selector);
    }
    if (this.config.href && this.config.text) {
      return this.page.locator(`a[href="${this.config.href}"]:has-text("${this.config.text}")`);
    }
    if (this.config.href) {
      return this.page.locator(`a[href="${this.config.href}"]`);
    }
    if (this.config.text) {
      return this.page.locator(`a:has-text("${this.config.text}")`);
    }
    
    throw new Error(
      `Link config must have selector, href, or text. ` +
      `Received: ${JSON.stringify(this.config)}`
    );
  }
}