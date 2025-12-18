import BasePage from "./BasePage";

export default class SecurityPage extends BasePage {
  constructor(page) {
    super(page);
  }

  get securityButton() {
    return this.page.locator('button[data-value="Security"]');
  }

  get securityHeading() {
    return this.page.locator('h2:has-text("Security")');
  }

  get twoFADescription() {
    return this.page.locator(
      "text=Enable or disable two-factor authentication"
    );
  }

  get twoFAToggle() {
    return this.page.locator("#toggle-2fa");
  }

  get enableDisable2FADialog() {
    return this.page.locator('div[role="dialog"]');
  }

  get enable2FADialogTitle() {
    return this.page.locator('h2:has-text("Enable 2FA")');
  }

  get disable2FADialogTitle() {
    return this.page.locator('h2:has-text("Disable 2FA")');
  }

  get enableDisable2FADialogSubmitButton() {
    return this.page.locator('button[type="submit"]');
  }

  get disable2FAPasswordInput() {
    return this.page.locator('input[name="password"]');
  }

  get updatePasswordButton() {
    return this.page.locator("text=Update your password");
  }

  get currentPasswordInput() {
    return this.page.locator('input[name="old_password"]');
  }

  get newPasswordInput() {
    return this.page.locator('input[name="new_password"]');
  }

  get updatePasswordSubmitButton() {
    return this.page.locator('button[type="submit"]');
  }

  get confirmationMessage() {
    return this.page.locator("text=Password updated successfully");
  }

  async clickSecurityButton() {
    await this.securityButton.click();
  }

  async toggleTwoFA() {
    await this.twoFAToggle.click();
  }

  async isTwoFAEnabled() {
    return (await this.twoFAToggle.getAttribute("aria-checked")) === "true";
  }

  async clickUpdatePassword() {
    await this.updatePasswordButton.click();
  }
  async isSecurityHeadingVisible() {
    return await this.securityHeading.isVisible();
  }

  async getTwoFADescriptionText() {
    return await this.twoFADescription.textContent();
  }

  async getPasswordDescriptionText() {
    return await this.passwordDescription.textContent();
  }
}
