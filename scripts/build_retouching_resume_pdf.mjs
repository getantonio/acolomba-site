import { copyFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const chrome =
  process.env.CHROME || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const out = resolve(root, "Antonio_Colomba_Retouching_Resume.pdf");
const docsOut = resolve(root, "docs/Antonio_Colomba_Retouching_Resume.pdf");

let playwright;
try {
  playwright = await import("playwright");
} catch {
  playwright = await import(
    pathToFileURL(
      "/Users/getantonio/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs"
    ).href
  );
}

const { chromium } = playwright;

const browser = await chromium.launch({
  headless: true,
  executablePath: chrome,
});

try {
  const page = await browser.newPage({
    viewport: { width: 1280, height: 1900 },
    deviceScaleFactor: 1,
  });

  await page.emulateMedia({ media: "screen" });
  await page.goto(pathToFileURL(resolve(root, "retouching-resume.html")).href, {
    waitUntil: "networkidle",
  });

  await page.addStyleTag({
    content: `
      nav,
      .download-row,
      .proof-strip,
      .resume-switch {
        display: none !important;
      }

      body {
        print-color-adjust: exact;
        -webkit-print-color-adjust: exact;
      }
    `,
  });

  await page.pdf({
    path: out,
    format: "Letter",
    printBackground: true,
    margin: {
      top: "0.25in",
      right: "0.25in",
      bottom: "0.25in",
      left: "0.25in",
    },
    scale: 0.72,
  });
} finally {
  await browser.close();
}

copyFileSync(out, docsOut);
console.log(out);
console.log(docsOut);
