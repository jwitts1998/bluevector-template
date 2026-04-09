---
name: feature-audit
description: Runs a full feature health check scoped to a task file. Covers spec alignment, code quality, security, testing, documentation, and domain consultation. Use when auditing a feature before release, verifying task completion, or running a pre-merge check on a task file.
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Write
---

# Feature Audit Skill

Runs a multi-dimensional audit on a feature (task file), producing a structured report.

## When to use

- "Run feature audit on session-monitor-v2"
- "Audit this feature before we ship"
- "Feature health check for tasks/session-monitor-v2.yml"
- "Verify acceptance criteria and quality for this feature"

## Workflow

### Step 1 — Extract scope

1. Read the task file (e.g. `tasks/session-monitor-v2.yml`).
2. Extract: `feature`, `tasks`, `code_areas`, `spec_refs`, `acceptance_criteria`, `domain_agents`.
3. Build code surface: union of all `code_areas` across tasks.
4. Read the referenced code files. If the user specified a subset of tasks, scope to those only.

### Step 2 — Run each dimension

Apply the condensed checklists below to the scoped code. For each dimension, record findings as Critical / Warnings / Suggestions. Skip dimensions with no findings if explicitly N/A (e.g. infrastructure-only feature skips domain consultation).

### Step 3 — Produce report

Write `docs/audits/feature_audit_<feature-slug>_<YYYY-MM-DD>.md` using the Output Format template below.

### Step 4 — Summarize

Present the report path and key findings to the user. If security-critical code had findings, recommend: "For a deeper security pass, invoke security-auditor subagent on [affected files]."

---

## Dimension checklists

### 1. Spec alignment

- [ ] All `acceptance_criteria` from the task file are met in the implementation
- [ ] Code aligns with `spec_refs` (PDB, docs, etc.)
- [ ] Task status reflects actual completion (no `status: done` with unmet criteria)
- [ ] `code_areas` accurately cover the changed files

**Output**: List each acceptance criterion as Met / Partial / Not met with evidence.

### 2. Code quality (condensed from code-reviewer)

**Tier 1 — always:**
- [ ] No hardcoded API keys, secrets, or credentials
- [ ] No logging of sensitive data (passwords, tokens, PII)
- [ ] Input validation present on user-facing entry points
- [ ] Follows architecture pattern and existing codebase patterns
- [ ] Error handling present for async operations and failure paths

**Tier 2 — change-relevant:**
- [ ] Auth/authorization checks on sensitive operations (data/API changes)
- [ ] SQL injection prevention, no N+1s (data/API changes)
- [ ] Functions small and focused, no unnecessary duplication (business logic)
- [ ] Correct directory structure, uses existing components (UI changes)
- [ ] New libraries cite official docs, approaches justified (dependency changes)

**Output**: Critical / Warnings / Suggestions with locations and fix guidance.

### 3. Security (condensed from security-auditor)

- [ ] No hardcoded credentials
- [ ] Proper password hashing if auth (bcrypt, argon2)
- [ ] All user input validated and sanitized
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS prevention
- [ ] No sensitive data in logs
- [ ] Secure data transmission (HTTPS in production)
- [ ] No insecure dependencies (check audit tooling)

**Output**: Findings by severity (Critical / Warnings) with remediation steps. For auth, data handling, or API code with findings, recommend security-auditor subagent for a deeper pass.

### 4. Testing

- [ ] Unit tests for business logic
- [ ] Integration tests for features where applicable
- [ ] Edge cases and error scenarios covered
- [ ] Tests follow existing patterns
- [ ] Tests are fast and deterministic

**Output**: Coverage summary, gaps, and recommendations. Note if no tests exist for the feature.

### 5. Documentation

- [ ] Public functions/classes documented
- [ ] Feature documented in `docs/` if significant
- [ ] API documentation updated (if applicable)
- [ ] Examples for complex functionality

**Output**: Gaps and recommendations. Skip if feature is internal/tooling with minimal surface.

### 6. Domain consultation

Apply only when the task file has `domain_agents`. For each Tier 3 agent pulled from `consultedBy` in the domain definitions:

| Tier 3 Agent | Lens |
|--------------|------|
| `animation-motion` | Transitions smooth? `prefers-reduced-motion` respected? |
| `accessibility` | Keyboard-navigable? ARIA correct? Color contrast? |
| `internationalization` | Strings externalized? RTL layout? Dates/numbers locale-aware? |
| `performance` | Unnecessary re-renders? Bundle impact OK? Images optimized? |
| `analytics-telemetry` | Key actions tracked? Events follow schema? |

Skip if `domain_agents: [schema-data]` only (pure data work) or infrastructure-only.

**Output**: Per-lens findings as Warnings or Suggestions.

---

## Output Format

```markdown
# Feature Audit Report

**Feature**: [Feature name from task file]
**Task File**: [path]
**Audited**: [YYYY-MM-DD]

## Executive Summary

[2-3 paragraphs: overall health, critical issues, readiness for release]

## Spec Alignment

**Acceptance criteria:**
| Criterion | Status | Evidence |
|-----------|--------|----------|
| [criterion] | Met / Partial / Not met | [brief] |

**Spec refs coverage:** [summary]

## Code Quality

**Critical:** [none / list with locations]
**Warnings:** [list]
**Suggestions:** [list]

## Security

**Critical:** [none / list with remediation]
**Warnings:** [list]

## Testing

**Coverage:** [summary]
**Gaps:** [list]
**Recommendations:** [list]

## Documentation

**Findings:** [list or "Adequate" / "N/A"]

## Domain Consultation

**Lenses applied:** [which Tier 3 agents]
**Findings:** [per-lens or "No issues" / "N/A"]

## Recommendations

1. [Prioritized next step]
2. [Next step]
3. [Next step]
```

---

## Notes

- **Read-only**: The skill does not update task statuses. Report findings only.
- **Deep dives**: For security-critical features or high-severity security findings, explicitly recommend invoking security-auditor subagent on the affected code areas.
- **Reference**: For extended checklists, see `templates/subagents/generic/code-reviewer.md` and `templates/subagents/generic/security-auditor.md`.
