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
- Never introduce a new visual language without updating `DESIGN_SYSTEM.md` in the same task.
- Read all company identity, legal details, editorial author data, and contact links from `src/config/company.ts`. Never hardcode duplicate values in pages or components.
- Reuse the shared editorial components and article shell. Do not create page-local versions of article heroes, content typography, figures, tables, checklists, FAQ, sources, article CTAs, or related-article carousels.
- Every published article must contain a meaningful image rendered through the shared article figure component.
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
