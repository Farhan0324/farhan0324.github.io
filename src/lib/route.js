// Project detail pages are real URLs. scripts/build.mjs pre-renders one HTML file for each.
export const PROJECT_SLUGS = ["nist-csf-microsoft", "nis2-incident-response"];

export const getProjectSlug = (pathname) => {
  const match = /^\/projects\/([\w-]+)\/?$/.exec(pathname);
  return match && PROJECT_SLUGS.includes(match[1]) ? match[1] : null;
};
