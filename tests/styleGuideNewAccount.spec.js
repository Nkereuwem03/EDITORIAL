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
      loginCredentials.validUser.email,
      loginCredentials.validUser.password
    );
    await styleGuidePage.goTo("/style-guide");
  });

  test('Verify that the "Browse Files" button opens a file dialog allowing the user to select a file.', async ({
    page,
  }) => {
    const fileChooserPromise = page.waitForEvent("filechooser", {
      timeout: 10000,
    });

    await styleGuidePage.clickBrowseFiles();
    const fileChooser = await fileChooserPromise;

    expect(fileChooser).toBeTruthy();

    await fileChooser.setFiles(styleGuideTestFiles.validFiles.pdf);
  });

  test('Verify that the user can successfully upload a valid PDF file using the "Upload Style Guide" button.', async () => {
    await styleGuidePage.uploadFile(styleGuideTestFiles.validFiles.pdf);
    await styleGuidePage.clickUploadButton();
    await styleGuidePage.clickCompleteSetUpButton();
  });

  test("Verify that an error message is displayed when the user attempts to upload a file type other than PDF or DOCX (e.g., JPG, TXT).", async () => {
    await styleGuidePage.uploadFile(styleGuideTestFiles.invalidFiles.jpg);
    await expect(styleGuidePage.uploadButton).not.toBeVisible();
  });

  test("Verify the accessibility of the upload feature by navigating using keyboard shortcuts.", async ({
    page,
  }) => {
    const fileChooserPromise = page.waitForEvent("filechooser", {
      timeout: 10000,
    });

    await styleGuidePage.browseFilesButton.focus();
    await page.keyboard.press("Enter");

    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(styleGuideTestFiles.validFiles.pdf);
  });
});
