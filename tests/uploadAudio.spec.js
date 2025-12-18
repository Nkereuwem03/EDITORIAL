import { expect, test } from "@playwright/test";
import UploadAudioPage from "../pages/UploadAudio";
import { loginAndSetCookie, signUpViaAPI } from "../utils/authenticateViaAPI";
import uploadAudioTestFiles from "../testData/uploadAudio/uploadAudioTestFiles.json" assert { type: "json" };
import loginCredentials from "../testData/loginCredentials.json" assert { type: "json" };

test.describe("Audio Upload Tests", () => {
  let uploadAudioPage;

  test.beforeEach(async ({ page }) => {
    await page.context().clearCookies();
    uploadAudioPage = new UploadAudioPage(page);
    await loginAndSetCookie(
      page,
      loginCredentials.oldUser.email,
      loginCredentials.oldUser.password
    );
    await uploadAudioPage.goTo("/upload-audio");
  });

  test("Verify users can only upload audio files after uploading style guide", async ({
    page,
  }) => {
    await signUpViaAPI(page);
    await uploadAudioPage.clickBrowseFiles();

    await uploadAudioPage.uploadAudioFirstDialog.waitFor({
      state: "visible",
      timeout: 5000,
    });
    await expect(uploadAudioPage.uploadAudioFirstDialog).toBeVisible();
    await expect(uploadAudioPage.uploadAudioFirstDialogHeading).toHaveText(
      "Upload Your Style Guide First"
    );
  });

  test("Verify interface displays the audio requirement information clearly", async () => {
    await expect(uploadAudioPage.audioRequirementSectionHeader).toHaveText(
      "Audio Requirement"
    );
    await expect(uploadAudioPage.audioRequirementSectionList).toBeVisible();
  });

  test("Verify users can successfully upload audio files in accepted formats (MP3)", async () => {
    await uploadAudioPage.uploadFile(uploadAudioTestFiles.validFiles.mp3);
    await uploadAudioPage.clickUploadAndGenerateArticle();
    await expect(uploadAudioPage.browseFilesButton).not.toBeVisible();
    await uploadAudioPage.uploadingText.waitFor({
      state: "visible",
      timeout: 10000,
    });
    await uploadAudioPage.uploadComplete.waitFor({
      state: "visible",
      timeout: 90000,
    });
    await expect(uploadAudioPage.uploadComplete).toHaveText("100% complete");
  });

  test("Verify system rejects audio files larger than 40MB with appropriate error message", async () => {
    await uploadAudioPage.uploadFile(uploadAudioTestFiles.invalidFiles.mp4);
    await expect(uploadAudioPage.uploadAndGenerateArticleButton).toBeDisabled();
  });

  test("Verify system rejects unsupported audio formats with format error message", async () => {
    await uploadAudioPage.uploadFile(
      uploadAudioTestFiles.invalidFiles.unSupportedFormat
    );
    await expect(uploadAudioPage.uploadAndGenerateArticleButton).toBeDisabled();
  });

  test("Verify upload button is disabled when no audio file is selected", async () => {
    await expect(uploadAudioPage.uploadAndGenerateArticleButton).toBeDisabled();
  });

  test("Verify system displays network error when internet connectivity is lost during upload", async ({
    page,
  }) => {
    await uploadAudioPage.uploadFile(uploadAudioTestFiles.validFiles.mp3);
    await page.evaluate(() => {
      window.navigator.onLine = false;
    });
    await uploadAudioPage.clickUploadAndGenerateArticle();
    await expect(uploadAudioPage.page).toHaveURL(
      "https://editorial.joinebo.app/upload-audio"
    );
  });

  test("Verify upload progress is maintained when user switches tabs during file upload", async ({
    page,
  }) => {
    await uploadAudioPage.uploadFile(uploadAudioTestFiles.validFiles.mp3);
    await uploadAudioPage.clickUploadAndGenerateArticle();
    await page.bringToFront();
    await uploadAudioPage.waitForSelector(
      uploadAudioPage.processingMessageSelector
    );
    await expect(uploadAudioPage.processingMessageSelector).toBeVisible();
  });
});
