import { test, expect, devices } from "@playwright/test";
import LogoutPage from "../pages/LogoutPage";
import { loginAndSetCookie } from "../utils/authenticateViaAPI";
import loginCredentials from "../testData/loginCredentials.json" assert { type: "json" };
import { faker } from "@faker-js/faker";
import { log } from "console";

test.describe("Logout functionality", () => {
  let logoutPage;

  test.beforeEach(async ({ page }) => {
    logoutPage = new LogoutPage(page);
    await loginAndSetCookie(
      page,
      loginCredentials.validUser.email,
      loginCredentials.validUser.password
    );
    await logoutPage.goTo("/dashboard");
  });

  test("Verify that clicking the button successfully logs the user out and redirects them to the login page.", async () => {
    await logoutPage.clickLogoutButton();
    await expect(logoutPage.page).toHaveURL(
      "https://editorial.joinebo.app/sign-in"
    );
  });

  test("Verify that the button changes its appearance (hover effect) when the mouse pointer is over it.", async () => {
    await logoutPage.logoutButton.hover();
    await expect(logoutPage.logoutButton).toHaveCSS(
      "background-color",
      "rgba(0, 83, 122, 0.05)"
    );
    await expect(logoutPage.logoutButton).toHaveCSS("color", "rgb(4, 51, 83)");
  });
});
