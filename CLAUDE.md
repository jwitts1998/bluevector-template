# BlueVector AI Project

## Overview

This is a standalone multi-agent development toolkit for GCP-based projects. It provides 52 specialized AI agents, 24 MCP servers, and an interactive setup system for rapid project bootstrapping on Google Cloud Platform.

**Status**: This is a freshly cloned starter. Run `./scripts/setup.sh` to configure for your specific project, which will:
- Replace template variables with your project details
- Configure MCP connections for GCP services
- Set up subagent configurations
- Initialize project status tracking

---

## How This System Works

### Agent Roles

Agents are perspectives, not separate processes. When working on a task, adopt the role specified in the task's `agent_roles` field:

- **Implementation Agent**: Write production code, follow architecture patterns, handle business logic
- **Quality Assurance Agent**: Review code for quality, security, and architecture compliance
- **Testing Agent**: Write tests, ensure coverage, validate behavior
- **Documentation Agent**: Generate and maintain documentation

### Task-Driven Development

Work is organized through task files:

- **Portfolio-level**: `tasks/tasks.yml` — milestones and high-level goals
- **Feature-level**: `tasks/*.yml` — detailed implementation tasks with `spec_refs`, `agent_roles`, and `acceptance_criteria`

---

## Directory Structure

```
.claude/
├── rules/                  # Active rules (loaded automatically)
├── skills/                 # Claude Code skills
├── agents/                 # Subagent configurations (populated by setup.sh)
│   ├── generic/
│   ├── ideation/
│   ├── ingestion/
│   ├── specialists/
│   └── domains/
└── settings.json           # Permissions and settings

.antigravity/               # Antigravity IDE configuration
├── settings.json           # IDE settings

templates/                  # Template library (for setup.sh)
├── claude-config/          # CLAUDE.md variants
├── agents/                 # AGENTS.md variants
├── subagents/              # All subagent configs
├── tasks/                  # Task schema templates
└── workflow/               # Workflow documentation

status/
├── status.json             # Machine-readable project status
└── progress.md             # Human-readable progress log

tasks/                      # Task files (YAML)
docs/
├── product_design/         # PDB output location
├── architecture/           # TAD output location
└── *.md                    # Documentation

src/                        # Business code (empty in template)
scripts/                    # Setup and utility scripts
examples/                   # Example configurations
```

---

## Available Agents (52 total)

Subagent configs are in `templates/subagents/`. After running `./scripts/setup.sh` or `./scripts/apply-to-existing.sh`, active agents are in `.claude/agents/`. Invoke with `@agent-name`.

### Ideation (4 agents)
- `@idea-to-pdb` — Explore an idea and generate a Product Design Blueprint
- `@context-to-pdb` — Transform stakeholder context into a PDB
- `@pdb-to-tasks` — Decompose a PDB into epics and task files
- `@vertical-calibrator` — Calibrate domain agents for your project's vertical

### Generic (8 agents)
- `@code-reviewer` — Code quality, security, architecture review
- `@test-writer` — Test creation and coverage
- `@debugger` — Error investigation and fixes
- `@designer` — UI/UX, design system, accessibility
- `@doc-generator` — Documentation creation and maintenance
- `@security-auditor` — Security scanning and hardening
- `@performance-optimizer` — Performance analysis and optimization
- `@deployment-specialist` — Deployment to Cloud Run, Firebase Hosting, GKE

### Specialists (14 agents)
- `@a2ui-specialist` — A2UI protocol, server-driven agent UI, Widget Registries (React & Flutter), A2A UI transport
- `@agent-console-specialist` — Agent dashboard UI, session management, tool call visualization
- `@data-science-specialist` — ETL/ELT, data warehousing, medallion architecture, analytics
- `@evaluation-specialist` — AI model evaluation, benchmarking, quality metrics
- `@firebase-specialist` — Firebase Auth, Firestore, Cloud Functions, Storage, Messaging, Remote Config, App Check
- `@flutter-specialist` — Flutter/Dart, Riverpod, Material 3, mobile best practices
- `@gcp-specialist` — gcloud CLI, Cloud Run, Cloud SQL, IAM, Secret Manager, Cloud Build
- `@ml-specialist` — LLM integration, embeddings, RAG, AI features
- `@node-specialist` — Node.js/Express/Fastify backend patterns
- `@observability-specialist` — Monitoring, logging, tracing, alerting (OpenTelemetry, Sentry, Datadog)
- `@orchestration-specialist` — Multi-agent workflows, LangGraph, CrewAI, Vercel AI SDK pipelines
- `@react-specialist` — React/TypeScript, hooks, state management, Vercel AI SDK, assistant-ui
- `@stitch-specialist` — Google Stitch design-to-code, DESIGN.md, design system, vibe design
- `@web-scraping-specialist` — Ethical scraping, Firecrawl, Stagehand, Jina AI, data extraction

### Domain Agents (17 agents)

Tier 2 vertical expertise agents. Auto-suggested via `.claude/rules/domain-routing.md`.

- `@accessibility` — WCAG compliance, screen readers, keyboard navigation
- `@agent-ui` — Agent-generated UI, A2UI protocol, Widget Registries, surface lifecycle
- `@analytics-telemetry` — Event tracking, metrics, dashboards, product analytics
- `@animation-motion` — Transitions, gestures, micro-interactions
- `@api-connections` — REST/GraphQL/gRPC design, webhooks, third-party integrations
- `@auth-identity` — Authentication (Firebase Auth), authorization, sessions, roles, permissions
- `@data-ingestion` — Data collection pipelines, medallion architecture, scraping orchestration
- `@infrastructure` — GCP deployment, Cloud Run, Cloud SQL, Terraform, CI/CD
- `@internationalization` — i18n, localization, RTL support
- `@maps-geo` — Location services, geospatial, routing, map tiles
- `@media-content` — Images, video, uploads, processing, CDN
- `@messaging` — Chat, real-time, Firestore, WebSockets, presence, typing indicators
- `@notifications` — Push (FCM), email, SMS, in-app alerts
- `@payments-billing` — Transactions, subscriptions, invoicing, PCI compliance
- `@performance` — Core Web Vitals, bundle optimization, caching, profiling
- `@schema-data` — Data modeling, Cloud SQL migrations, validation, indexing
- `@search-discovery` — Search, filtering, ranking, autocomplete

### System Agents (6 agents)

Internal orchestration agents for the multi-agent system.

- `@domain-router` — Routes tasks to appropriate domain agents
- `@product-orchestrator` — Coordinates cross-domain work
- `@task-orchestrator` — Task breakdown and execution coordination
- `@query-router` — Routes queries to appropriate specialists
- `@execution-monitor` — Monitors agent execution and health
- `@memory-updater` — Manages session memory and learned patterns

### Ingestion (3 agents)

For applying the template to existing codebases.

- `@codebase-auditor` — Analyze existing code structure and patterns
- `@gap-analysis` — Identify production-readiness gaps
- `@documentation-backfill` — Generate PDB from existing code

---

## MCP Capabilities

This system integrates **24 MCP servers** organized across 10 tiers:

### Tier 1: Essential (5 MCPs)
- **Context7** — Real-time library documentation
- **Sequential Thinking** — Multi-step reasoning
- **Idea-Reality** — Idea validation and planning
- **GitHub** — Repository management, PR reviews
- **Filesystem** — Local file operations

### Tier 2: UI/UX & Design (3 MCPs)
- **Google Stitch** — AI-native design-to-code with DESIGN.md
- **Shadcn** — Production-ready accessible components
- **21st.dev Magic** — Modern UI patterns

### Tier 3: Codebase Intelligence (3 MCPs)
- **TNG.sh** — Framework-aware auditor
- **Codebase Checkup** — Autonomous audit
- **Code Indexer** — Local code search

### Tier 4: Security & Quality (2 MCPs)
- **Snyk** — Vulnerability scanning
- **SonarQube** — Code quality analysis

### Tier 5: Task Orchestration (5 MCPs)
- **Workflows** — YAML-based workflows
- **Task Orchestrator** — Persistent state
- **Tasks** — Task management
- **Linear** — Issue tracking
- **Notion** — Documentation storage

### Tier 6: GCP Backend (2 MCPs)
- **Firebase** — Firebase Auth, Firestore, Cloud Functions, Hosting
- **SQLite** — Local database prototyping

### Tier 7: Observability (2 MCPs)
- **Sentry** — Error monitoring
- **Datadog** — Performance metrics

### Tier 8: Documentation (1 MCP)
- **Mintlify** — Docs generation

### Tier 9: CI/CD (1 MCP)
- **GitHub Actions** — CI/CD automation

### Tier 10: Data Ingestion (1 MCP)
- **Firecrawl** — Web scraping and data collection

Full configuration in `.mcp.json`. Setup guide in `docs/MCP_SETUP_GUIDE.md`.

---

## GCP Default Stack

| Project Type | Compute | Database | Auth | Hosting |
|---|---|---|---|---|
| **Mobile** | Cloud Functions | Firestore | Firebase Auth | N/A |
| **Web** | Cloud Run | Cloud SQL | Firebase Auth | Firebase Hosting |
| **Backend** | Cloud Run | Cloud SQL (PostgreSQL) | Firebase Auth | N/A |
| **Full-Stack** | Cloud Run | Cloud SQL (PostgreSQL) | Firebase Auth | Firebase Hosting |

---

## Status Contract

The `status/status.json` file is the canonical machine-readable project status:

```json
{
  "projectId": "string",
  "name": "string",
  "ok": "boolean",
  "lastUpdatedAt": "ISO timestamp",
  "gcpProjectId": "string",
  "git": {
    "head": "commit sha",
    "branch": "branch name"
  },
  "signals": {
    "hasStatusFile": true,
    "hasPackageJson": true,
    "hasSrc": true,
    "hasAgentConfigs": true,
    "hasTasks": true,
    "hasPDB": false
  }
}
```

---

## Development Standards

### Code Quality
- Functions: small, focused, < 50 lines
- Comments: explain "why", not "what"
- Follow DRY principle
- Follow existing patterns in the codebase

### Security
- Never commit API keys, tokens, or credentials
- Use environment variables for secrets
- Use GCP Secret Manager for production secrets
- Validate all user input
- Use parameterized queries

### A2UI (Agent-Generated UI)
- Use A2UI when agents control what UI renders (dynamic forms, adaptive dashboards, multi-panel layouts)
- Use Vercel AI SDK (`useChat`/`useCompletion`) for text/chat streaming — they are complementary
- Always validate component types against the Widget Registry catalog before rendering
- Separate data (data model) from structure (component tree) — never inline dynamic values
- Never embed raw PII in component trees — use data model path references
- Implement graceful degradation for non-A2UI clients (text-only fallback)
- See `docs/A2UI_GUIDE.md` for full implementation patterns and `@a2ui-specialist` for guidance

### Testing
- Write tests alongside implementation
- Test behavior, not implementation details
- Follow AAA pattern (Arrange, Act, Assert)

### GCP Best Practices
- Use Cloud Run for stateless containerized services
- Use Cloud SQL with connection pooling (Unix sockets from Cloud Run)
- Use Firebase Auth for client-facing authentication
- Use Secret Manager instead of .env files in production
- Follow IAM least-privilege principle
- Use Cloud Build for CI/CD pipelines

---

## Workflow

1. **Select a task**: Open `tasks/*.yml`, find `status: todo` with `priority: high`
2. **Read context**: Review `spec_refs`, `agent_roles`, `description`, `acceptance_criteria`
3. **Check role**: Adopt the appropriate agent role
4. **Implement**: Follow project conventions
5. **Verify**: Ensure all `acceptance_criteria` are met
6. **Propose done**: Update task `status: done` when complete

---

## Instruction Priority

When instructions conflict, apply this hierarchy:

1. **Security and correctness** — never skip auth checks, input validation, secret management
2. **User's explicit preferences** — override template defaults and agent suggestions
3. **Task acceptance criteria** — the task file defines "done"
4. **`CLAUDE.md` standards** — project-level conventions
5. **Agent-specific guidance** — the invoked agent's process and checklist
6. **Template defaults** — when nothing else applies

---

## Session Checklist

Before completing any task, verify:

- [ ] Task file updated with status and notes
- [ ] Relevant documentation updated
- [ ] Tests pass
- [ ] No hardcoded secrets or credentials
- [ ] Agent handoff notes added (if task has multiple `agent_roles`)
- [ ] Acceptance criteria reviewed and met

---

## Environment Variables

```bash
GCP_PROJECT_ID=your-gcp-project
FIREBASE_PROJECT_ID=your-firebase-project
GCP_REGION=us-central1
GOOGLE_APPLICATION_CREDENTIALS=./service-account.json
```

---

**To configure for your project**: Run `./scripts/setup.sh` from the repo root.
