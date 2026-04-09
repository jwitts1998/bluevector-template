# BlueVector AI — GCP Consulting Toolkit

A comprehensive template for AI-assisted software development on Google Cloud Platform, combining:

- **Multi-Agent Development System** — 52 specialized subagents for ideation, implementation, testing, and documentation
- **GCP-First Infrastructure** — Cloud Run, Cloud SQL, Firebase Auth, Firebase Hosting
- **28 MCP Servers** — Full stack of AI capabilities across 10 tiers
- **Antigravity IDE** — First-class support with 946+ agentic skills

## Quick Start

```bash
# Clone the template
git clone https://github.com/bluevector-ai/bluevector-template.git my-project
cd my-project

# Run interactive setup
./scripts/setup.sh

# Install Antigravity IDE skills (optional but recommended)
./scripts/install-antigravity-skills.sh

# Start developing
claude .
```

## Features

### Multi-Agent Development
- **4 Core Roles**: Implementation, QA, Testing, Documentation
- **52 Subagents**: Specialized agents for every development phase
- **Domain Routing**: 17 vertical domain experts auto-suggested by context
- **Idea-to-Implementation**: Full pipeline from idea to deployed code

### GCP-First Infrastructure
- **Cloud Run**: Serverless container deployment for backends and full-stack apps
- **Cloud SQL**: Managed PostgreSQL for relational data
- **Firebase Auth**: Client-facing authentication with Google, email, and social providers
- **Firebase Hosting**: CDN-backed hosting for web frontends
- **Cloud Functions**: Event-driven serverless for mobile and lightweight backends
- **Secret Manager**: Production secret management (replaces .env files)

### IDE Support
- **Antigravity IDE** (Primary): 946+ agentic skills via `sickn33/antigravity-awesome-skills`
- **Claude Code**: Full integration with subagents, MCP servers, rules, and skills
- See `docs/ANTIGRAVITY_SETUP_GUIDE.md` for Antigravity setup
- See `docs/IDE_MIGRATION_GUIDE.md` for migrating from Cursor or VS Code

### MCP Ecosystem
- **Tier 1**: Essential (Context7, Sequential Thinking, GitHub)
- **Tier 2**: UI/UX (Google Stitch, Shadcn, 21st.dev)
- **Tier 3**: Codebase Intelligence (TNG, Codebase Checkup)
- **Tier 4**: Security (Snyk, SonarQube)
- **Tier 5**: Task Orchestration (Workflows, Linear, Notion)
- **Tier 6**: GCP Backend (Firebase, SQLite, E2B Sandbox)
- **Tier 7**: Observability (Sentry, Datadog)
- **Tier 8**: Documentation (Mintlify, AWS Code Doc Gen)
- **Tier 9**: CI/CD (GitHub Actions, GitLab)
- **Tier 10**: Data Ingestion (Firecrawl)

## Directory Structure

```
.claude/
├── rules/              # Token efficiency, domain routing, GCP best practices
├── skills/             # Claude Code skills
├── agents/             # Active subagent configs
└── settings.json       # Permissions

.antigravity/           # Antigravity IDE configuration
├── settings.json       # IDE settings

templates/              # Template library
├── claude-config/      # CLAUDE.md variants
├── subagents/          # All subagent configs
└── tasks/              # Task schema templates

status/
├── status.json         # Machine-readable project status
└── progress.md         # Human-readable log

tasks/                  # YAML task files
docs/                   # Documentation
src/                    # Business code
scripts/                # Setup and utilities
examples/               # Example configs
```

## Project Types

Run `./scripts/setup.sh` and choose your project type:

| Type | Default Stack | GCP Services |
|------|--------------|--------------|
| **Mobile** | Flutter, Dart, Riverpod | Firebase + Cloud Functions |
| **Web** | React, TypeScript | Firebase Hosting + Cloud Run |
| **Backend** | Express, TypeScript | Cloud Run + Cloud SQL |
| **Full-Stack** | Next.js, TypeScript | Cloud Run + Cloud SQL + Firebase Auth |

## Environment Variables

Create `.env` with:

```bash
# GCP Configuration
GCP_PROJECT_ID=your-gcp-project
FIREBASE_PROJECT_ID=your-firebase-project
GCP_REGION=us-central1
GOOGLE_APPLICATION_CREDENTIALS=./service-account.json

# MCP API Keys (add as needed)
GITHUB_PERSONAL_ACCESS_TOKEN=...
STITCH_API_KEY=...
# See docs/MCP_SETUP_GUIDE.md for full list
```

## Workflow

1. **Create Goal**: Define high-level objective
2. **Decompose**: AI breaks into tasks via `@idea-to-pdb` then `@pdb-to-tasks`
3. **Implement**: Work through tasks with specialized agents
4. **Deploy**: Deploy to GCP via Cloud Run / Firebase Hosting
5. **Complete**: Mark tasks done, update progress

## Documentation

- [`CLAUDE.md`](./CLAUDE.md) — Project rules and standards
- [`AGENTS.md`](./AGENTS.md) — Agent roles and protocols
- [`docs/GCP_SETUP_GUIDE.md`](./docs/GCP_SETUP_GUIDE.md) — GCP project setup
- [`docs/ANTIGRAVITY_SETUP_GUIDE.md`](./docs/ANTIGRAVITY_SETUP_GUIDE.md) — Antigravity IDE setup
- [`docs/MCP_SETUP_GUIDE.md`](./docs/MCP_SETUP_GUIDE.md) — MCP configuration
- [`docs/IDEA_TO_PDB.md`](./docs/IDEA_TO_PDB.md) — Idea-to-PDB workflow
- [`docs/INTEGRATION_GUIDE.md`](./docs/INTEGRATION_GUIDE.md) — Full integration guide

## License

MIT
