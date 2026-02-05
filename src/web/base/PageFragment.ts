import { Page } from '@playwright/test';

/**
 * Abstract base class for all pages
 * Enforces navigation contract and provides common page utilities
 */
export abstract class PageFragment {
  constructor(protected page: Page) {}

  /**
   * Navigate to the page
   * Must be implemented by all pages
   */
  abstract navigate(): Promise<void>;

  /**
   * Wait for page to be fully loaded
   */
  async waitForLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Get current URL
   */
  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  /**
   * Set viewport size
   */
  async setViewport(width: number, height: number): Promise<void> {
    await this.page.setViewportSize({ width, height });
  }
}