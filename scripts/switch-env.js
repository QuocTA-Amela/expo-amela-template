// Switch environment: if param is dev then copy replace file .env.dev to .env. If param is live then copy replace file .env.live to .env
// Usage: node scripts/switch-env.js dev

const fs = require("fs");
const path = require("path");
const env = process.argv[2];
const rootPath = path.resolve(__dirname, "..");
// dotenv files
const envPath = path.resolve(rootPath, ".env");
const envDevPath = path.resolve(rootPath, "environments", ".env.dev");
const envStagingPath = path.resolve(rootPath, "environments", ".env.staging");
const envProductionPath = path.resolve(
  rootPath,
  "environments",
  ".env.production"
);

// Read build.gradle file
const buildGradlePath = path.resolve(
  rootPath,
  "android",
  "app",
  "build.gradle"
);
// Read app.json file
const appJSONPath = path.resolve(rootPath, "app.json");

if (!env || (env !== "dev" && env !== "staging" && env !== "production")) {
  throw new Error("Please provide environment: dev || staging || production");
}

if (
  !fs.existsSync(envPath) ||
  !fs.existsSync(envDevPath) ||
  !fs.existsSync(envStagingPath) ||
  !fs.existsSync(envProductionPath)
) {
  throw new Error(
    "Error switching environment. Make sure these files are present in your root project folder: .env, .env.dev, .env.staging, .env.production files!"
  );
}

// Function to read the .env file and get the value of a specific variable
function getEnvValue(filePath, key) {
  const envFileContent = fs.readFileSync(filePath, "utf-8");
  const lines = envFileContent.split("\n");

  for (let line of lines) {
    if (line.startsWith(key)) {
      return line.split("=")[1].trim().replace(/"/g, "");
    }
  }
  return null;
}

// Copy environment env to .env
let envFilePathToCopy = envDevPath;
if (env === "staging") envFilePathToCopy = envStagingPath;
if (env === "production") envFilePathToCopy = envProductionPath;
fs.copyFileSync(envFilePathToCopy, envPath);
console.log(`Replaced .env to ${env} environment`);

// Get some values in .env file
const androidVerCode = getEnvValue(
  envPath,
  "EXPO_PUBLIC_ANDROID_APP_VERSION_CODE"
);
const androidVerName = getEnvValue(
  envPath,
  "EXPO_PUBLIC_ANDROID_APP_VERSION_NAME"
);
const appName = getEnvValue(envPath, "EXPO_PUBLIC_APP_NAME");
const androidAppId = getEnvValue(envPath, "EXPO_PUBLIC_ANDROID_APP_ID");
const iosAppId = getEnvValue(envPath, "EXPO_PUBLIC_IOS_APP_ID");
const slugName = getEnvValue(envPath, "EXPO_PUBLIC_SLUG_NAME");
const channelName = getEnvValue(envPath, "EXPO_PUBLIC_CHANNEL_NAME");

// ANDROID: Modify build.gradle file
const buildAppGradleContent = fs.readFileSync(buildGradlePath, "utf8");
// Replace BUILD_ENV line with dev
const newBuildAppGradleContent = buildAppGradleContent
  .replace(/versionCode .+/, `versionCode ${androidVerCode}`)
  .replace(/versionName .+/, `versionName "${androidVerName}"`);
fs.writeFileSync(buildGradlePath, newBuildAppGradleContent);
console.log(
  `Modified build.gradle file (${buildGradlePath}) to ${env} environment`
);

const appJSONContent = fs.readFileSync(appJSONPath, "utf-8");
const newAppJSONContent = appJSONContent
  .replace(/"name": .+/, `"name": "${appName}",`)
  .replace(/"slug": .+/, `"slug": "${slugName}",`)
  .replace(/"package": .+/, `"package": "${androidAppId}"`)
  .replace(/"bundleIdentifier": .+/, `"bundleIdentifier": "${iosAppId}"`)
  .replace(/"expo-channel-name": .+/, `"expo-channel-name": "${channelName}"`);
fs.writeFileSync(appJSONPath, newAppJSONContent);
console.log(`Modified app.json file (${appJSONPath}) to ${env} environment`);
