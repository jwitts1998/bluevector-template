# Web App Example — CollabDocs

A complete walkthrough of using the multi-agent system template for a **net-new web app idea**, from clone to development.

## The Idea

"I want to build a real-time collaborative document editor for teams — like a lightweight Google Docs."

## Step 1: Clone and Setup

```bash
git clone https://github.com/jwitts1998/multi-agent-system-template.git collabdocs
cd collabdocs
./setup.sh
```

**Setup answers**:

| Prompt | Value |
|--------|-------|
| Project name | CollabDocs |
| One-line description | Real-time collaborative document editor for teams |
| Project type | web-app |
| Primary language | TypeScript |
| Framework | React |
| State management | Redux Toolkit |
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

I want to build CollabDocs — a real-time collaborative document editor for small teams.

Core idea: Teams can create documents, edit them simultaneously with
real-time cursor tracking, comment on sections, and organize docs
into workspaces.

Target users: Small teams (5-20 people) who need lightweight docs without
enterprise bloat.
Success in 30 days: One user can create and edit a document with rich text,
and two users can see each other's changes in real-time.
Constraints: React + TypeScript, WebSocket for real-time, PostgreSQL for
persistence. Solo developer.
MVP first.
```

Output: `docs/product_design/collabdocs_pdb.md`

## Step 3: Create Tasks from the PDB

```
pdb-to-tasks subagent

Read docs/product_design/collabdocs_pdb.md and decompose it into epics and task files.
```

Result:

```
tasks/
├── 00_phase0_build_prep.yml           # Project scaffolding, design system, schema defs
├── 01_auth_and_workspaces.yml         # Auth, workspace CRUD, membership
├── 02_document_editor.yml             # Rich text editor, document CRUD
├── 03_realtime_collaboration.yml      # WebSocket sync, cursor presence, conflict resolution
├── 04_comments_and_threads.yml        # Inline comments, threads, notifications (Phase 2)
└── 05_search_and_organization.yml     # Full-text search, tags, favorites (Phase 2)
```

Example task:

```yaml
epic: E03_Realtime_Collaboration
feature: WebSocket_Sync

context:
  phase: 1
  spec_refs:
    - "PDB: docs/product_design/collabdocs_pdb.md — Section 3.2: Real-time Editing"
    - "PDB: docs/product_design/collabdocs_pdb.md — Section 4: Technical Architecture"

tasks:
  - id: E03_T1_define_sync_protocol
    title: "Define WebSocket sync protocol (schema-first)"
    type: chore
    status: todo
    priority: high
    agent_roles:
      - implementation
      - documentation
    description: >
      Define the WebSocket message protocol for document sync.
      Document message types, payload shapes, and conflict resolution strategy.
    acceptance_criteria:
      - "Protocol document created at docs/schemas/sync_protocol.md"
      - "Message types defined (edit, cursor, presence, ack)"
      - "Conflict resolution strategy documented (OT or CRDT)"

  - id: E03_T2_implement_websocket_server
    title: "Implement WebSocket server for document sync"
    type: story
    status: todo
    priority: high
    agent_roles:
      - implementation
      - security
    description: >
      Create WebSocket server that broadcasts document changes
      to connected clients with authentication and rate limiting.
    acceptance_criteria:
      - "WebSocket server accepts authenticated connections"
      - "Changes broadcast to all connected clients"
      - "Rate limiting prevents abuse"
      - "Graceful reconnection handling"
    blocked_by:
      - E03_T1_define_sync_protocol
```

## Step 4: Begin Development

Work through tasks using the multi-agent workflow:

```
1. Implementation Agent → implements the feature
2. code-reviewer → reviews code quality
3. react-specialist → provides React/TypeScript patterns
4. performance-optimizer → checks bundle size and rendering
5. test-writer → creates component and E2E tests
```

## Resulting Workflow

```
Clone repo
    ↓
./setup.sh (web-app, React, TypeScript)
    ↓
idea-to-pdb subagent → docs/product_design/collabdocs_pdb.md
    ↓
pdb-to-tasks subagent → tasks/00-05_*.yml
    ↓
Pick first task → implement → review → test → done
```

## Success Metrics

- Bundle size < 250KB initial
- Lighthouse score > 90
- Test coverage > 85%
- Core Web Vitals meet targets
- Real-time sync latency < 100ms
