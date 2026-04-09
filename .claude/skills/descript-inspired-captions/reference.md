# Descript-Inspired Captions Workflow — Input/Output Schemas

Reference for each step's expected input and output structure. Use these when validating handoffs or resuming a partial run.

---

## Step 1: Design Extraction

**Input**
- Screenshots (images) or design references (Google Stitch URLs, descriptions)
- Optional: Target product name (e.g., CogD)

**Output:** `docs/descript-workflow/extraction.md`

```markdown
# Descript Screenshot Extraction

## Layout Summary
- [Overall structure, regions, navigation]
- [Key UI containers]

## Caption-Related Features
- [List of caption UI elements, behaviors, states]
- [Timing, positioning, styling]

## Stop-Cut Features
- [List of stop-cut UI elements and interactions]
- [How cuts are represented, edited, or applied]

## Design Annotations
- Fonts, colors, spacing
- Responsive or state variations
- Accessibility notes (if visible)
```

---

## Step 2: Feature Decisions

**Input:** `docs/descript-workflow/extraction.md`

**Output:** `docs/descript-workflow/feature-decisions.md`

```markdown
# Feature Decisions for [Target Product]

## Adopted Features
- [Feature A]: [Rationale]
- [Feature B]: [Rationale]

## Simplified
- [Feature X] → [Simplified version]: [Reason]

## Deferred
- [Feature Y]: [Reason for deferral]

## Open Questions Resolved
- [Question]: [Decision]
```

---

## Step 3: Implementation Plan

**Input:** `docs/descript-workflow/feature-decisions.md`, `docs/descript-workflow/extraction.md`

**Output:** `docs/descript-workflow/plan.md`

```markdown
# Implementation Plan: Descript-Inspired Captions

## Phase 1: [Name]
- **Task 1.1**: [Description]
  - Dependencies: [none / Task X]
  - Deliverable: [what]
- **Task 1.2**: ...

## Phase 2: [Name]
- [Tasks with dependencies on Phase 1]

## Dependencies (DAG)
[Optional: diagram or list of task → blocked_by]
```

---

## Step 4: Validated Plan

**Input:** `docs/descript-workflow/plan.md`

**Output:** `docs/descript-workflow/validated-plan.md`

```markdown
# Validated Implementation Plan

## Corrections / Additions
- [Any changes from spec-flow-analyzer]

## Final Task List
- **T1**: [Title] — [Acceptance criteria]
- **T2**: ...

## Gaps Addressed
- [List of gaps identified and how they were resolved]

## Risks or Edge Cases
- [Any remaining risks noted by spec-flow-analyzer]
```

---

## Step 5: Code Mapping

**Input:** `docs/descript-workflow/validated-plan.md`, project paths (e.g., Studio, captions, format)

**Output:** `docs/descript-workflow/code-mapping.md`

```markdown
# Task-to-Code Mapping

## Task T1: [Title]
- **code_areas**: [list of files or directories]
- **Patterns**: [Existing patterns to follow]
- **Integration points**: [APIs, components to use]

## Task T2: ...
```

---

## Step 6: Task File

**Input:** `docs/descript-workflow/validated-plan.md`, `docs/descript-workflow/code-mapping.md`

**Output:** `tasks/14_descript_inspired_captions_stopcuts.yml` (or user-specified path)

Schema: See `templates/tasks/TASK_SCHEMA_GUIDE.md` and `templates/tasks/feature-task-template.yml`.

Key fields per task:
- `id`, `title`, `description`
- `spec_refs`: paths to extraction, decisions, plan, code-mapping
- `agent_roles`: e.g. `[implementation, quality_assurance, testing]`
- `code_areas`: from code-mapping
- `acceptance_criteria`: from validated-plan
- `blocked_by`: task IDs for dependencies

---

## Step 7: Implementation

**Input:** Task file from Step 6

**Output:** Code changes, tests, commits. No structured markdown output.

Follow `@subagent-driven-development` process: implement → spec review → code quality review → repeat until approved.
