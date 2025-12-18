import BasePage from "./BasePage";

export default class ProfilePage extends BasePage {
  constructor(page) {
    super(page);
  }

  get profileButton() {
    return this.page.locator('button[data-value="Profile"]');
  }

  get securityButton() {
    return this.page.locator('button[data-value="Security"]');
  }

  get notificationsButton() {
    return this.page.locator('button[data-value="Notifications"]');
  }

  get profileInfoSection() {
    return this.page.locator('h2:has-text("Profile Information")');
  }

  get mediaOutletNameInput() {
    return this.page.locator('input[name="name"]');
  }

  get saveChangesButton() {
    return this.page.locator('button[type="submit"]');
  }

  get successMessage() {
    return this.page.locator("text=Changes saved successfully");
  }

  get errorMessage() {
    return this.page.locator("text=This field is required");
  }

  async clickProfileButton() {
    await this.profileButton.click();
  }

  async clickSecurityButton() {
    await this.securityButton.click();
  }

  async clickNotificationsButton() {
    await this.notificationsButton.click();
  }

  async fillMediaOutletName(name) {
    await this.mediaOutletNameInput.fill(name);
  }

  async submitForm() {
    await this.saveChangesButton.click();
  }

  async isButtonActive(button) {
    return await button.evaluate(
      (b) => b.getAttribute("data-active") === "true"
    );
  }

  async isElementVisible(element) {
    return await element.isVisible();
  }
}
