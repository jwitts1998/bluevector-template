---
description: Task-driven workflow and multi-agent collaboration guidelines for {{PROJECT_NAME}}
alwaysApply: true
---

# Workflow & Tasks

## Task-Driven Development

This project uses task files to organize and track work:

- **Portfolio-level tasks**: `tasks.yml` — Milestones and high-level goals
- **Feature tasks**: `tasks/{{FEATURE}}.yml` — Detailed implementation tasks

## Task Structure

Each task includes:
- `id`: Unique identifier
- `title`: Clear, actionable description
- `type`: story | chore | spike
- `status`: todo | in_progress | blocked | done
- `priority`: high | medium | low
- `agent_roles`: Which agents should work on this task
- `spec_refs`: Links to requirements/design documents
- `acceptance_criteria`: Definition of done
- `tests`: Test requirements

## Task Workflow

1. **Select a Task**: Choose a task with `status: todo` (prefer `priority: high`)
2. **Read Context**: Review `spec_refs`, `description`, and `acceptance_criteria`
3. **Check Agent Roles**: Verify your agent type matches `agent_roles` field
4. **Implement**: Work on the task following project conventions
5. **Verify**: Ensure all `acceptance_criteria` are met
6. **Update Status**: Propose status change when complete

## Multi-Agent Development

See `AGENTS.md` for agent role definitions, collaboration patterns, and quality checklists.

**Agent Roles** (check `agent_roles` field in tasks):
- `{{AGENT_ROLE_1}}`: {{AGENT_ROLE_1_DESCRIPTION}}
- `{{AGENT_ROLE_2}}`: {{AGENT_ROLE_2_DESCRIPTION}}
- `{{AGENT_ROLE_3}}`: {{AGENT_ROLE_3_DESCRIPTION}}

## Before Making Changes

1. Check `tasks.yml` or `tasks/*.yml` for current priorities
2. Review related documentation in `{{DOCS_DIRECTORY}}/`
3. Understand the feature's architecture pattern
4. Check for existing similar patterns in the codebase

## Session Checklist

Before completing any task, verify:

- [ ] Task file updated with status and notes
- [ ] Relevant documentation updated
- [ ] Tests pass
- [ ] No hardcoded secrets or credentials
- [ ] Agent handoff notes added (if task has multiple `agent_roles`)
- [ ] Acceptance criteria reviewed and met
