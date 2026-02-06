import { Page } from '@playwright/test';
import { step } from '@core/reporting/allure';
import { Link } from '@web/primitives/Link';

/**
 * Component for picking login method (Associate or Trainee)
 * First screen after navigating to /login
 */
export class LoginMethodPicker {
  private associateLink: Link;
  private traineeLink: Link;

  constructor(private page: Page) {
    this.associateLink = new Link(page, { selector: 'a[href*="/login/basic"]:has-text("Associate")' });
    this.traineeLink = new Link(page, { selector: 'a[href*="/login/trainee"]:has-text("Trainee")' });
  }

  async clickAssociate(): Promise<void> {
    return await step('LoginMethodPicker: Click Associate', async () => {
      await this.associateLink.click();
      await this.page.waitForLoadState('domcontentloaded');
    });
  }

  async clickTrainee(): Promise<void> {
    return await step('LoginMethodPicker: Click Trainee', async () => {
      await this.traineeLink.click();
      await this.page.waitForLoadState('domcontentloaded');
    });
  }

  async isVisible(): Promise<boolean> {
    return await step('LoginMethodPicker: Check if visible', async () => {
      return await this.associateLink.isVisible() || await this.traineeLink.isVisible();
    });
  }
}
