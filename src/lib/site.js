// Facts shared across sections. Edit them in src/data/profile.json; translatable copy lives in src/languages/*.json.
import profile from "../data/profile.json";

export const EMAIL = profile.email;
export const NAME = profile.name;
export const TIMEZONE = profile.location.timezone;
export const SOCIALS = profile.socials.filter((s) => s.url);
export const STACK = profile.stack;

export const SECTIONS = [
  { id: "about", key: "ui.nav.about" },
  { id: "experience", key: "ui.nav.experience" },
  { id: "expertise", key: "ui.nav.expertise" },
  { id: "projects", key: "ui.nav.projects" },
  { id: "contact", key: "ui.nav.contact" },
];

/** Returns null until a resume is added to profile.json, which hides the resume buttons. */
export const getResume = (lang) => {
  const href = profile.resume[lang] || profile.resume.en;
  return href ? { href, fileName: `${profile.name.replaceAll(" ", "_")}_Resume.pdf` } : null;
};

const GITHUB_PROFILE = profile.socials.find((s) => s.id === "github")?.url;

/** A project repo is private when it has no public GitHub link. */
export const isPrivateRepo = (url) => !url || url === "#" || url === GITHUB_PROFILE;
