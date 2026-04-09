---
name: calibrate-domains
description: Invokes the vertical calibrator agent to configure the domain micro-agent system for a specific product. Reads domain-config.yml when it exists to surface product-specific domain priorities during task creation.
disable-model-invocation: true
allowed-tools: Read, Write, Edit, Grep, Glob
---

# Calibrate Domains Skill

Configure the domain micro-agent system for a specific business vertical.

## When to use

- User says "calibrate domains", "configure for my product", "set up domain priorities"
- Starting a new product and `docs/architecture/domain-config.yml` does not exist
- Creating a task and you want to suggest relevant `domain_agents` based on product calibration

## Workflow

### If `domain-config.yml` does not exist

1. Inform the user: "No product calibration exists yet. Let's configure the domain agents for your product."
2. Invoke `vertical-calibrator subagent` to walk through the 5-step calibration workflow.
3. The calibrator generates `docs/architecture/domain-config.yml`.

### If `domain-config.yml` exists

1. Read `docs/architecture/domain-config.yml`.
2. Extract domain relevance ratings and AI priorities.
3. When creating or reviewing a task:
   - Suggest `domain_agents` from domains marked as `core` or `supporting`.
   - Highlight the `is_ai_differentiator` domain when the task involves AI features.
   - Skip domains marked as `not-applicable`.

### Validating task domain coverage

When a new task is created:

1. Read the task's `domain_agents` field.
2. Cross-reference against `domain-config.yml`:
   - If the task mentions keywords related to a `core` domain that isn't listed, suggest adding it.
   - If the task lists a `not-applicable` domain, flag it for review.
3. Surface the AI priority ratings for the listed domains so the implementer knows which AI applications are critical vs. useful.

## Re-calibration

If the user says "re-calibrate" or "update domain priorities":
1. Read the existing `domain-config.yml` to understand current state.
2. Invoke `vertical-calibrator subagent` with the existing config as context.
3. The calibrator walks through changes only (not the full workflow from scratch).

## Skills Access

You have permission to leverage and create skills at any time. If Antigravity Awesome Skills is installed, use `/skill-name` (e.g., `@brainstorming`, `@architecture`) when domain calibration would benefit. You can suggest running `./scripts/install-antigravity-skills.sh` during project setup if not yet installed. See `docs/CLAUDE_CODE_CAPABILITIES.md`.

## Files

- **Config file**: `docs/architecture/domain-config.yml`
- **Calibrator agent**: `templates/subagents/ideation/vertical-calibrator.md` (or `.claude/agents/ideation/vertical-calibrator.md` after setup)
- **Domain agents**: `templates/subagents/domains/*.md`
