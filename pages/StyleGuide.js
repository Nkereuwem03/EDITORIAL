import BasePage from "./BasePage";

export default class StyleGuidePage extends BasePage {
  constructor(page) {
    super(page);
  }

  get oldAccountHeading() {
    return this.page.locator("h1.text-2xl");
  }

  get oldAccountIntroText() {
    return this.page.locator("p.font-outfit");
  }

  get oldAccountOutletStyleGuideHeading() {
    return this.page.locator("h2.text-xl");
  }

  get oldAccountUpdateButton() {
    return this.page.locator('button[aria-label="Update Style Guide"]');
  }

  get oldAccountContinueButton() {
    return this.page.locator('button:has-text("Continue")');
  }

  get oldAccountUpdateCompleteDialog() {
    return this.page.locator('div[role="dialog"]');
  }

  get oldAccountUpdateCompleteDialogHeading() {
    return this.page.locator('div[role="dialog"] h2#radix-_r_a_');
  }

  get oldAccountUpdateCompleteDialogSvgElement() {
    return this.page.locator("div[role=\"dialog\"] svg");
  }

  get browseFilesButton() {
    return this.page.getByRole("button", { name: "Browse Files" });
  }

  get uploadInput() {
    return this.page.locator('input[type="file"]');
  }

  get uploadInstructions() {
    return this.page.locator(
      "p:has-text('Upload your existing style guide document')"
    );
  }

  get reporterWritingPatternHeading() {
    return this.page.locator("h2:has-text('Upload Reporter Writing Pattern')");
  }

  get skipReporterPatternButton() {
    return this.page.locator('button:has-text("I don\'t have one - skip")');
  }

  get uploadButton() {
    return this.page.getByRole("button", { name: "Continue" });
  }

  get completeSetUpButton() {
    return this.page.getByRole("button", { name: "Complete Setup" });
  }

  async uploadFile(filePath) {
    await this.uploadInput.setInputFiles(filePath);
  }

  async clickBrowseFiles() {
    await this.browseFilesButton.click();
  }

  async clickUploadButton() {
    await this.uploadButton.click();
  }

  async clickCompleteSetUpButton() {
    await this.completeSetUpButton.click();
  }

  async skipReporterWritingPattern() {
    await this.skipReporterPatternButton.click();
  }

  async isUploadSuccessful() {
    return await this.page.locator("text=Upload successful").isVisible();
  }

  async isErrorMessageVisible() {
    return await this.page.locator("text=Invalid file type").isVisible();
  }

  async isUploadDisabled() {
    return await this.uploadButton.isDisabled();
  }
}