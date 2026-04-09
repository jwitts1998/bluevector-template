# Full-Stack Example — TaskManager

A complete walkthrough of using the multi-agent system template for a **net-new full-stack idea**, from clone to development.

## The Idea

"I want to build a task management app with a web frontend and API backend — boards, lists, cards, assignees, deadlines."

## Step 1: Clone and Setup

```bash
git clone https://github.com/jwitts1998/multi-agent-system-template.git taskmanager
cd taskmanager
./setup.sh
```

**Setup answers**:

| Prompt | Value |
|--------|-------|
| Project name | TaskManager |
| One-line description | Task management app with boards, lists, and cards |
| Project type | full-stack |
| Primary language | TypeScript |
| Framework | Next.js |
| State management | React Context |
| Database | PostgreSQL |
| Architecture | Feature-First |
| Test framework | Vitest |
| Test coverage target | 85 |
| Remove template files? | y |

Verify setup:

```bash
./validate.sh
```

## Step 2: Flush the Idea

```
idea-to-pdb subagent

I want to build TaskManager — a task management app like a simplified Trello.

Core idea: Users create boards, add lists to boards, and add cards to lists.
Cards have titles, descriptions, assignees, due dates, labels, and comments.
Drag-and-drop to reorder cards and move between lists.

Target users: Small teams (2-10 people) who want simple project tracking.
Success in 30 days: One user can create a board, add lists and cards,
and drag-and-drop cards between lists.
Constraints: Next.js (App Router), PostgreSQL with Prisma, solo developer.
MVP first.
```

Output: `docs/product_design/taskmanager_pdb.md`

## Step 3: Create Tasks from the PDB

```
pdb-to-tasks subagent

Read docs/product_design/taskmanager_pdb.md and decompose it into epics and task files.
```

Result:

```
tasks/
├── 00_phase0_build_prep.yml           # Next.js scaffold, DB setup, design system, schema defs
├── 01_auth_and_users.yml              # Auth, user profiles, team membership
├── 02_boards_and_lists.yml            # Board CRUD, list CRUD, board sharing
├── 03_cards.yml                       # Card CRUD, assignees, due dates, labels
├── 04_drag_and_drop.yml               # Drag-and-drop reordering, cross-list moves
├── 05_comments_and_activity.yml       # Card comments, activity log (Phase 2)
└── 06_notifications.yml               # Email and in-app notifications (Phase 2)
```

Example task:

```yaml
epic: E02_Boards_And_Lists
feature: Board_CRUD

context:
  phase: 1
  spec_refs:
    - "PDB: docs/product_design/taskmanager_pdb.md — Section 3.2: Boards"
    - "PDB: docs/product_design/taskmanager_pdb.md — Section 6: Data Architecture"

tasks:
  - id: E02_T1_define_board_schema
    title: "Define board and list data schema (schema-first)"
    type: chore
    status: todo
    priority: high
    agent_roles:
      - implementation
      - documentation
    description: >
      Define Prisma schema for Board, List, and their relationships.
      Define API routes for board and list CRUD.
      Create shared TypeScript types in shared/types/.
    acceptance_criteria:
      - "Prisma schema with Board and List models"
      - "API routes documented (GET/POST/PUT/DELETE)"
      - "Shared types defined for frontend and backend"

  - id: E02_T2_implement_board_api
    title: "Implement board API routes"
    type: story
    status: todo
    priority: high
    agent_roles:
      - implementation
    description: >
      Create Next.js API routes for board CRUD operations.
      Use Server Actions or Route Handlers.
    acceptance_criteria:
      - "Create, read, update, delete boards"
      - "Authorization: only board members can access"
      - "Input validation on all routes"
    blocked_by:
      - E02_T1_define_board_schema

  - id: E02_T3_implement_board_ui
    title: "Implement board list page and board detail view"
    type: story
    status: todo
    priority: high
    agent_roles:
      - implementation
      - ui_ux
    description: >
      Create board listing page (all user's boards) and board detail view
      (shows lists in columns). Use Server Components where possible.
    acceptance_criteria:
      - "User sees all their boards on /boards"
      - "Clicking a board shows lists in columns"
      - "Create new board dialog"
      - "Responsive layout (mobile and desktop)"
    blocked_by:
      - E02_T2_implement_board_api
```

## Step 4: Begin Development

Work through tasks using the multi-agent workflow:

```
1. Implementation Agent → implements the feature (frontend + backend)
2. code-reviewer → reviews code quality and architecture
3. designer → reviews UI for consistency
4. test-writer → creates component and E2E tests
5. security-auditor → audits auth and data access
```

## Resulting Workflow

```
Clone repo
    ↓
./setup.sh (full-stack, Next.js, TypeScript)
    ↓
idea-to-pdb subagent → docs/product_design/taskmanager_pdb.md
    ↓
pdb-to-tasks subagent → tasks/00-06_*.yml
    ↓
Pick first task → implement → review → test → done
```

## Success Metrics

- Type safety across full stack (shared types)
- API contracts enforced
- E2E tests cover critical flows
- Frontend + backend test coverage > 85%
- Drag-and-drop works on mobile and desktop
- Server Components used where possible for performance
