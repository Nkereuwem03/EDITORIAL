import { expect } from "@playwright/test";

export default class BasePage {
  constructor(page) {
    this.page = page;
  }

  async goTo(url) {
    await this.page.goto(url);
  }

  async reload() {
    await this.page.reload();
  }

  async close() {
    await this.page.close();
  }

  async click(selector) {
    const locator =
      typeof selector === "string" ? this.page.locator(selector) : selector;
    await locator.click();
  }

  async fill(selector, text) {
    const locator =
      typeof selector === "string" ? this.page.locator(selector) : selector;
    await locator.fill(text);
  }

  async focusElement(selector) {
    const locator =
      typeof selector === "string" ? this.page.locator(selector) : selector;
    await locator.focus();
  }

  async pressKey(key) {
    await this.page.keyboard.press(key);
  }

  async isVisible(selector) {
    const locator =
      typeof selector === "string" ? this.page.locator(selector) : selector;
    return await locator.isVisible();
  }

  async waitForSelector(selector) {
    const locator =
      typeof selector === "string" ? this.page.locator(selector) : selector;
    await locator.waitFor({ state: "visible" });
  }

  async waitForLoadState(state = "load", options = {}) {
    await this.page.waitForLoadState(state, options);
  }

  async waitForURL(url, options = {}) {
    await this.page.waitForURL(url, options);
  }

  async waitForTimeout(timeout) {
    await this.page.waitForTimeout(timeout);
  }

  async getURL() {
    return this.page.url();
  }

  async getCount(selector) {
    return await this.page.locator(selector).count();
  }
}
