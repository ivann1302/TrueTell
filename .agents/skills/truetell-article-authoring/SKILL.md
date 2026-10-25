---
name: truetell-article-authoring
description: Create, adapt, publish, or substantially edit TrueTell blog articles from pasted text, Markdown, or source documents using the shared Astro article system. Use whenever an article or blog entry is added, rewritten, restyled, or connected to the blog and related-article catalog.
---

# TrueTell article authoring

Before changing an article, read `references/article-model.md` completely and use it as the implementation and editorial checklist.

## Workflow

1. Read the supplied article or source document completely. Preserve its useful meaning and factual qualifications while reshaping it into coherent editorial prose.
2. Inspect an existing article and the shared components before implementation. Build with `article-layout.astro` and the components named in the model; do not duplicate their markup or styles in the page.
3. Follow the spacing contract in the model and `DESIGN_SYSTEM.md`: `--article-space-block: 32px`, section `40px` desktop / `32px` mobile, shell `56px` desktop / `40px` mobile, paragraph spacing `16px`. Apply shared tokens to every current and future article; review actual gaps on desktop and mobile (owner rule, 14.10.2026).
4. Keep the public article URL at the site root as `/slug/` and connect the published article to `src/config/articles.ts`. Do not render visible breadcrumb navigation on any current or future article (owner rule, 12.10.2026). Assign knowledge instructions to «База знаний» and analytical articles to «Блог»; valid BreadcrumbList schema may describe that actual catalog hierarchy.
5. Give every article at least two distinct, meaningful images. Place the first in the early body and the second in another relevant section; do not repeat an asset or count decorative images. Prefer authentic screenshots and useful data/operation infographics according to reader intent (owner12.10.2026: less obvious AI styling). Do not default to generated people or decorative scenes; use editorial illustration only when it explains the task better. Newly generated illustrations need a genuinely transparent background; authentic screenshots retain their actual UI surfaces. Prefer a user-supplied asset when appropriate; otherwise use the `imagegen` skill and store the result in `src/images/articles/`. Render it with `article-figure.astro`, Astro Image, and a useful Russian `alt`.
6. Add complete metadata and structured data. Read the default author and company identity from `src/config/company.ts` unless the user supplies another author. Keep the author in metadata/schema rather than the visible body. Show the publication date only near the article sources; do not show reading-time estimates.
7. Update the article registry and related links. Do not add placeholder article URLs to the sitemap until those pages exist.
8. Before publishing a new or updated article, apply the `humanizer` skill to the final prose, FAQ, captions, CTA, headings and SEO metadata. Preserve verified facts, calculations, caveats and links. Record the result, including a no-change decision, in `docs/seo/publications/`. Add the current fingerprint from `node scripts/check-article-humanizer.mjs --fingerprint slug/` to `docs/seo/humanizer-reviews.json`; rerun the review if the text changes.
9. Apply the project-required design, Astro architecture, technical SEO, and quality-gate skills. Run `npm run check:article-humanizer`, a production build and visual review on desktop and mobile before finishing.

## Editorial guardrails

- Every current and future article uses the same shared full-viewport dark dotted hero: solid `#101621`, minimum `100svh` with `100vh` fallback, no light variant, gradients, glows, or custom background animation. Keep both the category (`ArticleHero .meta`) and H1 centered through the shared mobile rule at widths up to 768px; desktop alignment stays unchanged. Allow content to grow rather than clipping it.

- Images must make the adjacent task concrete or explain a control, report, decision, or limitation. Identify demonstration data and screenshot sources in captions; preserve factual qualifications. Do not default to narrow labeled diagrams. Verify the scene on mobile and let readers open detailed screenshots through `ArticleFigure fullSize`; use `portrait` for tall filters. Preserve generated-art alpha through optimization.
- Prefer connected, readable paragraphs to a sequence of checklists or cards.
- Use a table only for real comparisons or mappings, and a checklist only for a true sequence or verification task.
- Highlight only meaningful fragments in headings with the shared light-blue accent.
- Keep CTAs contextual: one short consultation invitation in the body, then the product CTA, related articles, and the shared consultation section at the end.
- Never publish an article with fewer than two meaningful images. If suitable assets are unavailable and image generation cannot be used, state that blocker instead of silently omitting either image.

## Воронка статей AI/MCP к нашему приложению

Правило владельца от 23.10.2026: статьи о подключении ИИ к Битрикс24 ведут
к разрабатываемому MCP TrueTell. Основной сценарий, изображения и CTA относятся
к нашему продукту; официальная документация остаётся источником фактов в
закрытом ArticleSources. Не подменять путь к TrueTell полной инструкцией чужой
интеграции. До реальной страницы продукта CTA «Обсудить MCP TrueTell» ведёт
к нашей форме через `mcpProduct` в `src/config/products.ts`. Не выдумывать
endpoint, Market URL, установку или поддержку клиента. До его приёмки честно
описывать подготовку, а не обещать рабочую пошаговую установку. Приёмка Codex
не подтверждает ChatGPT/Claude. Подробности: `docs/seo/product-content-funnel.md`.
Для Claude следующая статья требует самостоятельной пользы и проверенной
связки, а не дублирования материала ожидания ChatGPT. Пустую страницу продукта
ради перехода не создавать.
