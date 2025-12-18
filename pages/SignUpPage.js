import BasePage from "./BasePage";

export default class SignUpPage extends BasePage {
  constructor(page) {
    super(page);
  }

  get mediaOutletNameInput() {
    return this.page.locator('input[name="profile_data.media_outlet_name"]');
  }

  get emailInput() {
    return this.page.locator('input[name="email"]');
  }

  get passwordInput() {
    return this.page.locator('input[name="password"]');
  }

  get confirmPasswordInput() {
    return this.page.locator('input[name="confirm_password"]');
  }

  get signUpButton() {
    return this.page.locator('button:has-text("Sign up")');
  }

  get logInLink() {
    return this.page.locator('a:has-text("Log in")').nth(1);
  }

  get emptyMediaOutletNameErrorMessage() {
    return this.page.locator(
      "text=Media outlet name must be at least 3 characters"
    );
  }

  get missMatchedPasswordErrorMessage() {
    return this.page.locator("text=Passwords must match");
  }

  get invalidEmailErrorMessage() {
    return this.page.locator("text=Please enter a valid email");
  }

  get invalidPasswordErrorMessage() {
    return this.page.locator("text=Enter a valid password");
  }

  async fillMediaOutletName(name) {
    await this.mediaOutletNameInput.fill(name);
  }

  async fillEmail(email) {
    await this.emailInput.fill(email);
  }

  async fillPassword(password) {
    await this.passwordInput.fill(password);
  }

  async fillConfirmPassword(confirmPassword) {
    await this.confirmPasswordInput.fill(confirmPassword);
  }

  async navigateToLogin() {
    await this.logInLink.click();
  }

  async submitForm() {
    await this.signUpButton.click();
  }

  async signUp(user) {
    await this.fillMediaOutletName(user.mediaOutletName);
    await this.fillEmail(user.email);
    await this.fillPassword(user.password);
    await this.fillConfirmPassword(user.confirmPassword);
    await this.submitForm();
  }
}
