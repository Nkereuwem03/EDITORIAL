import { test, expect } from "@playwright/test";
import NotificationPage from "../pages/Notifications";
import { loginAndSetCookie } from "../utils/authenticateViaAPI";
import loginCredentials from "../testData/loginCredentials.json" assert { type: "json" };

test.describe("Notification Preferences", () => {
  let notificationPage;

  test.beforeEach(async ({ page }) => {
    notificationPage = new NotificationPage(page);
    await loginAndSetCookie(
      page,
      loginCredentials.validUser.email,
      loginCredentials.validUser.password
    );
    await notificationPage.goTo("/account");
    await notificationPage.click(notificationPage.notificationsButton);
  });

  test('Verify that the user can see the "Notification Preferences" heading and the accompanying description', async () => {
    await expect(notificationPage.heading).toBeVisible();
    await expect(notificationPage.description).toBeVisible();
  });

  test('Verify that both "Email Notifications" and "In-App Notifications" options are displayed with their respective descriptions', async () => {
    await expect(notificationPage.emailNotificationToggle).toBeVisible();
    await expect(notificationPage.inAppNotificationToggle).toBeVisible();
  });

  test('Verify that the toggle for "Email Notifications" can be switched from on to off and vice versa', async () => {
    const initialToggleState =
      await notificationPage.emailNotificationToggle.getAttribute(
        "aria-checked"
      );
    await notificationPage.toggleEmailNotification();
    const toggledState =
      await notificationPage.emailNotificationToggle.getAttribute(
        "aria-checked"
      );
    if (initialToggleState === true) {
      expect(toggledState).toBe("false");
    } else {
      expect(toggledState).toBe("true");
    }
  });

  test('Verify that the toggle for "In-App Notifications" can be switched from on to off and vice versa', async () => {
    const initialToggleState =
      await notificationPage.inAppNotificationToggle.getAttribute(
        "aria-checked"
      );
    await notificationPage.toggleInAppNotification();
    const toggledState =
      await notificationPage.inAppNotificationToggle.getAttribute(
        "aria-checked"
      );
    if (initialToggleState === true) {
      expect(toggledState).toBe("false");
    } else {
      expect(toggledState).toBe("true");
    }
  });

  test('Verify that the "Save Preferences" button is enabled when at least one notification option is toggled', async () => {
    await notificationPage.toggleEmailNotification();
    expect(await notificationPage.isSavePreferencesButtonEnabled()).toBe(true);
  });

  test('Verify that the preferences are saved correctly when the "Save Preferences" button is clicked after toggling options', async () => {
    const initialToggleState =
      await notificationPage.emailNotificationToggle.getAttribute(
        "aria-checked"
      );
    await notificationPage.toggleEmailNotification();
    await notificationPage.clickSavePreferences();

    await notificationPage.page.waitForTimeout(2000);

    await notificationPage.page.reload();
    await notificationPage.page.waitForLoadState("networkidle");
    await notificationPage.click(notificationPage.NotificationsButton);

    await notificationPage.emailNotificationToggle.waitFor({
      state: "visible",
    });

    const postSaveToggleState =
      await notificationPage.emailNotificationToggle.getAttribute(
        "aria-checked"
      );

    expect(postSaveToggleState).not.toBe(initialToggleState);
  });

  test('Verify that the "Save Preferences" button remains disabled when no notification options are toggled', async () => {
    expect(await notificationPage.isSavePreferencesButtonEnabled()).toBe(false);
  });
});
