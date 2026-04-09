# Semantic Memory -- Validated Patterns

Patterns in this file have been validated through practice and should be followed in all sessions.

## Architecture Patterns

- **Schema docs before implementation**: Always create or update data model documentation (`docs/data_models/`) before writing implementation code. This ensures agents and reviewers have a shared understanding of the data shape.
- **Repository pattern for data access**: All database operations go through repository classes. Never write raw queries in controllers or services.
- **Service layer for business logic**: Controllers handle HTTP concerns only. Business logic lives in the service layer, making it testable without HTTP context.

## Security Rules

- **Secrets in Secret Manager**: Never store API keys, tokens, or credentials in code, environment files committed to git, or configuration files. Use the project's secret management service (e.g., AWS Secrets Manager, GCP Secret Manager, HashiCorp Vault).
- **Input validation at API boundary**: Validate all request payloads using schema validation (Zod, Joi, etc.) before they reach the service layer.
- **No sensitive data in logs**: Error logs should include request IDs and context but never include tokens, passwords, or PII.

## Task Management Rules

- **Update task status before starting work**: Propose `status: in_progress` before making changes. This prevents multiple agents from picking up the same task.
- **Handoff notes are mandatory**: When a task has multiple `agent_roles`, each agent must leave a handoff note in the task before the next agent starts.

## Code Quality

- **Max function length**: Keep functions under 50 lines. Extract helpers for complex logic.
- **Test alongside implementation**: Every new feature or endpoint must include tests in the same PR. Do not defer testing to a separate task.

---

*Last validated: 2026-02-17*
*To add a pattern: validate it across at least two sessions, then add it here with a brief rationale.*
