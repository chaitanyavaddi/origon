import { Page, Locator } from '@playwright/test';
import { step } from '@core/reporting/allure';
import { Button } from '@web/primitives/Button';

export interface ModalConfig {
  selector: string;
  closeButtonSelector?: string;
}

/**
 * Generic Modal component
 * Built using primitives, can be extended by domain-specific modals
 */
export class Modal {
  protected closeButton: Button;
  protected readonly _locator: Locator;

  constructor(protected page: Page, protected config: ModalConfig) {
    this._locator = page.locator(config.selector);
    
    const closeSelector = config.closeButtonSelector || 
                         `${config.selector} button[aria-label="Close"]`;
    this.closeButton = new Button(page, { selector: closeSelector });
  }

  async isOpen(): Promise<boolean> {
    return await step('Modal: Check if open', async () => {
      return await this._locator.isVisible();
    });
  }

  async close(): Promise<void> {
    return await step('Modal: Close', async () => {
      await this.closeButton.click();
      await this.waitForClose();
    });
  }

  async waitForOpen(): Promise<void> {
    return await step('Modal: Wait for open', async () => {
      await this._locator.waitFor({ state: 'visible', timeout: 5000 });
    });
  }

  async waitForClose(): Promise<void> {
    return await step('Modal: Wait for close', async () => {
      await this._locator.waitFor({ state: 'hidden', timeout: 5000 });
    });
  }

  get element(): Locator {
    return this._locator;
  }
}