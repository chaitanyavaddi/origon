import { Page } from '@playwright/test';
import { step } from '@core/reporting/allure';
import { PageFragment } from '@web/base/PageFragment';
import { Link } from '@web/primitives/Link';
import { Button } from '@web/primitives/Button';
import { Input } from '@web/primitives/Input';
import { getConfig } from '@core/config/environment';

/**
 * Login Page - composes primitives directly (no domain components needed)
 */
export class LoginPage extends PageFragment {
  // Step 1 elements
  private associateLoginLink: Link;
  
  // Step 2 elements
  private emailPasswordButton: Button;
  
  // Step 3 elements
  private usernameInput: Input;
  private passwordInput: Input;
  private submitButton: Button;

  constructor(page: Page) {
    super(page);
    
    // Step 1: Initial login page
    this.associateLoginLink = new Link(page, {
      href: '/login/basic?next=/home',
      text: 'ecatest Associate'
    });
    
    // Step 2: SSO options page
    this.emailPasswordButton = new Button(page, {
      text: 'Login using e-mail and password'
    });
    
    // Step 3: Email/password form
    this.usernameInput = new Input(page, { name: 'username' });
    this.passwordInput = new Input(page, { name: 'password' });
    this.submitButton = new Button(page, { ariaLabel: 'Log in' });
  }

  @step('LoginPage: Navigate to login')
  async navigate(): Promise<void> {
    const config = getConfig();
    await this.page.goto(`${config.baseUrl}/login/?next=/home`);
    await this.waitForLoad();
  }

  @step('LoginPage: Click Associate Login')
  async clickAssociateLogin(): Promise<void> {
    await this.associateLoginLink.click();
    await this.waitForLoad();
  }

  @step('LoginPage: Click Email/Password Login')
  async clickEmailPasswordLogin(): Promise<void> {
    // Wait for any loading indicators to disappear
    await this.page.locator('[data-loading="true"]').waitFor({ 
      state: 'hidden', 
      timeout: 5000 
    }).catch(() => {});
    
    await this.emailPasswordButton.waitForVisible();
    await this.emailPasswordButton.click();
    await this.waitForLoad();
  }

  @step('LoginPage: Fill username "{0}"')
  async fillUsername(username: string): Promise<void> {
    await this.usernameInput.waitForVisible();
    await this.usernameInput.fill(username);
  }

  @step('LoginPage: Fill password')
  async fillPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  @step('LoginPage: Click Submit')
  async submit(): Promise<void> {
    await this.submitButton.click();
    await this.waitForLoad();
  }

  @step('LoginPage: Complete 3-step login with email "{0}"')
  async login(email: string, password: string): Promise<void> {
    await this.clickAssociateLogin();
    await this.clickEmailPasswordLogin();
    await this.fillUsername(email);
    await this.fillPassword(password);
    await this.submit();
  }
}