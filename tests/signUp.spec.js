import { test, expect } from "@playwright/test";
import SignUpPage from "../pages/SignUpPage";
import VerifyOtpPage from "../pages/VerifyOtpPage";
import newUser from "../testData/newUser.json" assert { type: "json" };
import generateEmail from "../utils/generateEmail";
import invalidEmails from "../testData/invalidEmails";
import invalidPasswords from "../testData/invalidPasswords";

test.describe("Sign Up Tests", () => {
  let signUpPage;
  let verifyOtpPage;
  let validUser = { ...newUser.validUser };
  let email;

  test.beforeEach(async ({ page }) => {
    signUpPage = new SignUpPage(page);
    verifyOtpPage = new VerifyOtpPage(page);
    email = generateEmail("testuser", "example.com");
    validUser.email = email;
    await signUpPage.goTo("/sign-up");
  });

  test("Verify that the user can successfully create an account by filling in all required fields with valid data.", async () => {
    await signUpPage.signUp(validUser);
    await expect(verifyOtpPage.heading).toBeVisible();
    await expect(verifyOtpPage.heading).toHaveText("Verify your email");
  });

  test("Verify that the Log In link redirects the user to the login page when clicked.", async () => {
    await signUpPage.navigateToLogin();
    await expect(signUpPage.page).toHaveURL(/\/sign-in/);
  });

  test("Verify that password strength indicators update correctly as the user types a valid password meeting all criteria.", async () => {
    await signUpPage.fillPassword(validUser.password);
    const indicators = await signUpPage.getCount(
      signUpPage.passwordStrengthIndicators
    );
    expect(indicators).toBeGreaterThan(0);
  });

  test("Verify that placeholder text in each input field is displayed correctly when the fields are empty.", async () => {
    await expect(signUpPage.mediaOutletNameInput).toHaveAttribute(
      "placeholder",
      "Enter your outlet name"
    );
    await expect(signUpPage.emailInput).toHaveAttribute(
      "placeholder",
      "Enter your email"
    );
    await expect(signUpPage.passwordInput).toHaveAttribute(
      "placeholder",
      "Enter your password"
    );
    await expect(signUpPage.confirmPasswordInput).toHaveAttribute(
      "placeholder",
      "Enter your password"
    );
  });

  test("Verify that an appropriate error message is displayed when attempting to create an account with an empty Media Outlet Name.", async () => {
    validUser.mediaOutletName = "";
    await signUpPage.signUp(validUser);
    await expect(signUpPage.emptyMediaOutletNameErrorMessage).toBeVisible();
  });

  test.skip("Verify that the system prompts the user to correct an invalid email format when submitting the form.", async () => {
    for (const invalidEmail of invalidEmails) {
      await signUpPage.goTo("/sign-up");
      validUser.email = invalidEmail;
      await signUpPage.signUp(validUser);
      await expect(signUpPage.invalidEmailErrorMessage).toBeVisible();
    }
  });

  test.skip("Verify that the system displays an error message when entering a password that does not meet minimum requirements.", async () => {
    invalidPasswords.forEach(async (invalidPassword) => {
      await signUpPage.goTo("/sign-up");
      validUser.password = invalidPassword;
      await signUpPage.signUp(validUser);
      await signUpPage.expectElementToBeVisible(
        signUpPage.invalidPasswordErrorMessage
      );
    });
  });

  test("Verify that a specific error message is shown when submitting the form with mismatched passwords.", async () => {
    validUser.confirmPassword = "DifferentPassword1!";
    await signUpPage.signUp(validUser);
    await expect(signUpPage.missMatchedPasswordErrorMessage).toBeVisible();
  });

  test("Verify that all form elements adjust properly on different screen sizes when resizing the browser window.", async () => {
    await signUpPage.setViewportSize(600, 800);
    await expect(signUpPage.signUpButton).toBeVisible();
    await signUpPage.setViewportSize(1200, 800);
    await expect(signUpPage.signUpButton).toBeVisible();
  });

  test("Verify that all form fields can be reached and filled using keyboard navigation without a mouse.", async () => {
    await signUpPage.focusElement(signUpPage.mediaOutletNameInput);
    await expect(signUpPage.mediaOutletNameInput).toBeFocused();

    await signUpPage.pressKey("Tab");
    await expect(signUpPage.emailInput).toBeFocused();

    await signUpPage.pressKey("Tab");
    await expect(signUpPage.passwordInput).toBeFocused();

    await signUpPage.focusElement(signUpPage.confirmPasswordInput);
    await expect(signUpPage.confirmPasswordInput).toBeFocused();
  });
});
