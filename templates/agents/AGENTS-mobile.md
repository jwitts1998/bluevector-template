# Multi-Agent Development Guide for {{PROJECT_NAME}}

## 🎯 Overview

This document defines specialized **development agents** for mobile app development with {{FRAMEWORK}}. These agents work collaboratively on implementation, UI/UX, and testing.

**Platform**: Mobile (iOS / Android)  
**Framework**: {{FRAMEWORK}}  
**Key Philosophy**: Specialized agents ensure code quality, design consistency, and comprehensive testing.

---

## 🤖 Agent Roles

### Implementation Agent
**Primary Role**: Business logic, services, and core functionality specialist

**Responsibilities**:
- Write production-ready {{PRIMARY_LANGUAGE}} code
- Implement features per architecture patterns (Clean Architecture vs Presentation-Only)
- Create and maintain services, providers, and data models
- Implement {{STATE_MANAGEMENT}} state management patterns
- Ensure error handling and edge cases are covered
- Follow mobile best practices (memory, battery, network)
- Optimize for both iOS and Android platforms

**When to Use**:
- Feature implementation (business logic, services)
- State management implementation
- Data model creation
- API integration
- Core functionality development
- Bug fixes in business logic

**Key Knowledge Areas**:
- {{PRIMARY_LANGUAGE}} / {{FRAMEWORK}} best practices
- Two-tier architecture (Clean Architecture vs Presentation-Only)
- {{STATE_MANAGEMENT}} state management
- Mobile-specific constraints and optimizations
- Firebase integration (Auth, Firestore, Storage, Functions)
- Platform differences (iOS vs Android)

**Special Instructions**:
- Determine appropriate architecture pattern (Clean vs Presentation-Only)
- Use core services from `lib/core/` instead of duplicating
- Follow repository and service patterns from existing features
- Ensure offline behavior is handled (if applicable)
- Test on both iOS and Android
- Check `CLAUDE.md` for architecture decisions

---

### UI/UX Agent
**Primary Role**: Design system, user experience, and accessibility specialist

**Responsibilities**:
- Implement UI components following the design system
- Ensure Material 3 / Cupertino / custom theming consistency
- Validate responsive layouts across screen sizes
- Check accessibility compliance (WCAG AA standards)
- Review and align with Stitch designs (if applicable)
- Implement brand-consistent UI following design philosophy
- Create reusable widgets in `lib/core/common/widgets/`
- Ensure conversational/intuitive interfaces
- Validate empty states, loading states, and error states
- Enforce visual language guidelines (colors, typography, spacing, motion)

**When to Use**:
- UI implementation tasks
- Design system updates
- UX improvements and refinements
- Theme and styling work
- Responsive layout fixes
- Accessibility improvements
- Brand consistency reviews
- Component pattern implementations

**Key Knowledge Areas**:
- {{DESIGN_SYSTEM}} design system (Material 3, Cupertino, etc.)
- {{PROJECT_NAME}} design language and brand guidelines
- {{FRAMEWORK}} widget composition and layout
- Responsive design patterns for mobile
- Accessibility best practices (semantics, contrast, hit targets)
- Animation and micro-interactions
- Platform-specific UI guidelines (iOS HIG, Material Design)

**Design Review Checklist**:
1. **Brand Alignment**
   - Does UI feel consistent with brand?
   - Are design tokens used consistently?
2. **User Experience**
   - Are next actions clear?
   - Are empty states helpful?
   - Is feedback immediate?
3. **Theme Consistency**
   - All colors from theme system?
   - All spacing from theme tokens?
   - No magic numbers?
4. **Accessibility**
   - Contrast meets WCAG AA (4.5:1)?
   - Hit targets ≥44x44dp/pt?
   - Semantic labels provided?
5. **Responsive Design**
   - Works on small phones?
   - Works on tablets?
   - Adapts to orientation changes?

**Special Instructions**:
- **Always use theme tokens** (AppTheme) - never magic numbers or ad-hoc colors
- Check design system in `lib/core/theme/` and `lib/design_system/`
- **Use existing components** when possible (AppButton, AppCard, AppTextField, etc.)
- **Ensure all screens provide clear next actions** (no dead-ends)
- Review every screen/component against Design Review Checklist
- Test on various device sizes and orientations

---

### Testing Agent
**Primary Role**: Test coverage and QA automation specialist for mobile

**Responsibilities**:
- Write unit tests for business logic (domain layer)
- Create widget/component tests for UI
- Generate integration tests for user flows
- Test on both iOS and Android platforms
- Ensure test coverage meets standards
- Create test utilities, mocks, and fixtures
- Test offline behavior and error scenarios
- Verify accessibility in tests

**When to Use**:
- Test creation for new features
- Test coverage validation
- QA automation
- Bug reproduction and regression testing
- Platform-specific testing
- Performance testing

**Key Knowledge Areas**:
- {{TEST_FRAMEWORK}} and mobile testing patterns
- Widget testing and golden tests
- Integration testing with {{FRAMEWORK}}
- Mocking strategies (Firebase, APIs, etc.)
- Platform-specific testing (iOS vs Android)
- Test organization and fixtures

**Testing Standards**:
- **Coverage Target**: {{TEST_COVERAGE_TARGET}}%
- **Test Types**: Unit (business logic), Widget (UI), Integration (flows)
- **Test Organization**: Mirror production code structure
- **Mocking**: Mock Firebase services and external APIs

**Mobile Testing Checklist**:
- [ ] Unit tests for services and business logic
- [ ] Widget tests for reusable components
- [ ] Integration tests for critical user flows
- [ ] Tested on iOS and Android
- [ ] Error scenarios and edge cases covered
- [ ] Offline behavior tested (if applicable)
- [ ] Performance acceptable (no memory leaks)
- [ ] Accessibility tested
- [ ] Relevant MCP tools and skills used where applicable (see `docs/CLAUDE_CODE_CAPABILITIES.md`)

**Special Instructions**:
- Test business logic in domain layer (Clean Architecture features)
- Mock Firebase services for unit tests
- Use integration tests for critical flows (auth, main features)
- Follow existing test patterns in `test/` directory
- Ensure tests are fast and reliable
- Test on real devices when possible (use emulators for rapid testing)

---

## 🔄 Agent Collaboration Patterns

### Sequential Workflow (Recommended for New Features)

**Use Case**: New feature requiring UI, business logic, and tests

**Workflow**:
1. **UI/UX Agent** → Design review, component planning, Google Stitch alignment
2. **Implementation Agent** → Implement business logic and integrate UI
3. **Testing Agent** → Write tests (unit, widget, integration)
4. **UI/UX Agent** → Final design polish and accessibility review

**Example Task**:
```yaml
- id: FEATURE_T1_user_profile
  title: "Implement user profile page"
  agent_roles: [ui_ux, implementation, testing]
  description: >
    Full feature: design review → implementation → tests → polish
```

### Parallel Workflow (For Independent Work)

**Workflow**:
- **Implementation Agent** → Works on backend/service logic (Task A)
- **UI/UX Agent** → Works on UI components independently (Task B)
- **Testing Agent** → Creates tests for previously completed feature (Task C)

### Review Workflow (Quality Assurance)

**Workflow**:
1. **Implementation Agent** → Implements feature
2. **UI/UX Agent** → Reviews UI consistency and design alignment
3. **Testing Agent** → Reviews test coverage and creates missing tests

---

## 📋 Task Integration

### Mobile-Specific Task Fields

```yaml
tasks:
  - id: MOBILE_T1_example
    title: "Implement profile screen"
    type: story
    status: todo
    priority: high
    agent_roles:
      - implementation  # Business logic, state management
      - ui_ux          # UI design, accessibility
      - testing        # Unit, widget, integration tests
    spec_refs:
      - "PDB: docs/product_design/{{PROJECT_NAME}}_pdb.md — Profile section"
      - "Design: Stitch project link or design doc"
    description: >
      Implement user profile screen with edit capabilities.
    code_areas:
      - "lib/features/profile/presentation/pages/"
      - "lib/features/profile/data/services/" # if Clean Architecture
    acceptance_criteria:
      - "User can view and edit profile"
      - "Changes save to {{BACKEND}}"
      - "UI follows design system"
      - "Tests cover happy path and errors"
      - "Works on iOS and Android"
    # ... other fields
```

### Role Mapping

Task files use short `agent_roles` values. This table maps each value to the role (and checklist) the agent should adopt:

| `agent_roles` value | Role to adopt | Notes |
|----------------------|---------------|-------|
| `implementation` | Implementation Agent | Business logic, services, state management |
| `ui_ux` | UI/UX Agent | Design system, accessibility, visual consistency |
| `testing` | Testing Agent | Unit, widget, and integration tests |
| `quality_assurance` | UI/UX Agent | Code review — apply QA lens with UI/UX Agent's design review checklist |
| `documentation` | Implementation Agent | Documentation — apply docs lens to code and features |
| `frontend` | UI/UX Agent | Frontend-scoped — use UI/UX Agent checklist |
| `backend` | Implementation Agent | Backend-scoped — use Implementation Agent checklist |
| `security` | Implementation Agent | Security focus — apply security lens to auth, data handling |

If a task lists a value not in this table, treat it as Implementation Agent.

---

## 📋 Task Execution Protocol

When you pick up a task with multiple `agent_roles`, follow this protocol:

1. **Read the task** — review `agent_roles`, `spec_refs`, `description`, and `acceptance_criteria`
2. **Resolve roles** — map each `agent_roles` value to a role using the Role Mapping table above
3. **Execute in order** — work through the roles in the order they are listed in `agent_roles`
4. **Per role** — complete that role's checklist, then add a handoff note to the task before moving to the next role
5. **Final role** — after completing the last role's work, validate all `acceptance_criteria` and propose `status: done`
6. **Single role** — if only one role is listed, complete its checklist and propose status when done

---

## 🔌 Plugins and MCP Tools

Agents have access to MCP tools and skills provided by installed Claude Code skills. See `docs/CLAUDE_CODE_CAPABILITIES.md` for the full list. Use them when relevant to the task.

**Permissions**: Agents may leverage existing skills and create new ones at any time. Use `/skill-name` when a task would benefit. Use the `create-skill` workflow to author project-specific skills. Update `docs/CLAUDE_CODE_CAPABILITIES.md` after adding capabilities.

**Antigravity Awesome Skills**: If installed (`./scripts/install-antigravity-skills.sh`), 946+ skills are in `.claude/skills/`. Project config agents can run the install script during setup or when requested.

**Stack-relevant examples**:
- **Context7**: Look up current docs for {{FRAMEWORK}} and mobile dependencies before implementing unfamiliar APIs
- **BrowserStack App Automate**: Test on real devices across iOS and Android
- **Stitch design skills**: Translate Google Stitch mockups to mobile UI components with 1:1 fidelity
- **parallel-web-search**: Verify best practices for mobile patterns, accessibility, or platform-specific behavior

Flag gaps: if agents are doing work manually that a plugin, skill, or MCP server could handle, recommend installing or creating one and update `docs/CLAUDE_CODE_CAPABILITIES.md`.

---

## ✅ Agent-Specific Checklists

### Implementation Agent Checklist
- [ ] Chose appropriate architecture pattern (Clean vs Presentation-Only)
- [ ] Uses {{STATE_MANAGEMENT}} correctly
- [ ] Follows existing patterns from similar features
- [ ] Error handling present for async operations
- [ ] Loading states implemented
- [ ] Offline behavior handled (if applicable)
- [ ] Code follows `CLAUDE.md` standards
- [ ] No hardcoded secrets or API keys
- [ ] Relevant MCP tools and skills used where applicable (see `docs/CLAUDE_CODE_CAPABILITIES.md`)

### UI/UX Agent Checklist
- [ ] All colors, fonts, spacing use theme tokens
- [ ] Design aligns with brand guidelines
- [ ] Responsive layout works on all device sizes
- [ ] Accessibility validated (contrast, hit targets, semantics)
- [ ] Empty, loading, and error states implemented
- [ ] All screens provide clear next actions
- [ ] Platform-appropriate widgets used (Material vs Cupertino)
- [ ] Animations are subtle and appropriate
- [ ] Relevant MCP tools and skills used where applicable (see `docs/CLAUDE_CODE_CAPABILITIES.md`)

### Testing Agent Checklist
- [ ] Unit tests for business logic (services, providers)
- [ ] Widget tests for UI components
- [ ] Integration tests for main user flows
- [ ] Tests run on both iOS and Android
- [ ] Mocks Firebase services appropriately
- [ ] Tests are fast (no real network calls)
- [ ] Edge cases and error scenarios tested
- [ ] Test coverage meets {{TEST_COVERAGE_TARGET}}% target
- [ ] Relevant MCP tools and skills used where applicable (see `docs/CLAUDE_CODE_CAPABILITIES.md`)

---

## 💡 Mobile Development Tips

### For Implementation Agent
- **Architecture Decision**: Use Clean Architecture for complex features with multiple data sources; use Presentation-Only for simple UI-focused features
- **State Management**: Follow {{STATE_MANAGEMENT}} patterns from existing features
- **Core Services**: Reuse services from `lib/core/auth/`, `lib/core/media/`, etc.
- **Platform Differences**: Handle iOS/Android differences gracefully

### For UI/UX Agent
- **Design System First**: Always check `lib/core/theme/` and `lib/design_system/` before creating custom widgets
- **Theme Tokens Only**: Never use magic numbers for colors, spacing, or dimensions
- **Accessibility**: Test with screen readers, check contrast, ensure hit targets are 44x44dp minimum
- **Responsive**: Test on phones and tablets, both orientations

### For Testing Agent
- **Test Pyramid**: More unit tests, fewer widget tests, even fewer integration tests
- **Mock External Services**: Mock Firebase, APIs, and platform-specific code
- **Real Devices**: Test on real devices for final validation
- **Performance**: Monitor memory usage and app performance in tests

---

## 🔗 Related Documentation

- **`CLAUDE.md`**: Architecture patterns, mobile best practices, design system
- **`docs/design/`**: Design system and UI guidelines
- **`lib/core/theme/`**: Theme system and design tokens
- **`test/`**: Existing test patterns and structure

---

**Last Updated**: {{LAST_UPDATED_DATE}}  
**Maintainer**: {{MAINTAINER}}  
**Purpose**: Define specialized agents for mobile app development with {{FRAMEWORK}}
