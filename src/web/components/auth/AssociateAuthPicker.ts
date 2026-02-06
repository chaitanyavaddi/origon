import { Page } from '@playwright/test';
import { step } from '@core/reporting/allure';
import { Button } from '@web/primitives/Button';

/**
 * Component for picking Associate authentication method
 * Shows options: Email/Password, SAML, SAML
 */
export class AssociateAuthPicker {
  private emailPasswordButton: Button;
  private samlFlsmidthButton: Button;
  private samlSprint183Button: Button;

  constructor(private page: Page) {
    this.emailPasswordButton = new Button(page, { text: 'Login using e-mail and password' });
    this.samlFlsmidthButton = new Button(page, { text: 'account' });
    this.samlSprint183Button = new Button(page, { text: 'testing account' });
  }

  async clickEmailPassword(): Promise<void> {
    return await step('AssociateAuthPicker: Click Email/Password', async () => {
      await this.emailPasswordButton.click();
      await this.page.waitForLoadState('domcontentloaded');
    });
  }

  async clickSAMLFlsmidth(): Promise<void> {
    return await step('AssociateAuthPicker: Click SAML Flsmidth', async () => {
      await this.samlFlsmidthButton.click();
      await this.page.waitForLoadState('domcontentloaded');
    });
  }

  async clickSAMLSprint183(): Promise<void> {
    return await step('AssociateAuthPicker: Click SAML Sprint183', async () => {
      await this.samlSprint183Button.click();
      await this.page.waitForLoadState('domcontentloaded');
    });
  }

  async isVisible(): Promise<boolean> {
    return await step('AssociateAuthPicker: Check if visible', async () => {
      return await this.emailPasswordButton.isVisible();
    });
  }
}
