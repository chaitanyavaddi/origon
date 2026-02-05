import { Page, Locator } from '@playwright/test';
import { step } from '@core/reporting/allure';

export interface InputConfig {
  selector?: string;
  name?: string;
  ariaLabel?: string;
  placeholder?: string;
}

/**
 * Standalone Input primitive
 * No inheritance - just a concrete implementation
 */
export class Input {
  private readonly _locator: Locator;

  constructor(private page: Page, private config: InputConfig) {
    this._locator = this.buildLocator();
  }

  @step('Input: Fill "{0}"')
  async fill(value: string): Promise<void> {
    await this._locator.fill(value);
  }

  @step('Input: Clear field')
  async clear(): Promise<void> {
    await this._locator.clear();
  }

  @step('Input: Get value')
  async getValue(): Promise<string> {
    return await this._locator.inputValue();
  }

  @step('Input: Check if visible')
  async isVisible(): Promise<boolean> {
    return await this._locator.isVisible();
  }

  @step('Input: Wait for visible')
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
    if (this.config.name) {
      return this.page.locator(`input[name="${this.config.name}"]`);
    }
    if (this.config.ariaLabel) {
      return this.page.locator(`input[aria-label="${this.config.ariaLabel}"]`);
    }
    if (this.config.placeholder) {
      return this.page.locator(`input[placeholder="${this.config.placeholder}"]`);
    }
    
    throw new Error(
      `Input config must have selector, name, ariaLabel, or placeholder. ` +
      `Received: ${JSON.stringify(this.config)}`
    );
  }
}