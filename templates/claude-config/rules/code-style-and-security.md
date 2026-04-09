---
description: Code style conventions and security requirements for {{PROJECT_NAME}}
alwaysApply: true
---

# Code Style & Security

## Naming Conventions

- **Files**: {{FILE_NAMING_CONVENTION}} (e.g., `user_service.{{FILE_EXTENSION}}`)
- **Classes/Types**: {{CLASS_NAMING_CONVENTION}} (e.g., `UserService`, `DataModel`)
- **Functions/Methods**: {{FUNCTION_NAMING_CONVENTION}} (e.g., `getUserById`, `calculate_total`)
- **Variables**: {{VARIABLE_NAMING_CONVENTION}} (e.g., `userId`, `totalCount`)
- **Constants**: {{CONSTANT_NAMING_CONVENTION}} (e.g., `MAX_RETRIES`, `API_BASE_URL`)

## File Organization

- One main class/component per file (file name matches primary export)
- Group imports: {{IMPORT_GROUPING_STRATEGY}}
- Keep files focused and under {{MAX_FILE_LINES}} lines when possible

## Code Quality

- Functions: small and focused (ideally < 50 lines)
- Avoid deeply nested logic (max {{MAX_NESTING_DEPTH}} levels)
- Comments explain "why", not "what"
- Follow DRY and existing codebase patterns

## Error Handling

{{ERROR_HANDLING_APPROACH}}

## Security Requirements

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

5. **Dependencies**:
   - Keep dependencies up to date
   - Audit dependencies for known vulnerabilities

**Security Priorities**:
- {{SECURITY_PRIORITY_1}}
- {{SECURITY_PRIORITY_2}}
- {{SECURITY_PRIORITY_3}}
