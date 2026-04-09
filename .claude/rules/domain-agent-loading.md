---
description: Controls how domain agent prompts are loaded when multiple agents are invoked on a single task.
paths:
  - templates/subagents/domains/*.md
  - .claude/agents/domains/*.md
  - tasks/*.yml
---

# Domain Agent Loading Strategy

When a task references multiple `domain_agents`, load prompts efficiently to avoid context overload.

## Loading rules

1. **Primary domain agent** (first in the `domain_agents` list): Load the **full agent file** including all sections.
2. **Supporting domain agents** (remaining entries): Load only the **Quick Reference** section (between `## Quick Reference` and `## When to Invoke`).
3. **Consulting domain agents** (Tier 3 pulled in via `consultedBy`): Load only the **Quick Reference** section.

## Rationale

Each domain agent is 100+ lines. A task touching 3-4 domains would consume significant context with full loads. The Quick Reference section contains the essential scope, top practices, top AI applications, and dependencies — sufficient for supporting and consulting roles.

## When to load full content

- The developer explicitly requests deep domain guidance for a supporting agent.
- A conflict arises between domains that requires detailed understanding of both positions.
- The task is primarily about the supporting domain (reconsider which agent is "primary").

## Example

```yaml
domain_agents:
  - maps-geo          # primary -> load full
  - schema-data       # supporting -> Quick Reference only
  - search-discovery  # supporting -> Quick Reference only
  # consulting: performance, accessibility -> Quick Reference only
```
