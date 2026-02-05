import { Page, Locator } from '@playwright/test';
import { step } from '@core/reporting/allure';

export interface ButtonConfig {
  selector?: string;
  text?: string;
  ariaLabel?: string;
}

/**
 * Standalone Button primitive
 * No inheritance - just a concrete implementation
 */
export class Button {
  private readonly _locator: Locator;

  constructor(private page: Page, private config: ButtonConfig) {
    this._locator = this.buildLocator();
  }

  @step('Button: Click')
  async click(): Promise<void> {
    await this._locator.click();
  }

  @step('Button: Check if enabled')
  async isEnabled(): Promise<boolean> {
    return await this._locator.isEnabled();
  }

  @step('Button: Check if visible')
  async isVisible(): Promise<boolean> {
    return await this._locator.isVisible();
  }

  @step('Button: Wait for visible')
  async waitForVisible(): Promise<void> {
    await this._locator.waitFor({ state: 'visible' });
  }

  get element(): Locator {
    return this._locator;
  }

  private buildLocator(): Locator {
    if (this.config.selector) {
      return this.page.locator(this.config.selector);
    }
    if (this.config.ariaLabel) {
      return this.page.locator(`button[aria-label="${this.config.ariaLabel}"]`);
    }
    if (this.config.text) {
      return this.page.locator(`button:has-text("${this.config.text}")`);
    }
    
    throw new Error(
      `Button config must have selector, ariaLabel, or text. ` +
      `Received: ${JSON.stringify(this.config)}`
    );
  }
}