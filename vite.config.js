import fs from "node:fs";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// The dev server sends /privacy/ to the app; serve the static page as production does.
const privacyPageInDev = {
  name: "privacy-page-in-dev",
  configureServer(server) {
    server.middlewares.use((req, _res, next) => {
      if (/^\/privacy\/?(\?|$)/.test(req.url)) req.url = "/privacy/index.html";
      next();
    });
  },
};

const readJson = (file) => JSON.parse(fs.readFileSync(new URL(file, import.meta.url), "utf8"));
const escapeHtml = (text) => text.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;");

// Fills the {{tokens}} in index.html from src/data/profile.json and the English copy.
const profileInHtml = {
  name: "profile-in-html",
  transformIndexHtml(html) {
    const profile = readJson("./src/data/profile.json");
    const en = readJson("./src/languages/en.json");
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Person",
      name: profile.name,
      jobTitle: en.hero.role,
      description: en.ui.meta.description,
      url: `${profile.siteUrl}/`,
      image: `${profile.siteUrl}/images/og-image.jpg`,
      email: `mailto:${profile.email}`,
      sameAs: profile.socials.filter((s) => s.url).map((s) => s.url),
      knowsAbout: profile.stack,
    };
    const tokens = {
      name: escapeHtml(profile.name),
      email: escapeHtml(profile.email),
      siteUrl: profile.siteUrl,
      title: escapeHtml(en.ui.meta.title),
      description: escapeHtml(en.ui.meta.description),
      jsonLd: JSON.stringify(jsonLd).replaceAll("<", "\\u003c"),
    };
    return html.replace(/\{\{(\w+)\}\}/g, (_, key) => tokens[key]);
  },
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), privacyPageInDev, profileInHtml],
  base: "/",
  define: {
    // react-google-recaptcha still references `global`
    global: "globalThis",
    // Shared by the client and pre-render builds so date-based text hydrates identically
    "import.meta.env.VITE_BUILD_TIME": JSON.stringify(process.env.VITE_BUILD_TIME || new Date().toISOString()),
  },
  build: {
    target: "es2022",
  },
});
