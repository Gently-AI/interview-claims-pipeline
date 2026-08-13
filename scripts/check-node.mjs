// Runs before install and before dev. Node version problems are the most common
// reason this repo won't start, and the default error messages don't say so.
const REQUIRED = 22;
const current = process.versions.node;
const major = Number(current.split(".")[0]);

if (Number.isNaN(major) || major < REQUIRED) {
  const line = "─".repeat(64);
  console.error(`\n${line}`);
  console.error(`  This project needs Node ${REQUIRED} or newer. You have ${current}.`);
  console.error(line);
  console.error(`
  If you have nvm:      nvm install 22 && nvm use 22
  If you have fnm:      fnm install 22 && fnm use 22
  If you have neither:  https://nodejs.org  (download the LTS installer)

  macOS with Homebrew:  brew install node@22
  Windows:              winget install OpenJS.NodeJS.LTS

  Then run 'node -v' to confirm, and start again.
`);
  process.exit(1);
}
