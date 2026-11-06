# Farhan Amjad — Portfolio

My personal portfolio, built with React, Vite and Tailwind CSS and pre-rendered to static HTML for GitHub Pages.

## Run it

```bash
npm install
npm run dev            # local dev server
npm run build          # production build in dist/
npm run check:content  # checks content and lists placeholders still to fill in
npm run test:smoke     # browser checks (run the build first)
```

## Where to edit

| What | File |
| --- | --- |
| Name, email, location, links, skills, stats, resume | `src/data/profile.json` |
| Bio, job history text, project text (English / German) | `src/languages/en.json`, `src/languages/de.json` |
| Dates, company names, project images and links | `src/data/facts.json` |
| Privacy details | `public/privacy/index.html` |
| Emails sent by the contact form (pasted into EmailJS) | `src/AutoReply.tmpl`, `src/ContactNotification.tmpl` |

A resume goes in `public/assets/`, with its path set in `profile.json` (for example `"en": "/assets/Resume.pdf"`). The resume buttons stay hidden until then.

## Optional services

Copy `.env.example` to `.env` and add the same values as GitHub Actions secrets for the live site.

- **Contact form:** needs the EmailJS and reCAPTCHA values. Without them the form tells visitors to use the email link.
- **Analytics:** set `VITE_GA_ID` to turn on Google Analytics and the consent banner, and update the privacy page to match.
