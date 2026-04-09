# Multi-Agent Development Workflow

**Date**: January 2026  
**Status**: Active

## 🎯 Purpose

This document describes how specialized development agents collaborate to implement features efficiently while maintaining code quality and consistency.

---

## 🤖 Agent Roles Summary

See `AGENTS.md` for detailed agent responsibilities. Common roles:

- **Implementation Agent**: Business logic, services, core functionality
- **UI/UX Agent** (Frontend): Design system, accessibility, user experience
- **Quality Assurance Agent**: Code review, security, architecture compliance
- **Testing Agent**: Test coverage, QA automation
- **Documentation Agent**: Code docs, architecture docs, API docs

---

## 🔄 Workflow Patterns

### Pattern 1: Sequential Feature Implementation (Recommended)

**Use Case**: New feature with complete development lifecycle

**Workflow**:
1. **{{FIRST_AGENT}}** → Initial implementation or design
2. **{{SECOND_AGENT}}** → Review or build upon first agent's work
3. **Testing Agent** → Write comprehensive tests
4. **Documentation Agent** → Add documentation

**Example Task**:
```yaml
- id: FEATURE_T1_user_profile
  title: "Implement user profile feature"
  agent_roles: [{{AGENT_ROLE_1}}, {{AGENT_ROLE_2}}, testing, documentation]
  description: >
    Full feature: {{WORKFLOW_DESCRIPTION}}
```

### Pattern 2: Parallel Independent Work

**Use Case**: Independent tasks that don't block each other

**Workflow**:
- **Agent A** → Works on feature/task A
- **Agent B** → Works on feature/task B simultaneously
- **Agent C** → Works on feature/task C simultaneously

#### Conflict Avoidance

Before starting parallel work, check for file-level overlap to prevent merge conflicts and duplicated effort:

1. **Check `code_areas` overlap**: Compare the `code_areas` of all `in_progress` tasks. If two tasks list the same file or directory, they risk conflicts.
2. **If overlap is detected**:
   - **Serialize**: Work on one task first if the overlap is significant (same core file)
   - **Designate ownership**: If the overlap is incidental (e.g., both touch a shared utility), the task whose `code_areas` lists the file as its primary concern owns it. The other task waits for the shared-file changes before modifying it.
   - **Coordinate via handoff notes**: If both tasks must proceed, add a note to each task identifying the shared files and which task owns them
3. **Shared file convention**: A task "owns" a file when that file is central to the task's purpose (listed first in `code_areas` or directly referenced in `description`). Tasks that touch a file incidentally (e.g., adding an import) should coordinate with the owner.

This is advisory — convention over runtime locking. The goal is to avoid wasted work from conflicting edits, not to enforce strict file locking.

### Pattern 3: Review-Based Collaboration

**Use Case**: Implementation followed by multi-perspective review

**Workflow**:
1. **Implementation Agent** → Implements feature
2. **Quality Assurance Agent** → Reviews code quality
3. **Testing Agent** → Reviews test coverage and creates missing tests
4. **Documentation Agent** → Reviews and updates documentation

---

## 📋 Task Selection Process

1. **Open relevant task file**: `tasks/*.yml` for the feature
2. **Find a task**: Look for `status: todo` with `priority: high`
3. **Check agent_roles**: Verify your agent type matches
4. **Read context**: Review `spec_refs`, `description`, `acceptance_criteria`
5. **Check dependencies**: Ensure `blocked_by` tasks are complete
6. **Propose status change**: Suggest `status: in_progress` before starting
7. **Work on task**: Follow agent-specific responsibilities
8. **Update task**: Propose `status: done` when acceptance criteria are met

---

## 🤝 Agent Handoff Protocol

When multiple agents work on the same task:

1. **First Agent**:
   - Complete their portion
   - Write a structured handoff note to the task's `notes` field (see format below)
   - Propose status update if appropriate

2. **Subsequent Agents**:
   - Read previous handoff notes to understand context
   - Complete their portion
   - Write their own handoff note
   - Hand off to next agent or mark complete

3. **Final Agent**:
   - Validate all acceptance criteria
   - Ensure all previous work is integrated
   - Write final handoff note and propose `status: done`

### Structured Handoff Note Format

Use structured YAML entries in the `notes` field for consistency and parseability:

```yaml
notes:
  - agent: implementation
    status: complete
    summary: "PUT /api/v1/users/:id/profile endpoint created."
    files_changed:
      - src/api/controllers/profileController.ts
      - src/services/profileService.ts
    decisions:
      - "5MB avatar limit based on S3 constraints"
    open_questions: []
    next: testing
```

**Required fields**:
- `agent` — which role wrote this note (matches `agent_roles` values)
- `status` — `complete`, `blocked`, or `escalated`
- `summary` — concise description of what was done (1-3 sentences)
- `next` — which agent role should pick up next (omit on final handoff)

**Optional fields**:
- `files_changed` — list of files created or modified
- `decisions` — non-obvious choices made and why
- `open_questions` — unresolved items the next agent should be aware of

Freeform string notes remain valid for backward compatibility, but the structured format is the recommended convention for new tasks.

---

## 🔄 Recovery & Escalation

When a task stalls, fails, or an agent cannot complete their portion, follow the escalation protocol rather than leaving the task in limbo.

### Escalation Ladder

| Tier | Trigger | Action |
|------|---------|--------|
| **1 — Route** | Agent encounters an issue they can classify | Route to the appropriate agent with context and recommended action |
| **2 — Decompose/Reassign** | Tier 1 agent cannot resolve after one attempt | Break the task into subtasks, or reassign to a different agent/specialist |
| **3 — Surface to user** | Tier 2 fails, or the issue requires a human decision | Present diagnosis with concrete options, pause task as `blocked` |

### How to Escalate

1. Write an escalation note to the task's `notes` field with: what went wrong, what was tried, and what should happen next
2. If the issue can be routed to another agent (Tier 1), do so immediately — don't wait for the next session
3. If routing didn't work (Tier 2), assess whether the problem needs decomposition or a different specialist
4. If the problem is outside agent capabilities (Tier 3), surface to the user with options and a recommendation

### When to Escalate vs. Retry

- **Retry** when the failure is transient (flaky test, network timeout, typo in config)
- **Escalate** when the failure is structural (missing dependency, ambiguous requirements, access permissions) or when the same fix has been attempted and failed

For the full escalation protocol with note formats and examples, see the Execution Monitor (`@execution-monitor`).

---

## 🎙️ Agent Invocation in Practice

In a typical Cursor (or other AI assistant) session, you are always talking to a single AI assistant. Agent "roles" are not separate processes -- they are perspectives enforced by context files (`CLAUDE.md`, `AGENTS.md`, task `agent_roles`).

### How to Invoke a Specific Agent Role

Reference the role explicitly in your prompt:

- "Act as the **Testing Agent** and review the test coverage for this feature."
- "As the **Documentation Agent**, update the API docs for the new endpoint."
- "Switch to the **Quality Assurance Agent** perspective and review this PR."

The AI will adopt that role's responsibilities and checklist from `AGENTS.md`.

### When to Switch Roles

Follow the handoff protocol above. After completing your portion of a task:

1. Add handoff notes to the task (e.g., "Implementation: endpoint created. Ready for Testing Agent.")
2. In your next prompt, invoke the next agent role explicitly.
3. The AI will review the previous work through the new role's lens.

### Projects with a Coordination Layer

For larger projects, you may add an **agent-router** that acts as a single entry point. The router triages intent and delegates to the appropriate agent role. To use this pattern:

- Create a router subagent (e.g., `.claude/agents/system/agent-router.md`) with a delegation matrix mapping keywords/intents to agent roles.
- Invoke the router with "Route this to the right agent" or use a convention like "@agent-router" in your prompt.
- The router will suggest which agent role should handle the request.

This is optional and most useful for teams with many agents and complex workflows. See the "Full Setup" tier in the [Customization Guide](../../docs/CUSTOMIZATION_GUIDE.md) for more details.

---

## Agent Interoperability Protocols

When agents need to access external tools or communicate with agents built on different frameworks, use these open standards.

### MCP (Model Context Protocol)

**Standard for tool discovery and calling.**

MCP defines how agents discover and invoke tools exposed by servers. Python SDK (21.8k stars), TypeScript SDK (11.7k stars). Already integrated into this template system via Claude Code skills.

For your own project, expose project-specific tools as MCP servers so any MCP-compatible agent or IDE can use them:

1. Define tools as functions with typed parameters
2. Wrap them in an MCP server (stdio or HTTP transport)
3. Register the server in agent configuration
4. Agents discover and call tools through the MCP protocol

Use MCP when: agents need to access project-specific tools, APIs, databases, or file systems through a standardized interface.

### A2A (Agent2Agent Protocol)

**Standard for cross-framework agent communication.**

[google/A2A](https://github.com/google/A2A) -- Apache-2.0, 21.9k stars. Donated to the Linux Foundation by Google. Python, TypeScript, and Java SDKs.

A2A enables agents built with different frameworks (LangGraph, CrewAI, custom) to collaborate on tasks:

- **Agent Cards**: JSON descriptors that advertise an agent's capabilities, input/output formats, and endpoint URL
- **Task lifecycle**: Agents send task requests and receive results (or stream partial results via SSE)
- **Transport**: JSON-RPC 2.0 over HTTP(S), supporting synchronous, streaming, and asynchronous push notification modes

Use A2A when: agents built with different frameworks or running in different services need to delegate tasks to each other. For example, a LangGraph orchestrator delegating a code review subtask to a CrewAI-based QA agent running as a separate service.

### MCP vs A2A

| Concern | Use MCP | Use A2A |
|---------|---------|---------|
| Agent needs to call a tool or API | Yes | No |
| Agent needs to delegate a task to another agent | No | Yes |
| Agents are in the same process/framework | MCP for tools | Not needed |
| Agents are in different services/frameworks | MCP for tools | A2A for delegation |

Both protocols are complementary. A project may use MCP for tool access and A2A for inter-agent task delegation simultaneously.

See `docs/research/agent_runtime_tooling_landscape.md` Section 6 for full evaluation of interoperability protocols.

---

## ⏸️ Session Boundaries

Cursor sessions have limited context windows and may end mid-task. This section defines how to checkpoint progress and resume cleanly.

### End-of-Session Checkpoint

Before ending a session with work in progress, write a checkpoint note to the current task's `notes` field:

```yaml
- agent: implementation
  status: in_progress
  type: session_checkpoint
  summary: "Profile editing endpoint 70% complete. Validation logic done, avatar upload in progress."
  files_in_progress:
    - src/services/profileService.ts (upload logic incomplete)
  completed_this_session:
    - Request validation for name/bio
    - Error response formatting
  remaining:
    - Avatar upload to S3
    - Rate limiting
  decisions:
    - "Using presigned URLs for avatar upload instead of proxy"
  gotchas:
    - "S3 bucket CORS not configured yet — needed before upload works"
```

**Required fields** for checkpoint notes:
- `agent` — which role was active
- `status` — always `in_progress` for checkpoints
- `type` — always `session_checkpoint` (distinguishes from handoff notes)
- `summary` — what's done and what's left (1-2 sentences)
- `remaining` — concrete list of what still needs to be done

**Optional but recommended**:
- `files_in_progress` — files being actively edited (with notes on incomplete state)
- `completed_this_session` — what was finished (helps avoid re-doing work)
- `decisions` — choices made that the next session should know about
- `gotchas` — blockers, surprises, or traps the next session should watch for

### Session Resume Protocol

When starting a new session that may continue previous work:

1. **Check for in-progress tasks**: Scan `tasks/*.yml` for any task with `status: in_progress`
2. **Read checkpoint notes**: If the task has a `type: session_checkpoint` note, read it for context — this is the minimum needed to resume
3. **Read recent episodic memory**: Check `docs/memory/episodic/` for the most recent session entry for continuity
4. **Read semantic memory**: Load `docs/memory/semantic/validated-patterns.md` for project-wide conventions
5. **Resume or start fresh**: Use the checkpoint to pick up where the previous session left off, avoiding re-reading all source files or re-deriving decisions

### When to Checkpoint vs. Archive

| Situation | Action |
|-----------|--------|
| Session ending mid-task | Write a **session_checkpoint** note to the task file |
| Session ending with completed tasks | Invoke `@memory-updater` for full episodic archive |
| Session ending with both | Checkpoint the in-progress task, then archive completed work to episodic memory |
| Quick pause (same day, same context) | Checkpoint is optional — the task's existing handoff notes may suffice |

The task file is the source of truth for in-progress work. Episodic memory is for completed work and cross-session learnings.

---

## ✅ Quality Assurance

### Agent-Specific Checklists

See `AGENTS.md` for complete checklists. Key items:

**Implementation Agent**:
- [ ] Architecture pattern followed
- [ ] Code follows style guidelines
- [ ] Error handling and edge cases covered
- [ ] No hardcoded secrets

**UI/UX Agent** (if applicable):
- [ ] Design system tokens used
- [ ] Responsive design implemented
- [ ] Accessibility requirements met
- [ ] Visual consistency maintained

**Quality Assurance Agent**:
- [ ] Code quality meets standards
- [ ] Security best practices followed
- [ ] Architecture patterns adhered to
- [ ] Performance considerations addressed

**Testing Agent**:
- [ ] Unit tests for business logic
- [ ] Integration tests for features
- [ ] Tests are fast and deterministic
- [ ] Coverage meets target ({{TEST_COVERAGE_TARGET}}%)

**Documentation Agent**:
- [ ] Code documentation present
- [ ] Feature documented in `docs/`
- [ ] API documentation updated (if applicable)
- [ ] Examples provided

---

## 💡 Best Practices

### Do's ✅

1. Start with context (read task file, spec_refs, related docs)
2. Propose status changes rather than silently applying
3. Document decisions in task notes or documentation
4. Follow existing patterns in codebase
5. Coordinate through task comments when multiple agents involved

### Don'ts ❌

1. Don't skip reading context before starting
2. Don't mark tasks complete without meeting all acceptance criteria
3. Don't ignore agent_roles assignments
4. Don't work on blocked tasks
5. Don't bypass quality checks

---

## 🔗 Related Documentation

- **AGENTS.md**: Detailed agent role definitions
- **CLAUDE.md**: Architecture and code standards
- **TASK_SCHEMA_GUIDE.md**: Task file schema documentation
- **[TASK_LIFECYCLE_EXAMPLE.md](./TASK_LIFECYCLE_EXAMPLE.md)**: End-to-end walkthrough of a task from `todo` to `done` with handoff notes

---

**Last Updated**: {{DATE}}
