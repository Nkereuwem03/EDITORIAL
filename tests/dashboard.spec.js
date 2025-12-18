import { test, expect } from "@playwright/test";
import DashboardPage from "../pages/DashboardPage";
import { loginAndSetCookie } from "../utils/authenticateViaAPI";
import loginCredentials from "../testData/loginCredentials.json" assert { type: "json" };

test.describe("Dashboard Tests", () => {
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    await loginAndSetCookie(
      page,
      loginCredentials.oldUser.email,
      loginCredentials.oldUser.password
    );
    await dashboardPage.goTo("/dashboard");
  });

  test.only('Verify that the "Upload Audio" button is visible and clickable', async () => {
    await expect(dashboardPage.uploadAudioButton).toBeVisible();
    await dashboardPage.clickUploadAudio();
    await expect(dashboardPage.page).toHaveURL(/\/upload-audio/);
    console.log("Upload Audio button is functional");
  });

  test('Verify that the "Update Style Guide" button is visible and clickable', async () => {
    await expect(dashboardPage.updateStyleGuideButton).toBeVisible();
    await dashboardPage.clickUpdateStyleGuide();
    await expect(dashboardPage.page).toHaveURL(/\/style-guide/);
  });

  test('Verify that the "Overview" header displays the correct title', async () => {
    await expect(dashboardPage.overviewHeader).toHaveText("Overview");
  });

  test('Verify that the "Copyedit" button initiates the copyediting process', async () => {
    await dashboardPage.clickCopyeditButton(0);
    await dashboardPage.waitForLoadState("networkidle");
    await expect(dashboardPage.copyEditBadge).toBeVisible();
  });
});
