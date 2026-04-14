# Domain Micro-Agents

Domain micro-agents are **development agents organized by area of software craft** rather than by workflow phase. Each one owns a vertical slice of the system and brings deep expertise to implementation, testing, review, and documentation within that domain.

## The Three Mandates

Every domain agent has three ongoing responsibilities:

1. **Create** — design and implement features using modern best practices for its domain.
2. **Monitor** — define metrics, alerts, and observability hooks appropriate for its domain.
3. **Maintain** — evolve the domain over time (upgrades, refactors, deprecations).

## The AI-Vertical Lens

Every domain agent must always evaluate:

> "Where in this domain can AI replace, augment, or create something that didn't exist before — both in how we build it and in what the end user experiences?"

This produces two categories of AI application:
- **Builder AI** — AI that improves development and maintenance within the domain.
- **Consumer AI** — AI that becomes a user-facing feature within the domain.

## Tier Model

Domains are organized into three tiers:

| Tier | Purpose | Agents |
|------|---------|--------|
| **1 — Foundation** | Shared primitives that other domains depend on | `schema-data`, `api-connections`, `auth-identity`, `infrastructure` |
| **2 — Feature** | User-facing capabilities (present or absent per product) | `maps-geo`, `messaging`, `search-discovery`, `payments-billing`, `notifications`, `media-content` |
| **3 — Experience** | Cross-cutting craft that influences how every feature is built | `animation-motion`, `accessibility`, `internationalization`, `performance`, `analytics-telemetry` |

### Dependency rules

- Tier 2 depends on Tier 1 (consumes foundation primitives).
- Tier 3 influences Tier 2 (consults on craft quality, doesn't own features).
- Tier 2 domains are independent of each other (interactions mediated through Tier 1).

## How They Work with Role-Based Agents

Domain agents define **what expertise is applied**. Role-based agents (Implementation, QA, Testing, Documentation) define **how work gets done**. They compose:

```yaml
- id: MAPS_T1_location_search
  agent_roles: [implementation, testing]
  domain_agents: [maps-geo, search-discovery]
```

When a task touches maps, invoke `maps-geo subagent` alongside the Implementation Agent. The domain agent brings best practices and AI-awareness; the role agent brings process discipline.

## Creating a New Domain Agent

Use the following structure. Copy an existing domain agent and adapt:

1. Set `name` and `description` in frontmatter.
2. Define **Scope** — what this domain owns (and explicitly what it does not).
3. Document **Modern Practices** — current best-in-class patterns.
4. Specify **AI Applications** — builder-side and consumer-side.
5. List **Dependencies** — which Tier 1 agents this domain relies on.
6. List **Consulted By** — which Tier 3 agents review this domain's work.
7. Define **Monitoring Hooks** — what to instrument in production.
8. Note **Maintenance Triggers** — events that require revisiting this domain.

## Orchestration

Two system agents coordinate domain micro-agents:

- `@product-orchestrator` — resolves cross-domain conflicts, sets AI strategy, manages domain lifecycle.
- `@domain-router` — determines which domain agent(s) a task touches, populates `domain_agents` on tasks.

## Reference

See [docs/architecture/vertical-micro-agents-exploration.md](../../../docs/architecture/vertical-micro-agents-exploration.md) for the full architecture exploration and design rationale.
