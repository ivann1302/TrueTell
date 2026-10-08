---
name: truetell-article-authoring
description: Create, adapt, publish, or substantially edit TrueTell blog articles from pasted text, Markdown, or source documents using the shared Astro article system. Use whenever an article or blog entry is added, rewritten, restyled, or connected to the blog and related-article catalog.
---

# TrueTell article authoring

Before changing an article, read `references/article-model.md` completely and use it as the implementation and editorial checklist.

## Workflow

1. Read the supplied article or source document completely. Preserve its useful meaning and factual qualifications while reshaping it into coherent editorial prose.
2. Inspect an existing article and the shared components before implementation. Build with `article-layout.astro` and the components named in the model; do not duplicate their markup or styles in the page.
3. Follow the compact spacing contract in the model and `DESIGN_SYSTEM.md`. Reuse shared spacing tokens; review actual gaps between adjacent elements on desktop and mobile.
4. Keep the public article URL at the site root as `/slug/`. Keep «Блог» in breadcrumbs and connect the published article to `src/config/articles.ts`.
5. Give every article at least two distinct, meaningful images. Place the first in the early body and the second in another relevant section; do not repeat an asset or count decorative images. For images we create, prioritize useful reader-facing infographics with accurate labels and a genuinely transparent background. Prefer a user-supplied asset when appropriate; otherwise use the `imagegen` skill and store the result in `src/images/articles/`. Render it with `article-figure.astro`, Astro Image, and a useful Russian `alt`.
6. Add complete metadata and structured data. Read the default author and company identity from `src/config/company.ts` unless the user supplies another author. Keep the author in metadata/schema rather than the visible body. Show the publication date only near the article sources; do not show reading-time estimates.
7. Update the article registry and related links. Do not add placeholder article URLs to the sitemap until those pages exist.
8. Apply the project-required design, Astro architecture, technical SEO, and quality-gate skills. Run a production build and visually review desktop and mobile before finishing.

## Editorial guardrails

- Images must explain a process, decision, comparison, or relationship from the adjacent text. Check infographic labels at mobile body width; decorative images do not satisfy the image requirement. Preserve alpha through optimization.
- Prefer connected, readable paragraphs to a sequence of checklists or cards.
- Use a table only for real comparisons or mappings, and a checklist only for a true sequence or verification task.
- Highlight only meaningful fragments in headings with the shared light-blue accent.
- Keep CTAs contextual: one short consultation invitation in the body, then the product CTA, related articles, and the shared consultation section at the end.
- Never publish an article with fewer than two meaningful images. If suitable assets are unavailable and image generation cannot be used, state that blocker instead of silently omitting either image.
