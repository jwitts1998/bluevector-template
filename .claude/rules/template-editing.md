---
description: Conventions for editing template files in this repo
paths:
  - templates/**/*
---

# Template Editing Rules

When editing files under `templates/`:

- Preserve all `{{VARIABLE_NAME}}` placeholders. Do not remove, rename, or hardcode them unless explicitly changing the documented variable set.
- Preserve existing section structure and headings. Add new content within established sections rather than restructuring.
- Only introduce new `{{VARIABLES}}` if they are also added to the variable reference in SETUP_GUIDE.md.
- Keep template content stack-agnostic in base templates; stack-specific content belongs in the specialized templates (e.g., `mobile-app.md`, `AGENTS-web.md`).
- When adding sections to a CLAUDE.md template, mirror the same section in the corresponding rule templates under `templates/claude-config/rules/` to keep both formats in sync.
