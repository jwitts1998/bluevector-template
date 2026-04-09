# Ingestion & Modernization Agents

**Purpose**: Specialized agents for reverse-engineering documentation and modernizing existing codebases.

## When to Use

Use these agents when:
- **Path D**: You have existing code + documentation, but no Product Design Blueprint (PDB)
- **Path E**: You have existing code with minimal/no documentation
- **Path F**: You're importing MVP/prototype code from Replit, Bolt, V0, etc.

**Do NOT use** for:
- Path A: Greenfield projects (no code yet) — use the [Idea-to-PDB agent](../ideation/idea-to-pdb.md) and [Idea to PDB Guide](../../../docs/IDEA_TO_PDB.md) instead
- Path B: Design-first projects (have PDB, minimal code)
- Path C: Existing projects that already have comprehensive PDB

## Agent Overview

### 1. Codebase Auditor (`codebase-auditor.md`)

**Purpose**: Analyze existing codebase to build comprehensive Codebase Knowledge Graph

**What it does**:
- Scans directory structure and architecture patterns
- Extracts data models and database schema
- Documents API endpoints and contracts
- Identifies dependencies and integrations
- Performs preliminary security audit
- Checks infrastructure and testing setup

**Output**: `docs/architecture/codebase_knowledge_graph.md`

**When to invoke**: First step in ingestion workflow

**In Cursor**:
```
codebase-auditor subagent

Prompt: "Perform comprehensive codebase audit. Build knowledge graph of all modules, dependencies, data flows, and architecture patterns."
```

**Timeline**: 30 minutes - 2 hours (depending on codebase size)

---

### 2. Gap Analysis (`gap-analysis.md`)

**Purpose**: Identify missing documentation, security vulnerabilities, infrastructure gaps, and production blockers

**What it does**:
- Compares codebase against production standards
- Identifies security vulnerabilities (hardcoded secrets, missing auth, etc.)
- Documents infrastructure gaps (no CI/CD, monitoring, backups)
- Assesses test coverage
- Creates prioritized modernization roadmap
- Assigns severity levels (Critical / High / Medium / Low)

**Input**: `docs/architecture/codebase_knowledge_graph.md` (from Codebase Auditor)

**Output**: `docs/architecture/gap_analysis_report.md`

**When to invoke**: After Codebase Auditor completes

**In Cursor**:
```
gap-analysis subagent

Prompt: "Analyze codebase knowledge graph. Identify ALL security vulnerabilities, missing infrastructure, test coverage gaps, and deployment blockers. Prioritize by severity."
```

**Timeline**: 15-45 minutes

---

### 3. Documentation Backfill (`documentation-backfill.md`)

**Purpose**: Generate Product Design Blueprint (PDB) and Technical Architecture Document (TAD) from existing code

**What it does**:
- Reverse-engineers product features from code
- Infers user flows from routing and navigation
- Extracts data models and API contracts
- Documents architecture patterns and tech stack
- Generates draft PDB and TAD with validation checklists
- Marks inferences with confidence levels

**Input**: 
- `docs/architecture/codebase_knowledge_graph.md` (from Codebase Auditor)
- `docs/architecture/gap_analysis_report.md` (from Gap Analysis - optional)
- Existing README, wiki, or documentation

**Output**: 
- `docs/product_design/{{PROJECT_NAME}}_pdb.md`
- `docs/architecture/technical_architecture.md`

**When to invoke**: After Gap Analysis completes (or after Codebase Auditor if skipping Gap Analysis)

**In Cursor**:
```
documentation-backfill subagent

Prompt: "Generate Product Design Blueprint (PDB) and Technical Architecture Document (TAD) from codebase knowledge graph and gap analysis. Mark inferences and add validation checklists."
```

**Timeline**: 1-3 hours (depending on complexity)

---

## Workflow

### Standard Ingestion Flow

```
1. Codebase Auditor
   ↓ (generates codebase_knowledge_graph.md)
2. Gap Analysis
   ↓ (generates gap_analysis_report.md)
3. Documentation Backfill
   ↓ (generates PDB + TAD)
4. Human Validation (CRITICAL)
   ↓
5. Set up standard multi-agent system
   ↓
6. Execute modernization roadmap
```

### Quick Flow (Path D - Documented, No PDB)

If you already have good documentation, you can skip Codebase Auditor:

```
1. Documentation Backfill (reads existing docs + code)
   ↓ (generates PDB + TAD)
2. Gap Analysis (optional, for validation)
   ↓
3. Human Validation
   ↓
4. Set up standard multi-agent system
```

### MVP/Prototype Flow (Path F)

For rapid prototypes that need production hardening:

```
1. Codebase Auditor (comprehensive scan)
   ↓
2. Gap Analysis (focus on security + infrastructure)
   ↓
3. Documentation Backfill (generate PDB + TAD)
   ↓
4. Create Modernization Roadmap (from gap analysis)
   ↓
5. Human Validation + Prioritization
   ↓
6. Set up multi-agent system with hardening agents
   ↓
7. Execute Phase 1: Critical Security Fixes
   ↓
8. Execute Phase 2: Infrastructure Setup
   ↓
9. Execute Phase 3+: Ongoing improvements
```

---

## Setup

### Copy Ingestion Agents to Your Project

```bash
# Set template directory
TEMPLATE_DIR=/path/to/multi-agent-system-template

# Create ingestion agents directory
mkdir -p .claude/agents/ingestion

# Copy all ingestion agents
cp $TEMPLATE_DIR/templates/subagents/ingestion/*.md .claude/agents/ingestion/

# Verify
ls .claude/agents/ingestion/
# Should show:
# - codebase-auditor.md
# - gap-analysis.md
# - documentation-backfill.md
# - README.md
```

### Customize Variables

Before using, replace these variables in each agent file:

- `{{PROJECT_NAME}}` - Your project name
- `{{PRIMARY_LANGUAGE}}` - Main programming language
- `{{FRAMEWORK}}` - Primary framework
- `{{PROJECT_TYPE}}` - mobile-app / web-app / backend-service / full-stack
- `{{DEPLOYMENT_ENV}}` - Production / Staging / Development

**Quick replace**:
```bash
cd .claude/agents/ingestion

# Replace project name
sed -i '' 's/{{PROJECT_NAME}}/YourProjectName/g' *.md

# Replace language
sed -i '' 's/{{PRIMARY_LANGUAGE}}/TypeScript/g' *.md

# Replace framework
sed -i '' 's/{{FRAMEWORK}}/React/g' *.md

# ... etc for other variables
```

---

## Usage Tips

### Running Agents in Claude Code

1. **Invoke agent by name**: `codebase-auditor subagent`, `gap-analysis subagent`, `documentation-backfill subagent`
2. **Provide detailed prompt**: Tell the agent exactly what to focus on
3. **Wait for completion**: These agents do heavy analysis - can take time
4. **Review output**: Check generated markdown files in `docs/`
5. **Iterate if needed**: Re-run with refined prompts if output is incomplete

### Best Practices

**DO**:
- ✅ Run agents in order (Auditor → Gap Analysis → Backfill)
- ✅ Review and validate ALL generated documentation
- ✅ Add business context that AI can't infer from code
- ✅ Correct inaccuracies and assumptions
- ✅ Use generated docs as starting point, not final version
- ✅ Keep generated docs under version control

**DON'T**:
- ❌ Trust generated docs blindly without validation
- ❌ Skip human review of generated documentation
- ❌ Run agents in parallel (they depend on each other)
- ❌ Ignore warnings and [INFERRED] tags in output
- ❌ Deploy to production based on gap analysis alone

### Validation is Critical

AI-generated documentation requires human review because:
- AI can extract WHAT but needs help with WHY
- Business context isn't evident in code
- Inferences can be wrong
- Security issues might be missed
- Architecture rationale needs human input

**Always**:
1. Review validation checklists in generated docs
2. Add business reasoning for decisions
3. Correct misunderstandings
4. Fill in gaps
5. Mark document as validated when complete

---

## Output Files

After running ingestion agents, you'll have:

```
docs/
├── architecture/
│   ├── codebase_knowledge_graph.md       (from Codebase Auditor)
│   ├── gap_analysis_report.md            (from Gap Analysis)
│   └── technical_architecture.md         (from Documentation Backfill)
└── product_design/
    └── {{PROJECT_NAME}}_pdb.md           (from Documentation Backfill)
```

These files then become the foundation for:
- `CLAUDE.md` configuration
- Task files (`tasks/*.yml`) with `spec_refs` pointing to PDB
- Standard multi-agent development workflow

---

## Troubleshooting

### Agent not found in Claude Code

**Problem**: `codebase-auditor subagent` doesn't auto-complete

**Solution**:
1. Check agent file exists: `ls .claude/agents/ingestion/codebase-auditor.md`
2. Verify frontmatter format (must have `name:` field)
3. Restart Claude Code CLI
4. Try full path: `.claude/agents/ingestion/codebase-auditor.md`

### Generated docs are inaccurate

**Problem**: Documentation doesn't match actual code behavior

**Solution**:
1. Check if code is clear and well-structured (unclear code → unclear docs)
2. Look for [INFERRED] and [UNCLEAR] tags - these need validation
3. Re-run agent with more specific prompt
4. Manually correct and mark as validated

### Gap Analysis seems incomplete

**Problem**: Expected to see more gaps identified

**Solution**:
1. Ensure Codebase Auditor completed successfully first
2. Re-run with specific focus: "gap-analysis subagent focus on security and infrastructure"
3. Manually add gaps you're aware of to the report
4. Consider project maturity - MVP code SHOULD have many gaps

### Agents take too long

**Problem**: Agents running for hours without completion

**Solution**:
1. Check codebase size - very large codebases take longer
2. Try narrowing scope: "Analyze only `src/` directory"
3. Run in stages: analyze modules individually
4. Check Cursor logs for errors or stalls

---

## Next Steps

After running ingestion agents and validating documentation:

1. **Follow SETUP_GUIDE.md** from "Quick Start" section
2. **Create task files** from gap analysis roadmap
3. **Set up standard multi-agent system**
4. **Execute modernization** using multi-agent workflow

For detailed instructions, see:
- [SETUP_GUIDE.md](../../../SETUP_GUIDE.md#ingestion--modernization-setup-paths-d-e-f)
- [INTEGRATION_GUIDE.md](../../../docs/INTEGRATION_GUIDE.md)

---

**Questions?** See [FAQ.md](../../../docs/FAQ.md#-ingestion--modernization-questions)
