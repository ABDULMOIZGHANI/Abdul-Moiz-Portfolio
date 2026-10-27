// Packages the standalone build into deploy/portfolio (+ deploy/portfolio.zip) ready to upload to cPanel.
// Usage: npm run package   (builds first)
import { cpSync, existsSync, rmSync, readdirSync } from "node:fs";
import { execSync } from "node:child_process";

const OUT = "deploy/portfolio";

if (!existsSync(".next/standalone/server.js")) {
  console.error('No standalone build found. Run "npm run build" first (output: "standalone" must be set in next.config.mjs).');
  process.exit(1);
}

rmSync("deploy", { recursive: true, force: true });
cpSync(".next/standalone", OUT, { recursive: true });
cpSync(".next/static", `${OUT}/.next/static`, { recursive: true });
if (existsSync("public")) cpSync("public", `${OUT}/public`, { recursive: true });

// Never ship local secrets — on cPanel, set environment variables in "Setup Node.js App".
for (const f of readdirSync(OUT)) if (f.startsWith(".env")) rmSync(`${OUT}/${f}`, { force: true });

try {
  // tar ships with Windows 10+ and macOS and can write zip files with -a.
  execSync("tar -a -c -f deploy/portfolio.zip -C deploy portfolio", { stdio: "ignore" });
  console.log("✓ Ready: deploy/portfolio.zip — upload and extract it in your cPanel app folder.");
} catch {
  console.log("✓ Ready: deploy/portfolio — zip this folder and upload it to your cPanel app folder.");
}
