import { readdir, readFile } from "node:fs/promises";
import { dirname, relative, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptDirectory, "..");
const oldDomainPattern = /acolomba\.site/gi;
const ignoredDirectories = new Set([".git", ".github", "_site", "output"]);
const corsCases = [
  { origin: "http://acolomba.com", expected: "http://acolomba.com" },
  { origin: "https://acolomba.com", expected: "https://acolomba.com" },
  { origin: "http://www.acolomba.com", expected: "http://www.acolomba.com" },
  { origin: "https://www.acolomba.com", expected: "https://www.acolomba.com" },
  { origin: "https://acolomba.site", expected: "https://acolomba.com" },
  { origin: "https://example.com", expected: "https://acolomba.com" },
];

function optionValue(name) {
  const index = process.argv.indexOf(name);
  return index === -1 ? "" : process.argv[index + 1] || "";
}

async function htmlFiles(directory = projectRoot) {
  const files = [];

  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && ignoredDirectories.has(entry.name)) {
      continue;
    }

    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await htmlFiles(path)));
    } else if (entry.isFile() && entry.name.endsWith(".html")) {
      files.push(path);
    }
  }

  return files.sort();
}

function auditHtml(source, label) {
  const occurrences = source.match(oldDomainPattern) || [];
  const staleLinks = [];
  const anchorPattern = /<a\b([^>]*)>([\s\S]*?)<\/a>/gi;

  for (const match of source.matchAll(anchorPattern)) {
    const attributes = match[1];
    const text = match[2].replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
    const href = attributes.match(/\bhref\s*=\s*(["'])(.*?)\1/i)?.[2] || "";

    if (oldDomainPattern.test(href) || oldDomainPattern.test(text)) {
      staleLinks.push({ href, text });
    }
    oldDomainPattern.lastIndex = 0;
  }

  return { label, occurrenceCount: occurrences.length, staleLinks };
}

async function auditPages(baseUrl) {
  const files = await htmlFiles();
  const results = [];

  for (const file of files) {
    const route = relative(projectRoot, file).split("\\").join("/");
    if (baseUrl) {
      const url = new URL(route, `${baseUrl.replace(/\/$/, "")}/`);
      const response = await fetch(url, { redirect: "follow" });
      if (!response.ok) {
        throw new Error(`${url} returned HTTP ${response.status}`);
      }
      results.push(auditHtml(await response.text(), url.toString()));
    } else {
      results.push(auditHtml(await readFile(file, "utf8"), route));
    }
  }

  return results;
}

async function importWorker() {
  const path = resolve(projectRoot, "workers/telegram-message-worker.js");
  const source = await readFile(path, "utf8");
  const moduleUrl = `data:text/javascript;base64,${Buffer.from(source).toString("base64")}`;
  return import(moduleUrl);
}

async function localCorsResults() {
  const workerModule = await importWorker();
  const endpointModule = await import(
    pathToFileURL(resolve(projectRoot, "telegram-endpoint/api/send-telegram.js"))
  );

  const results = [];
  for (const testCase of corsCases) {
    const workerResponse = await workerModule.default.fetch(
      new Request("https://worker.example", {
        method: "OPTIONS",
        headers: { Origin: testCase.origin },
      }),
      {},
    );
    results.push({
      label: `Cloudflare Worker source (${testCase.origin})`,
      actual: workerResponse.headers.get("access-control-allow-origin"),
      expected: testCase.expected,
    });

    const endpointHeaders = new Map();
    const endpointResponse = {
      setHeader(name, value) {
        endpointHeaders.set(name.toLowerCase(), value);
      },
      status(code) {
        this.statusCode = code;
        return this;
      },
      end() {
        return this;
      },
    };
    await endpointModule.default(
      { method: "OPTIONS", headers: { origin: testCase.origin } },
      endpointResponse,
    );
    results.push({
      label: `Vercel endpoint source (${testCase.origin})`,
      actual: endpointHeaders.get("access-control-allow-origin"),
      expected: testCase.expected,
    });
  }

  return results;
}

async function liveCorsResults(workerUrl) {
  const results = [];
  for (const testCase of corsCases) {
    const response = await fetch(workerUrl, {
      method: "OPTIONS",
      headers: {
        Origin: testCase.origin,
        "Access-Control-Request-Method": "POST",
      },
    });
    results.push({
      label: `${workerUrl} (${testCase.origin})`,
      actual: response.headers.get("access-control-allow-origin"),
      expected: testCase.expected,
    });
  }
  return results;
}

const baseUrl = optionValue("--base-url");
const workerUrl = optionValue("--worker-url");
const pageResults = await auditPages(baseUrl);
const stalePageResults = pageResults.filter((result) => result.occurrenceCount > 0);
const staleLinkCount = stalePageResults.reduce(
  (total, result) => total + result.staleLinks.length,
  0,
);
const staleOccurrenceCount = stalePageResults.reduce(
  (total, result) => total + result.occurrenceCount,
  0,
);
const corsResults = baseUrl ? [] : await localCorsResults();
if (workerUrl) {
  corsResults.push(...(await liveCorsResults(workerUrl)));
}
const badCorsResults = corsResults.filter((result) => result.actual !== result.expected);

if (stalePageResults.length || badCorsResults.length) {
  for (const result of stalePageResults) {
    console.error(
      `${result.label}: ${result.occurrenceCount} old-domain occurrence(s), ${result.staleLinks.length} affected link(s)`,
    );
  }
  for (const result of badCorsResults) {
    console.error(`${result.label}: expected CORS ${result.expected}, received ${result.actual}`);
  }
  console.error(
    `Audit failed: ${staleLinkCount} affected link(s), ${staleOccurrenceCount} old-domain page occurrence(s), ${badCorsResults.length} CORS failure(s).`,
  );
  process.exitCode = 1;
} else {
  console.log(
    `Audit passed: ${pageResults.length} HTML pages, 0 old-domain links, 0 old-domain page occurrences, ${corsResults.length} CORS check(s).`,
  );
}
