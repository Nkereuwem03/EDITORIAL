import BasePage from "./BasePage";

export default class LogoutPage extends BasePage {
  constructor(page) {
    super(page);
  }

  get logoutButton() {
    return this.page.locator('button:has-text("Logout")');
  }

  async clickLogoutButton() {
    await this.logoutButton.click();
  }
}
