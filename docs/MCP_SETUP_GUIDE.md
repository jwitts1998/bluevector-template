# MCP Server Setup Guide

Complete guide for configuring all MCP servers in the multi-agent system, with special emphasis on UI/UX and creative design capabilities.

---

## Quick Start: Essential 5 (Start Here)

Install these first for immediate productivity gains:

```bash
# 1. Context7 - Real-time documentation (eliminates hallucinations)
# No API key needed - works immediately
claude mcp add context7 -- npx -y @context7/mcp

# 2. Sequential Thinking - Multi-step reasoning for complex problems
# No API key needed
claude mcp add sequential-thinking -- npx -y @modelcontextprotocol/server-sequential-thinking

# 3. Google Stitch - Design-to-code with structural metadata
# Requires STITCH_API_KEY (see setup below)
claude mcp add stitch -- npx -y @_davideast/stitch-mcp

# 4. GitHub - Repository management
# Requires GITHUB_PERSONAL_ACCESS_TOKEN
claude mcp add github -- npx -y @modelcontextprotocol/server-github

# 5. Filesystem - Local file operations
# No API key needed - configure paths
claude mcp add filesystem -- npx -y @modelcontextprotocol/server-filesystem /Users/jacksonwittenberg/dev/projects
```

---

## UI/UX & Creative Design Stack

### **Why AI Struggles with Frontend Design**

Traditional LLMs often produce:
- Generic, template-looking UIs
- Poor spacing and typography
- Inconsistent design systems
- Lack of creative/abstract approaches
- No awareness of modern UI patterns

**Solution**: These MCP servers provide:
1. **Structural design intelligence** (Stitch MCP)
2. **Production-ready components** (Shadcn)
3. **Modern UI pattern generation** (21st.dev Magic)
4. **Real-time framework docs** (Context7)

---

### 1. Stitch MCP - The Foundation

**What it provides:**
- Direct access to Stitch file metadata (frames, layers, constraints)
- DESIGN.md integration (maps designs → real components)
- Typography, color, and spacing specifications
- Auto Layouts and responsive constraints

**Setup:**

```bash
# Get Google Stitch Access Token
# 1. Get a Stitch API key or run: npx @_davideast/stitch-mcp init
# 2. Click "Get personal access token"
# 3. Name it "Claude Code MCP" and generate

# Add to environment
export STITCH_API_KEY="your-token-here"

# Install
claude mcp add stitch -- npx -y @_davideast/stitch-mcp
```

**How to use for creative design:**

1. **Design exploration in Stitch first**
   - Create 2-3 visual directions/variants
   - Use Auto Layout for responsive behavior
   - Define color styles and typography scales

2. **Ask Claude to analyze designs:**
   ```
   Using Stitch MCP, review the "Hero Section" frame in file ABC123.
   Analyze the visual hierarchy, spacing system, and typography.
   Suggest 3 more creative/abstract variations that maintain the brand feel.
   ```

3. **Generate implementation with DESIGN.md:**
   ```
   Implement the "Product Card" component using our existing design system.
   Use DESIGN.md to map to the correct React components.
   ```

**Pro Tips:**
- Use Google Stitch Variants for state management (hover, active, disabled)
- Set up DESIGN.md in your repo for accurate component mapping
- Create reusable component libraries in Stitch for consistency

---

### 2. Shadcn Registry - Production UI Components

**What it provides:**
- 50+ accessible, high-quality React components
- Radix UI primitives (WAI-ARIA compliant)
- Tailwind CSS styling (fully customizable)
- Copy-paste ready, not an npm package

**Setup:**

```bash
# No API key needed
claude mcp add shadcn -- npx -y shadcn-mcp
```

**How to use for clean frontends:**

```
Build a data table with sorting, filtering, and pagination.
Use Shadcn components for a clean, accessible implementation.
```

```
Create a multi-step form wizard with validation.
Use Shadcn's Card, Form, and Button components.
Apply a modern, minimalist aesthetic.
```

**Available components:**
- Forms: Input, Select, Checkbox, Radio, Textarea, DatePicker
- Data Display: Table, Card, Badge, Avatar, Tooltip
- Feedback: Alert, Dialog, Toast, Progress
- Layout: Tabs, Accordion, Separator, ScrollArea
- Navigation: Command, DropdownMenu, NavigationMenu

---

### 3. 21st.dev Magic - Creative UI Patterns

**What it provides:**
- AI-generated modern UI patterns
- Creative layouts beyond templates
- Responsive grid systems
- Micro-interactions and animations

**Setup:**

```bash
# No API key needed
claude mcp add magic-21st -- npx -y @21st-dev/magic-mcp
```

**How to use for abstract/creative approaches:**

```
Design a portfolio landing page with an unconventional scroll-triggered layout.
Use 21st.dev Magic to explore creative navigation patterns.
Incorporate parallax effects and asymmetric grids.
```

```
Create a product showcase with an experimental card design.
Use abstract geometric shapes and gradient overlays.
Make it feel modern and artistic, not corporate.
```

**Best for:**
- Landing pages with personality
- Portfolio sites
- Creative product showcases
- Marketing pages
- Experimental UI explorations

---

### 4. Context7 - Real-time Framework Docs

**What it provides:**
- Up-to-date documentation for 1000+ libraries
- Latest API specifications (Next.js 15, React 19, Tailwind 4, etc.)
- Eliminates outdated training data hallucinations

**Setup:**

```bash
# No API key needed - works immediately
claude mcp add context7 -- npx -y @context7/mcp
```

**How it helps with modern UI:**

```
Build a Next.js 15 app with the new App Router.
Use Context7 to get the latest Server Components API.
```

```
Implement Tailwind CSS 4.0 with the new @theme directive.
Context7 will provide the current syntax and best practices.
```

**Supported frameworks (always latest):**
- React 19, Next.js 15, Remix, Astro
- Tailwind CSS 4.0, Shadcn UI
- Framer Motion, GSAP
- Three.js, React Three Fiber
- Firebase, Cloud SQL, Prisma

---

## Tier 1: Essential Core Capabilities

### Sequential Thinking MCP

**Purpose**: Multi-step reasoning for complex architectural decisions

**Setup:**
```bash
# No API key needed
claude mcp add sequential-thinking -- npx -y @modelcontextprotocol/server-sequential-thinking
```

**Use cases:**
- Breaking down complex features into steps
- Evaluating multiple architectural approaches
- Risk analysis before implementation
- Debugging complex issues

**Example:**
```
Use sequential thinking to plan a real-time notification system.
Consider scalability, reliability, and user experience.
```

---

### GitHub MCP

**Purpose**: Repository management, PR reviews, CI/CD integration

**Setup:**

```bash
# Get GitHub Personal Access Token
# 1. Go to https://github.com/settings/tokens
# 2. Generate new token (classic)
# 3. Scopes needed: repo, workflow, read:org

export GITHUB_PERSONAL_ACCESS_TOKEN="ghp_your_token"

claude mcp add github -- npx -y @modelcontextprotocol/server-github
```

**Use cases:**
- Search repositories
- Create/manage branches
- Review PRs
- Manage issues
- Trigger workflows

---

### Filesystem MCP

**Purpose**: Local file operations across project directories

**Setup:**

```bash
# Configure with your projects directory
claude mcp add filesystem -- npx -y @modelcontextprotocol/server-filesystem /Users/jacksonwittenberg/dev/projects
```

**Note**: This is already configured in your .mcp.json

---

## Tier 2: Codebase Intelligence

### TNG.sh MCP - Framework-Aware Auditor

**Purpose**: Deep structural analysis of codebases (identifies hidden side effects, N+1 queries, dead code)

**Setup:**

```bash
# Get TNG API key from https://tng.sh
export TNG_API_KEY="your-key"

claude mcp add tng -- npx -y @tng/mcp-server
```

**Use cases:**
- Audit legacy Rails/Django apps
- Find N+1 query patterns
- Trace method dependencies
- Identify dead code hidden by metaprogramming

---

### Codebase Checkup MCP - 10-Phase Audit

**Purpose**: Autonomous codebase audit with fix plan generation

**Setup:**

```bash
# No API key needed
claude mcp add codebase-checkup -- npx -y @alfahadgm/codebase-checkup-mcp
```

**Audit phases:**
1. Architecture review
2. Test coverage analysis
3. Security vulnerability scan
4. Performance bottlenecks
5. Code quality metrics
6. Documentation gaps
7. Dependency health
8. Build pipeline review
9. Deployment readiness
10. Prioritized fix plan

**Example:**
```
Run a complete codebase checkup on the current project.
Generate a prioritized fix plan for technical debt.
```

---

### Code Indexer MCP - Local Code Search

**Purpose**: Fast, local code indexing with ripgrep

**Setup:**

```bash
# No API key needed
claude mcp add code-indexer -- npx -y @johnhuang/code-indexer-mcp
```

**Use cases:**
- Find definitions across monorepos
- Trace imports and dependencies
- Extract class hierarchies
- Search without exceeding context limits

---

## Tier 3: Security & Quality (Secure at Inception)

### Snyk MCP - Auto-Fix Security Vulnerabilities

**Purpose**: Scan and automatically patch security issues

**Setup:**

```bash
# Get Snyk token from https://app.snyk.io/account
export SNYK_TOKEN="your-token"

claude mcp add snyk -- npx -y snyk@latest mcp --tool=claude-cli --rule-type=smart-apply
```

**"Smart Apply" rules:**
- Auto-scan after significant code changes
- Auto-fix known vulnerabilities
- Re-scan to verify fixes
- Works with: Code, Dependencies, Containers, IaC

**Scan types:**
- `snyk_code_scan` - SQL injection, XSS, insecure logic
- `snyk_sca_scan` - Vulnerable npm/pypi packages
- `snyk_container_scan` - Docker image security
- `snyk_iac_scan` - Terraform/CloudFormation misconfigs

---

### SonarQube MCP - Code Quality

**Purpose**: Code quality analysis and technical debt tracking

**Setup:**

```bash
# Get SonarQube credentials from your instance
export SONAR_TOKEN="your-token"
export SONAR_HOST_URL="https://your-sonarqube-instance.com"

claude mcp add sonarqube -- npx -y @sonarsource/mcp-server-sonarqube
```

**Use cases:**
- Code smell detection
- Bug pattern analysis
- Security hotspot identification
- Technical debt quantification

---

## Tier 4: Task Orchestration & Workflows

### Cyanheads Workflows MCP - Declarative YAML Workflows

**Purpose**: Define complex multi-step workflows in YAML

**Setup:**

```bash
# No API key needed
claude mcp add workflows -- npx -y @cyanheads/workflows-mcp-server
```

**Example workflow:**

```yaml
# .claude/workflows/new-feature.yml
name: New Feature Development
steps:
  - name: Design Review
    tool: stitch
    action: analyze_design

  - name: Generate Components
    tool: shadcn
    action: scaffold_ui

  - name: Implement Logic
    tool: context7
    action: generate_code

  - name: Security Scan
    tool: snyk
    action: scan_and_fix

  - name: Create PR
    tool: github
    action: create_pull_request
```

**Use case:**
```
Execute the "new-feature" workflow for the user dashboard.
```

---

### Task Orchestrator MCP - Persistent State

**Purpose**: SQLite-backed memory for long-running projects

**Setup:**

```bash
# No API key needed
claude mcp add task-orchestrator -- npx -y @echoingvesper/mcp-task-orchestrator
```

**Use cases:**
- Remember architectural decisions across sessions
- Track implementation progress
- Maintain context during multi-day projects

---

### Linear MCP - Task Management

**Purpose**: Sync with Linear for issue tracking

**Setup:**

```bash
# Get Linear API key from https://linear.app/settings/api
export LINEAR_API_KEY="lin_api_your_key"

claude mcp add linear -- npx -y @linear/mcp
```

**Use cases:**
- Create issues from PDB
- Sync task status
- Generate sprint roadmaps

---

### Notion MCP - Documentation

**Purpose**: Store PDBs, meeting notes, project docs

**Setup:**

```bash
# Get Notion API key from https://www.notion.so/my-integrations
export NOTION_API_KEY="secret_your_key"

claude mcp add notion -- npx -y @notionhq/mcp-server
```

---

## Tier 5: Backend & Deployment

### Firebase MCP - Backend Services

**Purpose**: Firebase Auth, Firestore, Cloud Functions, Hosting, Storage

**Setup:**

```bash
# Get credentials from https://console.firebase.google.com
export FIREBASE_PROJECT_ID="your-project-id"

claude mcp add firebase -- npx -y @firebase/mcp-server
```

**Use cases:**
- Configure Firebase Auth (email, Google, social providers)
- Manage Firestore collections and security rules
- Deploy Cloud Functions
- Set up Firebase Hosting with Cloud Run rewrites
- Manage Cloud Storage buckets

---

### SQLite MCP - Local Database

**Purpose**: Prototype with SQLite before production DB

**Setup:**

```bash
# No API key needed
claude mcp add sqlite -- npx -y @modelcontextprotocol/server-sqlite
```

---

## Tier 6: Observability & Monitoring

### Sentry MCP - Error Tracking

**Purpose**: Production error monitoring and debugging

**Setup:**

```bash
# Get credentials from https://sentry.io/settings/account/api/auth-tokens/
export SENTRY_AUTH_TOKEN="your-token"
export SENTRY_ORG="your-org-slug"

claude mcp add sentry -- npx -y @sentry/mcp-server
```

**Closed-loop debugging:**
```
Check Sentry for errors in the last 24 hours.
Fix the top 3 most frequent issues.
Deploy fixes and verify error rate decreased.
```

---

### Datadog MCP - Performance Monitoring

**Purpose**: APM, logs, and infrastructure monitoring

**Setup:**

```bash
# Get API keys from https://app.datadoghq.com/organization-settings/api-keys
export DD_API_KEY="your-api-key"
export DD_APP_KEY="your-app-key"

claude mcp add datadog -- npx -y @datadog/mcp-server
```

---

## Tier 7: Documentation Generation

### Mintlify MCP - Doc Sites

**Purpose**: Auto-generate documentation sites

**Setup:**

```bash
# No API key needed
claude mcp add mintlify -- npx -y @mintlify/mcp-server
```

---

### AWS Code-Doc-Gen - README & API Docs

**Purpose**: Generate structured documentation from code

**Setup:**

```bash
# No API key needed
claude mcp add aws-code-doc-gen -- npx -y @aws/code-doc-gen-mcp
```

---

## Tier 8: CI/CD & DevOps

### GitHub Actions MCP - Workflow Intelligence

**Purpose**: Monitor CI/CD, diagnose build failures

**Setup:**

```bash
# Uses same GITHUB_PERSONAL_ACCESS_TOKEN as GitHub MCP
claude mcp add github-actions -- npx -y @github/actions-mcp
```

**Tools:**
- `gha_diagnose_failure` - Analyze failed builds
- `gha_get_workflow_logs` - Fetch CI logs
- `gha_trigger_workflow` - Manual workflow dispatch

---

### GitLab MCP - Alternative Git Provider

**Purpose**: For teams using GitLab instead of GitHub

**Setup:**

```bash
# Get token from https://gitlab.com/-/profile/personal_access_tokens
export GITLAB_PERSONAL_ACCESS_TOKEN="glpat-your-token"

claude mcp add gitlab -- npx -y @gitlab/mcp-server
```

---

## Installation Strategies

### Strategy 1: Phased Rollout (Recommended)

**Week 1 - Essential 5:**
```bash
claude mcp add context7 -- npx -y @context7/mcp
claude mcp add sequential-thinking -- npx -y @modelcontextprotocol/server-sequential-thinking
claude mcp add stitch -- npx -y @_davideast/stitch-mcp
claude mcp add github -- npx -y @modelcontextprotocol/server-github
claude mcp add filesystem -- npx -y @modelcontextprotocol/server-filesystem /Users/jacksonwittenberg/dev/projects
```

**Week 2 - UI/UX Stack:**
```bash
claude mcp add shadcn -- npx -y shadcn-mcp
claude mcp add magic-21st -- npx -y @21st-dev/magic-mcp
```

**Week 3 - Codebase Intelligence:**
```bash
claude mcp add tng -- npx -y @tng/mcp-server
claude mcp add codebase-checkup -- npx -y @alfahadgm/codebase-checkup-mcp
claude mcp add code-indexer -- npx -y @johnhuang/code-indexer-mcp
```

**Week 4 - Security & Quality:**
```bash
claude mcp add snyk -- npx -y snyk@latest mcp --tool=claude-cli --rule-type=smart-apply
claude mcp add sonarqube -- npx -y @sonarsource/mcp-server-sonarqube
```

### Strategy 2: Install All Now, Enable Selectively

The .mcp.json is already configured with all servers. To prevent context bloat:

```bash
# Enable experimental MCP CLI (only loads tools when needed)
export ENABLE_EXPERIMENTAL_MCP_CLI=true
```

This prevents all 30+ MCP servers from loading simultaneously, reducing context window usage.

---

## Verification & Testing

After installing MCPs, verify they work:

```bash
# Start Claude Code
claude

# Test each MCP category
```

**Test Context7:**
```
What are the new features in Next.js 15?
```
Expected: Accurate, up-to-date information about App Router, Server Actions, etc.

**Test Stitch:**
```
List my recent Google Stitch files.
```
Expected: Returns your actual Google Stitch files (requires STITCH_API_KEY)

**Test Sequential Thinking:**
```
Use sequential thinking to evaluate: Should we use REST or GraphQL for our API?
```
Expected: Multi-step reasoning with branching thoughts

**Test Shadcn:**
```
Show me available Shadcn components for data tables.
```
Expected: Lists table-related components with usage examples

---

## Environment Variables Management

Create a `.env.mcp` file for centralized API key management:

```bash
# .env.mcp
export STITCH_API_KEY="figd_your_token"
export GITHUB_PERSONAL_ACCESS_TOKEN="ghp_your_token"
export TNG_API_KEY="your_tng_key"
export SNYK_TOKEN="your_snyk_token"
export SONAR_TOKEN="your_sonar_token"
export SONAR_HOST_URL="https://sonarqube.yourcompany.com"
export LINEAR_API_KEY="lin_api_your_key"
export NOTION_API_KEY="secret_your_key"
export SUPABASE_URL="https://your-project.supabase.co"
export SUPABASE_KEY="your_anon_key"
export E2B_API_KEY="your_e2b_key"
export VERCEL_TOKEN="your_vercel_token"
export SENTRY_AUTH_TOKEN="your_sentry_token"
export SENTRY_ORG="your_org"
export DD_API_KEY="your_dd_api_key"
export DD_APP_KEY="your_dd_app_key"
export GITLAB_PERSONAL_ACCESS_TOKEN="glpat_your_token"
```

**Load before starting Claude:**

```bash
source .env.mcp && claude
```

---

## Special: Improving AI's UI/UX Capabilities

### The Creative Design Workflow

**Step 1: Design Exploration in Stitch**
- Create 3-5 visual directions
- Use abstract shapes, asymmetric layouts, creative grids
- Define color systems with personality
- Set up responsive Auto Layouts

**Step 2: Analysis with Stitch MCP**
```
Analyze these 5 design variants in Stitch file XYZ.
Which one has the strongest visual hierarchy?
What makes the spacing system effective?
How can we make it even more creative without losing usability?
```

**Step 3: Implementation with Context + Components**
```
Implement Variant 3 using:
- Latest Tailwind CSS 4 (via Context7)
- Shadcn components for accessibility
- Custom animations for personality
- Responsive grid from 21st.dev Magic

Make it feel modern and artistic, not corporate.
```

**Step 4: Iteration with Sequential Thinking**
```
Use sequential thinking to evaluate:
How can we make this interface more memorable and delightful?
Consider micro-interactions, color psychology, and spatial creativity.
```

### Prompt Strategies for Better UI

**❌ Generic prompt:**
```
Create a login page.
```

**✅ Creative prompt:**
```
Design a login page with:
- Asymmetric layout using a 60/40 split
- Gradient mesh background (modern, not 2010s)
- Glassmorphism for the form container
- Micro-interactions on input focus
- Use Shadcn components for accessibility
- Reference 21st.dev Magic for creative patterns
- Check Stitch designs for color palette
```

**❌ Generic prompt:**
```
Build a pricing table.
```

**✅ Creative prompt:**
```
Create a pricing table that breaks convention:
- Cards with perspective tilt on hover
- Non-linear layout (not strict grid)
- Animated gradient borders
- Feature comparison uses icons, not checkmarks
- Use Shadcn for base components
- Add Framer Motion for animations (check Context7 for latest API)
- Inspiration: Stripe, Linear, Vercel pricing pages
```

---

## Next Steps

1. **Install Essential 5** (Context7, Sequential Thinking, Google Stitch, GitHub, Filesystem)
2. **Configure API keys** for Google Stitch and GitHub
3. **Test UI/UX workflow** with a sample design
4. **Phase in remaining MCPs** based on project needs
5. **Update CLAUDE.md** to reference new MCP capabilities

---

## Troubleshooting

**MCP server not connecting:**
```bash
# Check if npx can resolve the package
npx -y @context7/mcp --help

# Check environment variables
echo $STITCH_API_KEY

# Restart Claude Code
claude
```

**Context window issues with too many MCPs:**
```bash
# Enable experimental CLI to load tools on-demand
export ENABLE_EXPERIMENTAL_MCP_CLI=true
```

**API key errors:**
```bash
# Verify tokens are exported
env | grep TOKEN

# Source .env.mcp before starting Claude
source .env.mcp && claude
```

---

**Total MCPs configured**: 30
**Requires API keys**: 15
**Works immediately**: 15
**Recommended first 5**: Context7, Sequential Thinking, Google Stitch, GitHub, Filesystem
