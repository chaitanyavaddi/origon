import { Page } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { AuthSteps } from './steps/AuthSteps';
import { DashboardSteps } from './steps/DashboardSteps';

/**
 * Main facade for Certa application
 * Provides access to pages and steps
 */
export class Certa {
  constructor(private page: Page) {}

  // Pages
  get loginPage(): LoginPage {
    return new LoginPage(this.page);
  }

  get dashboardPage(): DashboardPage {
    return new DashboardPage(this.page);
  }

  // Steps
  get auth(): AuthSteps {
    return new AuthSteps(this.page);
  }

  get dashboard(): DashboardSteps {
    return new DashboardSteps(this.page);
  }
}

/**
 * Factory function to create Certa instance
 */
export function createCerta(page: Page): Certa {
  return new Certa(page);
}