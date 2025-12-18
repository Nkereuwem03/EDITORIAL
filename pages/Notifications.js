import BasePage from "./BasePage";

export default class NotificationPage extends BasePage {
  constructor(page) {
    super(page);
  }

  get notificationsButton() {
    return this.page.locator('button[data-value="Notifications"]');
  }

  get heading() {
    return this.page.locator('h2:has-text("Notification Preferences")');
  }

  get description() {
    return this.page.locator(
      'p:has-text("Manage how you receive notifications")'
    );
  }

  get emailNotificationToggle() {
    return this.page.locator("#email");
  }

  get inAppNotificationToggle() {
    return this.page.locator("#notification");
  }

  get savePreferencesButton() {
    return this.page.locator('button[type="submit"]');
  }

  async toggleEmailNotification() {
    await this.emailNotificationToggle.click();
  }

  async toggleInAppNotification() {
    await this.inAppNotificationToggle.click();
  }

  async clickSavePreferences() {
    await this.savePreferencesButton.click();
  }

  async isSavePreferencesButtonEnabled() {
    return await this.savePreferencesButton.isEnabled();
  }
}
