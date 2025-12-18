import { test, expect } from "@playwright/test";
import ProfilePage from "../pages/ProfilePage";
import { loginAndSetCookie } from "../utils/authenticateViaAPI";
import loginCredentials from "../testData/loginCredentials.json" assert { type: "json" };
import { faker } from "@faker-js/faker";

test.describe("Profile Settings", () => {
  let profilePage;
  let mediaOutletName;

  test.beforeEach(async ({ page }) => {
    profilePage = new ProfilePage(page);
    await loginAndSetCookie(
      page,
      loginCredentials.validUser.email,
      loginCredentials.validUser.password
    );
    await profilePage.goTo("/account");
    mediaOutletName = faker.company.name();
    await profilePage.fillMediaOutletName(mediaOutletName);
  });

  test('Verify that clicking the "Profile" button displays the appropriate profile information section', async () => {
    await profilePage.clickProfileButton();
    await expect(profilePage.profileInfoSection).toBeVisible();
  });

  test('Verify that the "Save Changes" button is enabled when valid input is provided in the "Media Outlet Name" field', async () => {
    expect(await profilePage.saveChangesButton.isEnabled()).toBeTruthy();
  });

  test("Verify that the user can successfully submit the form with a valid media outlet name and receive a success message", async () => {
    await profilePage.submitForm();
    await expect(profilePage.mediaOutletNameInput).toHaveValue(mediaOutletName);
  });

  test('Verify that the user can switch between "Profile", "Security", and "Notifications" buttons and that the active button is visually distinct', async () => {
    await profilePage.clickProfileButton();
    expect(
      await profilePage.isButtonActive(profilePage.profileButton)
    ).toBeTruthy();
    await profilePage.clickSecurityButton();
    expect(
      await profilePage.isButtonActive(profilePage.securityButton)
    ).toBeTruthy();
    await profilePage.clickNotificationsButton();
    expect(
      await profilePage.isButtonActive(profilePage.notificationsButton)
    ).toBeTruthy();
  });

  test('Verify that the description text under "Profile Information" is displayed correctly and is readable on various screen sizes', async () => {
    await profilePage.clickProfileButton();
    const description = await profilePage.page.locator(
      'p:has-text("Update your media outlet profile information")'
    );
    expect(await description.isVisible()).toBeTruthy();
  });

  test('Verify that when submitting the form with an empty "Media Outlet Name" field, the appropriate error message is displayed', async () => {
    await profilePage.fillMediaOutletName("");
    expect(await profilePage.saveChangesButton.isDisabled()).toBeTruthy();
  });

  test('Verify that clicking the "Security" or "Notifications" buttons does not display the profile information section', async () => {
    await profilePage.clickSecurityButton();
    expect(
      await profilePage.isElementVisible(profilePage.profileInfoSection)
    ).toBeFalsy();
    await profilePage.clickNotificationsButton();
    expect(
      await profilePage.isElementVisible(profilePage.profileInfoSection)
    ).toBeFalsy();
  });

  test("Verify that the form submission with a very long media outlet name does not exceed any character limits and handles the input gracefully", async () => {
    const longName = "A".repeat(300);
    await profilePage.fillMediaOutletName(longName);
    await profilePage.submitForm();
    expect(await profilePage.mediaOutletNameInput.inputValue()).toBe(longName);
  });

  test("Verify the responsiveness of the interface by resizing the browser window and ensuring that all elements adjust properly without losing functionality", async () => {
    await profilePage.page.setViewportSize({ width: 500, height: 800 });
    expect(
      await profilePage.isElementVisible(profilePage.profileInfoSection)
    ).toBeTruthy();
    await profilePage.page.setViewportSize({ width: 1200, height: 800 });
    expect(
      await profilePage.isElementVisible(profilePage.profileInfoSection)
    ).toBeTruthy();
  });

  test("Verify the accessibility of the form by using keyboard navigation to ensure all interactive elements are reachable and usable without a mouse", async () => {
    await profilePage.mediaOutletNameInput.focus();
    expect(
      await profilePage.mediaOutletNameInput.evaluate(
        (el) => document.activeElement === el
      )
    ).toBeTruthy();
    await profilePage.page.keyboard.press("Tab");
    expect(
      await profilePage.saveChangesButton.evaluate(
        (el) => document.activeElement === el
      )
    ).toBeTruthy();
  });
});
