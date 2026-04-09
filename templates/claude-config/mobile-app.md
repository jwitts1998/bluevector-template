# Cursor AI Agent Rules for {{PROJECT_NAME}}

## 🎯 Project Overview

{{PROJECT_DESCRIPTION}}

**Platform**: Mobile (iOS / Android)  
**Key Philosophy**: {{ARCHITECTURE_PHILOSOPHY}}

---

## 🏗️ Architecture Patterns

### Two-Tier Architecture Strategy

This project uses a flexible architecture approach:

#### Pattern 1: Full Clean Architecture (Complex Features)
**Use When**:
- Feature has complex business logic
- Multiple data sources (local DB + APIs)
- Reusable domain models needed
- Independent testing required

**Structure**:
```
lib/features/{feature_name}/
├── data/              # External data sources
│   └── services/      # API/database service implementations
├── domain/            # Business logic
│   └── models/        # Domain models, entities
└── presentation/      # UI layer
    ├── pages/         # Full-page screens
    ├── providers/     # State management
    └── widgets/       # Reusable UI components
```

#### Pattern 2: Presentation-Only (Simple Features)
**Use When**:
- Feature is primarily UI
- Consumes existing core services
- Minimal business logic
- Direct data integration is simple

**Structure**:
```
lib/features/{feature_name}/
└── presentation/      # UI layer only
    ├── pages/         # Full-page screens
    ├── providers/     # State management (if needed)
    └── widgets/       # Reusable UI components
```

### Core Infrastructure

```
lib/
├── core/              # Shared infrastructure
│   ├── auth/          # Authentication system
│   ├── common/        # Shared UI components
│   ├── navigation/    # Navigation wrapper
│   ├── routing/       # Route definitions
│   ├── theme/         # App theming
│   └── utils/         # Utility functions
├── features/          # Feature modules
└── design_system/     # Design system components
```

**Core Principles**:
- Core services are stateless and reusable
- Core widgets are shared UI components
- Features are self-contained modules
- State management follows {{STATE_MANAGEMENT}} patterns

---

## 🛠️ Technology Stack

### Core Technologies
- **{{PRIMARY_LANGUAGE}}** ({{LANGUAGE_VERSION}})
- **{{FRAMEWORK}}** - Cross-platform mobile framework
- **{{STATE_MANAGEMENT}}** - State management
- **{{BACKEND}}** - Backend infrastructure

### Agent UI (A2UI)
- **A2UI**: Server-driven component trees for agent-generated UI
- **Widget Registry**: Maps abstract component types to Flutter/Material 3 widgets
- **Transport**: JSONL over SSE for streaming UI updates
- **Coexistence**: A2UI for rich structured surfaces, flutter_chat_ui for chat threads
- See `@a2ui-specialist` for implementation guidance and `docs/A2UI_GUIDE.md` for patterns

### Mobile-Specific Tools
- **Navigation**: {{NAVIGATION_LIBRARY}}
- **Local Storage**: {{LOCAL_STORAGE_SOLUTION}}
- **Network**: {{NETWORK_LIBRARY}}
- **Image Handling**: {{IMAGE_LIBRARY}}

### Design System
- **Design Language**: {{DESIGN_SYSTEM}} (Material Design, Cupertino, Custom)
- **Theme System**: {{THEME_APPROACH}}
- **Responsive Design**: {{RESPONSIVE_STRATEGY}}

---

## 🔐 Security Requirements

### Mobile Security Best Practices

1. **Secure Storage**:
   - Use secure storage for tokens and sensitive data
   - Never store credentials in plain text
   - Use {{SECURE_STORAGE_LIBRARY}} for sensitive data

2. **Network Security**:
   - Use HTTPS for all network requests
   - Implement certificate pinning for critical APIs
   - Validate server certificates

3. **Authentication**:
   - {{MOBILE_AUTH_APPROACH}}
   - Implement biometric authentication where appropriate
   - Handle token refresh securely

4. **Data Protection**:
   - Encrypt sensitive data at rest
   - Clear sensitive data from memory after use
   - Implement proper session management

5. **Code Security**:
   - No hardcoded API keys or secrets
   - Use environment variables or secure config
   - Obfuscate code for production builds

**Security Priorities for This Project**:
- {{SECURITY_PRIORITY_1}}
- {{SECURITY_PRIORITY_2}}
- {{SECURITY_PRIORITY_3}}

---

## 📝 Code Style & Conventions

### Naming Conventions
- **Files**: `snake_case.dart` or `kebab-case.tsx` (e.g., `user_profile_page.dart`)
- **Classes/Components**: `PascalCase` (e.g., `UserProfilePage`, `CustomButton`)
- **Functions/Methods**: `camelCase` (e.g., `fetchUserData`, `handleSubmit`)
- **Variables**: `camelCase` (e.g., `userId`, `isLoading`)
- **Constants**: `lowerCamelCase` or `UPPER_SNAKE_CASE` (e.g., `maxRetries`, `API_BASE_URL`)
- **Providers/State**: `{{STATE_NAMING_CONVENTION}}` (e.g., `userProvider`, `authStateProvider`)

### File Organization
- One main widget/component per file (file name matches widget name)
- Group imports: Framework → Packages → Local
- Use trailing commas for better formatting
- Extract reusable widgets to separate files

### State Management Patterns

**{{STATE_MANAGEMENT}} Patterns**:
{{STATE_MANAGEMENT_EXAMPLES}}

### Error Handling
- Use try-catch for async operations
- Provide user-friendly error messages
- Log errors with context (use structured logging)
- Handle loading/error/success states consistently

---

## 🎨 UI/UX Patterns & Design Framework

### Design System Foundation
- **Design Tokens**: {{DESIGN_TOKEN_SYSTEM}}
- **Theme System**: `lib/core/theme/` (single source of truth for design tokens)
- **Reusable Components**: `lib/core/common/widgets/` and `lib/design_system/`

### Brand Foundations & Design Philosophy

**Brand Essence**: {{BRAND_ESSENCE}}

**Design Principles**:
1. {{DESIGN_PRINCIPLE_1}}
2. {{DESIGN_PRINCIPLE_2}}
3. {{DESIGN_PRINCIPLE_3}}

**Tone**: {{DESIGN_TONE}}

### Core Interaction Principles

These principles should guide all UI/UX design decisions:

1. **{{INTERACTION_PRINCIPLE_1}}**
   - {{PRINCIPLE_1_DESCRIPTION}}

2. **{{INTERACTION_PRINCIPLE_2}}**
   - {{PRINCIPLE_2_DESCRIPTION}}

3. **{{INTERACTION_PRINCIPLE_3}}**
   - {{PRINCIPLE_3_DESCRIPTION}}

### Visual Language Guidelines

#### Color System
- **Primary**: Use theme's primary color for key CTAs
- **Secondary/Surface**: Use surface colors for backgrounds
- **State Colors**: Use defined tokens (error, success, warning, info)
- **Consistency**: Never add ad-hoc colors; extend theme system

#### Typography
- Use theme font tokens consistently
- Use `theme.textTheme` variants instead of custom styles
- Maintain hierarchy (heading, body, caption, etc.)

#### Spacing, Shape, and Elevation
- Use theme spacing tokens (XS, S, M, L, XL)
- Use theme border radius tokens
- Elevation should be subtle and consistent
- Avoid magic numbers; always use theme tokens

#### Motion & Micro-interactions
- Transitions: Fast and supportive (200-300ms)
- Use framework primitives for animations
- Avoid distracting continuous animations
- Focus on state clarity (loading, success, failure)

### Core Component Patterns

#### Buttons
- Use theme-aware button components
- Support loading/disabled states
- Provide clear visual feedback on interaction

#### Cards & Content Containers
- Use consistent shape and padding
- Make entire card tappable when appropriate
- Provide clear affordances for interaction

#### Inputs & Forms
- Use theme-aware input components
- Provide clear labels, hints, and error messages
- Validate input and show feedback

#### Navigation
- Use consistent navigation patterns
- Maintain navigation state
- Handle deep linking appropriately

### Common State Patterns
- **Loading**: Show progress indicators with context
- **Error**: Display user-friendly messages with retry options
- **Empty**: Provide helpful guidance and next actions
- **Optimistic Updates**: Update UI immediately, sync asynchronously

### Design Review Checklist

Before considering UI work complete, verify:

1. **Brand Alignment**
   - Does the UI feel consistent with the brand?
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
   - Contrast meets WCAG AA standards?
   - Hit targets are ≥44x44dp/pt?
   - Screen reader support?
   - Semantic labels provided?

5. **Responsive Design**
   - Works on small phones?
   - Works on tablets?
   - Adapts to orientation changes?

---

## 🧪 Testing Strategy

### Test Types

1. **Unit Tests**: Test business logic, services, and utilities
2. **Widget/Component Tests**: Test individual UI components
3. **Integration Tests**: Test feature flows end-to-end
4. **{{ADDITIONAL_MOBILE_TEST_TYPE}}**: {{ADDITIONAL_TEST_DESCRIPTION}}

### Mobile-Specific Testing

- **Platform Testing**: Test on both iOS and Android
- **Device Testing**: Test on various screen sizes
- **Offline Testing**: Verify offline functionality
- **Performance Testing**: Monitor app performance and memory usage

### Testing Standards

- **Coverage Target**: {{TEST_COVERAGE_TARGET}}%
- **Test Organization**: Mirror production code structure
- **Mocking**: Mock {{BACKEND}} services and external dependencies
- **Test Data**: Use realistic test data and fixtures

### Testing Best Practices

- Test on real devices when possible
- Use emulators/simulators for rapid testing
- Mock network requests for deterministic tests
- Test error scenarios and edge cases
- Verify accessibility in tests

---

## 📚 Documentation Standards

### Code Documentation

- Document complex UI components and custom widgets
- Include usage examples for reusable components
- Document state management patterns
- Add comments for non-obvious platform-specific code

### Project Documentation

Documentation lives in `docs/`:

- **Architecture**: App structure and patterns
- **Features**: Feature-specific documentation
- **Design**: Design system and UI guidelines
- **Platform**: Platform-specific implementation notes

---

## 🔄 Workflow Guidelines

### Task Files and Task-Driven Development

- **Portfolio-level tasks**: `tasks.yml` - App milestones and releases
- **Feature tasks**: `tasks/*.yml` - Detailed implementation tasks

### Task Workflow

1. **Select a Task**: Choose from `tasks/*.yml` with `status: todo`
2. **Check Agent Roles**: Verify `agent_roles` field matches your expertise
3. **Read Context**: Review `spec_refs` and `acceptance_criteria`
4. **Choose Architecture**: Determine Clean Architecture vs Presentation-Only
5. **Implement**: Follow mobile best practices
6. **Test**: Unit tests + widget tests + integration tests
7. **Review Design**: Verify design system compliance
8. **Update Status**: Propose status change when complete

### Multi-Agent Development

**Agent Roles for Mobile Projects**:
- `implementation`: Business logic, services, data models
- `ui_ux`: Design system, accessibility, responsive layouts
- `testing`: Unit tests, widget tests, integration tests

See `AGENTS.md` for detailed agent responsibilities and collaboration patterns.

---

## 🎓 Mobile Development Best Practices

### Before Making Changes

1. Check which architecture pattern to use (Clean vs Presentation-Only)
2. Review similar features for established patterns
3. Understand mobile-specific constraints (memory, battery, network)
4. Consider both iOS and Android platforms

### When Adding New Features

1. **Determine Architecture**: Choose Clean Architecture or Presentation-Only
2. **Create Directory Structure**: Set up feature directories
3. **Define Data Models**: Create domain models if needed
4. **Implement Services**: Add data layer if needed
5. **Create State Management**: Set up providers/state
6. **Build UI**: Create pages and widgets
7. **Add Navigation**: Register routes
8. **Write Tests**: Unit + widget + integration tests
9. **Document**: Update feature docs

### Platform-Specific Considerations

**iOS**:
- Follow Human Interface Guidelines
- Use Cupertino widgets where appropriate
- Handle Safe Area properly
- Test on various iPhone sizes

**Android**:
- Follow Material Design guidelines
- Use Material widgets appropriately
- Handle system navigation properly
- Test on various Android versions and sizes

### Performance Best Practices

- Optimize widget rebuilds (use `const` constructors)
- Implement lazy loading for lists
- Cache images and data appropriately
- Profile app performance regularly
- Monitor memory usage
- Optimize asset sizes

### Code Review Checklist

- [ ] Follows appropriate architecture pattern
- [ ] Uses {{STATE_MANAGEMENT}} correctly
- [ ] UI components use design system
- [ ] Navigation implemented correctly
- [ ] Error handling present
- [ ] Loading states implemented
- [ ] Offline behavior handled (if applicable)
- [ ] Tested on iOS and Android
- [ ] Accessibility implemented
- [ ] No performance issues
- [ ] No hardcoded secrets
- [ ] Documentation updated

### Session Checklist

Before completing any task, verify:

- [ ] Task file updated with status and notes
- [ ] Relevant documentation updated
- [ ] Tests pass (unit + widget + integration)
- [ ] No hardcoded secrets or credentials
- [ ] Agent handoff notes added (if task has multiple `agent_roles`)
- [ ] Acceptance criteria reviewed and met
- [ ] Design system tokens used (no magic numbers)
- [ ] Tested on both iOS and Android

---

## 💡 Tips for AI Agents

### Understanding Context

- This is a **mobile app** using **{{FRAMEWORK}}**
- Architecture varies by feature complexity (Clean Architecture vs Presentation-Only)
- Design system is critical - always use theme tokens
- Test on both platforms (iOS and Android)

### Common Mobile Tasks

- **Adding features**: Choose architecture pattern → implement data/domain/presentation → test
- **Building UI**: Use design system components → follow theme tokens → test accessibility
- **State management**: Use {{STATE_MANAGEMENT}} → handle loading/error/success states
- **Navigation**: Register routes → implement navigation → handle deep links

### When Uncertain

- Check `lib/core/` for shared infrastructure
- Look for similar features in `lib/features/`
- Review `AGENTS.md` for agent-specific guidelines
- Check design system in `lib/design_system/` or `lib/core/theme/`

### Clarify Before Proceeding

**Ask for additional details when more information would materially improve your output.** Prefer asking over guessing when extra context would reduce ambiguity, wrong assumptions, or rework.

- **When to ask**: Ambiguity in scope/format, missing critical details, domain context that would change your approach, or high cost of being wrong
- **How to ask**: Be specific, state tradeoffs, offer defaults, bundle related questions
- **When not to ask**: Answer is discoverable, reasonable low-risk defaults exist, user said to proceed, or task is well-specified

### Architecture Decision Tree

**Use Clean Architecture when**:
- Feature has complex business logic
- Multiple data sources (API + local storage)
- Reusable domain models needed

**Use Presentation-Only when**:
- Feature is primarily UI
- Uses existing core services
- Minimal business logic

---

## 🔗 Related Documentation

- **AGENTS.md**: Agent role definitions and collaboration patterns
- **docs/design/**: Design system and UI guidelines
- **docs/architecture/**: Architecture patterns and decisions

---

**Last Updated**: {{LAST_UPDATED_DATE}}  
**Maintainer**: {{MAINTAINER}}  
**Purpose**: Guide AI agents in mobile app development with {{FRAMEWORK}}
