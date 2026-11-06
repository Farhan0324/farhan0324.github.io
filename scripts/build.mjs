// Production build: client bundle + build-time pre-render of the English page.
// The pre-rendered HTML gives an instant first paint, indexable content and a
// no-JS fallback; src/main.jsx then hydrates it.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { build } from "vite";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const indexPath = path.join(root, "dist", "index.html");
const ssrDir = path.join(root, "node_modules", ".prerender");
const marker = '<div id="root"></div>';

// One timestamp for both builds so date-based text hydrates identically.
process.env.VITE_BUILD_TIME ||= new Date().toISOString();

await build({ root });
await build({
  root,
  logLevel: "warn",
  build: { ssr: "src/entry-server.jsx", outDir: ssrDir, emptyOutDir: true, copyPublicDir: false },
});

const { render } = await import(pathToFileURL(path.join(ssrDir, "entry-server.js")).href);
let html = fs.readFileSync(indexPath, "utf8");
if (!html.includes(marker)) throw new Error(`prerender: ${marker} not found in dist/index.html`);
// Replacer function: a string replacement would interpret $&, $' etc. inside the content.
const withContent = (template, slug) => template.replace(marker, () => `<div id="root">${render(slug)}</div>`);

// Inline the (single, ~12 kB gzipped) stylesheet to save a render-blocking round trip.
html = html.replace(/<link rel="stylesheet"[^>]*href="(\/assets\/[^"]+\.css)"[^>]*>/, (_, href) => {
  const css = fs.readFileSync(path.join(root, "dist", href), "utf8");
  return `<style>${css}</style>`;
});

fs.writeFileSync(indexPath, withContent(html));

// One real HTML file per project page, so deep links work on GitHub Pages.
const escapeHtml = (text) => text.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;");
const homeTitle = /<title>(.*?)<\/title>/.exec(html)[1];
const homeDescription = /<meta name="description" content="(.*?)"/.exec(html)[1];
const siteUrl = /<link rel="canonical" href="(.*?)\/?"/.exec(html)[1];
const PROJECT_PAGES = { "nist-csf-microsoft": "nist", "nis2-incident-response": "nis2" };
for (const [slug, file] of Object.entries(PROJECT_PAGES)) {
  const { en } = JSON.parse(fs.readFileSync(path.join(root, "src", "data", "projects", `${file}.json`), "utf8"));
  const meta = { title: `${en.title} | Farhan Amjad`, description: en.description };
  const url = `${siteUrl}/projects/${slug}/`;
  const page = withContent(html, slug)
    .replaceAll(homeTitle, escapeHtml(meta.title))
    .replaceAll(homeDescription, escapeHtml(meta.description))
    .replaceAll(`href="${siteUrl}/"`, `href="${url}"`)
    .replaceAll(`property="og:url" content="${siteUrl}/"`, `property="og:url" content="${url}"`);
  fs.mkdirSync(path.join(root, "dist", "projects", slug), { recursive: true });
  fs.writeFileSync(path.join(root, "dist", "projects", slug, "index.html"), page);
}
fs.rmSync(ssrDir, { recursive: true, force: true });

console.log(`prerender: dist/index.html is ${(fs.statSync(indexPath).size / 1024).toFixed(1)} kB`);
