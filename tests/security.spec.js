import { test, expect } from "@playwright/test";
import SecurityPage from "../pages/SecurityPage";
import { loginAndSetCookie } from "../utils/authenticateViaAPI";
import loginCredentials from "../testData/loginCredentials.json" assert { type: "json" };
import { faker } from "@faker-js/faker";
import { updateValidUserPassword } from "../utils/globalSetup.js";

test.describe("Security Settings", () => {
  let securityPage;

  test.beforeEach(async ({ page }) => {
    securityPage = new SecurityPage(page);
    await loginAndSetCookie(
      page,
      loginCredentials.validUser.email,
      loginCredentials.validUser.password
    );
    await securityPage.goTo("/account");
    await securityPage.clickSecurityButton();
  });

  test('Verify that clicking on the "Security" button displays the security settings section with relevant options.', async () => {
    await expect(securityPage.securityHeading).toBeVisible();
    await expect(securityPage.securityHeading).toHaveText("Security");
  });

  test("Verify that the toggle for Two-Factor Authentication (2FA) can be switched on and off, and reflects the correct state.", async () => {
    const initialToggleState = await securityPage.twoFAToggle.getAttribute(
      "aria-checked"
    );

    if (initialToggleState === "true") {
      await securityPage.toggleTwoFA();
      await securityPage.waitForSelector(securityPage.enableDisable2FADialog);
      await expect(securityPage.enableDisable2FADialog).toBeVisible();
      await expect(securityPage.disable2FADialogTitle).toHaveText(
        "Disable 2FA"
      );
      await expect(
        securityPage.enableDisable2FADialogSubmitButton
      ).toBeEnabled();
      await expect(securityPage.enableDisable2FADialogSubmitButton).toHaveText(
        "Proceed"
      );
      await securityPage.enableDisable2FADialogSubmitButton.click();
      await expect(securityPage.disable2FAPasswordInput).toBeVisible();
      await securityPage.fill(
        securityPage.disable2FAPasswordInput,
        loginCredentials.validUser.password
      );
      await securityPage.enableDisable2FADialogSubmitButton.click();
      await expect(securityPage.twoFAToggle).toHaveAttribute(
        "aria-checked",
        "false",
        { timeout: 20000 }
      );
    } else {
      await securityPage.toggleTwoFA();
      await securityPage.waitForSelector(securityPage.enableDisable2FADialog);
      await expect(securityPage.enableDisable2FADialog).toBeVisible();
      await expect(securityPage.enable2FADialogTitle).toHaveText("Enable 2FA");
      await expect(
        securityPage.enableDisable2FADialogSubmitButton
      ).toBeEnabled();
      await expect(securityPage.enableDisable2FADialogSubmitButton).toHaveText(
        "Enable"
      );
      await securityPage.enableDisable2FADialogSubmitButton.click();
      await expect(securityPage.twoFAToggle).toHaveAttribute(
        "aria-checked",
        "true",
        { timeout: 20000 }
      );
    }
  });

  test("Verify that user can update their password with valid current password", async () => {
    const newPassword = faker.internet.password(
      12,
      false,
      /[A-Za-z0-9]/,
      "!@#$%^&*()"
    );
    console.log("Generated new password:", newPassword);

    await securityPage.click(securityPage.updatePasswordButton);
    await securityPage.fill(
      securityPage.currentPasswordInput,
      loginCredentials.validUser.password
    );
    await securityPage.fill(securityPage.newPasswordInput, newPassword);
    await securityPage.click(securityPage.updatePasswordSubmitButton);

    await expect(securityPage.page).toHaveURL(/\/account/, { timeout: 10000 });
    await expect(securityPage.confirmationMessage).toBeVisible();

    updateValidUserPassword(newPassword);
    console.log("Password updated successfully in all env files");
  });
});
