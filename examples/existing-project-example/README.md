# Existing Project Example — ShopFront

A complete walkthrough of applying the multi-agent system template to an **existing codebase** that has code but no formal Product Design Blueprint.

This covers **Paths D/E/F** from the Setup Guide — you already have a project and want to add multi-agent development to it.

## The Situation

You have an existing e-commerce storefront called **ShopFront**:
- **Built with**: Next.js + TypeScript, Prisma + PostgreSQL, Stripe
- **State**: Working production code, basic README, no formal design docs
- **Problem**: You want to add features faster and maintain quality as the project grows

Your project already lives at `~/dev/shopfront/` with its own git history.

---

## How This Differs from Net-New

For **net-new ideas**, you clone the template repo and it becomes your project. For **existing projects**, you copy template files *into* your project — the template stays separate as a reference library.

```
# Net-new (clone-and-become):
git clone template.git my-project    # Template IS the project

# Existing project (copy-from):
~/dev/multi-agent-system-template/   # Template stays here
~/dev/shopfront/                     # Your project gets template files copied in
```

---

## Step 1: Install the Template (One-Time)

If you haven't already, place the template somewhere central:

```bash
cd ~/dev
git clone https://github.com/jwitts1998/multi-agent-system-template.git

# Add to ~/.zshrc for convenience
echo 'export TEMPLATE_DIR=~/dev/multi-agent-system-template' >> ~/.zshrc
source ~/.zshrc
```

## Step 2: Copy Template Files into Your Project

```bash
cd ~/dev/shopfront

# Copy CLAUDE.md (choose your project type)
cp $TEMPLATE_DIR/templates/claude-config/full-stackCLAUDE.md CLAUDE.md

# Copy AGENTS.md
cp $TEMPLATE_DIR/templates/agents/AGENTS-full-stack.md AGENTS.md

# Copy task schema
cp $TEMPLATE_DIR/templates/tasks/tasks-schema.yml tasks.yml

# Create directories
mkdir -p tasks docs/product_design docs/architecture docs/workflow .claude/agents/generic .claude/agents/ingestion .claude/agents/ideation

# Copy subagents
cp $TEMPLATE_DIR/templates/subagents/generic/*.md .claude/agents/generic/
cp $TEMPLATE_DIR/templates/subagents/ideation/*.md .claude/agents/ideation/

# Copy ingestion agents (you'll need these to generate a PDB from existing code)
cp $TEMPLATE_DIR/templates/subagents/ingestion/*.md .claude/agents/ingestion/

# Copy workflow docs
cp $TEMPLATE_DIR/templates/workflow/MULTI_AGENT_WORKFLOW.md docs/workflow/
cp $TEMPLATE_DIR/templates/workflow/DEVELOPMENT_WORKFLOW.md docs/workflow/

# Copy task template
cp $TEMPLATE_DIR/templates/tasks/feature-task-template.yml tasks/

# Copy validation script
cp $TEMPLATE_DIR/validate.sh ./
chmod +x validate.sh
```

## Step 3: Customize Template Variables

Replace the core variables in your copied files:

```bash
cd ~/dev/shopfront

# Replace in CLAUDE.md, AGENTS.md, and subagents
FILES=$(find CLAUDE.md AGENTS.md tasks.yml .claude/agents tasks -name "*.md" -o -name "*.yml" 2>/dev/null)

for f in $FILES CLAUDE.md AGENTS.md tasks.yml; do
  [ -f "$f" ] || continue
  sed -i '' "s/{{PROJECT_NAME}}/ShopFront/g" "$f"
  sed -i '' "s/{{PRIMARY_LANGUAGE}}/TypeScript/g" "$f"
  sed -i '' "s/{{FRAMEWORK}}/Next.js/g" "$f"
  sed -i '' "s/{{ARCHITECTURE_PATTERN}}/Feature-First/g" "$f"
  sed -i '' "s/{{PROJECT_TYPE}}/full-stack/g" "$f"
  sed -i '' "s/{{DATABASE_TYPE}}/PostgreSQL/g" "$f"
  sed -i '' "s/{{TEST_FRAMEWORK}}/Vitest/g" "$f"
  sed -i '' "s/{{TEST_COVERAGE_TARGET}}/80/g" "$f"
done
```

Check for remaining variables:

```bash
./validate.sh
```

Fix any remaining `{{VARIABLES}}` manually — some are project-type-specific and need your actual values (e.g., `{{STATE_MANAGEMENT}}`, `{{ORM_LIBRARY}}`).

## Step 4: Generate a PDB from Existing Code

Since you have code but no PDB, use the **ingestion agents** to reverse-engineer one.

### 4a. Run Codebase Auditor

Open the project in Claude Code:

```
@codebase-auditor

Perform comprehensive codebase audit of this Next.js e-commerce project.
Build a knowledge graph of all modules, data models, API routes, dependencies,
and architecture patterns.
```

Output: `docs/architecture/codebase_knowledge_graph.md`

### 4b. Run Gap Analysis

```
@gap-analysis

Analyze the codebase knowledge graph. Identify security vulnerabilities,
missing infrastructure, test coverage gaps, and production blockers.
Prioritize by severity.
```

Output: `docs/architecture/gap_analysis_report.md`

### 4c. Run Documentation Backfill

```
@documentation-backfill

Generate a Product Design Blueprint (PDB) and Technical Architecture Document (TAD)
from the codebase knowledge graph and gap analysis. Mark all inferences with
confidence levels and add validation checklists.
```

Output:
- `docs/product_design/{{PROJECT_NAME}}_pdb.md`
- `docs/architecture/technical_architecture.md`

### 4d. Validate the Generated PDB

The generated PDB will have `[INFERRED]` and `[ASSUMPTION]` tags. Review it:

- [ ] Product overview accurately reflects actual functionality
- [ ] All major features are documented
- [ ] Data models match actual database schema
- [ ] API contracts match actual endpoints
- [ ] Architecture description is accurate
- [ ] Add business context (the "why" behind decisions)
- [ ] Correct any wrong inferences
- [ ] Mark as validated when complete

The PDB is saved directly as `docs/product_design/shopfront_pdb.md` (using your project name).

## Step 5: Create Tasks from the PDB

Now that you have a validated PDB, create task files:

```
pdb-to-tasks subagent

Read docs/product_design/shopfront_pdb.md and decompose it into epics and task files.
Focus on:
1. Gap analysis items (from docs/architecture/gap_analysis_report.md) as Phase 0 tasks
2. Existing features that need improvement as Phase 1 tasks
3. New features from the PDB as Phase 2 tasks
```

The gap analysis report drives initial priorities:

```
tasks/
├── 00_phase0_gap_fixes.yml            # Critical gaps from gap analysis
│                                       # (missing auth, no rate limiting, etc.)
├── 01_security_hardening.yml          # Security gaps identified in audit
├── 02_test_coverage.yml               # Test gaps identified in audit
├── 03_product_catalog.yml             # Existing feature: improvements
├── 04_checkout_flow.yml               # Existing feature: improvements
├── 05_user_dashboard.yml              # New feature from PDB
└── 06_order_management.yml            # New feature from PDB
```

Example gap-driven task:

```yaml
epic: E00_Gap_Fixes
feature: Critical_Security

context:
  phase: 0
  spec_refs:
    - "Gap: docs/architecture/gap_analysis_report.md — Critical Issues"
    - "PDB: docs/product_design/shopfront_pdb.md — Section 4: Security"

tasks:
  - id: E00_T1_fix_hardcoded_secrets
    title: "Remove hardcoded API keys and move to environment variables"
    type: chore
    status: todo
    priority: high
    agent_roles:
      - implementation
      - security
    description: >
      Gap analysis identified hardcoded Stripe keys in checkout service.
      Move all secrets to environment variables and add .env.example.
    acceptance_criteria:
      - "No hardcoded secrets in codebase"
      - ".env.example created with all required variables"
      - "Deployment docs updated"
    tests:
      - "grep -r 'sk_live' returns no results"

  - id: E00_T2_add_rate_limiting
    title: "Add rate limiting to all API routes"
    type: chore
    status: todo
    priority: high
    agent_roles:
      - implementation
      - security
    description: >
      Gap analysis identified no rate limiting on payment endpoints.
      Add rate limiting middleware to all API routes.
    acceptance_criteria:
      - "Rate limiting on all /api routes"
      - "Configurable limits per route"
      - "429 response with retry-after header"
    blocked_by:
      - E00_T1_fix_hardcoded_secrets
```

## Step 6: Begin Development

You now have the same multi-agent workflow as a net-new project:

```
1. Pick a task from tasks/*.yml (start with Phase 0 gap fixes)
2. Implementation Agent → implements
3. security-auditor → audits security-critical changes
4. code-reviewer → reviews quality
5. test-writer → creates tests
6. Update task status → pick next task
```

## Step 7: Commit the Template Files

```bash
cd ~/dev/shopfront
git add CLAUDE.md AGENTS.md tasks.yml tasks/ docs/ .claude/agents/ validate.sh
git commit -m "Add multi-agent development system

- CLAUDE.md configured for Next.js full-stack
- Agent roles defined (Implementation, QA, Testing, Documentation)
- Ingestion agents generated PDB and gap analysis
- Task files created from PDB with gap fixes as Phase 0
- Subagent configs for code review, testing, security, etc."
```

---

## Resulting Project Structure

```
shopfront/
├── CLAUDE.md                       # AI agent rules (configured for Next.js)
├── AGENTS.md                          # Agent role definitions
├── tasks.yml                          # Portfolio-level milestones
├── validate.sh                        # Variable validation
├── tasks/
│   ├── 00_phase0_gap_fixes.yml
│   ├── 01_security_hardening.yml
│   ├── 02_test_coverage.yml
│   └── ...
├── docs/
│   ├── product_design/
│   │   └── shopfront_pdb.md           # Generated + validated PDB
│   ├── architecture/
│   │   ├── codebase_knowledge_graph.md
│   │   ├── gap_analysis_report.md
│   │   └── technical_architecture.md
│   └── workflow/
│       ├── MULTI_AGENT_WORKFLOW.md
│       └── DEVELOPMENT_WORKFLOW.md
├── .claude/
│   └── agents/
│       ├── generic/                   # code-reviewer, test-writer, etc.
│       ├── ideation/                  # idea-to-pdb, pdb-to-tasks
│       └── ingestion/                 # codebase-auditor, gap-analysis, backfill
│
├── src/                               # ← Your existing code (unchanged)
├── prisma/                            # ← Your existing schema
├── package.json                       # ← Your existing deps
└── ...
```

---

## Key Differences from Net-New

| Aspect | Net-New (Clone) | Existing Project (Copy-From) |
|--------|----------------|------------------------------|
| **Starting point** | Clone the template repo | Copy files into your existing repo |
| **PDB source** | `idea-to-pdb subagent` agent | `@documentation-backfill` agent (from code) |
| **First tasks** | Phase 0 build prep | Phase 0 gap fixes (from gap analysis) |
| **Agent focus** | Ideation → implementation | Ingestion → hardening → implementation |
| **Template files** | Template IS the project | Template stays separate, files copied in |
| **setup.sh** | Runs in the cloned repo | Not used — manual copy + sed instead |

---

## Success Metrics

- All critical gaps from gap analysis resolved
- PDB accurately reflects the existing codebase
- Test coverage improved to target (80%+)
- Security audit passes
- New features follow established architecture patterns
- Multi-agent workflow running smoothly for ongoing development
