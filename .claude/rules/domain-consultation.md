---
description: Auto-includes Tier 3 consultation lenses during code review on tasks with domain_agents.
paths:
  - tasks/*.yml
  - templates/subagents/generic/code-reviewer.md
  - .claude/agents/generic/code-reviewer.md
---

# Domain Consultation During Review

When performing code review or QA on a task that has `domain_agents` specified, automatically include Tier 3 consultation lenses.

## Process

1. Read the task's `domain_agents` field.
2. For each listed domain agent, look up its `## Consulted By` section in the agent definition file.
3. Collect all Tier 3 agents referenced in those `consultedBy` lists.
4. During review, apply each Tier 3 agent's craft lens:

| Tier 3 Agent | Craft lens to apply |
|---|---|
| `animation-motion` | Are transitions smooth and purposeful? Is `prefers-reduced-motion` respected? |
| `accessibility` | Is the feature keyboard-navigable? Are ARIA attributes correct? Color contrast sufficient? |
| `internationalization` | Are strings externalized? Does layout handle RTL? Are dates/numbers locale-aware? |
| `performance` | Are there unnecessary re-renders? Is bundle impact acceptable? Are images optimized? |
| `analytics-telemetry` | Are key user actions tracked? Are events following the schema? |

## Lightweight application

Tier 3 consultation should be lightweight — load only the **Quick Reference** section of each consulting agent. Full agent context is not needed for review-level feedback.

## When to skip

- If the task explicitly marks `domain_agents: [schema-data]` only (pure data work), skip animation and i18n lenses.
- If the task is infrastructure-only, skip all Tier 3 consultation.
