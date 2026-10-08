# TrueTell project rules

## Platform

- Stack: Astro, React, and TypeScript.
- Build static-first. Do not add a backend, SSR, or server functionality unless explicitly requested.
- Use Astro by default. Use React only for an interactive island with a real client-side need.
- Do not add unnecessary production dependencies or client JavaScript.
- Use SCSS (preferably CSS Modules for components) for all project styling. Do not introduce Tailwind CSS.

## Product quality

- Treat SEO, performance, and accessibility as first-class requirements.
- Follow `DESIGN_SYSTEM.md` as the visual source of truth.
- Center hero H1 headings on mobile screens (up to 768px) across all current and future pages. Preserve body-text and desktop alignment.
- Large dark-blue sections with dot patterns use edge-to-edge backgrounds on mobile and desktop, with content kept in a readable container. Keep product/article/case cards in grids separate.
- Do not render visible breadcrumbs on product pages, including products in development. Apply this to future product pages too; articles keep their editorial breadcrumbs. Valid breadcrumb structured data may remain.
- Never introduce a new visual language without updating `DESIGN_SYSTEM.md` in the same task.
- Read all company identity, legal details, editorial author data, and contact links from `src/config/company.ts`. Never hardcode duplicate values in pages or components.
- Reuse the shared editorial components and article shell. Do not create page-local versions of article heroes, content typography, figures, tables, checklists, FAQ, sources, article CTAs, or related-article carousels.
- Every published article must contain at least two distinct, meaningful images rendered through the shared article figure component. Place them in different relevant sections of the body; do not repeat one asset or count decorative images toward this requirement.
- All image assets created or generated for this project must have a genuinely transparent background. Preserve alpha through optimization; do not bake in white or dark surfaces, dot patterns, gradients, or a checkerboard.
- Prioritize useful reader-facing infographics for article images: explain a sequence, decision, comparison, or relationship with accurate labels that remain readable on mobile. Do not add an image merely for decoration.
- Keep infographics simple and compact; prefer vertical compositions where suitable and retain only essential labels.
- Apply the anti-AI-slop rules to all UI work.
- Always check mobile. Meaningful frontend changes require a production build and visual review.

## Verification after work

- After completing every task, run the available automated tests before reporting completion. Currently use `node --test scripts/*.test.mjs`; the placeholder `npm test` does not count as a test run.
- For changes to site code, configuration, or deployment, also run `npm run lint`, `npm run build`, and `node scripts/indexnow.mjs --check` after the build.
- Fix failures caused by the changes and rerun the affected checks. Report which checks passed and any unresolved failures or checks that could not run; never claim an unexecuted check passed.
- These checks supplement the required mobile and visual review for frontend changes.

## Required skill combinations

- UI work: `truetell-design-system` + `anti-ai-slop-design`.
- New public page: `astro-seo-architecture` + `technical-seo`; add the UI pair when it includes interface work.
- New React island, routing, or hydration: `astro-seo-architecture`.
- Article or blog-entry work: `truetell-article-authoring`; read its article model before creating, adapting, or substantially editing an article.
- Final UI review: `frontend-quality-gate` + `anti-ai-slop-design` + `truetell-design-system`.

- Product-page footers, including products in development, use `SiteFooter hideDivider`: no horizontal divider above privacy and cookie settings. Preserve both links and spacing; do not show email in the shared footer.

- Product hero: the first 100svh contains only a centered H1 with description and one CTA near the bottom edge (40px desktop / 32px mobile). No benefit lists, kickers, status labels or secondary links in the first screen; move supporting content below it. Applies to all product pages including development placeholders.

- Product-page formula: hero -> shared ProductSummary -> real screenshot scenario -> capabilities/results -> FAQ -> connection. Immediately after hero, explain the purpose and workflow in plain language: a benefit heading and two short sentences, with no kicker or extra CTA. Use two columns on desktop, one on mobile. For unreleased products, describe planned behavior without implying availability.

## Content architecture

- Article metadata lives in `src/config/articles.ts`: `knowledge` instructions belong only to the knowledge base; `blog` analytical articles belong only to the blog. Keep existing root-level URLs.
- Editorial breadcrumbs use «База знаний» for `knowledge` and «Блог» for `blog`; this classification supersedes older article-model wording that always required «Блог».
- Follow `docs/seo/content-publishing.md` when adding articles. Use the registry for titles, descriptions, recorded dates, related articles and products; do not maintain another catalog or sitemap URL list.
- `astro:build:done` generates the only sitemap and `docs/seo/site-map.md` from built HTML. Drafts, noindex pages, aliases, redirects and 404 are excluded; do not infer search indexing from the generated XML.
