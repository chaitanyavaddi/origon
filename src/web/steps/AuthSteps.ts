import { Page } from '@playwright/test';
import { step } from '@core/reporting/allure';
import { UserCredentials } from '@core/config/credentials';
import { getConfig } from '@core/config/environment';
import { LoginMethodPicker } from '@web/components/auth/LoginMethodPicker';
import { AssociateAuthPicker } from '@web/components/auth/AssociateAuthPicker';
import { EmailPasswordForm } from '@web/components/auth/EmailPasswordForm';
import { TraineeOTPForm } from '@web/components/auth/TraineeOTPForm';

/**
 * Authentication steps - handles all login flows
 */
export class AuthSteps {
  constructor(private page: Page) {}

  /**
   * Login as Associate with email/password
   * 3-step flow: Click Associate → Click Email/Password → Fill & Submit
   */
  async loginAsAssociate(credentials: UserCredentials): Promise<void> {
    return await step(`AuthSteps: Login as Associate with email "${credentials.email}"`, async () => {
      const config = getConfig();

      // Navigate to login page
      await this.page.goto(`${config.baseUrl}/login/?next=/home`);
      await this.page.waitForLoadState('domcontentloaded');

      // Step 1: Select Associate login method
      const loginMethodPicker = new LoginMethodPicker(this.page);
      await loginMethodPicker.clickAssociate();

      // Step 2: Select Email/Password authentication
      const associateAuthPicker = new AssociateAuthPicker(this.page);
      await associateAuthPicker.clickEmailPassword();

      // Step 3: Wait for form to be ready and fill credentials
      const emailPasswordForm = new EmailPasswordForm(this.page);
      await emailPasswordForm.waitUntilReady();
      await emailPasswordForm.fillAndSubmit(credentials.email, credentials.password);
    });
  }

  /**
   * Login as Trainee with OTP
   * Flow: Click Trainee → Enter Email → Request OTP
   */
  async loginAsTrainee(credentials: UserCredentials): Promise<void> {
    return await step(`AuthSteps: Login as Trainee with email "${credentials.email}"`, async () => {
      const config = getConfig();

      // Navigate to login page
      await this.page.goto(`${config.baseUrl}/login/?next=/home`);
      await this.page.waitForLoadState('domcontentloaded');

      // Step 1: Select Trainee login method
      const loginMethodPicker = new LoginMethodPicker(this.page);
      await loginMethodPicker.clickTrainee();

      // Step 2: Wait for form to be ready, then fill email and request OTP
      const traineeOTPForm = new TraineeOTPForm(this.page);
      await traineeOTPForm.waitUntilReady();
      await traineeOTPForm.fillEmail(credentials.email);
      await traineeOTPForm.clickSendOTP();

      // Note: OTP handling would need additional implementation
      console.log('OTP requested - manual entry or external handling required');
    });
  }

  /**
   * Login with Flsmidth SAML account
   * Flow: Click Associate → Click Flsmidth SAML
   */
  async loginWithSAMLFlsmidth(credentials: UserCredentials): Promise<void> {
    return await step('AuthSteps: Login with Flsmidth SAML', async () => {
      const config = getConfig();

      // Navigate to login page
      await this.page.goto(`${config.baseUrl}/login/?next=/home`);
      await this.page.waitForLoadState('domcontentloaded');

      // Step 1: Select Associate login method
      const loginMethodPicker = new LoginMethodPicker(this.page);
      await loginMethodPicker.clickAssociate();

      // Step 2: Click Flsmidth SAML button
      const associateAuthPicker = new AssociateAuthPicker(this.page);
      await associateAuthPicker.clickSAMLFlsmidth();

      // SAML redirect - IdP authentication would happen here
      await this.page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
    });
  }

  /**
   * Login with Sprint 183 SAML account
   * Flow: Click Associate → Click Sprint 183 SAML
   */
  async loginWithSAMLSprint183(credentials: UserCredentials): Promise<void> {
    return await step('AuthSteps: Login with Sprint 183 SAML', async () => {
      const config = getConfig();

      // Navigate to login page
      await this.page.goto(`${config.baseUrl}/login/?next=/home`);
      await this.page.waitForLoadState('domcontentloaded');

      // Step 1: Select Associate login method
      const loginMethodPicker = new LoginMethodPicker(this.page);
      await loginMethodPicker.clickAssociate();

      // Step 2: Click Sprint 183 SAML button
      const associateAuthPicker = new AssociateAuthPicker(this.page);
      await associateAuthPicker.clickSAMLSprint183();

      // SAML redirect
      await this.page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
    });
  }

  /**
   * Logout from the application
   */
  async logout(): Promise<void> {
    return await step('AuthSteps: Logout', async () => {
      await this.page.goto('/logout');
    });
  }
}
