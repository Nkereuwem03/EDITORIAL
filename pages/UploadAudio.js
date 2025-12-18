import BasePage from "./BasePage";

export default class UploadAudioPage extends BasePage {
  constructor(page) {
    super(page);
  }

  get uploadAudioFirstDialog() {
    return this.page.locator('[role="dialog"]');
  }

  get uploadAudioFirstDialogHeading() {
    return this.page.locator('[role="dialog"] h2');
  }

  get browseFilesButton() {
    return this.page.locator('button:has-text("Browse Files")');
  }

  get uploadArea() {
    return this.page.locator('input[type="file"]');
  }

  get uploadAndGenerateArticleButton() {
    return this.page.locator('button:has-text("Upload and Generate Article")');
  }

  get uploadingText() {
    return this.page.locator('p:has-text("Uploading ...")');
  }

  get uploadComplete() {
    return this.page.locator("text=100% complete");
  }

  get processingMessageSelector() {
    return this.page.locator(
      "p.text-center.text-base.font-medium.text-text-black.sm\\:text-xl"
    );
  }

  get audioRequirementSectionHeader() {
    return this.page.locator('section.mt-6 h2:has-text("Audio Requirement")');
  }

  get audioRequirementSectionList() {
    return this.page.locator("section.mt-6 ul");
  }

  get errorMessage() {
    return this.page.locator(".error-message");
  }

  get backToDashboardLink() {
    return this.page.locator('a:has-text("Back to dashboard")');
  }

  get closeModalButton() {
    return this.page
      .locator('button[aria-label="close"], button:has(svg[viewBox*="16 17"])')
      .first();
  }

  async uploadFile(filePath) {
    await this.uploadArea.setInputFiles(filePath);
  }

  async clickBrowseFiles() {
    await this.browseFilesButton.click();
  }

  async clickUploadAndGenerateArticle() {
    await this.uploadAndGenerateArticleButton.click();
  }

  async closeModal() {
    await this.closeModalButton.click();
  }

  async getErrorMessageText() {
    return await this.errorMessage.textContent();
  }
}
