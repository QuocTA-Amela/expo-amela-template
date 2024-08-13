const fs = require("fs");
const path = require("path");
const rootPath = path.resolve(__dirname, "..");

const gitignorePath = path.resolve(rootPath, ".gitignore");
const gitignoreContent = fs.readFileSync(gitignorePath, "utf8");
const newGitignoreContent = gitignoreContent
  .replace("android", "")
  .replace("ios", "");
fs.writeFileSync(gitignorePath, newGitignoreContent);
