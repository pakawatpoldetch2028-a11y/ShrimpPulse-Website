# ShrimpPulse website

Bilingual (Thai / English) informational website for **ShrimpPulse**, an AI assistant for shrimp aquaculture on LINE.
It is a lightweight static site: no framework, no npm dependencies, built with a single Node script and deployed to GitHub Pages.

- ShrimpPulse **2.0** is the current public release. ShrimpPulse **4.0** is in development. The site labels every capability with one of four text statuses and never implies that 4.0 is available.
- Thai is the default language on first visit; the chosen language is remembered in the browser.

## Quick start

```bash
npm run build     # renders dist/ (12 pages + redirect + 404)
npm run dev       # builds, then serves dist/ at http://localhost:8080/ShrimpPulse-Website/
npm run check     # builds, then verifies every internal link, asset path, alt text, title and lang attribute
```

Requires Node 18 or newer. There is nothing to install.

## Project layout

| Path | Purpose |
| --- | --- |
| `site.config.json` | **Central configuration and asset manifest**: links (LINE, QR, feedback form), contact details, image paths, people/organisation names, quotations, latest update, feedback figures, release versions, Thai calendar setting. |
| `content/en/*.json`, `content/th/*.json` | **All page text**, one file per page per language (`common.json` holds navigation, status labels, buttons, footer, date formats). |
| `assets/images/brand/` | Mascot (original, trimmed, resized) and favicons generated from it. Put photographs in `assets/images/photos/` (create it). |
| `src/templates/` | Page templates (`pages/*.js`), document shell (`layout.js`), redirect and 404 pages (`special.js`). |
| `src/components.js` | Reusable pieces: status badges, placeholders, buttons, process diagrams, quotes. |
| `src/styles/main.css` | The stylesheet (palette tokens at the top). |
| `src/scripts/main.js` | Mobile menu and language memory. The site works without JavaScript. |
| `build.js`, `scripts/` | Build, dev server, link checker. |
| `.github/workflows/deploy.yml` | GitHub Pages deployment. |

Generated output goes to `dist/` (ignored by git).

## Replacing placeholders

Every reserved area shows a dashed box with a label such as “[Add farm visit photograph]”. To fill one:

1. Copy the file into `assets/` (for example `assets/images/photos/farm-visit.jpg`). Keep photos under ~300 KB where possible; the build does not resize them.
2. Set the matching key in `site.config.json` → `images` to that path.
3. If needed, edit the alt text and caption next to the placeholder label in `content/en/<page>.json` and `content/th/<page>.json`.
4. Run `npm run check`. The build fails if a configured path does not exist.

| Config key | Where it appears |
| --- | --- |
| `images.lineScreenshotHome` | Home hero phone frame |
| `images.lineScreenshotCapabilities` | Capabilities page phone frame |
| `images.founderPortrait` | Why ShrimpPulse hero |
| `images.researchPhoto` | Why ShrimpPulse, research section |
| `images.farmVisitPhoto` | Why ShrimpPulse photo band and Acknowledgements |
| `images.communityPhoto` | Acknowledgements |
| `images.architectureIllustration` | How It Works |
| `images.feedbackChart` | Progress & Participation |
| `links.lineQrImage` | Home access section (only together with `links.lineUrl`) |

Other reserved items:

- **LINE link**: set `links.lineUrl`. Until it is set, the primary button reads “ShrimpPulse 2.0 on LINE: access details” and points to the access section, which explains that the link is pending. Generate the QR code from the real link yourself and reference it with `links.lineQrImage`; the build refuses a QR image without a link.
- **Feedback form**: set `links.feedbackFormUrl`.
- **Contact details**: set `contact.email` and optionally `contact.organisation`.
- **Founder quotation**: set `quotes.founder.en` and `quotes.founder.th` (shown on Home and Why ShrimpPulse).
- **Project update**: set `updates.latest.date` (`YYYY-MM-DD`), `.en` and `.th`.
- **Names**: `people.*` holds every person and organisation name used across the site (`{{people.key}}` tokens in the content files). Thai personal names are currently kept in Latin script so that no real name is misspelled; replace the `th` values with the confirmed Thai spellings.

## Updating release statuses and dates

- The four status labels are defined once per language in `content/<lang>/common.json` → `status` (`available`, `developing`, `planned`, `considering`). Change wording there and it updates everywhere.
- Per-capability statuses live in `content/<lang>/capabilities.json` (`comparison.rows` and `modules.items`, field `status`; `alsoDeveloping: true` adds the 4.0 badge to a 2.0 module). Keep both languages in step.
- The home status strip is `content/<lang>/home.json` → `statusStrip.items`.
- The roadmap is `content/<lang>/progress.json` → `timeline.completed` and `timeline.planned`. To mark a milestone complete, **move it** from `planned` to `completed` in both languages; nothing is marked complete automatically when a date passes. Dates are written as `YYYY-MM`, `YYYY-MM-DD` or `YYYY-Qn` and are rendered per language (Thai uses the Buddhist year by default; set `site.thaiCalendar` to `"gregorian"` to keep ค.ศ.). The underlying dates are never changed by localisation.
- Feedback figures and the “as of” date are in `site.config.json` → `feedback`; the surrounding sentence in `progress.json` → `feedback.text` repeats them, so update both.
- When 4.0 is actually released, update `release` in `site.config.json`, the status fields above, the home hero and strip copy, and the How It Works status badges (`rag.status`, `loop.status`).

## Editing translations

English and Thai files have identical keys. Edit the text values only; keep the keys and array lengths matching. Strings may contain `{{people.key}}` tokens. Run `npm run check` afterwards; a missing key in one language fails the build with the file name.

Adding a page: create `content/en/<slug>.json` and `content/th/<slug>.json`, a template in `src/templates/pages/<slug>.js`, register it in `PAGES` (`src/templates/layout.js`) and `RENDERERS` (`build.js`), and add its label to `nav` in both `common.json` files.

## Deployment (GitHub Pages)

The workflow in `.github/workflows/deploy.yml` builds and publishes on every push to `main`.

1. In the repository settings open **Pages** and set **Build and deployment → Source** to **GitHub Actions**.
2. Merge to `main`. The site appears at `https://<owner>.github.io/ShrimpPulse-Website/`.

The base path is taken from the repository name in CI (`BASE_PATH=/<repo>/`) and from `site.siteUrl` locally. All in-page links are relative, so the built site also works when served from any other folder; only canonical/hreflang metadata, the root redirect and the 404 page use the base path. If you rename the repository or move to a custom domain, update `site.siteUrl` in `site.config.json`.

URL structure: `/th/`, `/th/why/`, `/th/capabilities/`, `/th/how-it-works/`, `/th/progress/`, `/th/acknowledgements/` and the same under `/en/`. The root `/` redirects to the remembered language (Thai on first visit). A language-less path such as `/why/` is redirected by the 404 page.

## Accessibility and performance notes

- Skip link, landmark regions, keyboard-operable mobile menu (Escape closes), visible focus rings, `aria-current` on navigation, `prefers-reduced-motion` support.
- Status is always conveyed by icon and words, not colour alone. The comparison table has a stacked card equivalent on narrow screens.
- Fonts: IBM Plex Sans and IBM Plex Sans Thai Looped from Google Fonts with system fallbacks; Thai text uses a taller line height.
- Images are lazy-loaded except the hero mascot; the mascot ships in three sizes.
