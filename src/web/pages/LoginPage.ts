import { Page } from '@playwright/test';
import { step } from '@core/reporting/allure';
import { PageFragment } from '@web/base/PageFragment';
import { Link } from '@web/primitives/Link';
import { Button } from '@web/primitives/Button';
import { Input } from '@web/primitives/Input';
import { getConfig } from '@core/config/environment';

/**
 * Login Page - Simple primitives wrapper
 * For complex login flows, use AuthSteps instead
 */
export class LoginPage extends PageFragment {
  // UI elements
  private associateLoginLink: Link;
  private traineeLoginLink: Link;
  private emailPasswordButton: Button;
  private usernameInput: Input;
  private passwordInput: Input;
  private submitButton: Button;

  constructor(page: Page) {
    super(page);

    // Initialize primitives
    this.associateLoginLink = new Link(page, {
      href: '/login/basic',
      text: 'ecatest Associate'
    });

    this.traineeLoginLink = new Link(page, {
      href: '/login/otp',
      text: 'OS3 Trainee Login'
    });

    this.emailPasswordButton = new Button(page, {
      text: 'Login using e-mail and password'
    });

    this.usernameInput = new Input(page, { name: 'username' });
    this.passwordInput = new Input(page, { name: 'password' });
    this.submitButton = new Button(page, { ariaLabel: 'Login' });
  }

  async navigate(): Promise<void> {
    return await step('LoginPage: Navigate to login', async () => {
      const config = getConfig();
      await this.page.goto(`${config.baseUrl}/login/?next=/home`);
      await this.waitForLoad();
    });
  }

  async clickAssociateLogin(): Promise<void> {
    return await step('LoginPage: Click Associate Login', async () => {
      await this.associateLoginLink.click();
      await this.waitForLoad();
    });
  }

  async clickTraineeLogin(): Promise<void> {
    return await step('LoginPage: Click Trainee Login', async () => {
      await this.traineeLoginLink.click();
      await this.waitForLoad();
    });
  }

  async clickEmailPasswordLogin(): Promise<void> {
    return await step('LoginPage: Click Email/Password Login', async () => {
      await this.emailPasswordButton.waitForVisible();
      await this.emailPasswordButton.click();
      await this.page.waitForSelector('input[name="username"]', { timeout: 5000 });
      await this.waitForLoad();
    });
  }

  async fillUsername(username: string): Promise<void> {
    return await step(`LoginPage: Fill username "${username}"`, async () => {
      await this.usernameInput.waitForVisible();
      await this.usernameInput.fill(username);
    });
  }

  async fillPassword(password: string): Promise<void> {
    return await step('LoginPage: Fill password', async () => {
      await this.passwordInput.fill(password);
    });
  }

  async submit(): Promise<void> {
    return await step('LoginPage: Click Submit', async () => {
      await this.submitButton.click();
      await this.waitForLoad();
    });
  }

  /**
   * Convenience method for backward compatibility
   * For production use, prefer AuthSteps.loginAsAssociate()
   */
  async login(email: string, password: string): Promise<void> {
    return await step(`LoginPage: Complete login with email "${email}"`, async () => {
      await this.clickAssociateLogin();
      await this.clickEmailPasswordLogin();
      await this.fillUsername(email);
      await this.fillPassword(password);
      await this.submit();
    });
  }
}
