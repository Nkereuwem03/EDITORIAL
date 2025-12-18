import BasePage from "./BasePage";
import fs from "fs";
import path from "path";

export default class DashboardPage extends BasePage {
  constructor(page) {
    super(page);
  }

  get copyEditBadge() {
    return this.page.locator('span:has-text("Copyedited")').first();
  }

  get uploadAudioButton() {
    return this.page.locator('a[href="/upload-audio"]').first();
  }

  get updateStyleGuideButton() {
    return this.page.locator('a[href="/style-guide"]').first();
  }

  get overviewHeader() {
    return this.page.locator("h1.text-2xl");
  }

  get recentlyProcessedFiles() {
    return this.page.locator("ul.space-y-4 li");
  }

  get DownloadDropdownMenu() {
    return this.page
      .locator(
        '[role="menu"], [role="listbox"], .dropdown, [class*="dropdown"]'
      )
      .first();
  }

  get DownloadDropdownItems() {
    return this.page.locator(
      '[role="menuitem"], [role="option"], .dropdown-item'
    );
  }

  async clickUploadAudio() {
    await this.uploadAudioButton.click();
  }

  async clickUpdateStyleGuide() {
    await this.updateStyleGuideButton.click();
  }

  async getOverviewHeaderText() {
    return await this.overviewHeader.textContent();
  }

  async getInGenerationStats() {
    return await this.inGenerationStats.textContent();
  }

  async getArticlesReadyStats() {
    return await this.articlesReadyStats.textContent();
  }

  async getCopyeditedStats() {
    return await this.copyeditedStats.textContent();
  }

  async getRecentlyProcessedFiles() {
    const files = await this.recentlyProcessedFiles.all();
    return Promise.all(
      files.map(async (file) => ({
        name: await file.locator("p.text-sm").textContent(),
        date: await file.locator("p.font-outfit.text-xs").last().textContent(),
      }))
    );
  }

  async clickViewButton(fileIndex) {
    await this.recentlyProcessedFiles
      .nth(fileIndex)
      .locator('a[href*="/my-articles"]')
      .click();
  }

  async clickCopyeditButton(fileIndex) {
    await this.recentlyProcessedFiles
      .nth(fileIndex)
      .locator('button:has-text("Copyedit")')
      .click();
  }

  async clickDownloadButton(fileIndex) {
    if ((await this.recentlyProcessedFiles.count()) === 0) {
      throw new Error("No recently processed files available to click.");
    }
    await this.recentlyProcessedFiles
      .nth(fileIndex)
      .locator('button:has-text("Download")')
      .click();
    await this.DownloadDropdownMenu.waitFor({ state: "visible" });
  }

  async isDownloadDropdownVisible() {
    return await this.DownloadDropdownMenu.isVisible();
  }

  async clickDownloadDropdownItem(itemText) {
    await this.DownloadDropdownItems.locator(`:text("${itemText}")`).click();
  }

  async clickDownloadDropdownItemByIndex(index) {
    await this.DownloadDropdownItems.nth(index).click();
  }

  async getDownloadDropdownItemsText() {
    return await this.DownloadDropdownItems.allTextContents();
  }

  async getDownloadedFileName(download) {
    return download.suggestedFilename();
  }

  async saveDownloadToPath(download, savePath) {
    const dir = path.dirname(savePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    await download.saveAs(savePath);
  }

  async verifyDownloadedFileExists(filename) {
    return fs.existsSync(filename);
  }

  async verifyDownloadedFileType(download, expectedExtension) {
    const filename = download.suggestedFilename();
    return filename.toLowerCase().endsWith(expectedExtension.toLowerCase());
  }

  async verifyDownloadedFileSize(download, minSize = 0) {
    const filePath = await download.path();
    const stats = fs.statSync(filePath);
    return stats.size > minSize;
  }
}
