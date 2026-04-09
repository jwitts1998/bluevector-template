---
description: Plugin, skill, and MCP gap identification for {{PROJECT_NAME}}
alwaysApply: true
---

# Plugin, Skill & MCP Awareness

## Permissions

You have permission to leverage existing skills and create new ones at any time. Use `/skill-name` when a task would benefit (e.g., `/brainstorming`, `/test-driven-development`). Use the `create-skill` workflow to author project-specific skills. After adding capabilities, update `docs/CLAUDE_CODE_CAPABILITIES.md`.

**Antigravity IDE**: This template is designed to work with [Antigravity IDE](https://antigravity.dev) as the primary development environment. Antigravity IDE provides native agent orchestration, skill management, and MCP integration. Configuration lives in `.antigravity/settings.json`. When working inside Antigravity IDE, skills and MCP tools are automatically discovered and available.

**Antigravity Awesome Skills**: If installed, 946+ skills are in `.claude/skills/`. Project config agents can run `./scripts/install-antigravity-skills.sh` during setup or when the user requests it. See `docs/CLAUDE_CODE_CAPABILITIES.md` for install instructions.

## Recognizing Gaps

While working on any task, watch for these signals that a plugin, skill, or MCP server would help:

**Missing plugin signals**:
- You are using a framework or service (e.g., Stripe, Firebase, Google Stitch) that likely has an MCP server or skill, but it is not listed in `docs/CLAUDE_CODE_CAPABILITIES.md`
- You are manually looking up library documentation that a docs-lookup tool (e.g., Context7) could provide instantly
- You are doing accessibility checks, visual regression comparisons, or cross-browser testing manually when tools exist for these

**Missing custom skill signals**:
- You are repeating the same multi-step workflow across different tasks (e.g., a specific deployment sequence, a data migration pattern, a code generation recipe)
- You keep re-deriving project-specific conventions (naming patterns, validation rules, architecture decisions) that should be encoded once and reused
- Multiple sessions make the same mistakes because domain knowledge is not persisted

**Missing MCP server signals**:
- You are shelling out to a project CLI, database client, or internal API repeatedly — structured MCP access would be safer and more efficient
- Multiple agents need the same tool access and each builds ad-hoc shell commands independently

## What to Do

When you identify a gap:
1. Note it in your output under a **Tooling Recommendations** heading
2. Specify whether to **install** (existing MCP server or skill), **create** (custom skill via `create-skill`), or **expose** (wrap a tool as an MCP server)
3. Explain the benefit concisely
4. After any installation or creation, update `docs/CLAUDE_CODE_CAPABILITIES.md` so all agents are aware

## Reference

See `docs/CLAUDE_CODE_CAPABILITIES.md` for the current inventory of installed skills and MCP servers.
