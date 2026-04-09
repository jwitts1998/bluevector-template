# Claude Code Capabilities and Integrations

**Last Updated**: March 2026

## Overview

Claude Code extends what agents can do through **skills** (reusable workflows) and **MCP (Model Context Protocol) tools**. When a skill or MCP server is configured, its capabilities become available to all agents automatically — agents will use them when relevant to the task at hand.

This document lists the skills and capabilities currently available in this workspace. Keep it up to date when you add or remove skills so that agents and documentation stay aligned.

---

## Antigravity Awesome Skills (Optional)

[Antigravity Awesome Skills](https://github.com/sickn33/antigravity-awesome-skills) is a curated library of **946+ agentic skills** that can be installed alongside this template's project skills. It adds skills for architecture, security auditing, TDD, brainstorming, AWS/DevOps, React patterns, and more — complementary to Claude Code skills.

**Install** (project-level):
```bash
./scripts/install-antigravity-skills.sh
```

**Install** (user-level, all projects):
```bash
./scripts/install-antigravity-skills.sh --global
```

Skills merge into `.claude/skills/`; project skills (`calibrate-domains`, `domain-routing`, `feature-audit`, `descript-inspired-captions`, etc.) are preserved. Use `/skill-name` in Claude Code CLI. Browse [docs/BUNDLES.md](https://github.com/sickn33/antigravity-awesome-skills/blob/main/docs/BUNDLES.md) for curated role-based bundles.

---

## Idea Reality Check MCP (Optional)

[idea-reality-mcp](https://github.com/mnemox-ai/idea-reality-mcp) reality-checks AI project ideas against GitHub, Hacker News, npm, PyPI, and Product Hunt. Returns a 0–100 reality signal, duplicate likelihood, similar projects, and pivot hints. Pre-configured in `.claude/mcp.json`; requires [uv](https://docs.astral.sh/uv/) (provides `uvx`).

**Install uv** ([full installation guide](https://docs.astral.sh/uv/getting-started/installation/)):

| Platform | Command |
|----------|---------|
| macOS/Linux (standalone) | `curl -LsSf https://astral.sh/uv/install.sh \| sh` |
| macOS (Homebrew) | `brew install uv` |
| Windows (Scoop) | `scoop install main/uv` |
| Windows (WinGet) | `winget install --id=astral-sh.uv -e` |

After installing, restart Claude Code. Optional: set `GITHUB_TOKEN` and `PRODUCTHUNT_TOKEN` for higher rate limits and deep mode.

---

## MCP Servers

MCP servers provide tool-level integrations that agents call directly.

| Server | Capabilities |
|--------|-------------|
| **Claude Code browser** | Browser automation — navigate pages, take snapshots, click elements, fill forms, type text, take screenshots. Useful for frontend testing and web interaction. |
| **Context7** | Fetch up-to-date documentation and code examples for any library or framework. Resolve a library ID, then query its docs. |
| **idea-reality** | Reality-checks AI project ideas against GitHub, Hacker News, npm, PyPI, and Product Hunt. Returns a 0–100 reality signal, duplicate likelihood, similar projects, and pivot hints. Use when users discuss new ideas or ask about competition. |

---

## Skills by Area

### Research and Web

| Skill | What It Does |
|-------|-------------|
| **parallel-web-search** | Default for any lookup or research query. Fast, cost-effective web search. |
| **parallel-deep-research** | Exhaustive, multi-source research. Use only when explicitly asked for "deep" or "comprehensive" research. |
| **parallel-web-extract** | Fetch and extract content from any URL (articles, pages, PDFs). Token-efficient. |
| **citation-standards** | Format and cite web search results consistently. |

### Testing and QA

| Skill | What It Does |
|-------|-------------|
| **BrowserStack Automate** | Run automated web tests on real browsers across platforms (Selenium, Playwright, Cypress). |
| **BrowserStack App Automate** | Run mobile app tests on real devices (Appium, Espresso, XCUITest). |
| **BrowserStack Accessibility** | Scan pages for WCAG violations and generate fix suggestions. |
| **BrowserStack Percy** | Visual regression testing — capture screenshots, detect visual changes, approve/reject builds. |
| **BrowserStack Test Management** | Create projects, folders, test cases, test runs, and track results. |
| **run-web-tests-on-browserstack** | Skill for setting up and running web test suites on BrowserStack. |
| **run-mobile-tests-on-browserstack** | Skill for running mobile test suites on BrowserStack. |
| **scan-and-fix-accessibility** | Skill for scanning pages and generating accessibility fixes. |

### Design and Frontend

| Skill | What It Does |
|-------|-------------|
| **implement-design** | Translate Stitch designs into production code with 1:1 visual fidelity. |
| **code-connect-components** | Connect Stitch design components to code components via DESIGN.md. |
| **create-design-system-rules** | Generate project-specific design system rules from Stitch. |
| **frontend-design** | Create distinctive, production-grade frontend interfaces with high design quality. |
| **vercel-react-best-practices** | React and Next.js performance optimization patterns from Vercel Engineering. |

**Design resources**: [docs/DESIGN_RESOURCES.md](DESIGN_RESOURCES.md) lists Square UI, Shadcnblocks, Kibo UI, Magic UI, and related templates. Use these as reference when implementing dashboards, panels, or data-heavy UIs in `tools/explorer` or project templates.

### Documentation and Learning

| Skill | What It Does |
|-------|-------------|
| **documentation-lookup** (Context7) | Look up library docs, API references, and code examples for any framework. |
| **create-rule** | Create Claude Code rules for persistent AI guidance (`.claude/rules/`). |
| **create-skill** | Author new agent skills with proper structure and best practices. |

### Workflow and Process

| Skill | What It Does |
|-------|-------------|
| **brainstorming** | Explore intent, approaches, and design decisions before implementation. |
| **writing-plans** | Create structured implementation plans from specs or requirements. |
| **executing-plans** | Execute implementation plans with review checkpoints. |
| **subagent-driven-development** | Execute plans with independent tasks using parallel subagents. |
| **test-driven-development** | Write tests before implementation code. |
| **systematic-debugging** | Investigate bugs and failures methodically before proposing fixes. |
| **requesting-code-review** | Request structured code review after completing work. |
| **receiving-code-review** | Process code review feedback with technical rigor. |
| **verification-before-completion** | Run verification commands and confirm output before claiming success. |
| **finishing-a-development-branch** | Guide branch completion — merge, PR, or cleanup. |
| **feature-audit** | Run a full feature health check on a task file (spec alignment, code quality, security, testing, docs, domain consultation). Use before release or for pre-merge verification. |
| **descript-inspired-captions** | Convert Descript screenshots to CogD features. Runs design-iterator → brainstorming → writing-plans → spec-flow-analyzer → repo-research-analyst → task creation → subagent-driven-development with file-based handoffs. |
| **using-git-worktrees** | Create isolated git worktrees for parallel feature work. |
| **dispatching-parallel-agents** | Run 2+ independent tasks in parallel when no shared state is needed. |
| **continual-learning** | Mine past chat transcripts for recurring corrections and durable facts, then update AGENTS.md. |

### Stack-Specific

| Skill | What It Does |
|-------|-------------|
| **stripe-best-practices** | Best practices for building Stripe payment integrations. |
| **upgrade-stripe** | Guide for upgrading Stripe API versions and SDKs. |
| **cloud-sql-postgres-best-practices** | Postgres performance optimization and best practices for Cloud SQL. |
| **dhh-rails-style** | Ruby and Rails code in DHH's 37signals style. |
| **dspy-ruby** | Build type-safe LLM applications with DSPy.rb in Ruby. |
| **andrew-kane-gem-writer** | Write Ruby gems following Andrew Kane's patterns. |

### Other

| Skill | What It Does |
|-------|-------------|
| **agent-browser** | Browse websites, fill forms, click buttons, take screenshots via CLI. |
| **gemini-imagegen** | Generate and edit images using the Gemini API. |
| **rclone** | Upload, sync, and manage files across cloud storage (S3, R2, GCS, etc.). |
| **every-style-editor** | Review and edit text content to conform to Every's editorial style guide. |
| **create-plugin-scaffold** | Create a new skill scaffold with manifest and structure. |
| **review-plugin-submission** | Audit a skill for marketplace readiness. |
| **apply-multi-agent-template** | Deploy the multi-agent system template into a target project. |

---

## Gap Identification

Agents should actively identify when installing a plugin, creating a custom skill, or exposing an MCP server would improve development quality or velocity. Use these guidelines:

### When to Install an Existing Plugin

- The project uses a framework, service, or tool (e.g., Stripe, Firebase, Google Stitch, a specific testing framework) that has a Claude Code skill but it is not listed above
- Agents are performing tasks manually that a plugin automates — accessibility scanning, visual regression testing, docs lookup, cross-browser testing, design-to-code translation
- A new dependency or integration has been added to the project and a corresponding plugin exists

### When to Create a Custom Skill

- A multi-step workflow is repeated across tasks (e.g., a specific deployment sequence, data migration pattern, code generation recipe) and would benefit from codification
- Project-specific domain knowledge — naming conventions, validation rules, architecture decisions, code patterns — is being re-derived each session instead of encoded once
- Agents make the same mistakes repeatedly because conventions are not persisted in a skill
- Use the `create-skill` workflow skill to author new skills with proper structure

### When to Expose an MCP Server

- Agents frequently shell out to a project CLI, database client, or internal API — structured MCP access would be safer and more efficient
- Multiple agents need the same tool access and each builds ad-hoc shell commands independently
- The project has tools that would benefit from structured input/output rather than raw terminal interaction

### After Installing or Creating

Update this file (`docs/CLAUDE_CODE_CAPABILITIES.md`) with the new capability so all agents are aware. Add entries to the appropriate section above (MCP Servers, Skills by Area) with a brief description of what it does.

---

## Maintaining This List

**When you install a new plugin**: Add its skills and/or MCP tools to the appropriate section above. You can see what a plugin provides by checking the skills and tools that appear in your Claude Code session after installation.

**When you remove a plugin**: Delete its entries from this list so agents don't reference unavailable capabilities.

**Project-specific customization**: Remove entries for plugins you don't use (e.g., remove Stripe skills if you don't process payments, remove Stitch design skills if you don't use Stitch for design). This keeps agent context focused on what's actually available.
