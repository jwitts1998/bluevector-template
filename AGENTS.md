# Multi-Agent Development Guide

## Overview

This document defines specialized development agents for this project. Agents are perspectives you adopt when working on tasks — each has distinct responsibilities and quality standards.

**Status**: This is the generic starter version. Run `./setup.sh` to generate a project-specific version with your tech stack and architecture details.

---

## Agent Roles

### Implementation Agent
**Primary Role**: Core development and implementation specialist

**Responsibilities**:
- Write production-ready code following architecture patterns
- Implement features according to specifications
- Follow conventions defined in `CLAUDE.md`
- Create and maintain services, business logic, and data models
- Handle error cases and edge cases

**When to Use**: Feature implementation, bug fixes, refactoring, architecture decisions

**Checklist**:
- [ ] Architecture pattern followed
- [ ] Code follows style guidelines from `CLAUDE.md`
- [ ] Error handling and edge cases covered
- [ ] No hardcoded secrets or API keys
- [ ] Acceptance criteria met
- [ ] Practices validated against current sources where required (see Practice Validation Protocol)
- [ ] Validation sources documented in task notes

---

### Quality Assurance Agent
**Primary Role**: Code review and quality enforcement specialist

**Responsibilities**:
- Review code for style, maintainability, and architecture compliance
- Check for security patterns and vulnerabilities
- Validate error handling and edge cases
- Ensure tests cover main functionality
- Verify documentation is updated

**When to Use**: After implementation, before merging, regular quality audits, security reviews

**Checklist**:
- [ ] Code quality meets standards
- [ ] Security best practices followed
- [ ] Architecture patterns adhered to
- [ ] No code duplication or anti-patterns
- [ ] Performance considerations addressed
- [ ] Documentation adequate
- [ ] Practice validation verified — new patterns and libraries cite current sources
- [ ] Outdated practices flagged for update if found

---

### Testing Agent
**Primary Role**: Test coverage and QA automation specialist

**Responsibilities**:
- Write unit tests for business logic
- Create integration tests for features
- Ensure test coverage meets project standards
- Create test data and mocks
- Review code for testability

**When to Use**: Test creation, coverage validation, bug reproduction, regression testing

**Checklist**:
- [ ] Unit tests for business logic
- [ ] Integration tests for features
- [ ] Tests are fast, deterministic, and reliable
- [ ] Edge cases and error scenarios tested
- [ ] Tests follow existing patterns

---

### Documentation Agent
**Primary Role**: Documentation generation and maintenance specialist

**Responsibilities**:
- Create inline code documentation
- Generate markdown documentation in `docs/`
- Document APIs and schemas
- Create usage examples
- Keep documentation current with code changes

**When to Use**: Documenting new features, creating API docs, after significant code changes

**Checklist**:
- [ ] Public functions/classes documented
- [ ] Feature documented in `docs/` if significant
- [ ] API documentation updated (if applicable)
- [ ] Examples provided for complex functionality

---

## Agent Collaboration Patterns

### Sequential Feature Implementation (Recommended)
1. **Implementation Agent** — implements feature
2. **Quality Assurance Agent** — reviews code quality
3. **Testing Agent** — creates tests
4. **Documentation Agent** — adds documentation

### Parallel Independent Work
- Multiple Implementation Agents on independent features
- Testing Agent on previously completed features

### Single-Agent Specialized Work
- One agent handles entire task (no handoff needed)

---

## Task Integration

Tasks in `tasks/*.yml` include an `agent_roles` field:

```yaml
- id: FEATURE_T1_example
  title: "Implement example feature"
  agent_roles: [implementation, quality_assurance, testing]
  spec_refs:
    - "PDB: docs/product_design/app_pdb.md — Section 3"
  acceptance_criteria:
    - "Feature works as specified"
    - "Tests cover main scenarios"
```

### Role Mapping

Task files use short `agent_roles` values. This table maps each value to the role (and checklist) the agent should adopt:

| `agent_roles` value | Role to adopt | Notes |
|----------------------|---------------|-------|
| `implementation` | Implementation Agent | Core development work |
| `quality_assurance` | Quality Assurance Agent | Code review and quality enforcement |
| `testing` | Testing Agent | Test creation and coverage |
| `documentation` | Documentation Agent | Docs and API reference |
| `ui_ux` | Implementation Agent | UI/UX focus — use Implementation checklist plus design system review |
| `security` | Quality Assurance Agent | Security focus — use QA checklist with emphasis on security items |
| `frontend` | Implementation Agent | Frontend-scoped implementation |
| `backend` | Implementation Agent | Backend-scoped implementation |
| `database` | Implementation Agent | Database-scoped implementation |
| `api` | Implementation Agent | API-scoped implementation |

If a task lists a value not in this table, treat it as Implementation Agent unless the project's AGENTS.md defines a different mapping. Stack-specific AGENTS templates (full-stack, web, mobile, backend) override this table with their own role definitions.

---

## Task Execution Protocol

When you pick up a task with multiple `agent_roles`, follow this protocol:

1. **Read the task** — review `agent_roles`, `spec_refs`, `description`, and `acceptance_criteria`
2. **Resolve roles** — map each `agent_roles` value to a role using the Role Mapping table above
3. **Execute in order** — work through the roles in the order they are listed in `agent_roles`
4. **Per role** — complete that role's checklist, then add a handoff note to the task (see Handoff Protocol below) before moving to the next role
5. **Final role** — after completing the last role's work, validate all `acceptance_criteria` and propose `status: done`
6. **Single role** — if only one role is listed, complete its checklist and propose status when done

---

## Practice Validation Protocol

Agents carry built-in knowledge of best practices, but that knowledge has a training cutoff. Before relying on it for implementation decisions, agents must validate against current sources. This creates a checks-and-balances loop between agents.

### When Validation Is Required

**Mandatory:**
- Introducing a new library, framework, or significant dependency
- Making architecture or infrastructure decisions
- Implementing security-sensitive code (auth, encryption, data handling)
- Working in rapidly-evolving domains (payments/PCI, accessibility/WCAG, performance, AI/ML)

**Recommended:**
- Implementing patterns in a domain not yet validated this session
- Choosing between multiple valid approaches with meaningful tradeoffs

**Skip:**
- Minor changes within an established, previously-validated pattern
- Purely mechanical tasks (renaming, moving files, formatting)

### Process

1. **Research** — Use `parallel-web-search` or Context7 to check current practices for the domain
2. **Compare** — Evaluate findings against built-in practices, project patterns, and `CLAUDE.md`
3. **Document** — Record what was validated, source(s) consulted, and any deviations in task notes
4. **Flag drift** — If research reveals outdated guidance in agent templates or `CLAUDE.md`, flag explicitly

### Checks and Balances

| Role | Responsibility |
|------|----------------|
| **Implementation Agent** | Validate practices *before* implementing new patterns. Record sources in task notes. |
| **Quality Assurance Agent** | Verify that validation occurred. Check task notes for sources. Challenge unsourced pattern choices. |
| **Code Reviewer** | Confirm new libraries, patterns, and security-sensitive code cite current sources. Flag if missing. |
| **Testing Agent** | Validate testing strategies and tools against current best practices for the framework. |

### Anti-Patterns

- **Cargo-culting**: copying patterns from training data without checking if they're still recommended
- **Skipping validation because it "seems obvious"**: obvious practices are the ones most likely to have quietly changed
- **Validating once, applying forever**: validation is per-session, not permanent
- **Citing a blog post over official docs**: prefer official documentation, then well-maintained community guides

---

## Handoff Protocol

When multiple agents work on the same task:

1. **First Agent**: Complete work, add notes: "Implementation complete. Ready for QA."
2. **Next Agent**: Review previous work, complete their portion, add notes
3. **Final Agent**: Validate all acceptance criteria, propose `status: done`

---

## Using Cursor Plugins and Skills

Installed Claude Code skills provide **agent skills** and **MCP tools** that any agent can use when relevant to a task. Prefer these over manual approaches when they apply.

**Permissions**: Agents have permission to leverage existing skills and create new ones at any time. When a task would benefit from a skill (e.g., brainstorming, TDD, security audit), invoke it or create a custom skill via the `create-skill` workflow. Update `docs/CLAUDE_CODE_CAPABILITIES.md` after adding capabilities.

**Antigravity Awesome Skills**: If installed (see `docs/CLAUDE_CODE_CAPABILITIES.md`), 946+ additional skills are available in `.claude/skills/` — brainstorming, test-driven-development, security-audit, architecture, and more. Use `/skill-name` at any time. Project config agents (e.g., apply-multi-agent-template, calibrate-domains) can run `./scripts/install-antigravity-skills.sh` during setup or when the user requests it.

**Role-specific guidance**:
- **Implementation Agent**: Use workflow skills (brainstorming, writing-plans, TDD) when starting features. Use Context7 or docs-lookup for library API reference. Use Stitch design skills when implementing from designs.
- **Quality Assurance Agent**: Use code-review workflow skills for structured reviews. Use BrowserStack for cross-browser and accessibility testing. Use verification-before-completion before signing off.
- **Testing Agent**: Use BrowserStack Automate / App Automate for cross-platform test runs. Use Percy for visual regression testing. Use systematic-debugging when investigating test failures.
- **Documentation Agent**: Use Context7 docs-lookup for accurate library references. Use web search for current best practices. Use continual-learning to surface recurring patterns from past sessions.

See `docs/CLAUDE_CODE_CAPABILITIES.md` for the complete list of available capabilities.

---

## Getting Started

1. **Select a task**: Open `tasks/*.yml`, find `status: todo` with `priority: high`
2. **Map agent_roles**: Use the Role Mapping table to identify which role(s) to adopt
3. **Read context**: Review `spec_refs`, `description`, `acceptance_criteria`
4. **Execute**: Follow the Task Execution Protocol — work through roles in order, complete each checklist, leave handoff notes
5. **Update**: Final role validates acceptance criteria and proposes `status: done`
