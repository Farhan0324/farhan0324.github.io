// Browser checks against the production build. Run `npm run build` first.
// Set PW_CHANNEL=msedge to use an installed browser instead of Playwright's Chromium.
import assert from "node:assert/strict";
import fs from "node:fs";
import { createRequire } from "node:module";
import { chromium } from "playwright";
import { preview } from "vite";

const PORT = 4180;
const URL = `http://localhost:${PORT}/`;
const axeSource = fs.readFileSync(createRequire(import.meta.url).resolve("axe-core/axe.min.js"), "utf8");

const server = await preview({ preview: { port: PORT, strictPort: true }, logLevel: "error" });
const browser = await chromium.launch({ channel: process.env.PW_CHANNEL || undefined });
const problems = [];

const GOOGLE_ANALYTICS = /googletagmanager|google-analytics/;

// `consent` is the stored choice; null means a first visit, with the banner showing.
const openPage = async ({ consent = "denied", path = "", ...options } = {}) => {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, ...options });
  // External services are not part of these checks.
  await context.route(GOOGLE_ANALYTICS, (route) => route.abort());
  if (consent) await context.addInitScript((value) => localStorage.setItem("analytics-consent", value), consent);
  const page = await context.newPage();
  page.analyticsRequests = [];
  page.on("request", (request) => {
    if (GOOGLE_ANALYTICS.test(request.url())) page.analyticsRequests.push(request.url());
  });
  page.on("pageerror", (error) => problems.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error" && !/Failed to load resource|ERR_FAILED/.test(message.text())) {
      problems.push(message.text());
    }
  });
  await page.goto(URL + path, { waitUntil: "networkidle" });
  return page;
};

const check = async (name, run) => {
  await run();
  console.log(`ok - ${name}`);
};

try {
  await check("pre-rendered content works without JavaScript", async () => {
    const page = await openPage({ javaScriptEnabled: false });
    assert.match(await page.locator("h1").innerText(), /security/);
    assert.equal(await page.locator("#projects article").count(), 4);
  });

  await check("sections, experience and projects render", async () => {
    const page = await openPage();
    for (const id of ["about", "experience", "expertise", "projects", "contact"]) {
      assert.equal(await page.locator(`#${id}`).count(), 1, id);
    }
    assert.equal(await page.locator("#experience ol > li").count(), 4);
  });

  await check("project filters and details work", async () => {
    const page = await openPage();
    await page.evaluate(() => document.getElementById("projects").scrollIntoView({ behavior: "instant" }));
    await page.locator("#projects article button").first().click();
    assert.equal(await page.locator("dialog[open]").count(), 1);
    await page.keyboard.press("Escape");
    await page.locator("button[aria-pressed]", { hasText: "Public" }).click();
    await page.waitForTimeout(700);
    assert.equal(await page.locator("#projects article").count(), 1);
  });

  for (const [slug, heading] of [
    ["nist-csf-microsoft", /NIST Cybersecurity Framework/],
    ["nis2-incident-response", /Incident Response Playbook/],
  ]) {
    await check(`${slug} page renders at every width`, async () => {
      for (const width of [390, 820, 1440]) {
        const page = await openPage({ path: `projects/${slug}/`, viewport: { width, height: 900 } });
        assert.match(await page.locator("h1").innerText(), heading);
        assert.equal((await page.locator("figure").count()) >= 4, true);
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `${width}px`);
      }
    });

    await check(`${slug} page has no accessibility violations`, async () => {
      for (const colorScheme of ["dark", "light"]) {
        const page = await openPage({ path: `projects/${slug}/`, colorScheme, reducedMotion: "reduce" });
        await page.addScriptTag({ content: axeSource });
        const violations = await page.evaluate(async () =>
          (await window.axe.run(document)).violations.map((v) => `${v.id} x${v.nodes.length}: ${v.nodes[0].target}`),
        );
        assert.deepEqual(violations, []);
      }
    });
  }

  await check("project cards link to their pages", async () => {
    const page = await openPage();
    assert.equal((await page.locator('#projects a[href="/projects/nist-csf-microsoft/"]').count()) > 0, true);
    assert.equal((await page.locator('#projects a[href="/projects/nis2-incident-response/"]').count()) > 0, true);
  });

  await check("command menu navigates", async () => {
    const page = await openPage();
    await page.keyboard.press("Control+k");
    await page.keyboard.type("contact");
    await page.keyboard.press("Enter");
    // Smooth scrolling takes longer on slower machines.
    await page.waitForFunction(
      () => Math.abs(document.getElementById("contact").getBoundingClientRect().top) < 200,
      null,
      {
        timeout: 5000,
      },
    );
  });

  await check("German language and title load", async () => {
    const page = await openPage({ locale: "de-DE" });
    await page.waitForTimeout(500);
    assert.match(await page.locator("h1").innerText(), /Sicherheit/);
    assert.equal(await page.evaluate(() => document.documentElement.lang), "de");
  });

  await check("phone layout has no sideways scroll", async () => {
    const page = await openPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
  });

  await check("no analytics or consent banner without VITE_GA_ID", async () => {
    const page = await openPage({ consent: null });
    assert.equal(await page.getByRole("region", { name: "Cookies and your privacy" }).count(), 0);
    assert.deepEqual(page.analyticsRequests, []);
  });

  await check("privacy page opens", async () => {
    const page = await openPage({ path: "privacy/" });
    assert.equal(await page.locator("h1").first().innerText(), "Privacy Policy");
  });

  for (const colorScheme of ["dark", "light"]) {
    await check(`no accessibility violations in ${colorScheme} theme`, async () => {
      const page = await openPage({ consent: null, colorScheme, reducedMotion: "reduce" });
      await page.evaluate(() => document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-in")));
      await page.addScriptTag({ content: axeSource });
      const violations = await page.evaluate(async () =>
        (await window.axe.run(document)).violations.map((v) => `${v.id} x${v.nodes.length}`),
      );
      assert.deepEqual(violations, []);
    });
  }

  assert.deepEqual(problems, [], "browser errors");
  console.log("All smoke checks passed.");
} finally {
  await browser.close();
  await new Promise((resolve) => server.httpServer.close(resolve));
}
