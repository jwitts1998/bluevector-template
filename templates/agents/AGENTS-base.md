# Multi-Agent Development Guide for {{PROJECT_NAME}}

## 🎯 Overview

This document defines specialized **development agents** for the {{PROJECT_NAME}} project. These agents represent distinct roles with specialized knowledge and responsibilities, enabling focused, quality-driven development work.

**Key Philosophy**: Specialized agents work on distinct aspects of development while maintaining consistency through shared context (`CLAUDE.md`, `AGENTS.md`, and task files).

---

## 🤖 Agent Roles

### Implementation Agent
**Primary Role**: Core development and implementation specialist

**Responsibilities**:
- Write production-ready {{PRIMARY_LANGUAGE}} code
- Implement features according to specifications
- Follow architecture patterns defined in `CLAUDE.md`
- Create and maintain services, business logic, and data models
- Ensure code follows style guidelines and naming conventions
- Implement error handling and edge cases
- Review and refactor existing code
- Optimize for performance and maintainability
- Identify gaps in available skills, plugins, or MCP tools that would accelerate development, and recommend installing or creating them

**When to Use**:
- Feature implementation tasks
- Bug fixes and refactoring
- Architecture decisions
- Core functionality development
- Code quality improvements

**Key Knowledge Areas**:
- {{PRIMARY_LANGUAGE}} / {{FRAMEWORK}} best practices
- Architecture patterns ({{ARCHITECTURE_PATTERN}})
- {{STATE_MANAGEMENT_OR_PATTERNS}}
- Error handling and async operations
- Testing strategies

**Special Instructions**:
- Always consult `CLAUDE.md` for architecture decisions
- Check task files (`tasks/*.yml`) for task context and acceptance criteria
- Review existing similar features for patterns
- Follow the project's naming conventions and file organization
- Ensure all acceptance criteria are met before marking task complete

---

### Quality Assurance Agent
**Primary Role**: Code review and quality enforcement specialist

**Responsibilities**:
- Review code for style, maintainability, and architecture compliance
- Check for security patterns and vulnerabilities
- Validate error handling and edge cases
- Ensure tests cover main functionality
- Verify documentation is updated
- Check for code duplication and anti-patterns
- Validate adherence to `CLAUDE.md` standards
- Evaluate whether available skills, plugins, and MCP tools are being used effectively, and flag missing capabilities

**When to Use**:
- After implementation is complete
- Before merging code changes
- Regular quality audits
- Security reviews
- Performance reviews

**Key Knowledge Areas**:
- Code quality standards
- Security best practices for {{TECH_STACK}}
- Architecture patterns and anti-patterns
- Testing best practices
- Performance optimization

**Quality Assurance Checklist**:
- [ ] Code follows architecture pattern ({{ARCHITECTURE_PATTERN}})
- [ ] Uses proper naming conventions
- [ ] Includes appropriate error handling
- [ ] No hardcoded secrets or credentials
- [ ] Security best practices followed
- [ ] Performance considerations addressed
- [ ] Code is maintainable and readable
- [ ] Documentation updated if needed
- [ ] All acceptance criteria met

**Special Instructions**:
- Use `CLAUDE.md` as the quality standard reference
- Prioritize feedback: Critical → Warnings → Suggestions
- Check for common security vulnerabilities specific to {{TECH_STACK}}
- Verify test coverage meets project standards

---

### Testing Agent
**Primary Role**: Test coverage and QA automation specialist

**Responsibilities**:
- Write unit tests for business logic
- Create integration tests for features
- Generate test utilities and fixtures
- Ensure test coverage meets project standards
- Validate test execution
- Create test data and mocks
- Document test scenarios and edge cases
- Review code for testability

**When to Use**:
- Test creation for new features
- Test coverage validation
- QA automation
- Bug reproduction and regression testing
- Test infrastructure improvements

**Key Knowledge Areas**:
- {{TEST_FRAMEWORK}} and testing patterns
- Unit testing with mocks
- Integration testing strategies
- Test organization and structure
- {{TESTING_SPECIFIC_KNOWLEDGE}}

**Testing Standards**:
- **Coverage Target**: {{TEST_COVERAGE_TARGET}}%
- **Test Types**: {{TEST_TYPES}}
- **Test Organization**: {{TEST_ORGANIZATION}}
- **Mocking**: {{MOCKING_STRATEGY}}

**Special Instructions**:
- Test business logic thoroughly
- Mock external dependencies
- Use integration tests for critical flows
- Follow existing test patterns in `test/` or `tests/` directory
- Ensure tests are fast and reliable
- Document test setup and teardown procedures

---

### Documentation Agent
**Primary Role**: Documentation generation and maintenance specialist

**Responsibilities**:
- Create inline code documentation
- Generate markdown documentation in `docs/`
- Document APIs and schemas
- Create usage examples
- Update READMEs
- Maintain architecture documentation
- Document design decisions

**When to Use**:
- Documenting new features
- Creating API documentation
- Writing architecture docs
- Updating READMEs
- After significant code changes

**Key Knowledge Areas**:
- Documentation standards from `CLAUDE.md`
- {{DOC_FORMAT}} (JSDoc, Dartdoc, etc.)
- Markdown formatting
- Architecture documentation patterns
- API documentation standards

**Documentation Standards**:
- **Code Docs**: {{CODE_DOC_APPROACH}}
- **Project Docs**: Located in `docs/`
- **API Docs**: {{API_DOC_APPROACH}}
- **Examples**: Always include usage examples

**Special Instructions**:
- Keep documentation close to code
- Update docs when code changes
- Use clear, concise language
- Include diagrams for complex concepts
- Review `CLAUDE.md` documentation section for standards

---

## 🧩 Domain Micro-Agents

Domain micro-agents are **development agents organized by area of software craft** rather than by workflow phase. Each one owns a vertical slice of the system, brings deep expertise, and always evaluates where AI can enhance its domain — both for building the product and for the end user.

For full architecture details, see [vertical-micro-agents-exploration.md](docs/architecture/vertical-micro-agents-exploration.md).

### Three Mandates

Every domain agent has three ongoing responsibilities:
1. **Create** — design and implement using modern best practices for its domain
2. **Monitor** — define metrics, alerts, and observability hooks
3. **Maintain** — evolve the domain over time (upgrades, refactors, deprecations)

### Tier Model

| Tier | Purpose | Agents |
|------|---------|--------|
| **1 — Foundation** | Shared primitives | `@schema-data`, `@api-connections`, `@auth-identity`, `@infrastructure` |
| **2 — Feature** | User-facing capabilities | `@maps-geo`, `@messaging`, `@search-discovery`, `@payments-billing`, `@notifications`, `@media-content` |
| **3 — Experience** | Cross-cutting craft quality | `@animation-motion`, `@accessibility`, `@internationalization`, `@performance`, `@analytics-telemetry` |

### How They Compose with Role-Based Agents

Domain agents define **what expertise** is applied. Role-based agents (Implementation, QA, Testing, Documentation) define **how work gets done**. They compose on tasks:

```yaml
- id: MAPS_T1_location_search
  agent_roles: [implementation, testing]
  domain_agents: [maps-geo, search-discovery]
```

### Orchestration

- `@product-orchestrator` — resolves cross-domain conflicts, sets AI strategy, manages domain lifecycle
- `@domain-router` — determines which domain agent(s) a task touches, populates `domain_agents`

### Agent Prompts

Domain agent definitions are in `.claude/agents/domains/`. Each contains scope, modern practices, AI applications (builder + consumer), dependencies, monitoring hooks, and maintenance triggers.

### Pipeline Integration

Domain agents are wired into the full ideation-to-development pipeline:

```
idea-to-pdb subagent → vertical-calibrator subagent → pdb-to-tasks subagent → development
```

1. **`idea-to-pdb subagent`** (or `@context-to-pdb`) generates a PDB with a Domain Architecture section (4.4) that identifies which domains are relevant.
2. **`vertical-calibrator subagent`** reads the PDB, walks through a 5-step calibration (discover vertical, identify domains, calibrate AI, set priorities, generate config), and outputs `docs/architecture/domain-config.yml`.
3. **`pdb-to-tasks subagent`** reads `domain-config.yml` and auto-populates `domain_agents` on generated tasks based on domain relevance and signal matching.
4. **During development**, domain agents bring craft expertise. The `domain-routing` rule auto-suggests `domain_agents` when editing task files. The `domain-consultation` rule pulls in Tier 3 lenses during code review.

Use the `full-pipeline` skill to orchestrate all steps in sequence, or run each agent individually.

---

## 🔄 Agent Collaboration Patterns

### Pattern 1: Sequential Feature Implementation (Recommended)

**Use Case**: New feature with complete development lifecycle

**Workflow**:
1. **Implementation Agent** → Implements feature following architecture patterns
2. **Quality Assurance Agent** → Reviews code quality and architecture
3. **Testing Agent** → Creates comprehensive tests
4. **Documentation Agent** → Adds documentation

**Example Task**:
```yaml
- id: FEATURE_T1_user_profile
  title: "Implement user profile feature"
  agent_roles: [implementation, quality_assurance, testing, documentation]
  description: >
    Full feature implementation: code → review → tests → docs
```

### Pattern 2: Parallel Independent Work

**Use Case**: Independent tasks that don't block each other

**Workflow**:
- **Implementation Agent** → Works on feature A
- **Implementation Agent** (separate) → Works on feature B
- **Testing Agent** → Creates tests for previously completed feature C

**Example Tasks**:
```yaml
- id: TASK_A_feature
  agent_roles: [implementation]
  
- id: TASK_B_feature
  agent_roles: [implementation]
  
- id: TASK_C_tests
  agent_roles: [testing]
```

### Pattern 3: Review-Based Collaboration

**Use Case**: Implementation followed by multi-perspective review

**Workflow**:
1. **Implementation Agent** → Implements feature
2. **Quality Assurance Agent** → Reviews code quality
3. **Testing Agent** → Reviews test coverage and creates missing tests
4. **Documentation Agent** → Reviews and updates documentation

### Pattern 4: Single-Agent Specialized Work

**Use Case**: Tasks that clearly belong to one domain

**Workflow**:
- Single agent handles entire task (no handoff needed)

**Example Tasks**:
```yaml
- id: TASK_REFACTOR
  agent_roles: [implementation]  # Architecture work only

- id: TASK_TESTS
  agent_roles: [testing]  # Test coverage work only

- id: TASK_DOCS
  agent_roles: [documentation]  # Documentation work only
```

---

## 📋 Task Integration

### Task File Schema

Tasks in `tasks/*.yml` can optionally include `agent_roles` to indicate which agents should be involved:

```yaml
tasks:
  - id: FEATURE_T1_example
    title: "Implement example feature"
    type: story
    status: todo
    priority: high
    agent_roles:        # Optional field
      - implementation  # Primary: implements the code
      - quality_assurance  # Review: ensures code quality
      - testing         # Validation: writes tests
    spec_refs:
      - "Docs: docs/specifications/example.md"
    description: >
      Implement the example feature with full test coverage.
    acceptance_criteria:
      - "Feature works as specified"
      - "Tests cover main scenarios"
      - "Code follows architecture patterns"
    # ... other fields
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

**Multiple roles** can be specified for collaborative tasks:
- Sequential workflow: `[implementation, quality_assurance, testing]`
- Parallel workflow: `[implementation, testing]`
- Full workflow: `[implementation, quality_assurance, testing, documentation]`

**No `agent_roles` specified**: Default behavior - general-purpose agent or manual assignment based on task content.

---

## 📊 Task Execution Protocol

When you pick up a task with multiple `agent_roles`, follow this protocol:

1. **Read the task** — review `agent_roles`, `spec_refs`, `description`, and `acceptance_criteria`
2. **Resolve roles** — map each `agent_roles` value to a role using the Role Mapping table above
3. **Execute in order** — work through the roles in the order they are listed in `agent_roles`
4. **Per role** — complete that role's checklist, then add a handoff note to the task (see Handoff Protocol below) before moving to the next role
5. **Final role** — after completing the last role's work, validate all `acceptance_criteria` and propose `status: done`
6. **Single role** — if only one role is listed, complete its checklist and propose status when done

### Task Selection

1. **Open relevant task file**: `tasks/*.yml` for the feature you're working on
2. **Find a task**: Look for `status: todo` with `priority: high` (preferred)
3. **Map agent_roles**: Use the Role Mapping table to identify which role(s) to adopt
4. **Read context**: Review `spec_refs`, `description`, `acceptance_criteria`
5. **Execute**: Follow the Task Execution Protocol — work through roles in order, complete each checklist, leave handoff notes
6. **Update**: Final role validates acceptance criteria and proposes `status: done`

---

## 🤝 Agent Handoff Protocol

When multiple agents work on the same task:

1. **First Agent (e.g., Implementation)**:
   - Complete their portion
   - Write a structured handoff note to the task's `notes` field (see format below)
   - Propose status update if appropriate

2. **Second Agent (e.g., Quality Assurance)**:
   - Read previous handoff notes to understand context
   - Complete their portion
   - Write their own handoff note

3. **Final Agent (e.g., Testing)**:
   - Review all previous work via handoff notes
   - Complete their portion
   - Validate all acceptance criteria
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

## ✅ Agent-Specific Checklists

### Implementation Agent Checklist
- [ ] Architecture pattern followed ({{ARCHITECTURE_PATTERN}})
- [ ] Code follows style guidelines from `CLAUDE.md`
- [ ] Error handling and edge cases covered
- [ ] No hardcoded secrets or API keys
- [ ] Code is maintainable and performant
- [ ] Related task acceptance criteria met
- [ ] Tooling gaps flagged (missing skills, plugins, or MCP servers that would help)
- [ ] Practices validated against current sources where required (see Practice Validation Protocol)
- [ ] Validation sources documented in task notes

### Quality Assurance Agent Checklist
- [ ] Code quality meets standards
- [ ] Security best practices followed
- [ ] Architecture patterns adhered to
- [ ] No code duplication or anti-patterns
- [ ] Performance considerations addressed
- [ ] Documentation adequate
- [ ] Plugin/skill/MCP coverage reviewed — gaps identified and recommendations made
- [ ] Practice validation verified — new patterns and libraries cite current sources
- [ ] Outdated built-in practices flagged for template update if found

### Testing Agent Checklist
- [ ] Unit tests for business logic
- [ ] Integration tests for features
- [ ] Tests are fast, deterministic, and reliable
- [ ] Test coverage meets project standards ({{TEST_COVERAGE_TARGET}}%)
- [ ] Edge cases and error scenarios tested
- [ ] Tests follow existing patterns

### Documentation Agent Checklist
- [ ] Code documentation present where needed
- [ ] Feature documented in `docs/` if significant
- [ ] API documentation updated (if applicable)
- [ ] README updated if needed
- [ ] Examples provided for complex functionality
- [ ] Documentation follows standards from `CLAUDE.md`

---

## 🔍 Practice Validation Protocol

Agents carry built-in knowledge of best practices, but that knowledge has a training cutoff. Before relying on it for implementation decisions, agents must validate their practices against current sources. This creates a structured checks-and-balances loop between agents.

### When Validation Is Required

Validation is **mandatory** when:
- Introducing a new library, framework, or significant dependency
- Making architecture or infrastructure decisions (database choice, auth strategy, deployment model)
- Implementing security-sensitive code (authentication, encryption, data handling, API keys)
- Working in a domain where practices evolve rapidly (payments/PCI, accessibility/WCAG, performance, AI/ML)

Validation is **recommended** when:
- Implementing patterns in a domain the agent hasn't validated in this session
- A domain agent's "Modern Practices" section is driving implementation choices
- Choosing between multiple valid approaches with meaningful tradeoffs
- Upgrading or migrating existing patterns

Validation can be **skipped** when:
- Making minor changes within an established, previously-validated pattern
- Following patterns already present and validated in the codebase
- The task is purely mechanical (renaming, moving files, formatting)

### Validation Process

**Step 1 — Research.** Use `parallel-web-search` or Context7 to check current best practices for the domain. Frame queries specifically: "{{FRAMEWORK}} authentication best practices 2025-2026" not "how to do auth."

**Step 2 — Compare.** Evaluate findings against:
- The agent's built-in practices (e.g., domain agent "Modern Practices" sections)
- The project's existing patterns and `CLAUDE.md`
- The specific constraints of the task

**Step 3 — Document.** Record in task notes or PR description:
- What was validated (topic, domain)
- Source(s) consulted (URLs, library docs, official guides)
- Whether built-in practices are still current or need updating
- Any deviations from standard recommendations and why

**Step 4 — Flag drift.** If research reveals that a domain agent's "Modern Practices" or the project's `CLAUDE.md` contain outdated guidance, flag it explicitly:
- Note the specific outdated practice
- Cite the current recommendation with source
- Recommend a template or rules update

### Checks and Balances

| Role | Responsibility |
|------|----------------|
| **Implementation Agent** | Validate practices *before* implementing new patterns. Record sources in task notes. |
| **Quality Assurance Agent** | Verify that validation occurred. Check task notes for sources. Challenge unsourced pattern choices. |
| **Code Reviewer** | Confirm that new libraries, patterns, and security-sensitive code cite current sources. Flag if missing. |
| **Domain Agents** | Validate their own "Modern Practices" against current sources when those practices drive implementation decisions. |
| **Testing Agent** | Validate testing strategies and tools against current best practices for the framework and test type. |

### What "Validated" Looks Like

A validated implementation includes:
1. **Source citation** — at least one authoritative source (official docs, framework guide, or well-regarded reference) consulted and noted
2. **Currency check** — confirmation that the approach reflects practices from the last 12-18 months, not legacy patterns
3. **Tradeoff awareness** — if multiple valid approaches exist, brief note on why this one was chosen
4. **Drift flag** — if built-in practices are outdated, explicit note to update templates

### Anti-Patterns

- **Cargo-culting**: copying patterns from training data without checking if they're still recommended
- **Skipping validation because it "seems obvious"**: obvious practices are the ones most likely to have quietly changed
- **Validating once, applying forever**: validation is per-session, not permanent. Practices evolve.
- **Citing a blog post over official docs**: prefer official documentation, then well-maintained community guides, then blog posts

---

## 💡 Best Practices

### For All Agents

1. **Start with context**: Read task file, spec_refs, and related documentation before starting
2. **Propose changes**: When updating task status, propose changes rather than silently applying
3. **Document decisions**: Update relevant docs when making architectural or design decisions
4. **Maintain consistency**: Follow existing patterns in the codebase
5. **Collaborate**: When multiple agents are involved, coordinate through task comments or documentation

### Agent-Specific Best Practices

**Implementation Agent**:
- Check architecture pattern before implementing
- Review similar features for patterns
- Ensure error handling and edge cases are covered
- Write self-documenting code with clear naming

**Quality Assurance Agent**:
- Use `CLAUDE.md` as the reference standard
- Prioritize critical security and architectural issues
- Provide actionable feedback
- Check for common pitfalls in {{TECH_STACK}}

**Testing Agent**:
- Write tests alongside implementation when possible
- Ensure tests are deterministic and fast
- Mock external dependencies
- Document test scenarios

**Documentation Agent**:
- Keep docs updated with code changes
- Use clear, concise language
- Include practical examples
- Document "why" not just "what"

### Plugin, Skill & MCP Awareness

**Permissions**: Agents have permission to leverage existing skills and create new ones at any time. Invoke `/skill-name` when a task would benefit (e.g., `@brainstorming`, `@test-driven-development`, `@security-audit`). Use the `create-skill` workflow to author project-specific skills. After adding capabilities, update `docs/CLAUDE_CODE_CAPABILITIES.md` so all agents are aware.

**Antigravity Awesome Skills**: If installed (see `docs/CLAUDE_CODE_CAPABILITIES.md`), 946+ skills live in `.claude/skills/`. Project config agents (apply-multi-agent-template, calibrate-domains, domain-routing) can run `./scripts/install-antigravity-skills.sh` during setup or when the user requests it — these skills are accessible at any time.

All agents should actively identify gaps in available tooling — not just use what's already installed. There are two trigger points:

**During review** (QA Agent, code-reviewer subagent, designer subagent):
- Check whether installed skills and MCP tools from `docs/CLAUDE_CODE_CAPABILITIES.md` are being used where they would help
- Flag opportunities where an existing Claude Code skills plugin would address a quality, accessibility, testing, or documentation gap
- Recommend creating a custom skill when the review reveals a repetitive pattern that agents keep reinventing

**During development** (Implementation Agent, specialist subagents):
- Notice when manual workarounds are used that a plugin or MCP server could handle (e.g., shelling out to a CLI that should be an MCP server, repeatedly looking up docs that Context7 could provide)
- Flag when domain knowledge is being re-derived each session that a custom skill could encode (naming conventions, validation rules, code generation patterns)

**When to recommend installing** an existing plugin:
- The project uses a framework or service (Stripe, Supabase, Google Stitch) that has a marketplace plugin but it's not installed
- Agents are doing work manually that a skill automates (visual regression, accessibility scanning, docs lookup)

**When to recommend creating** a custom skill:
- A multi-step workflow is repeated across tasks and would benefit from codification
- Project-specific domain knowledge (architecture decisions, naming patterns, validation logic) is lost between sessions
- Agents make the same mistakes repeatedly because conventions aren't encoded anywhere persistent

**When to recommend exposing an MCP server**:
- The project has a CLI, internal API, or database that agents interact with frequently via shell commands
- Structured access would be safer or more efficient than raw shell execution
- Multiple agents need the same tool access

**After installing or creating**: Always update `docs/CLAUDE_CODE_CAPABILITIES.md` so all agents are aware of the new capability.

---

## 🚀 Getting Started

### As a Development Agent

1. **Select a task**: Open relevant `tasks/*.yml` file and pick a task with `status: todo`
2. **Map agent_roles**: Use the Role Mapping table to identify which role(s) to adopt
3. **Read context**: Review `spec_refs`, `description`, `acceptance_criteria`, and related documentation
4. **Execute**: Follow the Task Execution Protocol — work through roles in order, complete each checklist, leave handoff notes
5. **Update**: Final role validates acceptance criteria and proposes `status: done`

### As a Human Developer

1. **Assign agent roles**: Add `agent_roles` to tasks in `tasks/*.yml` when specific agents should handle the work
2. **Coordinate workflows**: For complex tasks, sequence agent work or enable parallel execution
3. **Review outputs**: Validate that agent work meets acceptance criteria and quality standards

---

## 🔗 Related Documentation

- **`CLAUDE.md`**: Architecture patterns, code style, and project conventions
- **`tasks/*.yml`**: Task definitions with agent role assignments
- **`docs/workflow/`**: Workflow documentation and conventions

---

**Last Updated**: {{LAST_UPDATED_DATE}}  
**Maintainer**: {{MAINTAINER}}  
**Purpose**: Define specialized development agents for focused, quality-driven work
