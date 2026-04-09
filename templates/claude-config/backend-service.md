# Cursor AI Agent Rules for {{PROJECT_NAME}}

## 🎯 Project Overview

{{PROJECT_DESCRIPTION}}

**Type**: Backend Service / API  
**Key Philosophy**: {{ARCHITECTURE_PHILOSOPHY}}

---

## 🏗️ Architecture Patterns

### Architecture Style

This project follows **{{ARCHITECTURE_PATTERN}}** architecture.

**Typical Backend Patterns**:
- **Layered Architecture**: Controllers → Services → Data Access
- **Clean Architecture**: Presentation → Business Logic → Data
- **Domain-Driven Design**: Organized by business domains
- **Microservices**: Distributed services (if applicable)

### Directory Structure

```
src/
├── api/               # API layer
│   ├── controllers/   # Request handlers
│   ├── middleware/    # Express/Fastify middleware
│   ├── routes/        # Route definitions
│   └── validators/    # Request validation schemas
├── services/          # Business logic layer
│   └── {domain}/      # Domain-specific services
├── models/            # Data models and schemas
│   ├── entities/      # Domain entities
│   └── schemas/       # Database schemas
├── repositories/      # Data access layer
│   └── {domain}/      # Domain-specific repositories
├── database/          # Database configuration
│   ├── migrations/    # Database migrations
│   └── seeds/         # Seed data
├── utils/             # Utility functions
├── config/            # Configuration management
└── types/             # TypeScript types/interfaces
```

**Key Principles**:
- Controllers handle HTTP concerns only
- Services contain business logic
- Repositories abstract data access
- Clear separation between layers

---

## 🛠️ Technology Stack

### Core Technologies
- **{{PRIMARY_LANGUAGE}}** ({{LANGUAGE_VERSION}})
- **{{FRAMEWORK}}** - Web framework
- **{{DATABASE_TYPE}}** - Database
- **{{ORM_LIBRARY}}** - Database ORM/Query builder

### Infrastructure
- **Authentication**: {{AUTH_APPROACH}}
- **Caching**: {{CACHING_SOLUTION}}
- **Queue/Jobs**: {{QUEUE_SYSTEM}}
- **Logging**: {{LOGGING_LIBRARY}}
- **Monitoring**: {{MONITORING_SOLUTION}}

### Development Tools
- **Testing**: {{TEST_FRAMEWORK}}
- **Linting**: {{LINTER}}
- **Documentation**: {{API_DOCS_TOOL}}
- **Package Manager**: {{PACKAGE_MANAGER}}

---

## 🔐 Security Requirements

### Backend Security Best Practices

1. **Authentication & Authorization**:
   - {{AUTH_IMPLEMENTATION}}
   - Implement JWT or session-based auth
   - Use refresh tokens for long-lived sessions
   - Validate all incoming requests

2. **Input Validation**:
   - Validate all request payloads
   - Sanitize user input
   - Use validation schemas (Joi, Zod, etc.)
   - Reject malformed requests with 400 status

3. **SQL Injection Prevention**:
   - Use parameterized queries or ORM
   - Never concatenate user input into queries
   - Validate and sanitize all database inputs
   - Use least privilege for database connections

4. **Rate Limiting**:
   - Implement rate limiting for all endpoints
   - Use stricter limits for auth endpoints
   - Return 429 status when rate limit exceeded
   - Consider IP-based and user-based limiting

5. **Secrets Management**:
   - Never commit secrets to version control
   - Use environment variables or secret managers
   - Rotate secrets regularly
   - Use separate secrets per environment

6. **API Security**:
   - Implement CORS properly
   - Use HTTPS in production
   - Add security headers (Helmet.js or equivalent)
   - Implement CSRF protection for state-changing ops

7. **Error Handling**:
   - Never expose stack traces in production
   - Log errors with context
   - Return generic error messages to clients
   - Implement proper error codes and messages

**Security Priorities for This Project**:
- {{SECURITY_PRIORITY_1}}
- {{SECURITY_PRIORITY_2}}
- {{SECURITY_PRIORITY_3}}

---

## 📝 Code Style & Conventions

### Naming Conventions
- **Files**: `camelCase.ts` or `kebab-case.ts` (e.g., `userService.ts`, `auth-middleware.ts`)
- **Classes**: `PascalCase` (e.g., `UserService`, `AuthController`)
- **Functions**: `camelCase` (e.g., `getUserById`, `validateRequest`)
- **Variables**: `camelCase` (e.g., `userId`, `isAuthenticated`)
- **Constants**: `UPPER_SNAKE_CASE` (e.g., `MAX_RETRIES`, `DB_CONNECTION_STRING`)
- **Database Tables**: `{{DB_TABLE_NAMING}}` (e.g., `users`, `user_profiles`)
- **Database Columns**: `{{DB_COLUMN_NAMING}}` (e.g., `user_id`, `created_at`)

### API Design Conventions

**RESTful Endpoints**:
```
GET    /api/{{API_VERSION}}/users          # List users
POST   /api/{{API_VERSION}}/users          # Create user
GET    /api/{{API_VERSION}}/users/:id      # Get user
PUT    /api/{{API_VERSION}}/users/:id      # Update user
DELETE /api/{{API_VERSION}}/users/:id      # Delete user
```

**Response Format**:
```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Optional message",
  "meta": { /* pagination, etc. */ }
}

{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "User-friendly message",
    "details": { /* optional details */ }
  }
}
```

**HTTP Status Codes**:
- `200` - OK (successful GET, PUT, PATCH)
- `201` - Created (successful POST)
- `204` - No Content (successful DELETE)
- `400` - Bad Request (validation error)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error (unexpected error)

### Error Handling Patterns

```typescript
// Custom error classes
class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public code: string,
    public details?: any
  ) {
    super(message);
  }
}

// Error handling middleware
function errorHandler(err, req, res, next) {
  // Log error
  logger.error(err);
  
  // Send response
  res.status(err.statusCode || 500).json({
    success: false,
    error: {
      code: err.code || 'INTERNAL_ERROR',
      message: err.message || 'Something went wrong'
    }
  });
}
```

---

## 🗄️ Database Patterns

### Schema Design

**Naming Conventions**:
- Tables: {{DB_TABLE_NAMING}} (e.g., `users`, `user_sessions`)
- Columns: {{DB_COLUMN_NAMING}} (e.g., `user_id`, `created_at`)
- Indexes: `idx_{table}_{column}` (e.g., `idx_users_email`)
- Foreign Keys: `fk_{table}_{reference}` (e.g., `fk_posts_user_id`)

**Standard Columns**:
```sql
-- Every table should have:
id              {{ID_TYPE}}         PRIMARY KEY
created_at      TIMESTAMP           DEFAULT NOW()
updated_at      TIMESTAMP           DEFAULT NOW()

-- Soft delete (if applicable):
deleted_at      TIMESTAMP           NULL
```

### Migration Best Practices

1. **One migration per change**: Don't mix schema changes
2. **Reversible migrations**: Always provide `down` migration
3. **Test migrations**: Test on development before production
4. **Backup before migration**: Always backup production database
5. **Version control**: Commit migrations to git

### Query Optimization

- Use indexes for frequently queried columns
- Avoid N+1 queries (use joins or eager loading)
- Paginate large result sets
- Use connection pooling
- Monitor slow queries
- Use EXPLAIN to analyze query performance

### Data Validation

- Enforce constraints at database level (NOT NULL, UNIQUE, CHECK)
- Validate at application level before database operations
- Use transactions for multi-step operations
- Handle race conditions with optimistic or pessimistic locking

---

## 🧪 Testing Strategy

### Test Types

1. **Unit Tests**: Test individual functions and classes
2. **Integration Tests**: Test API endpoints end-to-end
3. **Database Tests**: Test repository layer with test database
4. **Contract Tests**: Test API contracts (if microservices)
5. **{{ADDITIONAL_TEST_TYPE}}**: {{ADDITIONAL_TEST_DESCRIPTION}}

### Testing Standards

- **Coverage Target**: {{TEST_COVERAGE_TARGET}}%
- **Test Database**: Use separate test database or in-memory database
- **Test Isolation**: Each test should be independent
- **Mocking**: Mock external services and APIs

### Testing Best Practices

```typescript
// Integration test structure
describe('POST /api/users', () => {
  beforeEach(async () => {
    // Set up test database
    await database.migrate.latest();
    await database.seed.run();
  });
  
  afterEach(async () => {
    // Clean up
    await database.migrate.rollback();
  });
  
  it('should create a new user', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({ name: 'Test User', email: 'test@example.com' })
      .expect(201);
    
    expect(response.body).toHaveProperty('data.id');
    expect(response.body.data.name).toBe('Test User');
  });
  
  it('should return 400 for invalid email', async () => {
    await request(app)
      .post('/api/users')
      .send({ name: 'Test', email: 'invalid' })
      .expect(400);
  });
});
```

---

## 📚 API Documentation

### Documentation Standards

- Use {{API_DOCS_TOOL}} for API documentation
- Document all endpoints with request/response examples
- Include authentication requirements
- Document error responses
- Provide usage examples

### OpenAPI/Swagger Documentation

```yaml
/api/users/{id}:
  get:
    summary: Get user by ID
    parameters:
      - name: id
        in: path
        required: true
        schema:
          type: string
    responses:
      200:
        description: User found
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/User'
      404:
        description: User not found
```

---

## ⚡ Performance Best Practices

### Response Time Optimization

- Target response time: < {{TARGET_RESPONSE_TIME}}ms for most endpoints
- Use caching for frequently accessed data
- Implement pagination for large datasets
- Use async/await properly to avoid blocking
- Optimize database queries

### Caching Strategy

- Cache static data (configuration, reference data)
- Cache expensive computations
- Use Redis or similar for distributed caching
- Implement cache invalidation strategy
- Set appropriate TTLs

### Database Connection Pooling

```typescript
// Connection pool configuration
const pool = {
  min: {{DB_POOL_MIN}},
  max: {{DB_POOL_MAX}},
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
};
```

### Monitoring & Observability

- Log all requests with request ID
- Track response times and error rates
- Monitor database query performance
- Set up alerts for high error rates or slow responses
- Use structured logging

---

## 🔄 Workflow Guidelines

### Task Files and Task-Driven Development

- **Portfolio-level tasks**: `tasks.yml` - Service milestones
- **Feature tasks**: `tasks/*.yml` - API implementation tasks

### Task Workflow

1. **Select a Task**: Choose from `tasks/*.yml` with `status: todo`
2. **Check Agent Roles**: Verify `agent_roles` matches (api, database, security, testing)
3. **Design API**: Define endpoints, request/response schemas
4. **Schema First**: Design database schema if needed
5. **Implement**: Controllers → Services → Repositories
6. **Validate**: Add input validation and error handling
7. **Secure**: Implement authentication and authorization
8. **Test**: Unit tests, integration tests, database tests
9. **Document**: Update API documentation
10. **Update Status**: Propose status change when complete

### Multi-Agent Development

**Agent Roles for Backend Projects**:
- `api`: Endpoints, validation, error handling
- `database`: Schema, migrations, queries, indexes
- `testing`: Unit tests, integration tests, API contract tests
- `security`: Auth, authorization, rate limiting, input validation

See `AGENTS.md` for detailed agent responsibilities.

---

## 🎓 Backend Development Best Practices

### Before Making Changes

1. Understand the business domain and requirements
2. Review existing API patterns and conventions
3. Check database schema and relationships
4. Consider scalability and performance implications

### When Adding New API Endpoints

1. **Design API**: Define endpoint URL, method, request/response
2. **Define Schema**: Create database schema and migrations
3. **Create Models**: Define data models and entities
4. **Implement Repository**: Data access layer
5. **Implement Service**: Business logic layer
6. **Create Controller**: Request handling layer
7. **Add Validation**: Request validation schemas
8. **Implement Auth**: Authentication and authorization
9. **Add Tests**: Unit and integration tests
10. **Document**: API documentation

### Code Review Checklist

- [ ] API design follows RESTful conventions
- [ ] Request validation implemented
- [ ] Error handling present
- [ ] Authentication/authorization implemented
- [ ] Database queries optimized
- [ ] Transactions used where appropriate
- [ ] Tests cover main scenarios
- [ ] No SQL injection vulnerabilities
- [ ] No hardcoded secrets
- [ ] Rate limiting implemented
- [ ] Logging added for debugging
- [ ] API documentation updated

### Session Checklist

Before completing any task, verify:

- [ ] Task file updated with status and notes
- [ ] Relevant documentation updated
- [ ] Tests pass (unit + integration + database)
- [ ] No hardcoded secrets or credentials
- [ ] Agent handoff notes added (if task has multiple `agent_roles`)
- [ ] Acceptance criteria reviewed and met
- [ ] API documentation updated
- [ ] Rate limiting applied to new endpoints

---

## 💡 Tips for AI Agents

### Understanding Context

- This is a **backend service/API** using **{{FRAMEWORK}}**
- Database is **{{DATABASE_TYPE}}**
- Follow RESTful conventions for API design
- Security and performance are critical

### Common Backend Tasks

- **Adding endpoints**: Design API → validate input → implement logic → test
- **Database changes**: Design schema → create migration → update models → test
- **Business logic**: Define requirements → implement in service layer → add tests
- **Security**: Implement auth middleware → add authorization checks → validate input

### When Uncertain

- Check existing controllers for API patterns
- Review service layer for business logic patterns
- Check repository layer for database access patterns
- Look at middleware for request processing patterns

### Clarify Before Proceeding

**Ask for additional details when more information would materially improve your output.** Prefer asking over guessing when extra context would reduce ambiguity, wrong assumptions, or rework.

- **When to ask**: Ambiguity in scope/format, missing critical details, domain context that would change your approach, or high cost of being wrong
- **How to ask**: Be specific, state tradeoffs, offer defaults, bundle related questions
- **When not to ask**: Answer is discoverable, reasonable low-risk defaults exist, user said to proceed, or task is well-specified

---

## 🔗 Related Documentation

- **AGENTS.md**: Agent role definitions and collaboration patterns
- **docs/api/**: API documentation and schemas
- **docs/database/**: Database schema and migration guides

---

**Last Updated**: {{LAST_UPDATED_DATE}}  
**Maintainer**: {{MAINTAINER}}  
**Purpose**: Guide AI agents in backend service development with {{FRAMEWORK}}
