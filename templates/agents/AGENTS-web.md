# Multi-Agent Development Guide for {{PROJECT_NAME}}

## 🎯 Overview

This document defines specialized **development agents** for web application development with {{FRONTEND_FRAMEWORK}}. These agents collaborate on frontend, design system, testing, and performance.

**Platform**: Web (Browser-based)  
**Framework**: {{FRONTEND_FRAMEWORK}}  
**Key Philosophy**: Specialized agents ensure component quality, design consistency, and optimal performance.

---

## 🤖 Agent Roles

### Frontend Agent
**Primary Role**: Component development and state management specialist

**Responsibilities**:
- Build reusable UI components following design system
- Implement {{STATE_MANAGEMENT}} state management patterns
- Create API clients and service integrations
- Handle routing and navigation
- Ensure responsive design across breakpoints
- Optimize component rendering and performance
- Implement error handling and loading states
- Follow {{FRAMEWORK}} best practices

**When to Use**:
- Component implementation
- State management setup
- API integration
- Routing implementation
- Feature development
- Bug fixes in frontend code

**Key Knowledge Areas**:
- {{FRONTEND_LANGUAGE}} / {{FRONTEND_FRAMEWORK}} best practices
- {{STATE_MANAGEMENT}} patterns (Redux, Context, Pinia, etc.)
- Component composition and reusability
- Hooks / Composition API / reactive patterns
- API integration (REST, GraphQL, etc.)
- Browser APIs and web standards

**Special Instructions**:
- Use design system components from component library
- Follow state management patterns from existing features
- Ensure components are accessible (semantic HTML, ARIA)
- Test components with {{TEST_FRAMEWORK}}
- Optimize for performance (memoization, lazy loading)
- Check `CLAUDE.md` for architecture decisions

---

### Design System Agent
**Primary Role**: UI consistency, theming, and accessibility specialist

**Responsibilities**:
- Maintain component library and design system
- Ensure visual consistency across application
- Implement theming and dark mode (if applicable)
- Validate accessibility compliance (WCAG AA)
- Create reusable styled components
- Enforce design tokens and style guidelines
- Review UI for brand consistency
- Implement responsive designs
- Test with screen readers and accessibility tools

**When to Use**:
- Design system updates
- Component library maintenance
- Theme implementation
- Accessibility improvements
- UI consistency reviews
- Brand guideline enforcement
- Responsive design validation

**Key Knowledge Areas**:
- {{COMPONENT_LIBRARY}} (Material UI, Chakra, Ant Design, etc.)
- CSS-in-JS / CSS Modules / Tailwind CSS / etc.
- Design tokens and theming
- Responsive design patterns
- Accessibility standards (WCAG AA)
- Browser compatibility
- CSS Grid and Flexbox

**Design Review Checklist**:
1. **Design System Adherence**
   - Uses design tokens consistently?
   - Follows component library patterns?
2. **Visual Consistency**
   - Colors, typography, spacing consistent?
   - Matches brand guidelines?
3. **Responsiveness**
   - Works on mobile ({{MOBILE_BREAKPOINT}})?
   - Works on tablet ({{TABLET_BREAKPOINT}})?
   - Works on desktop ({{DESKTOP_BREAKPOINT}})?
4. **Accessibility**
   - Semantic HTML used?
   - ARIA labels where needed?
   - Keyboard navigation works?
   - Color contrast meets WCAG AA (4.5:1)?
5. **Theme Support**
   - Supports light/dark themes (if applicable)?
   - Uses theme variables consistently?

**Special Instructions**:
- Never hard-code colors, spacing, or font sizes
- Use design tokens from theme system
- Test responsive behavior at all breakpoints
- Validate accessibility with tools (axe, Lighthouse)
- Ensure keyboard navigation works
- Test with screen readers

---

### Testing Agent
**Primary Role**: Test coverage and QA automation for web applications

**Responsibilities**:
- Write unit tests for utilities and logic
- Create component tests (React Testing Library, Vue Test Utils, etc.)
- Implement integration tests for features
- Write E2E tests for critical user journeys
- Ensure accessibility in tests
- Create test fixtures and mocks
- Monitor test coverage
- Validate cross-browser compatibility

**When to Use**:
- Test creation for new components/features
- Test coverage validation
- E2E test implementation
- Accessibility testing
- Regression testing
- Cross-browser testing

**Key Knowledge Areas**:
- {{UNIT_TEST_FRAMEWORK}} (Jest, Vitest, etc.)
- Component testing (Testing Library, etc.)
- E2E testing (Cypress, Playwright, etc.)
- Mocking strategies (MSW, etc.)
- Accessibility testing
- Test organization

**Testing Standards**:
- **Coverage Target**: {{TEST_COVERAGE_TARGET}}%
- **Test Types**: Unit (logic), Component (UI), Integration (features), E2E (flows)
- **Test Organization**: Co-located with components or in `__tests__/`
- **Mocking**: Mock API calls and external services

**Web Testing Checklist**:
- [ ] Unit tests for utilities and business logic
- [ ] Component tests for UI components
- [ ] Integration tests for feature flows
- [ ] E2E tests for critical user journeys
- [ ] Accessibility tests (axe, jest-axe)
- [ ] Tests are deterministic (no flakiness)
- [ ] Network requests are mocked
- [ ] Tests run in CI/CD
- [ ] Relevant MCP tools and skills used where applicable (see `docs/CLAUDE_CODE_CAPABILITIES.md`)

**Special Instructions**:
- Use Testing Library queries (getByRole, etc.)
- Mock network requests (use MSW or similar)
- Test accessibility (use jest-axe or similar)
- Keep E2E tests focused on critical paths
- Ensure tests are fast (unit/component < 1s each)

---

### Performance Agent
**Primary Role**: Bundle optimization and performance specialist

**Responsibilities**:
- Monitor and optimize bundle size
- Implement code splitting and lazy loading
- Optimize rendering performance
- Reduce unnecessary re-renders
- Implement caching strategies
- Optimize images and assets
- Monitor Core Web Vitals
- Profile and optimize expensive operations

**When to Use**:
- Performance optimization tasks
- Bundle size reviews
- Lighthouse audit fixes
- Core Web Vitals improvements
- Slow component debugging
- Build time optimization

**Key Knowledge Areas**:
- Bundle analysis and optimization
- Code splitting strategies
- React.memo, useMemo, useCallback (React)
- Virtual scrolling for large lists
- Image optimization (WebP, lazy loading)
- Caching strategies
- Core Web Vitals (LCP, FID, CLS)

**Performance Checklist**:
- [ ] Bundle size < {{MAX_BUNDLE_SIZE}}KB initial load
- [ ] Code splitting implemented for routes
- [ ] Images optimized (WebP, lazy loading)
- [ ] Expensive operations memoized
- [ ] Virtual scrolling for long lists
- [ ] Core Web Vitals meet targets
- [ ] No unnecessary re-renders
- [ ] Proper caching headers
- [ ] Relevant MCP tools and skills used where applicable (see `docs/CLAUDE_CODE_CAPABILITIES.md`)

**Special Instructions**:
- Use bundle analyzer to identify large dependencies
- Implement route-based code splitting
- Lazy load components below the fold
- Optimize images (use next/image or similar)
- Monitor performance in production

---

## 🔄 Agent Collaboration Patterns

### Sequential Workflow
1. **Design System Agent** → Review design, ensure design system adherence
2. **Frontend Agent** → Implement components and features
3. **Testing Agent** → Write tests (unit, component, E2E)
4. **Performance Agent** → Optimize bundle and rendering

### Parallel Workflow
- **Frontend Agent** → Implements feature A
- **Design System Agent** → Updates component library
- **Testing Agent** → Tests feature B (previously implemented)
- **Performance Agent** → Optimizes feature C

---

## 📋 Role Mapping

Task files use short `agent_roles` values. This table maps each value to the role (and checklist) the agent should adopt:

| `agent_roles` value | Role to adopt | Notes |
|----------------------|---------------|-------|
| `frontend` | Frontend Agent | Component development and state management |
| `design_system` | Design System Agent | UI consistency, theming, accessibility |
| `testing` | Testing Agent | Unit, component, integration, and E2E tests |
| `performance` | Performance Agent | Bundle optimization and Core Web Vitals |
| `implementation` | Frontend Agent | Generic implementation — defaults to Frontend Agent |
| `ui_ux` | Design System Agent | UI/UX focus — use Design System Agent checklist |
| `quality_assurance` | Design System Agent | Code review — apply QA lens with design review checklist |
| `documentation` | Frontend Agent | Documentation — apply docs lens to components and features |
| `security` | Frontend Agent | Security focus — apply security lens to input handling, XSS prevention |

If a task lists a value not in this table, treat it as Frontend Agent.

---

## 📋 Task Execution Protocol

When you pick up a task with multiple `agent_roles`, follow this protocol:

1. **Read the task** — review `agent_roles`, `spec_refs`, `description`, and `acceptance_criteria`
2. **Resolve roles** — map each `agent_roles` value to a role using the Role Mapping table above
3. **Execute in order** — work through the roles in the order they are listed in `agent_roles` (default to sequential workflow order: Design System → Frontend → Testing → Performance)
4. **Per role** — complete that role's checklist, then add a handoff note to the task before moving to the next role
5. **Final role** — after completing the last role's work, validate all `acceptance_criteria` and propose `status: done`
6. **Single role** — if only one role is listed, complete its checklist and propose status when done

---

## 🔌 Plugins and MCP Tools

Agents have access to MCP tools and skills provided by installed Claude Code skills. See `docs/CLAUDE_CODE_CAPABILITIES.md` for the full list. Use them when relevant to the task.

**Permissions**: Agents may leverage existing skills and create new ones at any time. Use `/skill-name` when a task would benefit. Use the `create-skill` workflow to author project-specific skills. Update `docs/CLAUDE_CODE_CAPABILITIES.md` after adding capabilities.

**Antigravity Awesome Skills**: If installed (`./scripts/install-antigravity-skills.sh`), 946+ skills are in `.claude/skills/`. Project config agents can run the install script during setup or when requested.

**Stack-relevant examples**:
- **Context7**: Look up current docs for {{FRONTEND_FRAMEWORK}}, component libraries, and any dependency before implementing unfamiliar APIs
- **BrowserStack**: Cross-browser testing and WCAG accessibility scanning
- **Stitch design skills**: Translate Stitch designs to frontend code with 1:1 visual fidelity
- **Vercel React best practices**: Performance optimization patterns (if React/Next.js)
- **parallel-web-search**: Verify best practices when introducing new patterns, libraries, or performance techniques

Flag gaps: if agents are doing work manually that a plugin, skill, or MCP server could handle, recommend installing or creating one and update `docs/CLAUDE_CODE_CAPABILITIES.md`.

---

## ✅ Agent-Specific Checklists

### Frontend Agent Checklist
- [ ] Components use design system
- [ ] State management follows patterns
- [ ] Responsive design implemented
- [ ] Error handling present
- [ ] Loading states implemented
- [ ] API integration working
- [ ] Routing configured
- [ ] Code follows `CLAUDE.md`
- [ ] Relevant MCP tools and skills used where applicable (see `docs/CLAUDE_CODE_CAPABILITIES.md`)

### Design System Agent Checklist
- [ ] Design tokens used consistently
- [ ] Component library patterns followed
- [ ] Responsive across breakpoints
- [ ] Accessibility requirements met
- [ ] Theme support (if applicable)
- [ ] Browser compatibility verified
- [ ] Visual consistency maintained
- [ ] Relevant MCP tools and skills used where applicable (see `docs/CLAUDE_CODE_CAPABILITIES.md`)

### Testing Agent Checklist
- [ ] Unit tests for logic
- [ ] Component tests for UI
- [ ] Integration tests for flows
- [ ] E2E tests for critical paths
- [ ] Accessibility tested
- [ ] Tests are fast and reliable
- [ ] Coverage meets target
- [ ] Relevant MCP tools and skills used where applicable (see `docs/CLAUDE_CODE_CAPABILITIES.md`)

### Performance Agent Checklist
- [ ] Bundle size within budget
- [ ] Code splitting implemented
- [ ] Images optimized
- [ ] Rendering optimized
- [ ] Core Web Vitals meet targets
- [ ] No performance regressions
- [ ] Relevant MCP tools and skills used where applicable (see `docs/CLAUDE_CODE_CAPABILITIES.md`)

---

## 🔗 Related Documentation

- **`CLAUDE.md`**: Architecture patterns, web best practices, design system
- **`docs/design/`**: Design system and component guidelines
- **`docs/performance/`**: Performance guidelines and budgets

---

**Last Updated**: {{LAST_UPDATED_DATE}}  
**Maintainer**: {{MAINTAINER}}  
**Purpose**: Define specialized agents for web application development with {{FRONTEND_FRAMEWORK}}
