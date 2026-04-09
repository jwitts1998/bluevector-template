---
name: domain-routing
description: Structured workflow for populating domain_agents on task files. Analyzes task signals against the routing matrix, classifies domains as primary/supporting/consulting, and optionally bulk-scans all tasks for coverage.
disable-model-invocation: true
allowed-tools: Read, Write, Edit, Grep, Glob
---

# Domain Routing Skill

Populate the `domain_agents` field on task files by analyzing task content against the domain routing matrix.

## When to use

- Creating a new task file
- Reviewing task files that have `domain_agents: []`
- Bulk-scanning all `tasks/*.yml` to check domain coverage

## Workflow

### Step 1: Read the task

Read the task file and extract:
- `title`
- `description`
- `spec_refs`
- `acceptance_criteria`
- `code_areas` (if present)

### Step 2: Match against routing matrix

Compare extracted signals against the routing matrix:

| Signal keywords | Primary domain |
|---|---|
| map, location, geo, coordinate, spatial | maps-geo |
| message, chat, real-time, websocket | messaging |
| search, filter, query, ranking, discovery | search-discovery |
| payment, billing, subscription, invoice | payments-billing |
| notification, push, alert, email, SMS | notifications |
| media, image, video, upload, file | media-content |
| auth, login, permission, role, identity | auth-identity |
| API, endpoint, REST, GraphQL, webhook | api-connections |
| schema, model, migration, database, data | schema-data |
| deploy, CI/CD, docker, infra, env | infrastructure |
| animate, motion, transition, gesture | animation-motion |
| accessible, a11y, WCAG, screen reader | accessibility |
| i18n, translate, locale, RTL | internationalization |
| perf, speed, bundle, cache, vitals | performance |
| analytics, tracking, event, telemetry | analytics-telemetry |

### Step 3: Classify

- **Primary**: the domain owning the core logic (usually 1, sometimes 2)
- **Supporting**: domains that need to be consulted for data models, infra, or API design
- **Consulting**: Tier 3 domains pulled in automatically via `consultedBy` — list these as comments

### Step 4: Populate and confirm

Present the suggestion to the developer:

```yaml
domain_agents:
  - maps-geo          # primary — core location feature
  - schema-data       # supporting — spatial data models
  # consulting (auto via consultedBy): performance, accessibility, animation-motion
```

Wait for confirmation before writing.

### Step 5: Validate

After populating, verify:
- At least one primary domain is listed
- Supporting domains are Tier 1 if the primary is Tier 2
- No duplicate entries

## Bulk scan mode

To scan all tasks for domain coverage:

1. Read all files in `tasks/*.yml`.
2. For each task with empty or missing `domain_agents`, run Steps 2-3.
3. Output a coverage report:

```
Domain Coverage Report
=====================
Tasks scanned: 15
Tasks with domain_agents: 9 (60%)
Tasks missing domain_agents: 6

Missing:
  - FEATURE_T1_auth_flow → suggested: [auth-identity, schema-data]
  - FEATURE_T2_dashboard → suggested: [analytics-telemetry, performance]
  ...
```

## Valid domain IDs

```
schema-data, api-connections, auth-identity, infrastructure,
maps-geo, messaging, search-discovery, payments-billing,
notifications, media-content, animation-motion, accessibility,
internationalization, performance, analytics-telemetry
```

## Skills Access

You have permission to leverage and create skills at any time. If Antigravity Awesome Skills is installed, use `/skill-name` (e.g., `@architecture`, `@brainstorming`) when routing would benefit. You can suggest running `./scripts/install-antigravity-skills.sh` during project setup if not yet installed. See `docs/CLAUDE_CODE_CAPABILITIES.md`.
