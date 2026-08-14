// Runs before install and before dev. A wrong Node version is the most common
// reason this repo won't start, and the errors it causes downstream (native
// build failures, syntax errors) point nowhere near the real cause.
const REQUIRED = 22;
const current = process.versions.node;
const major = Number(current.split(".")[0]);

if (Number.isNaN(major) || major < REQUIRED) {
  const line = "─".repeat(68);
  console.error(`\n${line}`);
  console.error(`  This project needs Node ${REQUIRED} or newer. You have ${current}.`);
  console.error(line);
  console.error(`
  Already have nvm?     nvm install 22 && nvm use 22
  Already have fnm?     fnm install 22 && fnm use 22

  No nvm? Install it, reopen your terminal, then run the above:
    macOS / Linux       curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
    Windows             winget install CoreyButler.NVMforWindows

  Or skip nvm and install Node directly:
    macOS               brew install node@22
    Windows             winget install OpenJS.NodeJS.LTS
    Anything            https://nodejs.org  (download the LTS installer)

  Then 'node -v' to confirm, and start again.
  Full instructions are in the README.
`);
  process.exit(1);
}
