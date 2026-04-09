---
description: Checks domain agent knowledge freshness when domain agents are invoked.
paths:
  - templates/subagents/domains/*.md
  - .claude/agents/domains/*.md
  - tasks/*.yml
---

# Domain Knowledge Freshness

When a domain agent is invoked (directly or via a task's `domain_agents` field), check its `last_reviewed` frontmatter field.

## Freshness check

1. Read the domain agent file and extract `last_reviewed` from frontmatter.
2. If `last_reviewed` is older than 90 days from the current date, the agent's knowledge is **stale**.
3. If stale:
   - Before applying the agent's recommendations, use web search or documentation tools to verify the top 3 practices listed in `## Modern Practices` are still current.
   - Cross-reference `knowledge_sources` from frontmatter — check if newer versions of those sources exist.
   - Log a reminder in task notes: `"[domain-name] agent knowledge last reviewed [date] — verified current practices via web search on [today's date]"`.
   - After the session, recommend updating the agent's `last_reviewed` date and any outdated practices.

## When not to check

- If `last_reviewed` is within the last 90 days, proceed normally without verification.
- Quick consultations (e.g. Tier 3 agents providing craft feedback) do not need full freshness checks — only primary domain agents on a task.
