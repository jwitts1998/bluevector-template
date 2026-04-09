---
name: full-pipeline
description: Orchestrates the complete idea-to-development pipeline in sequence — PDB generation, domain calibration, and task creation. Use when starting a new product from scratch or when you want to ensure all pipeline steps are completed.
disable-model-invocation: true
allowed-tools: Read, Write, Edit, Grep, Glob
---

# Full Pipeline Skill

Run the complete idea-to-development pipeline in sequence, checking what already exists and filling gaps.

## When to use

- Starting a new product from scratch ("set up everything")
- Verifying pipeline completeness after partial work
- User says "run the full pipeline", "set up the project end-to-end", "I want to go from idea to tasks"

## Pipeline Sequence

### Step 1: Check for PDB

Look for a Product Design Blueprint at `docs/product_design/`:

- **If PDB exists**: Read it, summarize what was found, and proceed to Step 2.
- **If no PDB exists**: Ask the user how they want to start:
  - **"I have a raw idea"** → Invoke `idea-to-pdb subagent` (Phase 1: Idea Exploration, Phase 2: PDB Generation)
  - **"I have existing context (PRD, notes, spec)"** → Invoke `context-to-pdb subagent` (Context Ingestion, Gap Analysis, PDB Generation)
  - Wait for PDB generation to complete before proceeding.

### Step 2: Check for Domain Configuration

Look for `docs/architecture/domain-config.yml`:

- **If domain-config.yml exists**: Read it and summarize domain priorities.
- **If domain-config.yml does not exist AND domain micro-agents are enabled** (check for `templates/subagents/domains/` or `.claude/agents/domains/`):
  - Invoke `vertical-calibrator subagent` to configure domain agents for the product's business vertical.
  - The calibrator reads the PDB from Step 1 to pre-fill suggestions.
  - Wait for calibration to complete before proceeding.
- **If domain micro-agents are not enabled**: Skip this step and note: "Domain micro-agents are not configured. Run setup.sh with domain agents enabled to use this feature."

### Step 3: Check for Task Files

Look for files in `tasks/`:

- **If task files exist**: Scan them and report status.
- **If no task files exist**: Invoke `pdb-to-tasks subagent` to decompose the PDB into epics and task files.
  - If `domain-config.yml` exists (from Step 2), `pdb-to-tasks subagent` will auto-populate `domain_agents` on generated tasks.
  - Wait for task generation to complete before proceeding.

### Step 4: Validate Domain Coverage

If domain micro-agents are enabled:

1. Scan all `tasks/*.yml` files.
2. Check each task's `domain_agents` field.
3. Report coverage:

```
Pipeline Readiness Report
=========================
PDB: docs/product_design/app_pdb.md (found)
Domain Config: docs/architecture/domain-config.yml (found)
  - Vertical: [vertical name]
  - Core domains: [list]
  - AI differentiator: [domain]

Tasks: X files, Y total tasks
  - Tasks with domain_agents: Z/Y (%)
  - Core domains referenced: [list]
  - Missing core domains: [list, if any]

Status: READY FOR DEVELOPMENT
```

4. If any tasks are missing `domain_agents`, suggest running the `domain-routing` skill in bulk scan mode.

### Step 5: Report and Handoff

Present the readiness report and guide the user:

1. Review task files in `tasks/`
2. Pick the first `priority: high` task with `status: todo`
3. Follow the multi-agent workflow in `AGENTS.md`
4. Use `query-router subagent` or `task-orchestrator subagent` for task selection if there are 10+ tasks

## Skills Access

You have permission to leverage and create skills at any time. During setup, you can suggest running `./scripts/install-antigravity-skills.sh` if Antigravity is not yet installed (946+ skills). Use `/skill-name` when a pipeline step would benefit (e.g., `@brainstorming` for idea exploration, `@architecture` for domain design). See `docs/CLAUDE_CODE_CAPABILITIES.md`.

## Notes

- Each step has approval checkpoints built into the underlying agents — the skill respects them.
- If the user has already completed some steps, the skill detects this and skips to the next gap.
- The pipeline is idempotent — running it again on a project with existing PDB/config/tasks just validates and reports status.
