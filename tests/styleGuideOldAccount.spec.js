import { test, expect } from "@playwright/test";
import StyleGuidePage from "../pages/styleGuide";
import loginCredentials from "../testData/loginCredentials.json" assert { type: "json" };
import styleGuideTestFiles from "../testData/styleGuide/styleGuideTestFiles.json" assert { type: "json" };
import { loginAndSetCookie } from "../utils/authenticateViaAPI";

test.describe("Upload Functionality Tests", () => {
  let styleGuidePage;

  test.beforeEach(async ({ page }) => {
    styleGuidePage = new StyleGuidePage(page);
    await loginAndSetCookie(
      page,
      loginCredentials.oldUser.email,
      loginCredentials.oldUser.password
    );
    await styleGuidePage.goTo("/style-guide");
  });

  test('Verify that the heading "Style Guide" is displayed prominently and is easily readable.', async () => {
    await expect(styleGuidePage.oldAccountHeading).toBeVisible();
    await expect(styleGuidePage.oldAccountHeading).toHaveText("Style Guide");
  });

  test("Verify that the introductory text accurately describes the purpose of the style guide.", async () => {
    await expect(styleGuidePage.oldAccountIntroText).toBeVisible();
    await expect(styleGuidePage.oldAccountIntroText).toHaveText(
      "Your outlet's writing style and reporter writing pattern."
    );
  });

  test('Verify that the section heading "Outlet Style Guide" is visible and correctly formatted.', async () => {
    await expect(
      styleGuidePage.oldAccountOutletStyleGuideHeading
    ).toBeVisible();
    await expect(styleGuidePage.oldAccountOutletStyleGuideHeading).toHaveText(
      "Outlet Style Guide"
    );
  });

  test('Verify that the "Update Style Guide" button is clearly labeled and visually distinct from other elements.', async () => {
    await expect(styleGuidePage.oldAccountUpdateButton).toBeVisible();
    await expect(styleGuidePage.oldAccountUpdateButton).toHaveText(
      "Update Style Guide"
    );
  });

  test("Verify that user can update a style guide", async ({ page }) => {
    await styleGuidePage.click(styleGuidePage.oldAccountUpdateButton);
    await styleGuidePage.uploadFile(styleGuideTestFiles.validFiles.pdf);
    await styleGuidePage.click(styleGuidePage.oldAccountContinueButton);
    await styleGuidePage.clickCompleteSetUpButton();

    // Wait for the next step heading to appear
    await expect(styleGuidePage.reporterWritingPatternHeading).toBeVisible({
      timeout: 15000,
    });

    await styleGuidePage.skipReporterWritingPattern();
    expect(page.url()).toContain("style-guide");
  });
});
