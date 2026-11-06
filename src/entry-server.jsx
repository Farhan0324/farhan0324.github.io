import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import App from "./App.jsx";
import ProjectPage from "./pages/ProjectPage.jsx";
import { TranslationProvider } from "./lib/i18n";

/** Renders an English page to static HTML at build time (see scripts/build.mjs). */
export const render = (slug) =>
  renderToString(
    <StrictMode>
      <TranslationProvider initialLang="en">{slug ? <ProjectPage slug={slug} /> : <App />}</TranslationProvider>
    </StrictMode>,
  );
