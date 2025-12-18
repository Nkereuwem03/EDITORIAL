import BasePage from "./BasePage";

export default class LoginPage extends BasePage {
  constructor(page) {
    super(page);
  }

  get emailInput() {
    return this.page.locator('input[name="email"]');
  }

  get passwordInput() {
    return this.page.locator('input[name="password"]');
  }

  get rememberCheckbox() {
    return this.page.locator("#keep-me-logged-in");
  }

  get loginButton() {
    return this.page.locator('button:has-text("Log in")');
  }

  get forgotPasswordLink() {
    return this.page.locator('a[href="/forgot-password"]');
  }

  get signUpLink() {
    return this.page.locator('a[href="/sign-up"]');
  }

  async enterEmail(email) {
    await this.emailInput.fill(email);
  }

  async enterPassword(password) {
    await this.passwordInput.fill(password);
  }

  async clickRememberCheckbox() {
    await this.rememberCheckbox.click();
  }

  async clickLoginButton() {
    await this.loginButton.click();
  }

  async clickForgotPassword() {
    await this.forgotPasswordLink.click();
  }

  async clickSignUp() {
    await this.signUpLink.click();
  }

  async isPlaceholderVisible() {
    const emailPlaceholder = await this.emailInput.getAttribute("placeholder");
    const passwordPlaceholder = await this.passwordInput.getAttribute(
      "placeholder"
    );
    return (
      emailPlaceholder === "name@company.com" &&
      passwordPlaceholder === "＊＊＊＊＊＊＊"
    );
  }

  async login(email, password) {
    await this.enterEmail(email);
    await this.enterPassword(password);
    await this.clickLoginButton();
    await this.page.waitForURL(/dashboard/);
  }
}
