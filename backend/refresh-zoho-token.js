// refresh-zoho-token.js

const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const fs = require('fs');
require('dotenv').config();

const envPath = ".env";
const refreshToken = process.env.ZOHO_REFRESH_TOKEN;
const clientId = process.env.ZOHO_CLIENT_ID;
const clientSecret = process.env.ZOHO_CLIENT_SECRET;

async function refreshZohoToken() {
  const url = "https://accounts.zoho.com/oauth/v2/token";
  const params = new URLSearchParams({
    refresh_token: refreshToken,
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: "refresh_token",
  });

  try {
    const response = await fetch(url, {
      method: "POST",
      body: params,
    });

    const data = await response.json();

    if (data.access_token) {
      console.log("✅ Token refreshed successfully!");
      console.log("🔑 New Access Token:", data.access_token);

      // Update both Zoho CRM and Campaigns access tokens automatically
      updateEnvFile("ZOHO_ACCESS_TOKEN", data.access_token);
      updateEnvFile("ZOHO_CAMPAIGNS_ACCESS_TOKEN", data.access_token);
    } else {
      console.error("⚠️ Token refresh failed:", data);
    }
  } catch (err) {
    console.error("❌ Error refreshing token:", err);
  }
}

function updateEnvFile(key, value) {
  try {
    let envData = fs.readFileSync(envPath, "utf-8");

    // Replace or append token
    if (envData.includes(`${key}=`)) {
      envData = envData.replace(new RegExp(`${key}=.*`, "g"), `${key}=${value}`);
    } else {
      envData += `\n${key}=${value}`;
    }

    fs.writeFileSync(envPath, envData);
    console.log(`💾 Updated ${key} in .env file.`);
  } catch (err) {
    console.error("❌ Error updating .env file:", err);
  }
}

// Immediately run once
refreshZohoToken();

// Auto-refresh every 55 minutes (3300 seconds)
setInterval(refreshZohoToken, 3300 * 1000);
