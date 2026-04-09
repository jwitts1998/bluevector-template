---
name: descript-inspired-captions
description: Convert Descript screenshots to CogD features. Runs design-iterator, brainstorming, writing-plans, spec-flow-analyzer, repo-research-analyst, task creation, and subagent-driven-development in sequence with file-based handoffs.
disable-model-invocation: true
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
---

# Descript-Inspired Captions Workflow

Convert screenshots (or references to Descript UI) into implemented CogD features through a 7-step pipeline with explicit handoffs.

## When to Use

- User provides Descript screenshots and wants to implement similar captions/stop-cuts features
- User says "run the Descript captions workflow", "screenshot to feature", or "convert these designs to tasks"
- User has design references and wants a structured path from analysis to implementation

## Handoff Artifacts

All intermediate outputs live under `docs/descript-workflow/` for traceability. Each step reads from prior output and writes its result for the next step.

| Step | Input | Output Path |
|------|-------|-------------|
| 1 | User screenshots / design refs | `docs/descript-workflow/extraction.md` |
| 2 | extraction.md | `docs/descript-workflow/feature-decisions.md` |
| 3 | feature-decisions.md | `docs/descript-workflow/plan.md` |
| 4 | plan.md | `docs/descript-workflow/validated-plan.md` |
| 5 | validated-plan.md | `docs/descript-workflow/code-mapping.md` |
| 6 | code-mapping.md + validated-plan.md | `tasks/14_descript_inspired_captions_stopcuts.yml` (or user-specified) |
| 7 | task file | Implementation (code changes) |

## Pipeline Sequence

### Step 1: Design Extraction

**Invoke:** `@design-iterator` (subagent)

**Input:** User-provided screenshots or design references (images, Google Stitch URLs, or description).

**Task:** Analyze Descript screenshots and extract:
- Layout structure
- Features relevant to captions and stop cuts
- UI patterns and interactions

**Output:** Write to `docs/descript-workflow/extraction.md` with structured sections:
- Layout summary
- Caption-related features
- Stop-cut-related features
- Design annotations (fonts, spacing, states)

**Handoff:** Ensure extraction.md is complete before proceeding. If design-iterator asks questions, answer them first.

---

### Step 2: Feature Decisions

**Invoke:** `@brainstorming` (skill)

**Input:** Read `docs/descript-workflow/extraction.md`.

**Task:** Decide what to adopt vs. simplify for CogD (or the target product):
- Which extracted features align with the product vision
- What to simplify or defer
- Tradeoffs and rationale

**Output:** Write to `docs/descript-workflow/feature-decisions.md` with:
- Adopted features (with rationale)
- Simplified or deferred items
- Open questions resolved or surfaced

**Handoff:** Feature decisions must be clear enough for planning. Resolve ambiguity before Step 3.

---

### Step 3: Implementation Plan

**Invoke:** `@writing-plans` (skill)

**Input:** Read `docs/descript-workflow/feature-decisions.md` and `docs/descript-workflow/extraction.md`.

**Task:** Produce a structured implementation plan with:
- Phases and dependencies
- Task breakdown
- Suggested order of work

**Output:** Write to `docs/descript-workflow/plan.md` with phased tasks and dependencies.

**Handoff:** Plan should be concrete enough for spec validation and code mapping.

---

### Step 4: Spec Validation

**Invoke:** `@spec-flow-analyzer` (subagent)

**Input:** Read `docs/descript-workflow/plan.md`.

**Task:** Validate the spec for:
- Flow completeness
- Gap identification
- Edge cases and missing scenarios

**Output:** Write to `docs/descript-workflow/validated-plan.md`:
- Validated plan with any corrections
- List of gaps or risks addressed
- Final task list with acceptance criteria

**Handoff:** Only proceed if spec-flow-analyzer passes or issues are explicitly resolved.

---

### Step 5: Code Mapping

**Invoke:** `@repo-research-analyst` (subagent)

**Input:** Read `docs/descript-workflow/validated-plan.md`. Provide project context (e.g., Studio, captions, format code paths).

**Task:** Map the plan to the current codebase:
- Which modules, directories, or files each task touches
- Existing patterns to follow
- Dependencies and integration points

**Output:** Write to `docs/descript-workflow/code-mapping.md`:
- Task-to-code mapping
- Recommended `code_areas` for each task
- Notes on architecture fit

**Handoff:** Code mapping feeds directly into task file creation.

---

### Step 6: Create Task File

**Invoke:** Agent writes task file (no separate skill).

**Input:** Read `docs/descript-workflow/validated-plan.md`, `docs/descript-workflow/code-mapping.md`, and reference `templates/tasks/TASK_SCHEMA_GUIDE.md` and `templates/tasks/feature-task-template.yml`.

**Task:** Create a task file (e.g. `tasks/14_descript_inspired_captions_stopcuts.yml`) with:
- Task IDs, titles, descriptions
- `spec_refs` pointing to extraction, decisions, plan, and code mapping
- `agent_roles` per task
- `code_areas` from code mapping
- `acceptance_criteria` from validated plan
- `blocked_by` for dependencies

**Output:** Task file(s) in `tasks/`.

**Handoff:** Ensure task file follows project schema. User may specify a different path (e.g. `tasks/15_captions_v2.yml`).

---

### Step 7: Execute Implementation

**Invoke:** `@subagent-driven-development` (skill)

**Input:** Read the task file created in Step 6. Use `mcp_task` to dispatch implementation subagents where tasks are independent; run sequentially where dependencies exist.

**Task:** Execute the plan with parallel work where possible:
- Dispatch implementer subagents for independent tasks
- Follow two-stage review (spec compliance, then code quality) per task
- Coordinate for tasks with `blocked_by` dependencies

**Output:** Implemented code, passing tests, ready for final review.

**Handoff:** Use `@finishing-a-development-branch` when all tasks are complete.

---

## Idempotency and Resumption

If artifacts already exist, the skill can resume from the first missing step:

1. Check `docs/descript-workflow/` for existing files.
2. If `extraction.md` exists → start at Step 2 (or ask user to confirm).
3. If `feature-decisions.md` exists → start at Step 3, and so on.
4. Report: "Resuming from Step N. Found: [list of existing artifacts]."

---

## Skills and Subagents Required

- **design-iterator** — MCP subagent (design-iterator)
- **brainstorming** — Skill (superpowers or compound-engineering)
- **writing-plans** — Skill (superpowers)
- **spec-flow-analyzer** — MCP subagent
- **repo-research-analyst** — MCP subagent
- **subagent-driven-development** — Skill (superpowers)
- **finishing-a-development-branch** — Skill (superpowers)

If any skill or subagent is unavailable, note it and suggest the user install the required plugin or run the step manually with equivalent instructions.

---

## Notes

- Screenshots or design references must be provided by the user at the start (or attached to the chat).
- The task file naming (e.g. `14_descript_inspired_captions_stopcuts.yml`) follows the project convention; adjust the numeric prefix to match existing task files.
- For parallel work in Step 7, ensure tasks have no `code_areas` overlap to avoid merge conflicts (see MULTI_AGENT_WORKFLOW.md).
