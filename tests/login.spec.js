import { test, expect } from "@playwright/test";
import LoginPage from "../pages/LoginPage";
import SignUpPage from "../pages/SignUpPage";
import loginCredentials from "../testData/loginCredentials.json" assert { type: "json" };
import invalidEmails from "../testData/invalidEmails";
import invalidPasswords from "../testData/invalidPasswords";

test.describe("Login Tests", () => {
  let loginPage;
  let signUpPage;
  let validLogin = { ...loginCredentials.validUser };

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    signUpPage = new SignUpPage(page);
    await loginPage.goTo("/sign-in");
  });

  test("Verify that a user can successfully log in with valid email and password.", async () => {
    await loginPage.login(validLogin.email, validLogin.password);
    await loginPage.waitForURL("/dashboard");
    await expect(loginPage.page).toHaveURL(/dashboard/);
  });

  test("Verify that the email input field accepts valid email formats.", async () => {
    await loginPage.enterEmail("user@domain.com");
    await expect(loginPage.emailInput).toHaveValue("user@domain.com");
  });

  test("Verify that the password input field accepts a variety of valid passwords.", async () => {
    await loginPage.enterPassword("ValidPassword!123");
    await expect(loginPage.passwordInput).toHaveValue("ValidPassword!123");
  });

  test("Verify that the 'Remember for 30 days' checkbox can be checked and unchecked.", async () => {
    await loginPage.clickRememberCheckbox();
    await expect(loginPage.rememberCheckbox).toBeChecked();
    await loginPage.clickRememberCheckbox();
    await expect(loginPage.rememberCheckbox).not.toBeChecked();
  });

  test("Verify that clicking the 'Forgot password' link redirects the user to the correct password recovery page.", async () => {
    await loginPage.clickForgotPassword();
    await loginPage.waitForURL("/forgot-password");
    await expect(loginPage.page).toHaveURL(/forgot-password/);
  });

  test.skip("Verify that the 'Sign up' link navigates to the signup page.", async () => {
    await loginPage.clickSignUp();
    await loginPage.waitForURL("/sign-up");
    await expect(loginPage.page).toHaveURL(/sign-up/);
  });

  test("Verify that the placeholder text in the email and password fields is visible and appropriately descriptive.", async () => {
    const isVisible = await loginPage.isPlaceholderVisible();
    expect(isVisible).toBe(true);
  });

  test("Verify that the user is not granted access when logging in with an invalid email.", async () => {
    for (const email of invalidEmails) {
      await loginPage.goTo("/sign-in");
      await loginPage.enterEmail(email);
      await loginPage.enterPassword("SomePassword123!");
      await loginPage.clickLoginButton();
      await expect(loginPage.page).toHaveURL(/sign-in/);
    }
  });

  test("Verify that the user is not granted access when logging in with an incorrect password.", async () => {
    for (const password of invalidPasswords) {
      await loginPage.goTo("/sign-in");
      await loginPage.enterEmail("email@domain.com");
      await loginPage.enterPassword(password);
      await loginPage.clickLoginButton();
      await expect(loginPage.page).toHaveURL(/sign-in/);
    }
  });

  test("Verify that the form does not submit when the email field is left empty.", async () => {
    await loginPage.enterPassword("SomePassword123!");
    await loginPage.clickLoginButton();
    await expect(loginPage.page).toHaveURL(/sign-in/);
  });

  test("Verify that the form does not submit when the password field is left empty.", async () => {
    await loginPage.enterEmail("user@domain.com");
    await loginPage.clickLoginButton();
    await expect(loginPage.page).toHaveURL(/sign-in/);
  });

  test("Verify that the form is responsive and user-friendly when accessed from a mobile device.", async () => {
    await loginPage.setViewportSize(375, 667);
    await expect(loginPage.page.locator("form")).toBeVisible();
  });
});
