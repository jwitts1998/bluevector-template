# Agent Data Contracts

This document defines the expected structure of artifacts that agents produce and consume. When modifying an agent's output format, check this document to ensure downstream agents are not broken.

## Artifact Registry

| Artifact | Producer(s) | Consumer(s) | Path |
|---|---|---|---|
| Product Design Blueprint (PDB) | `idea-to-pdb`, `context-to-pdb`, `documentation-backfill` | `pdb-to-tasks`, `vertical-calibrator` | `docs/product_design/{{PROJECT_NAME}}_pdb.md` |
| Domain Configuration | `vertical-calibrator` | `pdb-to-tasks`, `domain-router` | `docs/architecture/domain-config.yml` |
| Task Files | `pdb-to-tasks` | `task-orchestrator`, `execution-monitor`, `domain-router` | `tasks/*.yml` |
| Portfolio Milestones | `pdb-to-tasks` | `task-orchestrator`, `execution-monitor` | `tasks.yml` |
| Codebase Knowledge Graph | `codebase-auditor` | `gap-analysis`, `documentation-backfill` | `docs/architecture/codebase_knowledge_graph.md` |
| Gap Analysis Report | `gap-analysis` | `documentation-backfill` | `docs/architecture/gap_analysis_report.md` |
| Working Memory | Any agent | `memory-updater` | `docs/memory/working/current-session.md` |
| Episodic Memory | `memory-updater` | `memory-updater` | `docs/memory/episodic/YYYY-MM-DD-session.md` |
| Semantic Memory | `memory-updater` | All agents (session start) | `docs/memory/semantic/validated-patterns.md` |

---

## PDB Structure Contract

All PDB generators must produce the following sections in this order. Downstream agents reference sections by number.

| Section | Title | Required |
|---|---|---|
| 1 | Cover Page | Yes |
| 2 | Executive Summary | Yes |
| 3 | Functional Requirements Document (FRD) | Yes |
| 3.1 | Core Features | Yes |
| 3.2 | Feature Requirements | Yes |
| 3.3 | Personas | Yes |
| 3.4 | User Journeys | Yes |
| 4 | Technical Architecture Document (TAD) | Yes |
| 4.1 | Component Breakdown | Deep-dive only |
| 4.2 | API Contracts | Deep-dive only |
| 4.3 | Environment Strategy | Deep-dive only |
| 4.4 | Domain Architecture | If domain agents enabled |
| 5 | AI Architecture | If applicable |
| 6 | Data Architecture | Yes |
| 7 | System Flows | Yes |
| 8 | UX / UI Design Specification | Yes |
| 9 | Demo Specification | Optional |
| 10 | Google Stitch Prompt Package | Optional |
| 11 | Cursor Task Outline | Optional |
| 12 | Traceability Matrix | Optional |
| 13 | Appendix | Yes |

**Critical rule:** When referencing PDB sections in `spec_refs`, use the section number AND title (e.g., `"Section 3.2: Feature Requirements"`). This survives minor renumbering.

### PDB Metadata Header

Every PDB must begin with:

```markdown
# Product Design Blueprint

**Product**: {{PROJECT_NAME}}
**Version**: 0.1.0
**Generated**: {{DATE}}
**Status**: DRAFT — Requires validation
**Depth**: Lightweight | Deep-Dive
```

### Traceability Tags

All PDB content must be tagged with provenance:
- `[STAKEHOLDER]` — directly from user or stakeholder input
- `[INFERRED]` — agent's inference based on available context
- `[ASSUMPTION]` — assumption that requires explicit validation

---

## Domain Configuration Contract

`docs/architecture/domain-config.yml` must follow this structure:

```yaml
vertical: string
value_prop: string
primary_users:
  - string
calibrated_at: date

domains:
  <domain-id>:
    relevance: core | supporting | not-applicable
    ai_priority:
      builder:
        - critical | useful: string
      consumer:
        - critical | useful: string
    priority_rank: integer          # 1 = build first
    monitoring_priority: high | medium | low
    is_ai_differentiator: boolean   # exactly one domain should be true
```

**Validation rules:**
- Exactly one domain should have `is_ai_differentiator: true`
- Tier 1 domains (schema-data, api-connections, auth-identity, infrastructure) should be `core` or `supporting`, rarely `not-applicable`
- `priority_rank` values should be unique across core domains

---

## Task File Contract

Each `tasks/*.yml` file must follow this structure:

```yaml
epic: string                     # E01_slug format
feature: string

context:
  phase: integer
  spec_refs:
    - string                     # "PDB: path — Section X.Y: Title"
  notes: string

defaults:
  status: todo
  priority: medium
  owner: string
  envs: [dev]

tasks:
  - id: string                  # E01_T1_slug format
    title: string
    type: chore | story | spike
    status: todo | in_progress | in_review | done | blocked | failed
    priority: critical | high | medium | low
    agent_roles:
      - string                  # implementation | quality_assurance | testing | documentation | ui_ux | security
    domain_agents:               # optional
      - string                  # domain-id with comment explaining classification
    spec_refs:
      - string
    description: string
    code_areas:
      - string
    acceptance_criteria:
      - string                  # must be objectively verifiable
    tests:
      - string
    blocked_by: [string]         # task IDs
    blocks: [string]             # task IDs
```

**Validation rules:**
- `id` must be globally unique across all task files
- `blocked_by` references must point to existing task IDs
- `acceptance_criteria` items must be objectively testable (execution-monitor verifies these)
- `spec_refs` should use section numbers AND titles

---

## Codebase Knowledge Graph Contract

`docs/architecture/codebase_knowledge_graph.md` must include these sections (gap-analysis and documentation-backfill depend on them):

| Section | Required By |
|---|---|
| Architecture Overview | documentation-backfill |
| Directory Structure | documentation-backfill |
| Module Breakdown (table) | documentation-backfill |
| Data Models (table) | documentation-backfill |
| API Endpoints (table) | documentation-backfill |
| Dependencies: External (table) | gap-analysis |
| Dependencies: Internal | documentation-backfill |
| Authentication & Authorization | gap-analysis, documentation-backfill |
| Security Findings (Preliminary) | gap-analysis |
| Infrastructure | gap-analysis |
| Testing | gap-analysis |
| Gaps Identified (High-Level) | gap-analysis |

**Severity markers in Security Findings must use these exact prefixes:**
- `🔴 Critical` — gap-analysis uses these to populate its Critical Gaps section
- `🟡 High` — maps to High Priority Gaps
- `🟢 Medium` — maps to Medium Priority Gaps

---

## Handoff Notes Contract

When agents hand off work on a shared task, notes must follow this format in the task's `notes` field:

```
[Agent Role]: [Work completed]. [Key decisions or context]. Ready for [Next Agent Role].
```

Example:
```
Implementation Agent: Auth endpoints created (login, signup, password-reset). Used bcrypt for password hashing per PDB Section 4. Ready for Testing Agent.
```

---

## Maintenance

When modifying any agent's output format:
1. Check this document for downstream consumers
2. Update the contract if the format change is intentional
3. Update all consumers to handle the new format
4. Update all producers to match the contract
