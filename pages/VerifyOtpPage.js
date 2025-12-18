import { expect } from "@playwright/test";
import BasePage from "./BasePage";

export default class VerifyOtpPage extends BasePage {
  constructor(page) {
    super(page);
  }

  get heading() {
    return this.page.locator("h1.text-center");
  }

  get instructionText() {
    return this.page.locator('p:text("Enter the code sent to your email")');
  }

  get otpInput() {
    return this.page.locator("input[data-input-otp=true]");
  }

  get verifyButton() {
    return this.page.locator('button:has-text("Verify OTP")');
  }

  get resendLink() {
    return this.page.locator("span[data-resending=false]");
  }

  get errorMessage() {
    return this.page.locator("text=Please enter a valid OTP");
  }

  async enterOtp(otp) {
    await this.otpInput.fill(otp);
  }

  async clickVerify() {
    await this.verifyButton.click();
  }

  async clickResend() {
    await this.resendLink.click();
  }

  async verifyHeadingText(expectedText) {
    await expect(this.heading).toHaveText(expectedText);
  }

  async isVerifyButtonEnabled() {
    return await this.verifyButton.isEnabled();
  }

  async isResendLinkVisible() {
    return await this.resendLink.isVisible();
  }

  async getErrorMessage() {
    return await this.errorMessage.textContent();
  }

  async getInstructionText() {
    return await this.instructionText.textContent();
  }
}
