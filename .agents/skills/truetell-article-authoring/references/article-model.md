# TrueTell article model

Use this document whenever a new article is created from text, Markdown, or another source document. It records the reusable page structure established by `/kak-snyat-rezervy-moysklad/`.

## Route and data

- Publish articles at the second URL level: `/article-slug/`, not `/blog/article-slug/`.
- Keep the breadcrumb chain `Главная → Блог → Статья`.
- Add the published article to `src/config/articles.ts`; use the same registry for the homepage/blog cards and related-article data where possible.
- Give every related card a stable root-level URL so the carousel remains fully linked. Only existing public pages belong in the sitemap; planned destinations are added there when their articles are published.

## Required page composition

Build the page with `src/components/editorial/article-layout.astro`. Keep this order unless the content gives a concrete reason to change it:

1. Breadcrumbs, category, one H1 with a restrained light-blue accent, and a concise introduction through `article-hero.astro`.
2. A dark-blue dotted «Быстрый ответ» containing two or three short paragraphs.
3. An opening lead that explains the problem in plain language.
4. Optional contextual note for one important distinction; do not stack multiple notice cards.
5. Main sections written primarily as connected prose. Use one H2 per search-intent subtopic and H3 only for genuine subsections.
6. One mandatory, relevant image through `article-figure.astro`, normally in the first third or middle of the article where it advances the explanation.
7. Optional `data-table.astro` for comparisons/mappings and `checklist.astro` only for a true process or verification sequence.
8. One `inline-consultation.astro` at a natural point where the reader may need help.
9. FAQ through `src/sections/faq-section/faq-section.astro` with `variant="article"`. Pass the same FAQ data into `FAQPage` structured data.
10. Publication date and authoritative sources through `article-sources.astro`.
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

Use the “Компактный ритм статьи” contract in `DESIGN_SYSTEM.md`. Its implementation lives in `article-layout.module.scss` (`--article-space-*`) and the shared component styles, so new articles inherit the same spacing automatically.

- Compose the lead, optional note, and main `section[aria-labelledby]` elements as direct children of `ArticleLayout`'s default slot. Each main section starts with its H2; put subsections and shared components inside it.
- Keep chapter spacing on top-level sections only. Nested checklists and FAQ internals retain their own component spacing.
- Use normal paragraphs, headings and shared figures/tables directly in the section flow. Avoid spacer elements, extra margin-bearing wrappers, inline styles and per-page spacing exceptions.
- A section's last child has no bottom margin; the next section supplies the separation. Check the rendered distance rather than adding margin and padding independently.
- Before publication, inspect at 390, 768 and 1440 px: lead → first H2 with and without a note; paragraph → H3 → paragraph; table/figure → next paragraph or heading; checklist title → description; inline consultation → next heading; last section → FAQ → sources → CTA → related articles. Confirm readable compact gaps, no touching text, no doubled section gaps and no horizontal overflow.

## Image requirement

Every published article requires at least one meaningful raster image.

- Prefer a diagram, process illustration, or editorial visual that explains the subject rather than a generic stock-like banner.
- When generating an image, use the `imagegen` skill and base the prompt on the TrueTell visual system: dark navy field, restrained light-blue illumination, fine dot/grid texture, clean technical composition, no decorative dashboard clichés, and no embedded text unless essential.
- Store article images in `src/images/articles/` with a stable descriptive filename.
- Render the image with `article-figure.astro`; provide a specific Russian `alt` and an optional caption that adds context rather than repeating the alt.
- Check crop and legibility at desktop and mobile widths. Keep the source large enough for responsive output while relying on Astro for optimized formats.

## Metadata and structured data

Each article provides:

- unique title and description;
- canonical root-level path;
- article Open Graph title and description;
- the mandatory article image as an absolute Open Graph and Twitter image with matching descriptive alt text;
- `BlogPosting` with headline, description, URL, dates, language, author, and publisher;
- `BreadcrumbList` matching the visible breadcrumbs;
- `FAQPage` only when the visible FAQ exists and using the same question/answer strings.

Create these schemas with `createArticleStructuredData.ts` rather than duplicating the JSON-LD graph in each article page.

Use authoritative source links where the topic depends on external product behavior. Verify unstable or current facts before publication.

## Publication checklist

- Article uses `ArticleLayout` and shared editorial components.
- Root-level URL and canonical agree; «Блог» remains in breadcrumbs.
- H1 and metadata match the article intent without stuffing keywords.
- Prose has clear transitions and does not overuse lists, cards, or checklists.
- Mandatory image exists, is relevant, has alt text, and is responsive.
- FAQ content and structured data match exactly.
- Product and consultation CTAs are contextual and working.
- Published card appears in the blog registry; related cards have stable root-level links.
- Sitemap includes only real public pages.
- Spacing follows the shared compact rhythm; adjacent-element checks from the spacing section pass at mobile, tablet and desktop widths.
- Production build succeeds.
- Desktop and mobile visual review covers the hero, image, table, FAQ, CTAs, related carousel, and overflow/focus behavior.
