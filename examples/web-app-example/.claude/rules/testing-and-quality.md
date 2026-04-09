---
description: Testing standards and quality requirements for CollabDocs
paths: ["**/*.{test,spec}.{ts,tsx}"]
alwaysApply: false
---

# Testing & Quality

## Coverage

- Target: 85% overall coverage
- All new features must include tests before merge
- Critical paths (auth, real-time sync, data persistence) require integration tests

## Testing Patterns

- Use React Testing Library for component tests
- Test user behavior, not implementation details
- Use `screen.getByRole` and accessible queries over test IDs
- Mock API calls with MSW (Mock Service Worker)

## Test Structure

- Follow AAA pattern: Arrange, Act, Assert
- One assertion concept per test
- Descriptive test names: `it("shows error message when login fails")`
- Group related tests with `describe` blocks

## Quality Gates

- Lighthouse score > 90 for all pages
- Bundle size < 250KB initial load
- Core Web Vitals must meet "Good" thresholds
- No TypeScript errors (`tsc --noEmit` passes)
