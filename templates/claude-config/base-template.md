# Claude Code Agent Rules for {{PROJECT_NAME}}

## 🎯 Project Overview

{{PROJECT_DESCRIPTION}}

**Key Philosophy**: {{ARCHITECTURE_PHILOSOPHY}}

---

## 🏗️ Architecture Patterns

### Architecture Style

This project follows **{{ARCHITECTURE_PATTERN}}** architecture.

{{ARCHITECTURE_DESCRIPTION}}

### Directory Structure

```
{{PROJECT_DIRECTORY_STRUCTURE}}
```

**Key Principles**:
- {{ARCHITECTURE_PRINCIPLE_1}}
- {{ARCHITECTURE_PRINCIPLE_2}}
- {{ARCHITECTURE_PRINCIPLE_3}}

---

## 🛠️ Technology Stack

### Core Technologies

- **{{PRIMARY_LANGUAGE}}** ({{LANGUAGE_VERSION}}) - {{LANGUAGE_DESCRIPTION}}
- **{{FRAMEWORK}}** ({{FRAMEWORK_VERSION}}) - {{FRAMEWORK_DESCRIPTION}}
- **{{STATE_MANAGEMENT}}** - State management approach
- **{{TESTING_FRAMEWORK}}** - Testing infrastructure

### Additional Tools

- **Version Control**: {{VERSION_CONTROL}}
- **CI/CD**: {{CI_CD_PLATFORM}}
- **Package Manager**: {{PACKAGE_MANAGER}}

---

## 🔐 Security Requirements

### Security Best Practices

1. **Secrets Management**:
   - Never commit API keys, tokens, or credentials to version control
   - Use environment variables or secret management services
   - Add sensitive files to `.gitignore`

2. **Authentication & Authorization**:
   - {{AUTH_REQUIREMENTS}}
   - {{AUTHORIZATION_REQUIREMENTS}}

3. **Input Validation**:
   - Validate all user input
   - Sanitize data before storage or display
   - Use parameterized queries to prevent injection attacks

4. **Error Handling**:
   - Never expose sensitive information in error messages
   - Log errors with context but without sensitive data
   - Provide user-friendly error messages

5. **Dependencies**:
   - Keep dependencies up to date
   - Review security advisories regularly
   - Audit dependencies for known vulnerabilities

**Security Priorities for This Project**:
- {{SECURITY_PRIORITY_1}}
- {{SECURITY_PRIORITY_2}}
- {{SECURITY_PRIORITY_3}}

---

## 📝 Code Style & Conventions

### Naming Conventions

- **Files**: {{FILE_NAMING_CONVENTION}} (e.g., `user_service.{{FILE_EXTENSION}}`)
- **Classes/Types**: {{CLASS_NAMING_CONVENTION}} (e.g., `UserService`, `DataModel`)
- **Functions/Methods**: {{FUNCTION_NAMING_CONVENTION}} (e.g., `getUserById`, `calculate_total`)
- **Variables**: {{VARIABLE_NAMING_CONVENTION}} (e.g., `userId`, `totalCount`)
- **Constants**: {{CONSTANT_NAMING_CONVENTION}} (e.g., `MAX_RETRIES`, `API_BASE_URL`)

### File Organization

- One main class/component per file (file name matches primary export)
- Group imports: {{IMPORT_GROUPING_STRATEGY}}
- Use trailing commas for better diffs
- Keep files focused and under {{MAX_FILE_LINES}} lines when possible

### Code Quality Standards

- **Functions**: Keep functions small and focused (ideally < 50 lines)
- **Complexity**: Avoid deeply nested logic (max {{MAX_NESTING_DEPTH}} levels)
- **Comments**: Use comments for "why", not "what"
- **Duplication**: Follow DRY (Don't Repeat Yourself) principle
- **Consistency**: Follow existing patterns in the codebase

### Error Handling Patterns

{{ERROR_HANDLING_APPROACH}}

---

## 🧪 Testing Strategy

### Test Types

1. **Unit Tests**: {{UNIT_TEST_DESCRIPTION}}
2. **Integration Tests**: {{INTEGRATION_TEST_DESCRIPTION}}
3. **{{ADDITIONAL_TEST_TYPE}}**: {{ADDITIONAL_TEST_DESCRIPTION}}

### Testing Standards

- **Coverage Target**: {{TEST_COVERAGE_TARGET}}%
- **Test Organization**: {{TEST_ORGANIZATION_STRATEGY}}
- **Naming**: {{TEST_NAMING_CONVENTION}}
- **Mocking**: {{MOCKING_STRATEGY}}

### Testing Best Practices

- Write tests alongside implementation
- Test behavior, not implementation details
- Keep tests fast and deterministic
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)

---

## 📚 Documentation Standards

### Code Documentation

- {{CODE_DOCUMENTATION_APPROACH}}
- Document public APIs and interfaces
- Include usage examples for complex functionality
- Keep documentation close to code

### Project Documentation

Documentation lives in `{{DOCS_DIRECTORY}}/`:

- **Architecture**: High-level system design
- **Features**: Feature-specific documentation
- **API**: API endpoints and contracts (if applicable)
- **Workflow**: Development processes and conventions

### Documentation Best Practices

- Update docs when code changes
- Use clear, concise language
- Include diagrams for complex concepts
- Provide examples and use cases

---

## 🔄 Workflow Guidelines

### Task Files and Task-Driven Development

This project uses task files to organize and track work:

- **Portfolio-level tasks**: `tasks.yml` - Milestones and high-level goals
- **Feature tasks**: `tasks/{{FEATURE}}.yml` - Detailed implementation tasks

### Task Structure

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

### Task Workflow

1. **Select a Task**: Choose a task with `status: todo` (prefer `priority: high`)
2. **Read Context**: Review `spec_refs`, `description`, and `acceptance_criteria`
3. **Check Agent Roles**: Verify your agent type matches `agent_roles` field
4. **Implement**: Work on the task following project conventions
5. **Verify**: Ensure all `acceptance_criteria` are met
6. **Update Status**: Propose status change when complete

### Multi-Agent Development

This project uses a multi-agent development system. See `AGENTS.md` for:
- Agent role definitions and responsibilities
- When to use which agent
- Agent collaboration patterns
- Quality assurance checklists

**Agent Roles** (check `agent_roles` field in tasks):
- `{{AGENT_ROLE_1}}`: {{AGENT_ROLE_1_DESCRIPTION}}
- `{{AGENT_ROLE_2}}`: {{AGENT_ROLE_2_DESCRIPTION}}
- `{{AGENT_ROLE_3}}`: {{AGENT_ROLE_3_DESCRIPTION}}

---

## 🎓 Development Best Practices

### Before Making Changes

1. Check `tasks.yml` or `tasks/*.yml` for current priorities
2. Review related documentation in `{{DOCS_DIRECTORY}}/`
3. Understand the feature's architecture pattern
4. Check for existing similar patterns in codebase

### When Adding New Features

1. {{NEW_FEATURE_STEP_1}}
2. {{NEW_FEATURE_STEP_2}}
3. {{NEW_FEATURE_STEP_3}}
4. {{NEW_FEATURE_STEP_4}}

### Code Review Checklist

- [ ] Follows architecture pattern ({{ARCHITECTURE_PATTERN}})
- [ ] Uses proper naming conventions
- [ ] Includes appropriate error handling
- [ ] Has test coverage (unit + integration)
- [ ] No hardcoded secrets or credentials
- [ ] Documentation updated if needed
- [ ] All acceptance criteria met

### Session Checklist

Before completing any task, verify:

- [ ] Task file updated with status and notes
- [ ] Relevant documentation updated
- [ ] Tests pass
- [ ] No hardcoded secrets or credentials
- [ ] Agent handoff notes added (if task has multiple `agent_roles`)
- [ ] Acceptance criteria reviewed and met

---

## 💡 Tips for AI Agents

### Understanding Context

- This is a **{{PROJECT_TYPE}}** project using **{{FRAMEWORK}}**
- Code should be **{{CODE_QUALITY_FOCUS}}** and follow established patterns
- {{ADDITIONAL_AGENT_CONTEXT}}

### Common Tasks

- **Adding features**: {{FEATURE_ADDITION_GUIDANCE}}
- **Fixing bugs**: {{BUG_FIX_GUIDANCE}}
- **Refactoring**: {{REFACTORING_GUIDANCE}}

### Claude Code Skills and MCP Servers

Agents have access to **agent skills** and **MCP tools** provided by installed Claude Code skills. Use them when relevant — for example, web search for research, Context7 for library docs, BrowserStack for cross-browser testing, Stitch design skills for design-to-code, and workflow skills for structured plans and code review.

**Permissions**: Agents may leverage existing skills and create new ones at any time. Use `/skill-name` when a task would benefit. Use the `create-skill` workflow to author project-specific skills. Update `docs/CLAUDE_CODE_CAPABILITIES.md` after adding capabilities.

**Antigravity Awesome Skills**: If installed (`./scripts/install-antigravity-skills.sh`), 946+ skills are in `.claude/skills/`. Project config agents can run the install script during setup or when requested. See `docs/CLAUDE_CODE_CAPABILITIES.md`.

See `docs/CLAUDE_CODE_CAPABILITIES.md` for the full list of available capabilities.

### When Uncertain

- Check `{{DOCS_DIRECTORY}}/` for existing documentation
- Look for similar patterns in existing features
- Review `tasks.yml` for context on recent changes
- Ask clarifying questions rather than making assumptions

### Clarify Before Proceeding

**Ask for additional details when more information would materially improve your output.** Prefer asking over guessing when extra context would reduce ambiguity, wrong assumptions, or rework.

- **When to ask**: Ambiguity in scope/format, missing critical details, domain context that would change your approach, or high cost of being wrong
- **How to ask**: Be specific, state tradeoffs, offer defaults, bundle related questions
- **When not to ask**: Answer is discoverable, reasonable low-risk defaults exist, user said to proceed, or task is well-specified

### Architecture Decision Tree

{{ARCHITECTURE_DECISION_GUIDANCE}}

---

**Last Updated**: {{LAST_UPDATED_DATE}}  
**Maintainer**: {{MAINTAINER}}  
**Purpose**: Provide consistent context for AI agents working on this codebase
