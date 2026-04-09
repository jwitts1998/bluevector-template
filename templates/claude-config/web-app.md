# Cursor AI Agent Rules for {{PROJECT_NAME}}

## 🎯 Project Overview

{{PROJECT_DESCRIPTION}}

**Platform**: Web (Browser-based)  
**Key Philosophy**: {{ARCHITECTURE_PHILOSOPHY}}

---

## 🏗️ Architecture Patterns

### Architecture Style

This project follows **{{ARCHITECTURE_PATTERN}}** architecture.

**Common Patterns**:
- **Feature-First**: Features organized as top-level modules
- **Component-Based**: UI built from composable components
- **State Management**: Centralized or distributed state using {{STATE_MANAGEMENT}}
- **API Layer**: Clean separation between UI and backend

### Directory Structure

```
src/
├── components/        # Reusable UI components
│   ├── common/        # Shared components (buttons, inputs)
│   ├── layout/        # Layout components (header, footer)
│   └── features/      # Feature-specific components
├── features/          # Feature modules
│   └── {feature}/
│       ├── components/     # Feature components
│       ├── hooks/          # Feature hooks (React)
│       ├── services/       # Feature services
│       ├── state/          # Feature state management
│       └── types/          # Feature types/interfaces
├── lib/               # Shared utilities and helpers
├── services/          # API clients and external services
├── state/             # Global state management
├── styles/            # Global styles and themes
├── types/             # Shared TypeScript types
└── utils/             # Utility functions
```

**Key Principles**:
- Components are focused and reusable
- State management is predictable and testable
- Services abstract external dependencies
- Features are self-contained when possible

---

## 🛠️ Technology Stack

### Core Technologies
- **{{PRIMARY_LANGUAGE}}** ({{LANGUAGE_VERSION}})
- **{{FRAMEWORK}}** - Frontend framework
- **{{STATE_MANAGEMENT}}** - State management
- **{{STYLING_APPROACH}}** - Styling solution
- **{{BACKEND}}** - Backend/API

### Agent UI (A2UI)
- **A2UI**: Server-driven component trees for agent-generated UI
- **Widget Registry**: Maps abstract component types to React components
- **Transport**: JSONL over SSE for streaming UI updates
- **Coexistence**: A2UI for rich structured panels, Vercel AI SDK for chat/text streams
- See `@a2ui-specialist` for implementation guidance and `docs/A2UI_GUIDE.md` for patterns

### Development Tools
- **Build Tool**: {{BUILD_TOOL}}
- **Package Manager**: {{PACKAGE_MANAGER}}
- **Linter**: {{LINTER}}
- **Formatter**: {{FORMATTER}}

### Browser Support
- {{BROWSER_SUPPORT_LIST}}

---

## 🔐 Security Requirements

### Web Security Best Practices

1. **Authentication & Sessions**:
   - {{WEB_AUTH_APPROACH}}
   - Secure token storage (httpOnly cookies or secure local storage)
   - Implement CSRF protection
   - Handle session expiration gracefully

2. **XSS Prevention**:
   - Sanitize user input before rendering
   - Use framework's built-in XSS protection
   - Avoid `dangerouslySetInnerHTML` or `v-html` unless necessary
   - Implement Content Security Policy (CSP)

3. **API Security**:
   - Use HTTPS for all requests
   - Validate responses from APIs
   - Handle authentication tokens securely
   - Implement proper CORS configuration

4. **Data Protection**:
   - Never expose sensitive data in client-side code
   - Encrypt sensitive data in transit
   - Minimize data stored in browser storage
   - Clear sensitive data on logout

5. **Dependency Security**:
   - Audit dependencies regularly (`npm audit` or equivalent)
   - Keep dependencies up to date
   - Review security advisories

**Security Priorities for This Project**:
- {{SECURITY_PRIORITY_1}}
- {{SECURITY_PRIORITY_2}}
- {{SECURITY_PRIORITY_3}}

---

## 📝 Code Style & Conventions

### Naming Conventions
- **Files**: 
  - Components: `PascalCase.tsx` (e.g., `UserProfile.tsx`)
  - Utilities: `camelCase.ts` (e.g., `formatDate.ts`)
  - Styles: `kebab-case.css` or match component name
- **Components**: `PascalCase` (e.g., `UserProfileCard`)
- **Functions**: `camelCase` (e.g., `fetchUserData`, `handleSubmit`)
- **Variables**: `camelCase` (e.g., `userId`, `isLoading`)
- **Constants**: `UPPER_SNAKE_CASE` (e.g., `MAX_RETRIES`, `API_BASE_URL`)
- **Types/Interfaces**: `PascalCase` (e.g., `User`, `ApiResponse`)
- **CSS Classes**: `{{CSS_NAMING_CONVENTION}}` (e.g., `user-profile`, `btn-primary`)

### Component Organization

```typescript
// {{FRAMEWORK}} Component Structure
import { /* framework imports */ } from '{{FRAMEWORK}}';
import { /* third-party imports */ } from 'libraries';
import { /* local imports */ } from './local';

// Types/Interfaces
interface ComponentProps {
  // ...
}

// Component
export function ComponentName({ props }: ComponentProps) {
  // Hooks (if React)
  // State
  // Effects
  // Event handlers
  // Render helpers
  
  return (
    // JSX/Template
  );
}
```

### State Management Patterns

**{{STATE_MANAGEMENT}} Patterns**:
{{STATE_MANAGEMENT_EXAMPLES}}

### Error Handling
- Use try-catch for async operations
- Provide user-friendly error messages
- Log errors with context
- Display error boundaries for unhandled errors
- Handle network errors gracefully

---

## 🎨 UI/UX Patterns & Design Framework

### Design System
- **Component Library**: {{COMPONENT_LIBRARY}}
- **Theme System**: {{THEME_SYSTEM}}
- **Styling Approach**: {{STYLING_APPROACH}}
- **Responsive Strategy**: {{RESPONSIVE_STRATEGY}}

### Design Principles

**Brand Essence**: {{BRAND_ESSENCE}}

**Core Principles**:
1. {{DESIGN_PRINCIPLE_1}}
2. {{DESIGN_PRINCIPLE_2}}
3. {{DESIGN_PRINCIPLE_3}}

### Visual Language Guidelines

#### Color System
- Use design tokens for all colors
- Never hard-code color values
- Support both light and dark themes (if applicable)
- Maintain WCAG AA contrast ratios

#### Typography
- Use design system font tokens
- Maintain clear hierarchy (h1-h6, body, caption)
- Ensure readable line heights and spacing
- Support responsive font sizes

#### Spacing & Layout
- Use spacing scale (4px, 8px, 16px, 24px, 32px, etc.)
- Implement consistent padding and margins
- Create responsive layouts with breakpoints
- Use CSS Grid and Flexbox appropriately

#### Interactions & Animations
- Provide immediate feedback on interactions
- Use subtle animations (200-300ms)
- Respect prefers-reduced-motion
- Maintain consistent interaction patterns

### Responsive Design

**Breakpoints**:
```css
/* {{FRAMEWORK_NAME}} breakpoints */
- Mobile: {{MOBILE_BREAKPOINT}}
- Tablet: {{TABLET_BREAKPOINT}}
- Desktop: {{DESKTOP_BREAKPOINT}}
- Wide: {{WIDE_BREAKPOINT}}
```

**Responsive Strategies**:
- Mobile-first approach
- Flexible layouts using Grid/Flexbox
- Responsive images with srcset
- Conditional rendering for different viewports

### Accessibility Guidelines

1. **Semantic HTML**: Use appropriate HTML elements
2. **ARIA Labels**: Add ARIA labels where needed
3. **Keyboard Navigation**: Ensure full keyboard accessibility
4. **Focus Management**: Visible focus indicators
5. **Screen Readers**: Test with screen readers
6. **Color Contrast**: Meet WCAG AA standards (4.5:1 for text)
7. **Alt Text**: Provide meaningful alt text for images

### Common UI Patterns

#### Loading States
- Show loading indicators for async operations
- Skeleton screens for content loading
- Progressive loading for large datasets

#### Error States
- Display user-friendly error messages
- Provide retry actions
- Log errors for debugging

#### Empty States
- Show helpful empty state messages
- Provide next actions (CTAs)
- Use illustrations when appropriate

#### Forms
- Inline validation with clear error messages
- Disabled state for submit buttons during submission
- Success feedback after submission
- Preserve form state when possible

---

## 🧪 Testing Strategy

### Test Types

1. **Unit Tests**: Test individual functions and utilities
2. **Component Tests**: Test components in isolation
3. **Integration Tests**: Test feature flows
4. **E2E Tests**: Test complete user journeys
5. **{{ADDITIONAL_TEST_TYPE}}**: {{ADDITIONAL_TEST_DESCRIPTION}}

### Testing Tools

- **Unit/Component**: {{UNIT_TEST_FRAMEWORK}}
- **E2E**: {{E2E_TEST_FRAMEWORK}}
- **Coverage**: {{COVERAGE_TOOL}}

### Testing Standards

- **Coverage Target**: {{TEST_COVERAGE_TARGET}}%
- **Test Organization**: Co-located with components or in `__tests__/`
- **Naming**: `ComponentName.test.tsx` or `functionName.spec.ts`
- **Mocking**: Mock API calls and external dependencies

### Testing Best Practices

- Test behavior, not implementation
- Use Testing Library queries (if React)
- Mock network requests
- Test accessibility
- Test error scenarios
- Keep tests fast and deterministic

---

## ⚡ Performance Best Practices

### Bundle Optimization
- Code splitting with dynamic imports
- Lazy loading for routes and components
- Tree shaking to remove unused code
- Minimize bundle size (target: < {{MAX_BUNDLE_SIZE}}KB initial)

### Rendering Optimization
- Memoization for expensive computations
- Virtual scrolling for long lists
- Debouncing for frequent events
- Optimize re-renders (React.memo, useMemo, useCallback)

### Asset Optimization
- Optimize images (WebP, AVIF)
- Lazy load images below the fold
- Use CDN for static assets
- Implement proper caching strategies

### Network Optimization
- Minimize API requests
- Implement request caching
- Use pagination for large datasets
- Prefetch critical resources

### Monitoring
- Monitor Core Web Vitals (LCP, FID, CLS)
- Set performance budgets
- Use Lighthouse for audits
- Track bundle size over time

---

## 📚 Documentation Standards

### Code Documentation

- Document complex components and logic
- Use JSDoc/TSDoc for functions and APIs
- Include prop types and descriptions
- Provide usage examples for reusable components

### Component Documentation

```typescript
/**
 * UserCard component displays user information in a card format.
 * 
 * @example
 * ```tsx
 * <UserCard 
 *   user={userData} 
 *   onEdit={handleEdit}
 *   isEditable={true}
 * />
 * ```
 */
```

### Project Documentation

Documentation lives in `docs/`:
- **Architecture**: App structure and patterns
- **Components**: Component library documentation
- **API**: API integration guides
- **Deployment**: Deployment procedures

---

## 🔄 Workflow Guidelines

### Task Files and Task-Driven Development

- **Portfolio-level tasks**: `tasks.yml` - Project milestones
- **Feature tasks**: `tasks/*.yml` - Implementation tasks

### Task Workflow

1. **Select a Task**: Choose from `tasks/*.yml` with `status: todo`
2. **Check Agent Roles**: Verify `agent_roles` matches your expertise
3. **Read Context**: Review `spec_refs` and `acceptance_criteria`
4. **Implement**: Build components, state, and services
5. **Test**: Unit + component + integration tests
6. **Review Design**: Verify design system compliance
7. **Optimize**: Check performance and bundle size
8. **Update Status**: Propose status change when complete

### Multi-Agent Development

**Agent Roles for Web Projects**:
- `frontend`: Components, state management, routing
- `design_system`: UI consistency, theming, accessibility
- `testing`: Unit tests, component tests, E2E tests
- `performance`: Bundle optimization, lazy loading

See `AGENTS.md` for detailed agent responsibilities.

---

## 🎓 Web Development Best Practices

### Before Making Changes

1. Review design mockups or specifications
2. Check existing component library for reusable components
3. Understand state management patterns
4. Consider responsive design requirements

### When Adding New Features

1. **Plan Component Structure**: Break down into reusable components
2. **Set Up State Management**: Define state shape and actions
3. **Create Services**: API integration and data fetching
4. **Build Components**: Implement UI with design system
5. **Add Navigation**: Register routes if needed
6. **Implement Accessibility**: ARIA labels, keyboard navigation
7. **Write Tests**: Component tests, integration tests
8. **Optimize Performance**: Code splitting, lazy loading
9. **Document**: Component docs and usage examples

### Code Review Checklist

- [ ] Components use design system
- [ ] State management follows patterns
- [ ] Responsive design implemented
- [ ] Accessibility requirements met
- [ ] Error handling present
- [ ] Loading states implemented
- [ ] Tests cover main functionality
- [ ] No performance issues
- [ ] No console errors or warnings
- [ ] Bundle size within budget
- [ ] No hardcoded secrets
- [ ] Documentation updated

### Session Checklist

Before completing any task, verify:

- [ ] Task file updated with status and notes
- [ ] Relevant documentation updated
- [ ] Tests pass (unit + component + integration)
- [ ] No hardcoded secrets or credentials
- [ ] Agent handoff notes added (if task has multiple `agent_roles`)
- [ ] Acceptance criteria reviewed and met
- [ ] Design system compliance verified
- [ ] Bundle size within budget

---

## 💡 Tips for AI Agents

### Understanding Context

- This is a **web application** using **{{FRAMEWORK}}**
- State management uses **{{STATE_MANAGEMENT}}**
- Components should be reusable and testable
- Performance and accessibility are priorities

### Common Web Tasks

- **Building components**: Use design system → implement logic → add tests
- **State management**: Define state → create actions/mutations → connect to components
- **API integration**: Create service → handle loading/error states → display data
- **Routing**: Define routes → create pages → implement navigation

### When Uncertain

- Check `components/common/` for reusable components
- Look for similar features in `features/`
- Review design system in `styles/` or component library docs
- Check API patterns in `services/`

### Clarify Before Proceeding

**Ask for additional details when more information would materially improve your output.** Prefer asking over guessing when extra context would reduce ambiguity, wrong assumptions, or rework.

- **When to ask**: Ambiguity in scope/format, missing critical details, domain context that would change your approach, or high cost of being wrong
- **How to ask**: Be specific, state tradeoffs, offer defaults, bundle related questions
- **When not to ask**: Answer is discoverable, reasonable low-risk defaults exist, user said to proceed, or task is well-specified

---

## 🔗 Related Documentation

- **AGENTS.md**: Agent role definitions and collaboration patterns
- **docs/design/**: Design system and component guidelines
- **docs/api/**: API integration documentation

---

**Last Updated**: {{LAST_UPDATED_DATE}}  
**Maintainer**: {{MAINTAINER}}  
**Purpose**: Guide AI agents in web app development with {{FRAMEWORK}}
