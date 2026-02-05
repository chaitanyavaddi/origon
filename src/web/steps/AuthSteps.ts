import { Page } from '@playwright/test';
import { step } from '@core/reporting/allure';
import { LoginPage } from '@web/pages/LoginPage';
import { UserCredentials } from '@core/config/credentials';

/**
 * Authentication steps - orchestrates LoginPage
 */
export class AuthSteps {
  constructor(private page: Page) {}

  @step('Login as Associate with email "{0}"')
  async loginAsAssociate(credentials: UserCredentials): Promise<void> {
    const loginPage = new LoginPage(this.page);
    await loginPage.navigate();
    await loginPage.login(credentials.email, credentials.password);
  }

  @step('Logout')
  async logout(): Promise<void> {
    // Implementation depends on your app's logout flow
    await this.page.goto('/logout');
  }
}