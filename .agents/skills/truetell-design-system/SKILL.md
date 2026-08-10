---
name: truetell-design-system
description: Enforce the TrueTell visual system for any UI work. Use when creating or changing a page, section, component, header, footer, navigation, responsive layout, colors, typography, spacing, forms, or composition for TrueTell.
---

# TrueTell Design System

Treat [`DESIGN_SYSTEM.md`](../../../DESIGN_SYSTEM.md) as the single source of truth. Read it before making visual decisions. If it is missing or unclear, stop and ask rather than inventing a visual rule.

## Apply the system

- Build a calm, precise B2B engineering interface for software, automation, and integrations—not a generic AI, SaaS, or agency site.
- Use the documented tokens, type stack, spacing rhythm, radii, color proportions, components, image priorities, motion, and mobile rules.
- Prefer semantic HTML, grid, whitespace, real product surfaces, data, statuses, diagrams, and 2D connection maps.
- Use colors only for hierarchy or state. Use dark surfaces and liquid glass only in the documented, limited contexts.
- Make a standalone card, icon, line, animation, or image only when it communicates a distinct function.

## Hard constraints

- Do not add brand colors, font families, radius scales, shadow styles, decorative patterns, or a new visual language unless `DESIGN_SYSTEM.md` is updated in the same task.
- Do not use forbidden treatments from the design system, including generic SaaS heroes, gradients as a style, glow, 3D objects, decorative kickers, icon circles, or indiscriminate rounded cards.
- When touching code that conflicts with the design system, bring that local area into compliance. Do not expand the scope into an unrelated site-wide redesign.

## Completion

Use `anti-ai-slop-design` alongside this skill for all UI work. Check desktop and mobile composition, token use, semantic/accessibility requirements, and whether every visual detail has a functional purpose before finishing.
