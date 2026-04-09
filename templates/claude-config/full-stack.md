# Cursor AI Agent Rules for {{PROJECT_NAME}}

## 🎯 Project Overview

{{PROJECT_DESCRIPTION}}

**Type**: Full-Stack Application (Frontend + Backend)  
**Key Philosophy**: {{ARCHITECTURE_PHILOSOPHY}}

---

## 🏗️ Architecture Patterns

### Full-Stack Architecture

This project combines frontend and backend concerns in a unified architecture.

**Common Full-Stack Patterns**:
- **Monorepo**: Frontend and backend in single repository
- **API-First**: Backend exposes REST/GraphQL API, frontend consumes it
- **Server-Side Rendering**: {{SSR_FRAMEWORK}} with API routes
- **Serverless**: Frontend + serverless functions

### Directory Structure

```
project-root/
├── client/            # Frontend application
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── features/       # Feature modules
│   │   ├── lib/            # Client utilities
│   │   ├── services/       # API clients
│   │   └── state/          # State management
│   └── public/             # Static assets
│
├── server/            # Backend application
│   ├── src/
│   │   ├── api/            # API endpoints
│   │   ├── services/       # Business logic
│   │   ├── models/         # Data models
│   │   ├── database/       # Database config
│   │   └── middleware/     # Express middleware
│   └── tests/              # Backend tests
│
├── shared/            # Shared code between client and server
│   ├── types/              # TypeScript types
│   ├── utils/              # Shared utilities
│   └── constants/          # Shared constants
│
└── docs/              # Project documentation
```

**Key Principles**:
- Clear separation between client and server
- Shared types for type safety across stack
- API contracts define client-server interface
- Reusable business logic where appropriate

---

## 🛠️ Technology Stack

### Frontend Technologies
- **Language**: {{FRONTEND_LANGUAGE}} ({{FRONTEND_VERSION}})
- **Framework**: {{FRONTEND_FRAMEWORK}}
- **State Management**: {{STATE_MANAGEMENT}}
- **Styling**: {{STYLING_APPROACH}}
- **Build Tool**: {{BUILD_TOOL}}

### Backend Technologies
- **Language**: {{BACKEND_LANGUAGE}} ({{BACKEND_VERSION}})
- **Framework**: {{BACKEND_FRAMEWORK}}
- **Database**: {{DATABASE_TYPE}}
- **ORM**: {{ORM_LIBRARY}}
- **Authentication**: {{AUTH_APPROACH}}

### Shared Technologies
- **API Protocol**: {{API_PROTOCOL}} (REST, GraphQL, tRPC)
- **Type System**: {{TYPE_SYSTEM}} (shared types across stack)
- **Testing**: {{TEST_FRAMEWORK}}
- **Monorepo Tool**: {{MONOREPO_TOOL}} (if applicable)

---

## 🔐 Security Requirements

### Full-Stack Security Best Practices

1. **Authentication & Authorization**:
   - {{AUTH_IMPLEMENTATION}}
   - Secure token storage on client
   - Token validation on server
   - Session management across stack

2. **API Security**:
   - Implement CORS properly
   - Use HTTPS in production
   - Validate all requests on server
   - Rate limiting on API endpoints

3. **Frontend Security**:
   - XSS prevention (sanitize user input)
   - CSRF protection for state-changing operations
   - Content Security Policy (CSP)
   - Secure token storage (httpOnly cookies preferred)

4. **Backend Security**:
   - Input validation and sanitization
   - SQL injection prevention (parameterized queries)
   - No secrets in client-side code
   - Proper error handling (don't leak sensitive info)

5. **Secrets Management**:
   - Environment variables for both client and server
   - Separate secrets per environment
   - Never commit secrets to version control
   - Use secret management service in production

**Security Priorities for This Project**:
- {{SECURITY_PRIORITY_1}}
- {{SECURITY_PRIORITY_2}}
- {{SECURITY_PRIORITY_3}}

---

## 📝 Code Style & Conventions

### Naming Conventions

**Frontend**:
- Files: `PascalCase.tsx` for components, `camelCase.ts` for utilities
- Components: `PascalCase` (e.g., `UserProfile`)
- Functions: `camelCase` (e.g., `fetchUserData`)
- CSS Classes: `{{CSS_NAMING_CONVENTION}}`

**Backend**:
- Files: `camelCase.ts` or `kebab-case.ts`
- Classes: `PascalCase` (e.g., `UserService`)
- Functions: `camelCase` (e.g., `getUserById`)
- Database: `{{DB_NAMING_CONVENTION}}`

**Shared**:
- Types/Interfaces: `PascalCase` (e.g., `User`, `ApiResponse`)
- Constants: `UPPER_SNAKE_CASE` (e.g., `MAX_UPLOAD_SIZE`)

### API Contract Definitions

**Shared Types** (in `shared/types/`):
```typescript
// Request/Response types shared between client and server
export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
}

export interface CreateUserResponse {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
}
```

### Error Handling

**Client-Side**:
- Display user-friendly error messages
- Log errors for debugging
- Handle network errors gracefully
- Show retry options when appropriate

**Server-Side**:
- Return consistent error format
- Log errors with context
- Never expose stack traces
- Use appropriate HTTP status codes

---

## 🎨 Frontend Patterns

### Component Architecture

- Build reusable components
- Use design system tokens
- Implement responsive design
- Follow accessibility guidelines

### State Management

**{{STATE_MANAGEMENT}} Patterns**:
{{STATE_MANAGEMENT_EXAMPLES}}

### API Integration

```typescript
// Client-side API service
export class ApiService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL;
  
  async createUser(data: CreateUserRequest): Promise<CreateUserResponse> {
    const response = await fetch(`${this.baseUrl}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.message);
    }
    
    return response.json();
  }
}
```

---

## 🗄️ Backend Patterns

### API Design

**RESTful Endpoints**:
```
GET    /api/v1/users          # List users
POST   /api/v1/users          # Create user
GET    /api/v1/users/:id      # Get user
PUT    /api/v1/users/:id      # Update user
DELETE /api/v1/users/:id      # Delete user
```

**Response Format**:
```typescript
// Success response
{
  "success": true,
  "data": { /* response data */ }
}

// Error response
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "User-friendly message"
  }
}
```

### Database Patterns

- Use migrations for schema changes
- Implement repository pattern for data access
- Use transactions for multi-step operations
- Optimize queries with indexes

---

## 🧪 Testing Strategy

### Frontend Tests

1. **Component Tests**: Test UI components in isolation
2. **Integration Tests**: Test feature flows
3. **E2E Tests**: Test complete user journeys
4. **Accessibility Tests**: Automated a11y testing

### Backend Tests

1. **Unit Tests**: Test business logic and utilities
2. **Integration Tests**: Test API endpoints
3. **Database Tests**: Test repository layer
4. **Contract Tests**: Verify API contracts

### Full-Stack Tests

- E2E tests that exercise full stack
- Test frontend-backend integration
- Test authentication flows
- Test error handling across stack

### Testing Standards

- **Coverage Target**: {{TEST_COVERAGE_TARGET}}%
- **Test Organization**: Co-located with code or in `tests/`
- **Shared Tests**: Test shared types and utilities
- **Mock External Services**: API calls, third-party services

---

## 📚 Documentation Standards

### API Documentation

- Document all endpoints with {{API_DOCS_TOOL}}
- Include request/response examples
- Document authentication requirements
- Provide usage examples

### Component Documentation

- Document reusable components
- Include prop types and descriptions
- Provide usage examples
- Document accessibility features

### Architecture Documentation

Documentation lives in `docs/`:
- **Architecture**: Full-stack architecture overview
- **Frontend**: Frontend patterns and conventions
- **Backend**: Backend patterns and conventions
- **API**: API documentation and contracts
- **Deployment**: Deployment procedures

---

## ⚡ Performance Best Practices

### Frontend Performance

- Code splitting and lazy loading
- Optimize bundle size
- Lazy load images
- Implement proper caching
- Monitor Core Web Vitals

### Backend Performance

- Database query optimization
- Response time < {{TARGET_RESPONSE_TIME}}ms
- Implement caching (Redis)
- Use connection pooling
- Monitor slow queries

### Full-Stack Optimization

- Minimize API requests
- Implement pagination
- Use server-side rendering (if applicable)
- Optimize data transfer (gzip, etc.)
- CDN for static assets

---

## 🔄 Workflow Guidelines

### Task Files and Task-Driven Development

- **Portfolio-level tasks**: `tasks.yml` - Application milestones
- **Feature tasks**: `tasks/*.yml` - Implementation tasks

### Full-Stack Task Workflow

1. **Select a Task**: Choose from `tasks/*.yml` with `status: todo`
2. **Check Agent Roles**: Verify `agent_roles` (frontend, backend, database, etc.)
3. **Design API Contract**: Define request/response types in `shared/types/`
4. **Backend First**:
   - Implement API endpoints
   - Add validation and error handling
   - Write integration tests
5. **Frontend Second**:
   - Implement API client
   - Build UI components
   - Integrate with backend
6. **End-to-End**:
   - Test full flow
   - Verify error handling
   - Test edge cases
7. **Document**: Update API docs and component docs
8. **Update Status**: Propose status change when complete

### Multi-Agent Development

**Agent Roles for Full-Stack Projects**:
- `frontend`: UI components, state management, client-side logic
- `backend`: API endpoints, business logic, database integration
- `database`: Schema design, migrations, query optimization
- `api`: API design, contracts, documentation
- `testing`: Unit tests, integration tests, E2E tests
- `performance`: Optimization across stack

See `AGENTS.md` for detailed agent responsibilities.

---

## 🎓 Full-Stack Development Best Practices

### Before Making Changes

1. Understand requirements for both frontend and backend
2. Design API contract first (define shared types)
3. Review existing patterns on both sides
4. Consider performance and security implications

### When Adding New Features

1. **Design API Contract**: Define request/response types in `shared/types/`
2. **Backend Implementation**:
   - Database schema and migrations
   - Business logic in services
   - API endpoints in controllers
   - Validation and error handling
   - Backend tests
3. **Frontend Implementation**:
   - API client service
   - UI components
   - State management
   - Component tests
4. **Integration**:
   - Test frontend-backend integration
   - E2E tests
   - Error handling across stack
5. **Documentation**: API docs, component docs
6. **Performance**: Optimize queries and rendering

### Code Review Checklist

- [ ] API contract defined in shared types
- [ ] Backend endpoint implemented and tested
- [ ] Frontend component implemented and tested
- [ ] Authentication/authorization implemented
- [ ] Input validation on both sides
- [ ] Error handling across stack
- [ ] Loading states implemented
- [ ] Responsive design (frontend)
- [ ] Database queries optimized (backend)
- [ ] No hardcoded secrets
- [ ] API documentation updated
- [ ] E2E test covers main flow

### Session Checklist

Before completing any task, verify:

- [ ] Task file updated with status and notes
- [ ] Relevant documentation updated
- [ ] Tests pass (frontend + backend + E2E)
- [ ] No hardcoded secrets or credentials
- [ ] Agent handoff notes added (if task has multiple `agent_roles`)
- [ ] Acceptance criteria reviewed and met
- [ ] API contract types updated in `shared/types/`
- [ ] API documentation updated

---

## 💡 Tips for AI Agents

### Understanding Context

- This is a **full-stack application** with **{{FRONTEND_FRAMEWORK}}** frontend and **{{BACKEND_FRAMEWORK}}** backend
- API contracts defined in `shared/types/`
- Follow conventions for both frontend and backend
- Security and performance matter on both sides

### Common Full-Stack Tasks

- **Adding features**: Design API → implement backend → implement frontend → integrate → test
- **API changes**: Update shared types → update backend → update frontend → test
- **Database changes**: Schema → migration → backend → frontend → test

### When Uncertain

- Check `shared/types/` for API contracts
- Review frontend patterns in `client/src/`
- Review backend patterns in `server/src/`
- Look at existing features for full-stack patterns

### Clarify Before Proceeding

**Ask for additional details when more information would materially improve your output.** Prefer asking over guessing when extra context would reduce ambiguity, wrong assumptions, or rework.

- **When to ask**: Ambiguity in scope/format, missing critical details, domain context that would change your approach, or high cost of being wrong
- **How to ask**: Be specific, state tradeoffs, offer defaults, bundle related questions
- **When not to ask**: Answer is discoverable, reasonable low-risk defaults exist, user said to proceed, or task is well-specified

---

## 🔗 Related Documentation

- **AGENTS.md**: Agent role definitions and collaboration patterns
- **docs/api/**: API documentation and contracts
- **docs/frontend/**: Frontend architecture and patterns
- **docs/backend/**: Backend architecture and patterns

---

**Last Updated**: {{LAST_UPDATED_DATE}}  
**Maintainer**: {{MAINTAINER}}  
**Purpose**: Guide AI agents in full-stack development with {{FRONTEND_FRAMEWORK}} + {{BACKEND_FRAMEWORK}}
