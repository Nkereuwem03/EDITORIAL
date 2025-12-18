import loginCredentials from "../testData/loginCredentials.json" assert { type: "json" };
import { faker } from "@faker-js/faker";
import { MailSlurp } from "mailslurp-client";

const FRONTEND_URL =
  process.env.BASE_URL || "https://editorial.joinebo.app";
const API_BASE_URL =
  process.env.API_BASE_URL || "https://backend.joinebo.app/main";
const API_LOGIN_ENDPOINT = `${API_BASE_URL}/auth/login/`;

const mailslurp = new MailSlurp({
  apiKey: process.env.MAILSLURP_API_KEY,
});

export async function sendVerificationCodeViaAPI(page, email) {
  const response = await page.request.post(
    `${API_BASE_URL}/auth/email/send-code/`,
    {
      data: { email },
      headers: { "Content-Type": "application/json" },
    }
  );

  if (!response.ok()) {
    throw new Error(`Send code failed with status ${response.status()}`);
  }
  return await response.json();
}

export async function getVerificationCode(inboxId) {
  try {
    console.log(`Waiting for email in inbox: ${inboxId}`);

    const email = await mailslurp.waitController.waitForLatestEmail({
      inboxId: inboxId,
      unreadOnly: true,
      timeout: 60_000,
    });

    console.log(`Email received:`);
    console.log(`   - ID: ${email.id}`);
    console.log(`   - Subject: "${email.subject}"`);
    console.log(`   - From: ${email.from}`);
    console.log(`   - Received: ${email.createdAt}`);

    const body = email.body || "";

    const digitMatches = body.match(/<td class="table-cell-style">(\d)<\/td>/g);

    if (!digitMatches || digitMatches.length === 0) {
      console.log(
        `No code digits found in HTML. Searching for fallback patterns...`
      );

      const fallback = body.match(/(\d{6})/);
      if (fallback) {
        return fallback[1];
      }

      throw new Error("Verification code not found in email");
    }

    const codeDigits = digitMatches.map((match) => {
      const digitMatch = match.match(/(\d)/);
      return digitMatch ? digitMatch[1] : "";
    });

    const extractedCode = codeDigits.join("");
    console.log(`Verification code extracted: ${extractedCode}`);
    return extractedCode;
  } catch (err) {
    console.error("Error getting verification code:", err.message);
    throw err;
  }
}

export async function verifyEmailViaAPI(page, email, code) {
  const response = await page.request.post(
    `${API_BASE_URL}/auth/email/verify/`,
    {
      data: {
        email,
        code: code.toString(),
      },
      headers: { "Content-Type": "application/json" },
    }
  );

  if (!response.ok()) {
    const errorBody = await response.json().catch(() => ({}));
    console.error(
      `Verification failed with status ${response.status()}: email=${email}, code=${code}`,
      errorBody
    );
    throw new Error(
      `Email verification failed with status ${response.status()}`
    );
  }

  const verifyBody = await response.json();
  console.log(`Email verification successful`);

  const allHeaders = response.headers();
  console.log(`Verify response headers:`, Object.keys(allHeaders));
  if (allHeaders["set-cookie"]) {
    console.log(`Set-Cookie header found:`, allHeaders["set-cookie"]);
  }

  return verifyBody;
}

export async function signUpViaAPI(page) {
  try {
    const inbox = await mailslurp.inboxController.createInboxWithDefaults();
    const email = inbox.emailAddress;
    const password = "Testing@123";

    console.log(`Created inbox with email: ${email}`);

    await sendVerificationCodeViaAPI(page, email);
    console.log(`Verification code sent to ${email}`);
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const verificationCode = await getVerificationCode(inbox.id);
    console.log(`Verification code extracted: ${verificationCode}`);

    await verifyEmailViaAPI(page, email, verificationCode);
    console.log(`Email verified successfully`);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log(`Attempting to sign up with verified email: ${email}`);
    const signUpResponse = await page.request.post(
      `${API_BASE_URL}/auth/register/`,
      {
        data: {
          email: email,
          account_type: "expert",
          password: password,
          confirm_password: password,
          profile_data: {
            first_name: faker.internet.username(),
            last_name: faker.internet.username(),
          },
        },
      }
    );

    if (!signUpResponse.ok()) {
      const errorBody = await signUpResponse.json().catch(() => ({}));
      console.error(
        `Sign up failed with status ${signUpResponse.status()}:`,
        errorBody
      );
      throw new Error(`Sign up failed with status ${signUpResponse.status()}`);
    }

    const signUpBody = await signUpResponse.json();
    console.log(`Sign up successful for ${email}`);
    console.log(`User created:`, signUpBody.data.user.username);

    const accessToken = signUpBody.data.access;
    const refreshToken = signUpBody.data.refresh;

    if (accessToken && refreshToken) {
      console.log(`Setting cookies from sign-up response`);
      await page.context().addCookies([
        { name: "access-token", value: accessToken, url: FRONTEND_URL },
        { name: "refresh-token", value: refreshToken, url: FRONTEND_URL },
        { name: "email", value: email, url: FRONTEND_URL },
      ]);
      console.log(`Cookies set successfully`);
    } else {
      throw new Error("Missing access or refresh token in sign-up response");
    }

    return { email, password };
  } catch (err) {
    console.error("Sign up error:", err);
    throw err;
  }
}

export async function authenticateViaAPI(page) {
  try {
    const res = await page.request.post(API_LOGIN_ENDPOINT, {
      data: {
        email: loginCredentials.validUser.email,
        password: loginCredentials.validUser.password,
      },
    });

    if (!res.ok()) {
      throw new Error(`Authentication failed with status ${res.status()}`);
    }

    const body = await res.json();

    const token =
      body.access_token ||
      body.token ||
      body.access ||
      body.data?.access_token ||
      body?.data?.accessToken ||
      body.data?.access ||
      body.data?.token;

    if (!token) {
      throw new Error(`Token not found in response: ${JSON.stringify(body)}`);
    }

    return token;
  } catch (err) {
    console.error("Authentication error:", err);
    throw err;
  }
}

export async function loginAndSetCookie(page, email, password) {
  const res = await page.request.post(API_LOGIN_ENDPOINT, {
    data: { email, password },
  });

  if (!res.ok()) {
    throw new Error(`Authentication failed with status ${res.status()}`);
  }

  const body = await res.json();
  const accessToken = body.data.access;
  const refreshToken = body.data.refresh;

  await page.context().addCookies([
    { name: "access-token", value: accessToken, url: FRONTEND_URL },
    { name: "refresh-token", value: refreshToken, url: FRONTEND_URL },
    { name: "email", value: email, url: FRONTEND_URL },
  ]);

  return accessToken;
}
