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
- Article mobile category (`ArticleHero .meta`) is centered alongside H1 up to 768px on all current and future articles. Desktop remains left aligned. Article spacing uses the shared tokens: block32px; section40px desktop/32px mobile; shell56px desktop/40px mobile; paragraph16px. Owner rule recorded on14.10.2026.
- Large dark-blue sections with dot patterns use edge-to-edge backgrounds on mobile and desktop, with content kept in a readable container. Keep product/article/case cards in grids separate.
- All light page backgrounds, full-width light sections, and the spaces between them use `var(--bg)` (`#F6F7F9`). White is reserved for cards, tables, forms, controls, and authentic image content. Use the shared tokens from `src/styles/site-surfaces.scss` instead of duplicating page background colors.
- Vertical spacing belonging to a dark dotted section uses the same `var(--surface-dark)` (`#101621`) background. Put that spacing inside the section as padding, including its full-bleed background and dot layer; do not use external margins that expose a light parent. Use the shared full-bleed/product surface spacing mixins. Preserve the content rhythm on desktop and mobile.
- Do not render visible breadcrumb navigation anywhere on the site: articles, catalogs, product pages and all future pages. Use the shared header and contextual links for navigation. Valid BreadcrumbList structured data describing the actual catalog hierarchy may remain. Owner rule recorded on 12.10.2026.
- The business-idea validation product was removed at the owner’s request on 12.10.2026. Do not restore its cards, choice options, copy or links on public pages.
- Never introduce a new visual language without updating `DESIGN_SYSTEM.md` in the same task.
- Read all company identity, legal details, editorial author data, and contact links from `src/config/company.ts`. Never hardcode duplicate values in pages or components.
- On desktop above 768px, both article hero columns start at the same vertical level: category/H1 on the left, introduction on the right, with the quick answer below the introduction. Enforce this through the shared ArticleHero grid for every current and future article; retain the one-column mobile flow and centered H1. Owner rule recorded on 13.10.2026.
- Article hero: every current and future article uses the shared ArticleHero with a solid var(--surface-dark) (#101621) background and the same dot pattern, edge to edge from the top under the header. Minimum height is 100svh (100vh fallback); grow only when content needs more room. No light hero variant, gradients, glows, or page-specific background animation. Preserve the centered mobile H1 and readable uncut text.
- Reuse the shared editorial components and article shell. Do not create page-local versions of article heroes, content typography, figures, tables, checklists, FAQ, sources, article CTAs, or related-article carousels.
- Every published article must contain at least two distinct, meaningful images rendered through the shared article figure component. Place them in different relevant sections of the body; do not repeat one asset or count decorative images toward this requirement.
- Newly drawn or generated illustrations must have a genuinely transparent background. Preserve alpha through optimization; do not bake in surfaces, dot patterns, gradients, or a checkerboard. Authentic screenshots retain their actual interface surfaces and verified content.
- Choose article images by reader intent. Prefer authentic screenshots and useful infographics explaining real controls, data, selection scope, comparisons and verification. The owner asked on12.10.2026 for less obvious AI styling and more infographics/screenshots. Use editorial illustration only when it explains the task better; do not default to generated people or decorative scenes. Match the TrueTell palette; label sources and examples, never invent product UI or results.
- Do not default to narrow labeled box-and-arrow diagrams, large baked-in headings, or decorative icons. Use a diagram only when it explains a relationship better than a real scene or interface. Keep text labels minimal and readable on mobile. Give detailed screenshots a full-size link; constrain tall filter screenshots through the shared figure portrait variant.
- Apply the anti-AI-slop rules to all UI work.
- Always check mobile. Meaningful frontend changes require a production build and visual review.

## Independent editorial review

- The owner requested on 11.10.2026 that a second agent run in parallel to review our articles and factual accuracy. Apply `docs/seo/editorial-review-protocol.md` to new articles, substantive updates and retrospective content checks.
- The primary agent authors and fixes; an independent read-only reviewer checks official sources, reproducibility, actual product capabilities, intent, SEO, images and the final version. Complete review before publication and recheck substantive fixes. Record the evidence and limits; do not confuse documentation review with a live product test or deployment with indexing.
- Before publishing a new or updated article, run the `humanizer` skill on the final prose, FAQ, captions, CTA, headings and SEO metadata. Preserve verified facts and links. Record the outcome in `docs/seo/publications/`, then update `docs/seo/humanizer-reviews.json` with the current fingerprint. `npm run check:article-humanizer`, the build and CI must pass before release; a new hash without an actual review is not approval.

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
- Classify `knowledge` articles in «База знаний» and `blog` articles in «Блог» through the registry and catalogs. No visible breadcrumb navigation is rendered; any BreadcrumbList schema follows the same actual hierarchy.
- Follow `docs/seo/content-publishing.md` when adding articles. Use the registry for titles, descriptions, recorded dates, related articles and products; do not maintain another catalog or sitemap URL list.
- For every newly published blog article, prepare its authorial Dzen version and images in the same editorial cycle. The build and CI must fail when that package is missing or an image is unsuitable. Keep the product CTA aligned with the real site article, and mark a manually published Dzen article so RSS cannot send it again. Follow `docs/seo/dzen/README.md`.
- `astro:build:done` generates the only sitemap and `docs/seo/site-map.md` from built HTML. Drafts, noindex pages, aliases, redirects and 404 are excluded; do not infer search indexing from the generated XML.

## Cleaner marketplace reference

- The official Bitrix24 Market listing for TrueTell «Массовое удаление лидов и сделок» is https://www.bitrix24.ru/apps/app/truetell.massovoe_udalenie_lidov_i_sdelok/. Supplied by the owner and verified as a public HTTP 200 listing on 13.10.2026.
- Read its URL from `cleanerProduct.marketplaceUrl` in `src/config/products.ts` for product links; the site landing remains `/bitrix24-cleaner/`. Keep consultation links for setup questions. A listing URL does not by itself verify installation or app behavior in a customer portal.

## Исключённые задачи бэклога

По поручению владельца от 15.10.2026 задачи SEO-053–SEO-056 (cookie-баннер,
холодный CLS статьи, края/карточки главной на 320 px и контраст) исключены
из текущей SEO-очереди. Сохранять историю находок, не возвращать задачи
в план без нового поручения. Это решение не отменяет обычную проверку
адаптивности и работоспособности новых и изменяемых страниц.

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


## Временные элементы серии AI/MCP

По поручению владельца от25.10.2026 для подготовки статьи об ИИ-анализе
сделок разрешены явно обозначенные заглушки настоящих скриншотов и будущей
продуктовой ссылки MCP TrueTell. Не имитировать интерфейс и не выдумывать
публичный URL; временный CTA ведёт к нашей форме через mcpProduct.
Реестр: `docs/seo/mcp-editorial-placeholders-094.md`, открытая задача SEO-087
в текущем Excel-бэклоге. После завершения всей серии и перед её публикацией
явно напомнить владельцу заменить временные картинки/скриншоты и ссылки;
проверить074/075/086 и все будущие AI/MCPстатьи, обновить подписи, FAQ,
статус готовности, humanizer и фактологическое ревью. Задачу замены
не закрывать по факту создания черновика. Пустая публичная продуктовая
страница или выдуманный endpoint этим поручением не требуются.
