# Vertical Micro-Agent Architecture

An exploration of domain-expertise micro-agents for building AI-native products that disrupt business verticals.

---

## 1. What This Is (and Is Not)

### The outer frame

The goal is to **apply AI to a business vertical** — to build a product that fundamentally changes how an industry operates by embedding AI where it was previously absent. The micro-agent architecture described here is **the means of building that product**, not the product itself.

### What a vertical micro-agent is

A vertical micro-agent is a **domain-expertise development agent** scoped to one area of software craft. It knows the modern best practices, patterns, libraries, and constraints for its domain, and it applies that knowledge when building features in the product.

> A vertical micro-agent is an entity that owns one area of the software craft.
> It knows how to apply that area to any product.
> It creates, monitors, and maintains architecture within its domain.
> It always asks: **"Where does AI belong in this domain — both in how we build it and in what the end user experiences?"**

### How this differs from role-based agents

| Dimension | Role-based agents (current) | Domain micro-agents (proposed) |
|---|---|---|
| Organized by | Workflow phase (implement, test, review, document) | Area of software craft (maps, animations, messaging, schema) |
| Expertise | General-purpose coding + quality standards | Deep domain knowledge ("how to do geolocation well in a modern app") |
| Scope | Any feature, any domain | One domain, across all features that touch it |
| AI lens | Not a primary concern | Core mandate: evaluate where AI fits in this domain |
| Lifecycle | Invoked per task, then done | Ongoing ownership: create, monitor, maintain |

Role-based agents answer "what phase of work am I doing?" Domain micro-agents answer "what part of the system am I responsible for and how should it be built?"

These two models are complementary. A domain micro-agent (e.g. Map Agent) still goes through implementation, testing, review, and documentation — it just brings deep map/geo expertise to each of those phases rather than relying on a generalist.

---

## 2. The Three Mandates

Every micro-agent has the same three responsibilities applied to its domain:

### Create

Design and implement (or guide implementation of) features within the domain. The agent knows:
- Which libraries and services are best-in-class for this domain today.
- What architectural patterns work (and which don't) at different scales.
- Where AI can replace or augment traditional approaches in this domain.
- How to structure code so the domain stays modular and replaceable.

### Monitor

Observe the health and behavior of the domain's components in the running product:
- Define the metrics, logs, and alerts that matter for this domain.
- Detect drift (e.g. an API integration degrading, animation frame rates dropping, a data model growing inconsistent).
- Surface problems before they become user-visible.

### Maintain

Evolve the domain over time:
- Upgrade dependencies and migrate patterns as the ecosystem moves.
- Refactor when the domain's footprint outgrows its original design.
- Deprecate and remove cleanly when a domain is no longer needed.
- Keep the domain consistent with the rest of the system as other domains evolve.

---

## 3. First Set of Domains

The domains below are organized into three tiers based on how they relate to the product.

### Tier 1 — Foundation (shared substrate)

These domains provide primitives that other domains depend on. They must be stable and well-defined before feature domains can build on top of them.

| Domain | Scope | Where AI fits |
|---|---|---|
| **Schema / Data Modeling** | Entity design, migrations, relationships, validation rules, data integrity | AI-assisted schema generation from natural language; anomaly detection on data quality; auto-migration drafting when models evolve |
| **API Connections** | External integrations, internal service contracts, webhooks, rate limiting, error handling | AI-powered API mapping (auto-discover and connect to third-party APIs); intelligent retry/fallback strategies; natural language API query layers for end users |
| **Auth / Identity** | Authentication, authorization, sessions, roles, permissions, multi-tenancy | AI-driven adaptive auth (risk-based step-up); anomaly detection on login patterns; conversational identity verification for consumer-facing flows |
| **Infrastructure / DevOps** | Deployment, environments, CI/CD, cloud resources, scaling, monitoring scaffolding | AI-assisted incident triage; predictive auto-scaling; natural language infrastructure queries ("why did latency spike?") |

### Tier 2 — Feature domains

These domains implement user-facing capabilities. Each one can be present or absent depending on the product.

| Domain | Scope | Where AI fits |
|---|---|---|
| **Maps / Geolocation** | Spatial queries, geocoding, routing, map rendering, geofencing, location permissions | AI-powered place understanding (not just coordinates — context: "near a park," "busy area"); predictive routing; natural language location search for end users |
| **Messaging / Real-time** | Chat, channels, presence, typing indicators, message storage, delivery guarantees | AI-generated smart replies; conversation summarization; intent detection for routing messages; real-time moderation |
| **Search / Discovery** | Indexing, ranking, filters, facets, autocomplete, recommendations | Semantic search via embeddings; personalized ranking; conversational search ("find me something like X but cheaper") |
| **Payments / Billing** | Checkout, subscriptions, invoicing, usage metering, refunds, tax | AI-assisted pricing optimization; fraud detection; natural language billing queries for end users ("what am I being charged for?") |
| **Notifications** | Push, email, in-app, SMS, scheduling, preference management, templates | AI-generated notification copy; send-time optimization; smart batching/summarization to reduce notification fatigue |
| **Media / Content** | Uploads, image/video processing, CDN, transcoding, storage lifecycle | AI-powered auto-tagging, alt text generation, content moderation, smart cropping/resizing, video summarization |

### Tier 3 — Experience and craft

These domains cut across features to ensure the product feels right. They don't own features directly but influence how every feature is built and perceived.

| Domain | Scope | Where AI fits |
|---|---|---|
| **Animation / Motion** | Transitions, micro-interactions, loading states, gesture feedback, performance budgets | AI-driven adaptive animations (reduce motion for accessibility or low-end devices dynamically); generative motion design from descriptions |
| **Accessibility** | WCAG compliance, screen reader support, keyboard navigation, color contrast, focus management | AI-powered accessibility auditing; auto-generated alt text and ARIA labels; real-time compliance monitoring |
| **Internationalization** | Translation, locale formatting, RTL support, cultural adaptation, content extraction | AI translation and cultural adaptation; context-aware string extraction; real-time translation for user-generated content |
| **Performance** | Bundle size, rendering speed, network efficiency, caching, lazy loading, profiling | AI-assisted performance profiling ("what is causing jank?"); predictive prefetching; auto-optimization suggestions |
| **Analytics / Telemetry** | Event tracking, funnels, cohorts, dashboards, privacy compliance | AI-powered insight generation from raw data; anomaly detection; natural language analytics queries for stakeholders |

---

## 4. Contract Model

### How domains interact

Domains are not isolated — they share a codebase and a running product. The contract model defines how they depend on each other without creating entanglement.

```
                    ┌─────────────────────────────────────┐
                    │        Product Orchestrator          │
                    │  (product-level goals, priorities,   │
                    │   conflict resolution, AI strategy)  │
                    └────────────────┬────────────────────┘
                                     │
                    ┌────────────────┼────────────────────┐
                    │                │                    │
              ┌─────▼─────┐   ┌─────▼─────┐   ┌─────────▼───┐
              │  Tier 3    │   │  Tier 2    │   │  Tier 2     │
              │ Animation  │   │  Maps      │   │  Messaging  │  ...
              │ A11y, Perf │   │  Search    │   │  Payments   │
              └─────┬──────┘   └─────┬──────┘   └──────┬──────┘
                    │                │                  │
                    └────────────────┼──────────────────┘
                                     │
                    ┌────────────────▼────────────────────┐
                    │           Tier 1 — Foundation       │
                    │  Schema, API, Auth, Infrastructure  │
                    └─────────────────────────────────────┘
```

### Dependency rules

1. **Tier 2 depends on Tier 1.** Feature domains consume foundation primitives (data models from Schema, auth tokens from Auth, API contracts from API Connections). They never redefine them.

2. **Tier 3 influences Tier 2 (but doesn't own features).** The Animation agent doesn't build the messaging UI — it reviews and augments how the Messaging agent builds its UI. Tier 3 agents operate as consultants with authority over their craft area.

3. **Tier 2 domains are independent of each other.** Maps doesn't depend on Messaging. If they need to interact (e.g. "send a message when a user arrives at a location"), the interaction is mediated through Tier 1 primitives (events via API, triggers via Schema).

4. **The orchestrator resolves cross-cutting concerns.** When two domains disagree (e.g. Performance wants to defer loading a map; Maps wants it ready instantly), the product orchestrator makes the call based on product-level priorities.

### Dependency matrix

| Domain | Depends on | Consulted by |
|---|---|---|
| Schema / Data | — | All Tier 2 domains (they define models through Schema) |
| API Connections | Schema | All Tier 2 domains (they expose/consume APIs through this) |
| Auth / Identity | Schema, API | All Tier 2 domains (they delegate auth) |
| Infrastructure | — | All domains (deployment, scaling, monitoring) |
| Maps / Geo | Schema, API, Auth | Animation (map transitions), Performance (tile loading), Accessibility (alt text for maps) |
| Messaging | Schema, API, Auth | Animation (message transitions), Performance (real-time perf), Accessibility (screen reader for chat) |
| Search | Schema, API | Performance (index size), Analytics (search behavior) |
| Payments | Schema, API, Auth | Analytics (revenue tracking), Notifications (receipts) |
| Animation | — | — (consulted by Tier 2, doesn't depend on them) |
| Accessibility | — | — (consulted by Tier 2) |
| Performance | Infrastructure | — (consulted by Tier 2) |
| Analytics | Schema, API | — (consulted by orchestrator for product decisions) |

### Shared substrate

The following are owned collectively (or by a designated foundation agent) and are off-limits for unilateral changes by any single domain agent:

- **Database schema** — changes go through the Schema agent.
- **API surface** — public endpoints go through the API agent.
- **Auth model** — permission structures go through the Auth agent.
- **Event bus / pub-sub contracts** — event names and payloads are registered in a shared manifest.
- **Environment config** — managed by Infrastructure.
- **Design tokens** (if applicable) — shared visual primitives managed by a design system, consulted by Animation and Accessibility.

### Conflict resolution protocol

When domains disagree:

1. The involved agents each state their position and rationale.
2. If one domain is Tier 1 and the other is Tier 2 or 3, the Tier 1 domain's constraints take precedence (e.g. Schema integrity beats feature convenience).
3. If both are the same tier, the product orchestrator decides based on product goals.
4. All resolutions are logged so the system develops institutional memory about tradeoffs.

---

## 5. Design-Time vs Runtime

### The spectrum

"Agent" can mean very different things depending on when it operates:

| Mode | What it looks like | Example |
|---|---|---|
| **Design-time only** | A prompt/subagent you invoke when working on that domain. It brings expertise to the dev session. | "Map Agent" is a Cursor subagent with deep knowledge of geolocation patterns. You invoke it when building map features. |
| **Design-time + static hooks** | Same as above, but the agent also generates monitoring, config, and health-check scaffolding that runs in production. | Map Agent creates the feature AND sets up tile-load latency alerts, geofence event logging, and a feature flag for map provider switching. |
| **Design-time + runtime feedback loop** | The agent is invoked during dev AND periodically reviews production telemetry to propose maintenance actions. | Map Agent checks weekly: "tile error rate is up 3% — provider X may be degrading. Propose: add fallback to provider Y." |
| **Full runtime autonomy** | The agent operates continuously, making decisions without human approval (within guardrails). | Map Agent auto-switches tile providers when error rate exceeds threshold. (Highest risk, highest coordination cost.) |

### Recommended starting point: Design-time + static hooks

For the initial version of this architecture, agents should be:

1. **Design-time subagents** — invoked during development sessions, bringing domain expertise to implementation, testing, and review. Implemented as Claude Code agent prompts (`.claude/agents/domains/`) that can be invoked with `@domain-name`.

2. **Static hook generators** — as part of their implementation work, each agent is responsible for setting up the monitoring, alerting, and configuration scaffolding appropriate for their domain. This doesn't require runtime AI — it's just good engineering practice codified in the agent's expertise.

This starting point gives you:
- Deep domain expertise during development (the primary value).
- Production observability per domain (monitoring and alerting).
- A clear path to runtime feedback loops later (the telemetry is already being collected).
- No runtime AI cost or coordination complexity yet.

### Path to runtime (later)

When the product is live and generating telemetry, you can upgrade specific domains to a feedback loop:

```
Phase 1 (now):    Agent creates + sets up monitoring
Phase 2 (later):  Agent periodically reviews monitoring data, proposes changes
Phase 3 (future): Agent acts on monitoring data within guardrails (auto-remediation)
```

Not every domain needs to reach Phase 3. Some (like Animation) may stay at Phase 1 permanently. Others (like API Connections or Infrastructure) are natural candidates for Phase 3 because they deal with dynamic, measurable systems.

---

## 6. The AI-Vertical Lens

This is the core design principle that distinguishes this architecture from conventional microservices or domain-driven design.

### The question every agent must answer

When a domain micro-agent creates, monitors, or maintains its slice of the system, it must always evaluate:

> **"Where in this domain can AI replace, augment, or create something that didn't exist before — both in how we build it and in what the end user experiences?"**

This produces two outputs:

**Builder AI** — AI that improves how the domain is developed and maintained:
- Auto-generating boilerplate (schema migrations, API stubs, test fixtures).
- Suggesting patterns based on the domain's best practices.
- Detecting drift or degradation in the domain's components.

**Consumer AI** — AI that becomes a user-facing feature within the domain:
- Natural language search instead of filter dropdowns.
- Smart replies in messaging instead of empty text boxes.
- Predictive routing in maps instead of manual address entry.
- Contextual billing explanations instead of opaque invoices.

### Why this matters for business verticals

When the product's purpose is to **bring AI into an industry that doesn't have it yet**, the domain agents need to internalize this. A Map Agent building for a logistics company doesn't just implement pin-dropping — it asks: "What does AI-native logistics mapping look like? Predictive ETAs? Autonomous route optimization? Natural language dispatch?" The agent's expertise includes knowing what's possible with AI in its domain, not just what's conventional.

This is how the micro-agent architecture serves the larger goal: each domain agent is a vector for AI penetration into the business vertical, because each one is trained to look for where AI fits in its specific area of the product.

### Consumer AI ownership

The domain agent that owns a feature domain also owns the consumer-facing AI within that domain:

- **Maps agent** owns smart location suggestions, predictive routing, natural language place search.
- **Messaging agent** owns smart replies, conversation summarization, intent detection.
- **Search agent** owns semantic search, conversational queries, personalized ranking.

This keeps the AI coherent with the domain's architecture rather than bolting it on as an afterthought. The agent knows both the domain's technical constraints and the AI capabilities that can operate within them.

---

## 7. Agent Definition Template

Each domain micro-agent should be defined with the following structure. This template is how new domains are created and existing ones are documented.

```yaml
id: domain-maps-geo
name: Maps / Geolocation Agent
tier: 2  # 1=foundation, 2=feature, 3=experience

scope: |
  Spatial queries, geocoding, reverse geocoding, routing and directions,
  map rendering (tile providers, vector maps), geofencing, location
  permissions, coordinate systems, distance calculations.

modern_practices: |
  - Vector tiles over raster for performance and styling flexibility.
  - Server-side geocoding with client-side caching.
  - Privacy-first location: request only when needed, degrade gracefully.
  - Provider abstraction layer (swap Mapbox/Google/OSM without feature loss).
  - Geofencing via server-side spatial queries, not client polling.

ai_applications:
  builder:
    - Auto-generate spatial indexes based on query patterns.
    - Suggest geofence boundaries from usage data.
    - Detect map rendering performance regressions from telemetry.
  consumer:
    - Natural language place search ("coffee shop near the park by my office").
    - Predictive destination suggestions based on time/context.
    - AI-generated route narratives ("scenic route along the coast, 12 min longer").
    - Semantic geofencing ("alert me when I'm near a competitor's store").

dependencies:
  - schema       # spatial data models, coordinate storage
  - api          # map tile providers, geocoding services
  - auth         # location permission scoping per user role

consulted_by:
  - animation    # map transition smoothness
  - performance  # tile loading budgets
  - accessibility # alt text for map regions, non-visual navigation

monitoring_hooks:
  - Tile load latency p50/p95/p99
  - Geocoding success rate and fallback frequency
  - Location permission grant/deny ratio
  - Geofence trigger accuracy (false positive rate)

maintenance_triggers:
  - Tile provider deprecation or pricing change
  - New spatial data format adoption (e.g. H3, S2)
  - Privacy regulation changes affecting location data
```

---

## 8. Relationship to This Repo

### What stays the same

The existing role-based agents (Implementation, QA, Testing, Documentation) and the task-driven workflow (`tasks/*.yml`, `spec_refs`, `acceptance_criteria`) remain unchanged. They define **how work gets done** — phases of the development process.

### What this adds

Domain micro-agents define **what expertise is applied** during that work. When a task touches maps, the Map Agent is invoked alongside the Implementation Agent. The domain agent brings the "what" (geolocation best practices, where AI fits) and the role-based agent brings the "how" (code quality, test coverage, documentation).

### Where domain agents would live

```
.claude/agents/domains/
  maps-geo.md
  messaging.md
  schema.md
  api-connections.md
  auth-identity.md
  animation-motion.md
  accessibility.md
  search-discovery.md
  payments-billing.md
  notifications.md
  media-content.md
  internationalization.md
  performance.md
  analytics-telemetry.md
  infrastructure.md
```

Each file is a Claude Code agent prompt that encodes the domain's scope, modern practices, AI applications, dependencies, and monitoring hooks — following the template in Section 7.

### How they integrate with tasks

```yaml
# tasks/maps-feature.yml
- id: MAPS_T1_location_search
  title: "Implement natural language location search"
  agent_roles: [implementation, testing]
  domain_agents: [maps-geo, search-discovery]  # NEW FIELD
  spec_refs:
    - "PDB: docs/product_design/app_pdb.md — Section 3.4"
  acceptance_criteria:
    - "User can search by natural language description"
    - "Falls back to standard geocoding when AI confidence is low"
    - "Location permissions requested only on first search"
```

The `domain_agents` field tells the system which domain expertise to bring into the task. The role-based `agent_roles` field still governs the workflow phases.

---

## 9. Open Questions

These are unresolved design decisions that should be addressed as the architecture matures:

1. **Granularity threshold** — When is a domain too small to justify its own agent (e.g. "tooltips") vs. too large to be coherent (e.g. "frontend")? A useful heuristic: if the domain has its own set of best practices, libraries, and failure modes, it's a candidate.

2. **Agent knowledge freshness** — Domain agents encode best practices, but those evolve. How do agents stay current? Options: periodic review cycles, web search at invocation time, version-stamped knowledge with expiry dates.

3. **Cross-domain features** — Some features are inherently multi-domain (e.g. "send a push notification when a user enters a geofenced area" spans Maps, Notifications, and Messaging). The contract model handles this via Tier 1 mediation, but the orchestration overhead needs to be practical, not bureaucratic.

4. **Agent proliferation** — At what point does the number of domain agents exceed what a team (or an AI) can coordinate? The tier system helps, but a large product could have 20+ domains. Governance and pruning criteria are needed.

5. **Measurability** — How do you know if a domain agent is actually delivering value vs. adding overhead? Possible metrics: time-to-implement for features in that domain, defect rate, AI feature adoption by end users.

---

## Summary

This architecture reframes multi-agent development from **"roles that do phases of work"** to **"domain experts that own slices of the software craft."** Each micro-agent knows the modern best practices for its area, creates and maintains architecture within that area, and — critically — always evaluates where AI belongs in that domain, both for the team building the product and for the end users consuming it.

The micro-agent system is the means, not the end. The end is a product that brings AI into a business vertical in a way that is deeply integrated, not superficially bolted on. By distributing AI-awareness across every domain agent, the architecture ensures that AI penetration is a first-class concern at every level of the system — from data modeling to animations to billing.

Start with design-time agents and static monitoring hooks. Let production telemetry reveal which domains benefit from runtime feedback loops. Grow the system organically: add domains when new areas of expertise are needed, retire them when they're absorbed into established patterns.
