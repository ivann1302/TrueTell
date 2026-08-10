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
- Apply the anti-AI-slop rules to all UI work.
- Always check mobile. Meaningful frontend changes require a production build and visual review.

## Required skill combinations

- UI work: `truetell-design-system` + `anti-ai-slop-design`.
- New public page: `astro-seo-architecture` + `technical-seo`; add the UI pair when it includes interface work.
- New React island, routing, or hydration: `astro-seo-architecture`.
- Final UI review: `frontend-quality-gate` + `anti-ai-slop-design` + `truetell-design-system`.
