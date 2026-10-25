# TrueTell article model

Use this document whenever a new article is created from text, Markdown, or another source document. It records the reusable page structure established by `/kak-snyat-rezervy-moysklad/`.

## Route and data

- Publish articles at the second URL level: `/article-slug/`, not `/blog/article-slug/`.
- Do not render visible breadcrumb navigation on current or future articles (owner rule, 12.10.2026). Use the shared header and contextual links. Valid BreadcrumbList schema may follow the actual catalog: `Главная → База знаний → Статья` for knowledge instructions or `Главная → Блог → Статья` for analytical articles.
- Add the published article to `src/config/articles.ts`; use the same registry for the homepage/blog cards and related-article data where possible.
- Give every related card a stable root-level URL so the carousel remains fully linked. Only existing public pages belong in the sitemap; planned destinations are added there when their articles are published.

## Required page composition

Build the page with `src/components/editorial/article-layout.astro`. Keep this order unless the content gives a concrete reason to change it:

1. Category, one H1 with a restrained light-blue accent, and a concise introduction through `article-hero.astro`. Every article uses the same solid `#101621` full-width dotted hero from the top under the header, minimum `100svh` (`100vh` fallback). No light variant, gradients, glows or custom background animation; center both the category (`ArticleHero .meta`) and H1 at widths up to 768px and grow the block if content needs more room. Desktop category and body text remain left aligned.
2. «Быстрый ответ» containing two or three short paragraphs on the same shared hero surface. On desktop above 768px, start the category/H1 column and introduction column at the same top level; place the quick answer below the introduction in the right column. Use the shared grid for all existing and future articles, with no page-local offsets. Mobile remains category/H1 → introduction → quick answer in one column (owner rule, 13.10.2026); the category and H1 are centered (owner rule, 14.10.2026).
3. An opening lead that explains the problem in plain language.
4. Optional contextual note for one important distinction; do not stack multiple notice cards.
5. Main sections written primarily as connected prose. Use one H2 per search-intent subtopic and H3 only for genuine subsections.
6. At least two distinct, relevant images through `article-figure.astro`: the first in the early body, the second in a different relevant section. Place each where it advances the explanation; do not stack both together just to meet the count.
7. Optional `data-table.astro` for comparisons/mappings and `checklist.astro` only for a true process or verification sequence.
8. One `inline-consultation.astro` at a natural point where the reader may need help.
9. FAQ through `src/sections/faq-section/faq-section.astro` with `variant="article"`. Pass the same FAQ data into `FAQPage` structured data.
10. Publication date and authoritative sources through `article-sources.astro`. Keep dates visible; «Официальные материалы» uses native `details/summary`, closed by default, with a full-row keyboard-accessible toggle and chevron. Source links remain in server-rendered HTML and work without client JavaScript.
11. A contained dark-blue dotted product CTA through `article-product-cta.astro`.
12. Related materials through `related-articles.astro`: three visible cards on desktop, two on tablet, one on mobile.
13. The site-wide consultation CTA through `consultation-cta-section.astro` after the article.

## Shared implementation surface

Use these components rather than recreating them locally:

```text
src/components/editorial/article-layout.astro
src/components/editorial/article-hero.astro
src/components/editorial/article-content.astro
src/components/editorial/article-figure.astro
src/components/editorial/data-table.astro
src/components/editorial/checklist.astro
src/components/editorial/inline-consultation.astro
src/components/editorial/article-sources.astro
src/components/editorial/article-product-cta.astro
src/components/editorial/related-articles.astro
src/sections/faq-section/faq-section.astro
src/sections/consultation-cta-section/consultation-cta-section.astro
src/config/company.ts
src/utils/functions/createArticleStructuredData.ts
```

The article page should contain its content and data, not a private copy of the layout system. Add a shared component only when a genuinely recurring pattern is missing.

## Text model

- Turn fragmented source material into flowing editorial prose with clear transitions between paragraphs and sections.
- On desktop, body copy should remain comfortably wide and readable, using the shared article typography rather than page-local font rules.
- Avoid a card or checklist for every idea. A normal paragraph is the default format.
- Keep paragraphs substantial but scannable. Split only when the argument changes, not after every sentence.
- Use the light-blue heading accent once per important heading at most. Do not color whole headings.
- Use one H1. Maintain a logical H2/H3 hierarchy and stable heading IDs.
- Do not display reading time. Display the date only in the sources/footer area.
- Keep the author out of the visible article body. Read the default metadata/schema author from `companyInfo.editorial.defaultAuthor` in `src/config/company.ts`.

## Compact article spacing

Use the “Компактный ритм статьи” contract in `DESIGN_SYSTEM.md`. Its implementation lives in `article-layout.module.scss` (`--article-space-*`) and the shared component styles, so current and new articles inherit the same spacing automatically. The owner increased block/section/shell spacing on 14.10.2026: block `32px`, section `40px` desktop / `32px` mobile, shell `56px` desktop / `40px` mobile. Paragraph spacing stays `16px`.

- Compose the lead, optional note, and main `section[aria-labelledby]` elements as direct children of `ArticleLayout`'s default slot. Each main section starts with its H2; put subsections and shared components inside it.
- Keep chapter spacing on top-level sections only. Nested checklists and FAQ internals retain their own component spacing.
- Use normal paragraphs, headings and shared figures/tables directly in the section flow. Avoid spacer elements, extra margin-bearing wrappers, inline styles and per-page spacing exceptions.
- A section's last child has no bottom margin; the next section supplies the separation. Check the rendered distance rather than adding margin and padding independently.
- Before publication, inspect at 390, 768 and 1440 px: lead → first H2 with and without a note; paragraph → H3 → paragraph; table/figure → next paragraph or heading; checklist title → description; inline consultation → next heading; last section → FAQ → sources → CTA → related articles. Confirm readable compact gaps, no touching text, no doubled section gaps and no horizontal overflow.

## Image requirement

Every published article requires at least two distinct, meaningful raster images in its body. A repeated asset, logo, or decorative background does not count. Do not generate fictitious product screenshots.

- Prefer authentic screenshots and useful infographics for controls, data, selection scope, comparisons and verification (owner12.10.2026: less obvious AI styling, more infographics/screenshots). Do not default to generated people or decorative scenes. Use editorial illustrations only when they explain the task better. Match the TrueTell charcoal, gray, and blue palette. Do not default to narrow labeled box-and-arrow diagrams or large typography inside images; use a diagram only when the relationship genuinely needs it.
- Generated illustrations need a genuinely transparent background through optimization. Use `imagegen` with `transparent_background: true`; no baked-in backdrop, glow, decorative cards, or fictitious product UI. Authentic screenshots preserve the actual UI surface and values. Captions identify sources, demo data, and the limits of what the screen proves.
- Store article images in `src/images/articles/` with a stable descriptive filename.
- Render the image with `article-figure.astro`; provide a specific Russian `alt` and an optional caption that adds context rather than repeating the alt.
- Verify actual alpha in the saved source and optimized output. Check scene readability at about 358 px body width. Render detailed screenshots with `fullSize` and verify the visible full-size link; use the shared `portrait` variant for tall filters. Check crop and legibility at desktop and mobile widths. Keep the source large enough for responsive output while relying on Astro for optimized formats.

## Metadata and structured data

Each article provides:

- unique title and description;
- canonical root-level path;
- article Open Graph title and description;
- the primary article image as an absolute Open Graph and Twitter image with matching descriptive alt text;
- `BlogPosting` with headline, description, URL, dates, language, author, and publisher;
- valid `BreadcrumbList` describing the actual catalog hierarchy without a visible navigation block;
- `FAQPage` only when the visible FAQ exists and using the same question/answer strings.

Create these schemas with `createArticleStructuredData.ts` rather than duplicating the JSON-LD graph in each article page.

Use authoritative source links where the topic depends on external product behavior. Verify unstable or current facts before publication.

## Publication checklist

- Article uses `ArticleLayout` and shared editorial components.
- Root-level URL and canonical agree; the article is in its correct catalog and has no visible breadcrumb navigation.
- H1 and metadata match the article intent without stuffing keywords.
- Prose has clear transitions and does not overuse lists, cards, or checklists.
- At least two distinct images exist in different relevant body sections, explain their adjacent text, have useful alt text, and are responsive. Newly created illustrations have real alpha transparency and a concrete task; screenshots retain authentic UI and can be enlarged; optimization preserves alpha.
- FAQ content and structured data match exactly.
- Product and consultation CTAs are contextual and working.
- Published card appears in the blog registry; related cards have stable root-level links.
- Sitemap includes only real public pages.
- The category and H1 are centered at widths up to 768px; above 768px the category stays left aligned and both hero columns start on the same top line. Test the semantic `.meta` element, not a generated CSS Modules hash.
- Spacing follows the updated shared rhythm; adjacent-element checks from the spacing section pass at mobile, tablet and desktop widths.
- Production build succeeds.
- Desktop and mobile visual review covers the hero, both images, table, FAQ, CTAs, related carousel, and overflow/focus behavior.

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
