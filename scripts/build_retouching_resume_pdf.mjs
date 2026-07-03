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
      .portfolio-section,
      .proof-strip,
      .resume-switch {
        display: none !important;
      }

      body {
        font-size: 13.2px !important;
        line-height: 1.22 !important;
        print-color-adjust: exact;
        -webkit-print-color-adjust: exact;
      }

      main {
        width: 100% !important;
        max-width: none !important;
        padding: 0.5in !important;
      }

      header {
        grid-template-columns: minmax(0, 69%) 145px !important;
        margin: 0 0 10px !important;
        gap: 22px !important;
      }

      h1 {
        font-size: 44px !important;
      }

      .subtitle {
        margin-left: 0 !important;
        margin-top: 9px !important;
        font-size: 15.5px !important;
      }

      .contact {
        justify-self: start !important;
        font-size: 10.8px !important;
        line-height: 1.18 !important;
        text-align: left !important;
      }

      .summary {
        max-width: none !important;
        margin: 0 0 9px 180px !important;
        font-size: 13.2px !important;
        line-height: 1.22 !important;
      }

      .intro-section {
        margin-top: 0 !important;
        padding-top: 0 !important;
        border-top: 0 !important;
      }

      .intro-section h2 {
        text-transform: none !important;
      }

      .intro-section .summary {
        margin: 0 !important;
      }

      section {
        grid-template-columns: 150px minmax(0, 1fr) !important;
        column-gap: 22px !important;
        margin-top: 9px !important;
        padding-top: 0 !important;
        border-top: 0 !important;
        break-inside: auto !important;
        page-break-inside: auto !important;
      }

      h2 {
        font-size: 12.2px !important;
        line-height: 1.02 !important;
        padding-right: 10px !important;
      }

      .keep {
        white-space: nowrap !important;
      }

      h3 {
        display: grid !important;
        grid-template-columns: minmax(0, 60%) 145px !important;
        column-gap: 12px !important;
        justify-content: start !important;
        align-items: baseline !important;
        margin: 7px 0 2px !important;
        font-size: 12.3px !important;
        line-height: 1.08 !important;
      }

      h3 small {
        font-size: 9.1px !important;
        text-align: left !important;
        white-space: nowrap !important;
      }

      ul {
        margin: 2px 0 0 14px !important;
      }

      li {
        margin: 0.5px 0 !important;
      }

      p {
        margin-top: 0 !important;
        margin-bottom: 2px !important;
      }

      .education-list {
        gap: 3px !important;
      }

      .school {
        display: grid !important;
        grid-template-columns: minmax(0, 60%) 145px !important;
        column-gap: 12px !important;
        align-items: baseline !important;
        font-size: 12px !important;
        line-height: 1.08 !important;
      }

      .school-detail {
        margin-top: 1px !important;
        font-size: 10.4px !important;
        line-height: 1.08 !important;
      }

      .school-location {
        display: block !important;
        min-width: 0 !important;
        margin-left: 0 !important;
        font-size: 9.4px !important;
        text-align: left !important;
      }
    `,
  });

  await page.pdf({
    path: out,
    format: "Letter",
    printBackground: true,
    margin: {
      top: "0",
      right: "0",
      bottom: "0",
      left: "0",
    },
    scale: 0.95,
  });
} finally {
  await browser.close();
}

copyFileSync(out, docsOut);
console.log(out);
console.log(docsOut);
