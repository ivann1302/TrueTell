---
name: truetell-article-authoring
description: Create, adapt, publish, or substantially edit TrueTell blog articles from pasted text, Markdown, or source documents using the shared Astro article system. Use whenever an article or blog entry is added, rewritten, restyled, or connected to the blog and related-article catalog.
---

# TrueTell article authoring

Before changing an article, read `references/article-model.md` completely and use it as the implementation and editorial checklist.

## Workflow

1. Read the supplied article or source document completely. Preserve its useful meaning and factual qualifications while reshaping it into coherent editorial prose.
2. Inspect an existing article and the shared components before implementation. Build with `article-layout.astro` and the components named in the model; do not duplicate their markup or styles in the page.
3. Keep the public article URL at the site root as `/slug/`. Keep «Блог» in breadcrumbs and connect the published article to `src/config/articles.ts`.
4. Give every article one meaningful, unique image. Prefer a user-supplied asset when appropriate; otherwise use the `imagegen` skill and store the result in `src/images/articles/`. Render it with `article-figure.astro`, Astro Image, and a useful Russian `alt`.
5. Add complete metadata and structured data. Read the default author and company identity from `src/config/company.ts` unless the user supplies another author. Keep the author in metadata/schema rather than the visible body. Show the publication date only near the article sources; do not show reading-time estimates.
6. Update the article registry and related links. Do not add placeholder article URLs to the sitemap until those pages exist.
7. Apply the project-required design, Astro architecture, technical SEO, and quality-gate skills. Run a production build and visually review desktop and mobile before finishing.

## Editorial guardrails

- Prefer connected, readable paragraphs to a sequence of checklists or cards.
- Use a table only for real comparisons or mappings, and a checklist only for a true sequence or verification task.
- Highlight only meaningful fragments in headings with the shared light-blue accent.
- Keep CTAs contextual: one short consultation invitation in the body, then the product CTA, related articles, and the shared consultation section at the end.
- Never publish an article without its image. If no suitable image is available and image generation cannot be used, state that blocker instead of silently omitting the image.
