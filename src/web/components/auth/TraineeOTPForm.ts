import { Page } from '@playwright/test';
import { step } from '@core/reporting/allure';
import { Input } from '@web/primitives/Input';
import { Button } from '@web/primitives/Button';

/**
 * Component for Trainee OTP login form
 * Handles OTP-based authentication for trainee accounts
 */
export class TraineeOTPForm {
  private emailInput: Input;
  private otpInput: Input;
  private sendOTPButton: Button;
  private submitButton: Button;

  constructor(private page: Page) {
    this.emailInput = new Input(page, { name: 'email' });
    this.otpInput = new Input(page, { name: 'otp' });
    this.sendOTPButton = new Button(page, { text: 'Send OTP' });
    this.submitButton = new Button(page, { selector: 'button[type="submit"]' });
  }

  async fillEmail(email: string): Promise<void> {
    return await step('TraineeOTPForm: Fill email', async () => {
      await this.emailInput.fill(email);
    });
  }

  async clickSendOTP(): Promise<void> {
    return await step('TraineeOTPForm: Click Send OTP', async () => {
      await this.sendOTPButton.click();
      // Wait for OTP input to become enabled
      await this.page.waitForTimeout(1000);
    });
  }

  async fillOTP(otp: string): Promise<void> {
    return await step('TraineeOTPForm: Fill OTP', async () => {
      await this.otpInput.fill(otp);
    });
  }

  async submit(): Promise<void> {
    return await step('TraineeOTPForm: Submit', async () => {
      await this.submitButton.click();
      await this.page.waitForLoadState('networkidle', { timeout: 10000 });
    });
  }

  async waitUntilReady(): Promise<void> {
    return await step('TraineeOTPForm: Wait until ready', async () => {
      await this.emailInput.element.waitFor({ state: 'visible', timeout: 5000 });
      await this.sendOTPButton.element.waitFor({ state: 'visible', timeout: 5000 });
    });
  }

  async isVisible(): Promise<boolean> {
    return await step('TraineeOTPForm: Check if visible', async () => {
      return await this.emailInput.isVisible();
    });
  }
}
