---
description: Auto-suggests domain_agents when editing task files with empty domain_agents fields.
paths:
  - tasks/*.yml
---

# Domain Routing

When editing a task file in `tasks/*.yml`, check if the task has an empty `domain_agents: []` field.

## Routing signals

Analyze the following fields to determine which domain agents are relevant:

- **title** — keywords map to domains (e.g. "map", "location" -> `maps-geo`; "payment", "billing" -> `payments-billing`)
- **description** — longer text with domain context clues
- **spec_refs** — PDB section references often indicate domain areas
- **acceptance_criteria** — specific behaviors often point to domains

## Routing matrix

| Signal keywords | Primary domain | Supporting domains |
|---|---|---|
| map, location, geo, coordinate, spatial | maps-geo | schema-data, infrastructure |
| message, chat, real-time, websocket | messaging | schema-data, notifications |
| search, filter, query, ranking, discovery | search-discovery | schema-data |
| payment, billing, subscription, invoice | payments-billing | schema-data, notifications |
| notification, push, alert, email, SMS | notifications | messaging |
| media, image, video, upload, file | media-content | schema-data, infrastructure |
| auth, login, permission, role, identity | auth-identity | schema-data |
| API, endpoint, REST, GraphQL, webhook | api-connections | schema-data, auth-identity |
| schema, model, migration, database, data | schema-data | |
| deploy, CI/CD, docker, infra, env | infrastructure | |
| animate, motion, transition, gesture | animation-motion | performance |
| accessible, a11y, WCAG, screen reader | accessibility | |
| i18n, translate, locale, RTL | internationalization | |
| perf, speed, bundle, cache, vitals | performance | |
| analytics, tracking, event, telemetry | analytics-telemetry | schema-data |
| a2ui, agent-ui, server-driven UI, widget registry, component tree, surface, LLM-generated UI | agent-ui | schema-data, api-connections |
| scrape, crawl, ingest, pipeline, firecrawl, stagehand, medallion, bronze, silver, gold, data collection | data-ingestion | schema-data, api-connections |
| firebase, firestore, cloud function, fcm, remote config, app check, firebase auth, firebase storage | auth-identity | schema-data, notifications, infrastructure |

## Classification

- **Primary**: the domain that owns the core logic of the task
- **Supporting**: domains that need to be consulted but don't own the task
- **Consulting**: Tier 3 domains pulled in via `consultedBy` (handled by the consultation rule)

## Behavior

When you detect an empty `domain_agents` on a task:
1. Analyze the task against the routing matrix.
2. Suggest the `domain_agents` value with classification comments.
3. Do not auto-populate — present the suggestion to the developer for confirmation.

Example suggestion:
```yaml
domain_agents:
  - maps-geo        # primary — location search feature
  - schema-data     # supporting — spatial data models
  # consulting (auto via consultedBy): performance, accessibility
```
