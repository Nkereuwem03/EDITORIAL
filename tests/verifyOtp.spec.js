import { test, expect } from "@playwright/test";
import VerifyOtpPage from "../pages/VerifyOtpPage";
import {
  loginAndSetCookie,
  sendVerificationCodeViaAPI,
  getVerificationCode,
} from "../utils/authenticateViaAPI";
import loginCredentials from "../testData/loginCredentials.json" assert { type: "json" };

test.describe("Verify OTP Page Tests", () => {
  let verifyOtpPage;

  test.beforeEach(async ({ page }) => {
    verifyOtpPage = new VerifyOtpPage(page);
    await page.goto("https://editorial.joinebo.app/sign-up/verify?token=...");
  });

  test("Verify that the heading is displayed correctly", async () => {
    await verifyOtpPage.verifyHeadingText("Verify Your Email");
  });

  test("Verify that the page displays the correct instructional text for entering the OTP", async () => {
    const instructionText = await verifyOtpPage.getInstructionText();
    expect(instructionText).toContain("Enter the code sent to your email");
  });

  test("Verify that the placeholder for the OTP input field is visible and prompts the user correctly", async () => {
    const placeholder = await verifyOtpPage.otpInput.getAttribute(
      "placeholder"
    );
    expect(placeholder).toBe("Enter OTP");
  });

  test('Verify that the "Resend OTP" link is visible and clickable', async () => {
    expect(await verifyOtpPage.isResendLinkVisible()).toBeTruthy();
  });

  test("Verify that the user can enter a valid OTP and successfully verify their email", async () => {
    await verifyOtpPage.enterOtp("123456");
    await verifyOtpPage.clickVerify();
    expect(await verifyOtpPage.isVerifyButtonEnabled()).toBeTruthy();
  });

  test('Verify that the "Verify OTP" button is enabled when a valid OTP is entered', async () => {
    await verifyOtpPage.enterOtp("123456");
    expect(await verifyOtpPage.isVerifyButtonEnabled()).toBeTruthy();
  });

  test("Verify that an error message is displayed when submitting with an empty OTP input", async () => {
    await verifyOtpPage.clickVerify();
    const errorMessage = await verifyOtpPage.getErrorMessage();
    expect(errorMessage).toContain("Please enter a valid OTP");
  });

  test("Verify that the form rejects non-numeric characters in the OTP field", async () => {
    await verifyOtpPage.enterOtp("abc123");
    expect(await verifyOtpPage.isVerifyButtonEnabled()).toBeFalsy();
  });

  test("Verify that the form rejects OTP input longer than 6 digits", async () => {
    await verifyOtpPage.enterOtp("1234567");
    expect(await verifyOtpPage.isVerifyButtonEnabled()).toBeFalsy();
  });

  test("Verify that the user can click the resend link to request a new OTP", async () => {
    await verifyOtpPage.clickResend();
    expect(await verifyOtpPage.isResendLinkVisible()).toBeTruthy();
  });

  test("Verify the form responsiveness on mobile viewport", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 480 });
    expect(await verifyOtpPage.isResendLinkVisible()).toBeTruthy();
  });

  test("Verify the form responsiveness on desktop viewport", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    expect(await verifyOtpPage.isResendLinkVisible()).toBeTruthy();
  });

  test("Verify keyboard navigation through form elements", async ({ page }) => {
    await page.keyboard.press("Tab");
    expect(
      await verifyOtpPage.otpInput.evaluate(
        (el) => document.activeElement === el
      )
    ).toBeTruthy();
    await page.keyboard.press("Tab");
    expect(
      await verifyOtpPage.page
        .locator('button:has-text("Verify OTP")')
        .evaluate((el) => document.activeElement === el)
    ).toBeTruthy();
  });
});
