import { Page } from '@playwright/test';
import { step } from '@core/reporting/allure';
import { Input } from '@web/primitives/Input';
import { Button } from '@web/primitives/Button';

/**
 * Component for email/password login form
 * Used for Associate email/password authentication
 */
export class EmailPasswordForm {
  private usernameInput: Input;
  private passwordInput: Input;
  private loginButton: Button;

  constructor(private page: Page) {
    this.usernameInput = new Input(page, { name: 'username' });
    this.passwordInput = new Input(page, { name: 'password' });
    this.loginButton = new Button(page, { ariaLabel: 'Login' });
  }

  async fillUsername(username: string): Promise<void> {
    return await step('EmailPasswordForm: Fill username', async () => {
      await this.usernameInput.fill(username);
    });
  }

  async fillPassword(password: string): Promise<void> {
    return await step('EmailPasswordForm: Fill password', async () => {
      await this.passwordInput.fill(password);
    });
  }

  async submit(): Promise<void> {
    return await step('EmailPasswordForm: Submit', async () => {
      await this.loginButton.click();
      await this.page.waitForLoadState('networkidle', { timeout: 10000 });
    });
  }

  async fillAndSubmit(username: string, password: string): Promise<void> {
    return await step('EmailPasswordForm: Fill and submit credentials', async () => {
      await this.fillUsername(username);
      await this.fillPassword(password);
      await this.submit();
    });
  }

  async waitUntilReady(): Promise<void> {
    return await step('EmailPasswordForm: Wait until ready', async () => {
      await this.usernameInput.element.waitFor({ state: 'visible', timeout: 5000 });
      await this.passwordInput.element.waitFor({ state: 'visible', timeout: 5000 });
    });
  }

  async isVisible(): Promise<boolean> {
    return await step('EmailPasswordForm: Check if visible', async () => {
      return await this.usernameInput.isVisible() && await this.passwordInput.isVisible();
    });
  }
}
