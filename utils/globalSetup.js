// utils/updateEnvFiles.js
import fs from "fs";

export function updateValidUserPassword(newPassword) {
  const envFiles = [".env", ".env.dev", ".env.test"];

  envFiles.forEach((envFile) => {
    if (fs.existsSync(envFile)) {
      try {
        let content = fs.readFileSync(envFile, "utf-8");

        // Replace VALID_USER_PASSWORD value
        content = content.replace(
          /VALID_USER_PASSWORD=.*/,
          `VALID_USER_PASSWORD=${newPassword}`
        );

        fs.writeFileSync(envFile, content, "utf-8");
        console.log(`✓ Updated VALID_USER_PASSWORD in ${envFile}`);
      } catch (error) {
        console.error(`✗ Error updating ${envFile}:`, error.message);
      }
    }
  });

  // Also update process.env for current session
  process.env.VALID_USER_PASSWORD = newPassword;
}
