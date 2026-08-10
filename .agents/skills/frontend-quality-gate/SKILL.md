---
name: frontend-quality-gate
description: Run final UI, performance, responsive, and accessibility validation for significant TrueTell frontend changes. Use after materially changing a page or component and before completing a substantial frontend task.
---

# Frontend Quality Gate

Use this as a completion gate, not merely a report. Apply `truetell-design-system` and `anti-ai-slop-design` during the review; fix issues found and validate again.

## Validate

- Run the production build and resolve TypeScript, build, and relevant console errors.
- Check links when a suitable checker is available.
- Test desktop (about 1440 px), tablet, and mobile (about 390 px): layout, readable responsive typography, navigation, forms, touch targets, and horizontal overflow.
- Verify keyboard navigation, visible focus states, semantic/accessibility basics, contrast, and `prefers-reduced-motion`.
- Check image dimensions, lazy loading, unnecessary JavaScript or React hydration, layout shifts, and obvious LCP risks.

## Visual verification

When a browser tool or Playwright is available, use it at roughly 1440 px and 390 px. Correct visual defects rather than only listing them, then recheck the affected viewports.

## Completion

State the commands and checks actually run, plus any limitations. Do not claim checks that were unavailable.
