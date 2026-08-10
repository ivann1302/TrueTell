---
name: astro-seo-architecture
description: Keep TrueTell Astro-first, static-first, semantic, and lean. Use when creating pages or components, adding React or client JavaScript, changing architecture, routing, hydration, or rendering strategy.
---

# Astro SEO Architecture

Follow the principle: **Astro by default. React only when client-side interaction is actually required.**

## Architecture rules

- Implement static content in `.astro`; keep headers, footers, navigation, text, and non-interactive cards out of React.
- Before adding React, ask: “Why can this not be an Astro component?” Use Astro unless there is a concrete client-side interaction requirement.
- Hydrate only interactive islands. Avoid `client:load` without a first-screen interaction need; for below-the-fold islands prefer lazy or visible hydration when React is necessary.
- Minimize client JavaScript, avoid unnecessary production dependencies, and use CSS or browser APIs when they reasonably solve the task.
- Keep content available and meaningful without JavaScript. Use semantic HTML and crawlable links.
- Preserve static generation. Do not add a backend, SSR, server endpoints, or other dynamic infrastructure unless the task explicitly requests it.

## Before completion

Verify that the routing/rendering choice keeps the page indexable and that no static UI has gained needless hydration. For a new or materially changed public page, use `technical-seo` as well.
