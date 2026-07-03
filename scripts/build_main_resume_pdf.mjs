import { copyFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const chrome =
  process.env.CHROME || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const out = resolve(root, "Antonio_Colomba_Main_Resume.pdf");
const docsOut = resolve(root, "docs/Antonio_Colomba_Main_Resume.pdf");

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
    viewport: { width: 1280, height: 1800 },
    deviceScaleFactor: 1,
  });

  await page.emulateMedia({ media: "screen" });
  await page.goto(pathToFileURL(resolve(root, "main-resume.html")).href, {
    waitUntil: "networkidle",
  });

  await page.addStyleTag({
    content: `
      nav,
      .download-row,
      .resume-switch {
        display: none !important;
      }

      body {
        font-size: 15px !important;
        line-height: 1.36 !important;
        print-color-adjust: exact;
        -webkit-print-color-adjust: exact;
      }

      main {
        padding: 0 !important;
      }

      header {
        margin: 0 0 16px !important;
        gap: 28px !important;
      }

      h1 {
        font-size: 56px !important;
      }

      .subtitle {
        margin-top: 8px !important;
        font-size: 18px !important;
      }

      .contact {
        font-size: 12px !important;
        line-height: 1.35 !important;
      }

      .summary {
        max-width: none !important;
        margin: 0 0 15px 190px !important;
        font-size: 15px !important;
        line-height: 1.34 !important;
      }

      section {
        grid-template-columns: 170px minmax(0, 1fr) !important;
        column-gap: 26px !important;
        margin-top: 13px !important;
        padding-top: 0 !important;
        border-top: 0 !important;
      }

      h2 {
        font-size: 15px !important;
        line-height: 1.05 !important;
      }

      h3 {
        margin: 10px 0 3px !important;
        font-size: 15px !important;
        line-height: 1.12 !important;
      }

      h3 small {
        font-size: 10.5px !important;
      }

      ul {
        margin: 4px 0 0 18px !important;
      }

      li {
        margin: 2px 0 !important;
      }

      p {
        margin-top: 0 !important;
      }

      .education-list {
        gap: 5px !important;
      }

      .school {
        font-size: 15px !important;
        line-height: 1.1 !important;
      }

      .school-detail {
        margin-top: 1px !important;
        font-size: 12.5px !important;
        line-height: 1.2 !important;
      }

      .school-location {
        font-size: 11.5px !important;
      }
    `,
  });

  await page.pdf({
    path: out,
    format: "Letter",
    printBackground: true,
    margin: {
      top: "0.22in",
      right: "0.22in",
      bottom: "0.22in",
      left: "0.22in",
    },
    scale: 0.82,
  });
} finally {
  await browser.close();
}

copyFileSync(out, docsOut);
console.log(out);
console.log(docsOut);
