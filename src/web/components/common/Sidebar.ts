import { Page, Locator } from '@playwright/test';
import { step } from '@core/reporting/allure';

/**
 * Generic Sidebar component
 * Can be extended by domain-specific sidebars
 */
export class Sidebar {
  constructor(protected page: Page) {}

  async clickNavItem(text: string): Promise<void> {
    return await step(`Sidebar: Click navigation item "${text}"`, async () => {
      await this.getNavItem(text).click();
    });
  }

  async isNavItemActive(text: string): Promise<boolean> {
    return await step(`Sidebar: Check if navigation item "${text}" is active`, async () => {
      const item = this.getNavItem(text).locator('..');
      const classes = await item.getAttribute('class') || '';
      return classes.includes('_catalystNavbarItemActive_');
    });
  }

  async getUserEmail(): Promise<string> {
    return await step('Sidebar: Get user email', async () => {
      const userProfile = this.page.locator('[data-testid="user-profile-menu"]');
      return await userProfile.textContent() || '';
    });
  }

  protected getNavItem(text: string): Locator {
    return this.page.locator(`nav button:has-text("${text}")`);
  }

  get element(): Locator {
    return this.page.locator('nav');
  }
}