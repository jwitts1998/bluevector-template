# Multi-Agent System Integration Guide

**Version**: 1.0.0  
**Last Updated**: January 2026

## 📖 Overview

This guide explains how all components of the multi-agent development system work together to enable collaborative, quality-driven development.

---

## 🏗️ System Architecture

```mermaid
graph TB
    Dev[Developer] --> Quest[Project Questionnaire]
    Quest --> Templates[Select Templates]
    
    Templates --> CR[CLAUDE.md]
    Templates --> AG[AGENTS.md]
    Templates --> TS[Task Files]
    Templates --> WF[Workflow Docs]
    Templates --> SA[Subagent Configs]
    
    CR --> Project[Your Project]
    AG --> Project
    TS --> Project
    WF --> Project
    SA --> Project
    
    Project --> Work[Development Work]
    Work --> Agents[AI Agents]
    
    Agents --> Impl[Implementation]
    Agents --> Review[Code Review]
    Agents --> Test[Testing]
    Agents --> Docs[Documentation]
    
    Impl --> Quality[Quality Code]
    Review --> Quality
    Test --> Quality
    Docs --> Quality
```

---

## 🔗 Component Relationships

### 1. Project Questionnaire → Template Selection

**Flow**:
1. Fill out `PROJECT_QUESTIONNAIRE.md`
2. Identify project type, tech stack, architecture
3. Select appropriate templates based on answers

**Output**: Template selection guide (mobile/web/backend/full-stack)

---

### 2. Templates → Project Configuration

**Components**:
- **`CLAUDE.md`**: Defines project context for AI agents
- **`AGENTS.md`**: Defines agent roles and responsibilities
- **`tasks/*.yml`**: Defines implementation tasks
- **Workflow docs**: Define development processes
- **Subagent configs**: Define specialized AI assistants

**Integration**:
```
CLAUDE.md (project context)
     ↓
  AGENTS.md (agent roles)
     ↓
tasks/*.yml (specific tasks)
     ↓
Subagent configs (AI assistants)
```

---

### 3. CLAUDE.md ↔ AGENTS.md

**Relationship**: Complementary

**CLAUDE.md provides**:
- Project overview and philosophy
- Architecture patterns
- Technology stack
- Security requirements
- Code style conventions
- Testing strategy
- Documentation standards

**AGENTS.md provides**:
- Specific agent roles
- Agent responsibilities
- When to use which agent
- Agent collaboration patterns
- Quality checklists

**Integration**: Agents reference `CLAUDE.md` as the source of truth for project standards.

---

### 4. AGENTS.md ↔ Task Files

**Relationship**: Direct integration via `agent_roles` field

**Task File Example**:
```yaml
- id: FEATURE_T1_profile
  title: "Implement user profile"
  agent_roles:
    - implementation   # Resolved via Role Mapping table in AGENTS.md
    - ui_ux           # Resolved via Role Mapping table in AGENTS.md
    - testing         # Resolved via Role Mapping table in AGENTS.md
```

**Integration**:
1. Task file specifies `agent_roles`
2. Agent resolves each value to a role using the **Role Mapping** table in `AGENTS.md` (each stack-specific AGENTS template defines its own mappings — e.g. `ui_ux` maps to UI/UX Agent in mobile, Design System Agent in web, Frontend Agent in full-stack)
3. Agent follows the **Task Execution Protocol** in `AGENTS.md` — executing roles in list order, completing each role's checklist, and leaving handoff notes
4. Agent completes work per acceptance criteria in task

---

### 5. Task Files ↔ Subagent Configs

**Relationship**: Agents invoke subagents for specialized work

**Flow**:
1. Main agent reads task from `tasks/*.yml`
2. Agent determines work type (implementation, review, testing)
3. Agent invokes appropriate subagent (code-reviewer, designer, test-writer, etc.)
4. Subagent uses project context from `CLAUDE.md`
5. Subagent completes specialized work
6. Main agent integrates subagent output

**Example**:
```
Task: Implement user profile
    ↓
Implementation Agent (from AGENTS.md)
    ↓
Invokes flutter-specialist subagent
    ↓
flutter-specialist uses CLAUDE.md context
    ↓
Implements feature following project patterns
```

---

### 6. Workflow Docs → Development Process

**Relationship**: Guides day-to-day development

**MULTI_AGENT_WORKFLOW.md provides**:
- Sequential workflow patterns
- Parallel workflow patterns
- Agent handoff protocols
- Quality assurance checklists

**DEVELOPMENT_WORKFLOW.md provides**:
- Feature development process
- Code review guidelines
- Testing requirements
- Documentation standards

**Integration**: Both reference `CLAUDE.md` and `AGENTS.md` as authoritative sources.

---

## 🔄 Complete Development Flow

### Example: Implementing a New Feature

**Step 1: Task Creation**
```yaml
# tasks/03_user_features.yml
- id: USER_T1_profile_page
  title: "Implement user profile viewing"
  agent_roles: [implementation, ui_ux, testing]
  spec_refs:
    - "PDB: docs/specs/user_profile.md"
  acceptance_criteria:
    - "User can view their profile"
    - "UI follows design system"
    - "Tests cover main scenarios"
```

**Step 2: Task Execution Protocol**
1. **Read task file**: Understands requirements, resolves `agent_roles` via Role Mapping table in `AGENTS.md`
2. **Check `CLAUDE.md`**: Reviews architecture pattern, code style
3. **Check `AGENTS.md`**: Reviews mapped role responsibilities and checklist
4. **Execute roles in order**: Works through each role per Task Execution Protocol, leaving handoff notes between roles
5. **Implement feature**: Follows project patterns, invokes relevant subagents
6. **Final role validates**: Last role checks all acceptance criteria and proposes `status: done`

**Step 3: Automatic Code Review**
- **code-reviewer subagent** automatically activates
- Reviews against `CLAUDE.md` standards
- Checks architecture compliance from `AGENTS.md`
- Provides feedback (Critical / Warnings / Suggestions)

**Step 4: UI/UX Review** (if `ui_ux` in `agent_roles`)
- UI/UX Agent reviews design system compliance
- Checks accessibility requirements
- Validates responsive design
- Ensures visual consistency

**Step 5: Testing** (if `testing` in `agent_roles`)
- Testing Agent reviews test coverage
- **test-writer subagent** creates missing tests
- Ensures unit, widget, and integration tests present
- Validates coverage meets target

**Step 6: Documentation** (if needed)
- **doc-generator subagent** adds documentation
- Updates feature docs in `docs/`
- Adds inline code documentation
- Updates README if needed

---

## 💡 Best Practices for Integration

### 1. Start with Context

Before any work:
1. Read `CLAUDE.md` → Understand project standards
2. Read `AGENTS.md` → Understand agent responsibilities
3. Read task file → Understand specific requirements
4. Check workflow docs → Understand process

### 2. Use Agent Roles Consistently

In task files, always specify `agent_roles`:
```yaml
agent_roles: [implementation, testing]  # Clear who works on this
```

### 3. Reference Documentation Explicitly

In tasks, reference specific docs:
```yaml
spec_refs:
  - "PDB: docs/product_design/app_pdb.md — Section 3.2"
  - "Design: Stitch project link"
  - "Docs: docs/architecture/PATTERNS.md"
```

### 4. Maintain Consistency

- **`CLAUDE.md`**: Single source of truth for standards
- **`AGENTS.md`**: Single source of truth for agent roles
- **Task files**: Single source of truth for work items
- **Workflow docs**: Single source of truth for processes

### 5. Leverage Subagents

Let subagents handle specialized work:
- **code-reviewer**: Automatic code review
- **designer**: UI/UX, design system, accessibility review
- **test-writer**: Test generation
- **debugger**: Error investigation
- **doc-generator**: Documentation
- **security-auditor**: Security review
- **performance-optimizer**: Performance optimization
- **{project}-specialist**: Project-specific patterns

---

## 🔍 Troubleshooting Integration Issues

### Issue: Agents Not Following Project Standards

**Cause**: `CLAUDE.md` not comprehensive or up-to-date

**Solution**:
1. Review `CLAUDE.md` for completeness
2. Add missing project-specific patterns
3. Ensure examples are clear and specific

### Issue: Agents Giving Conflicting Advice

**Cause**: Agent roles overlapping or unclear

**Solution**:
1. Review `AGENTS.md` role definitions
2. Clarify agent responsibilities
3. Establish priority (e.g., specialist > generic agent)

### Issue: Subagents Not Activating

**Cause**: Description in subagent YAML frontmatter not specific enough

**Solution**:
1. Review subagent `description` field
2. Ensure it mentions "Use proactively when..."
3. Make description specific to activation scenarios

### Issue: Task Context Not Clear

**Cause**: Task file missing key information

**Solution**:
1. Ensure `spec_refs` point to specific docs
2. Add detailed `description` with context
3. Make `acceptance_criteria` specific and testable
4. Specify `code_areas` for reference

---

## 📊 Success Metrics

Your integration is successful when:

✅ Agents automatically follow `CLAUDE.md` standards
✅ Agent roles from `AGENTS.md` are clear and non-overlapping
✅ Tasks have clear `agent_roles` assignments
✅ Subagents activate appropriately
✅ Code reviews happen automatically
✅ Documentation stays current
✅ Test coverage meets targets
✅ Development velocity increases
✅ Code quality improves

---

## 🔗 Related Documentation

- [SETUP_GUIDE.md](../SETUP_GUIDE.md) - Initial setup instructions
- [PROJECT_QUESTIONNAIRE.md](../PROJECT_QUESTIONNAIRE.md) - Project identification
- [CUSTOMIZATION_GUIDE.md](./CUSTOMIZATION_GUIDE.md) - How to customize templates
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Common issues and solutions
- [FAQ.md](./FAQ.md) - Frequently asked questions

---

**Questions?** See [FAQ.md](./FAQ.md) or [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

**Version History**:
- 1.0.0 (Jan 2026) - Initial integration guide
