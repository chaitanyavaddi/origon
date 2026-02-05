import { Page, Locator } from '@playwright/test';
import { step } from '@core/reporting/allure';

/**
 * Generic Sidebar component
 * Can be extended by domain-specific sidebars
 */
export class Sidebar {
  constructor(protected page: Page) {}

  @step('Sidebar: Click navigation item "{0}"')
  async clickNavItem(text: string): Promise<void> {
    await this.getNavItem(text).click();
  }

  @step('Sidebar: Check if navigation item "{0}" is active')
  async isNavItemActive(text: string): Promise<boolean> {
    const item = this.getNavItem(text).locator('..');
    const classes = await item.getAttribute('class') || '';
    return classes.includes('_catalystNavbarItemActive_');
  }

  @step('Sidebar: Get user email')
  async getUserEmail(): Promise<string> {
    const userProfile = this.page.locator('[data-testid="user-profile-menu"]');
    return await userProfile.textContent() || '';
  }

  protected getNavItem(text: string): Locator {
    return this.page.locator(`nav button:has-text("${text}")`);
  }

  get element(): Locator {
    return this.page.locator('nav');
  }
}