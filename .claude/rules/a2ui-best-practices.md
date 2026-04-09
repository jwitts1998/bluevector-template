---
description: Guides agents on when and how to use A2UI for agent-generated UIs vs other approaches.
---

# A2UI Best Practices

## When to Use A2UI vs Alternatives

| Need | Use | Why |
|------|-----|-----|
| Chat conversation thread | Vercel AI SDK (`useChat`) + assistant-ui / flutter_chat_ui | Text-oriented, conversational |
| Tool result display in chat | tool-ui / custom message types | Inline structured results |
| Agent-controlled rich UI panels | **A2UI** | Server-driven component trees |
| Simple text completion | Vercel AI SDK (`useCompletion`) | No UI structure needed |
| Agent workflow visualization | xyflow / React Flow | Graph/DAG visualization |

**Decision rule**: Use A2UI when the agent needs to control WHAT UI renders (dynamic forms, adaptive dashboards, multi-panel layouts). Use Vercel AI SDK when the agent produces text/chat that needs streaming display.

## Component Tree Principles

1. **Flat adjacency list** — never nest component definitions; use `children` arrays of IDs
2. **Unique IDs** — every component has a server-generated unique ID
3. **Parent references via ID** — tree structure built implicitly, not explicitly nested
4. **Catalog-only types** — only use component types registered in the Widget Registry
5. **Shallow depth** — keep trees 4-5 levels deep maximum

## Data Model Principles

1. **Separate data from structure** — never inline dynamic values in the component tree
2. **Path-based references** — components bind to data model paths (e.g., `$.user.name`)
3. **Deep merge by default** — `dataModelUpdate` merges into existing data model
4. **Per-surface isolation** — each surface has its own data model, no cross-surface key collisions
5. **Validate shape** — data model should match expected schema

## Security Requirements (Non-Negotiable)

1. **Catalog validation**: validate every component type against the Widget Registry before rendering. Reject and log unknown types.
2. **XSS sanitization**: sanitize all text content from agent responses (DOMPurify for React, framework escaping for Flutter).
3. **No inline PII**: never include raw PII in component trees. Use data model path references. Component trees may be logged or cached.
4. **userAction validation**: validate all `userAction` payloads against expected schemas on the server. Never trust client-constructed action payloads.
5. **Security event logging**: log all Widget Registry misses, sanitization triggers, and validation failures as security events.

## Streaming Pattern

1. Use SSE (Server-Sent Events) as the primary transport
2. Parse JSONL lines incrementally as they arrive
3. Buffer `surfaceUpdate` and `dataModelUpdate` until `beginRendering` signal
4. Show loading skeleton while waiting for `beginRendering`
5. After initial render, apply updates incrementally (no full re-render)
6. Handle `surfaceDeletion` for cleanup
