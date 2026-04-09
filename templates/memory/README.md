# Memory System Templates

**Status**: Optional  
**When to Use**: Multi-session projects, large teams, or projects where decisions and patterns need to persist across AI sessions.

## Overview

A tiered memory system helps AI agents maintain context across sessions and accumulate validated knowledge over time. Without it, each session starts fresh and may repeat mistakes or rediscover patterns.

### Three-Tier Model

| Tier | Purpose | Lifespan | Example |
|------|---------|----------|---------|
| **Working Memory** | Current session context | Single session | Current task, delegation log, open questions |
| **Episodic Memory** | Session logs and decision history | Per-session, archived | "In session 12, we decided to use Repository pattern for data access" |
| **Semantic Memory** | Validated patterns and rules | Permanent | "Always use Secret Manager for API keys" |

### When to Adopt

- **Skip it** if your project is small, single-developer, or short-lived. The task system and `CLAUDE.md` provide enough context.
- **Adopt working memory** if you find yourself re-explaining context at the start of each session.
- **Adopt all three tiers** if your project has multiple contributors, spans months, or has complex domain rules that agents need to internalize.

## Directory Structure

```
docs/memory/
├── README.md                        # This file (or a project-specific version)
├── working/                         # Working memory (current session)
│   └── current-session.md           # Active session context
├── episodic/                        # Session logs (archived)
│   ├── 2026-02-15-session.md
│   └── 2026-02-17-session.md
└── semantic/                        # Validated patterns (permanent)
    └── validated-patterns.md
```

## Setup

1. Create `docs/memory/` in your project.
2. Copy the examples from this directory as starting points.
3. Reference `docs/memory/` in your `CLAUDE.md` context rules so agents can read memory files.
4. At the start of each session, update or create a working memory file with the current task and context.
5. At the end of each session, archive the working memory as an episodic entry and extract any new validated patterns into semantic memory.

## Examples

- [working-memory-example.md](./working-memory-example.md) -- Sample working memory file for a single session.
- [semantic-memory-example.md](./semantic-memory-example.md) -- Sample validated patterns that persist across sessions.

## Backend Options

The three-tier model above is pattern-based and works with plain markdown files. For projects that need programmatic memory (retrieval at inference time, cross-session recall, temporal fact tracking), these open-source backends can serve as the storage and retrieval layer.

### mem0 (Recommended Starting Point)

**Repository**: [mem0ai/mem0](https://github.com/mem0ai/mem0) -- Apache-2.0

Universal memory layer abstraction designed for AI agents. Supports user-level, session-level, and agent-level memory scopes. Good fit for both episodic and semantic tiers.

| Tier | How mem0 Maps |
|------|--------------|
| Working | Not applicable (working memory is in-context, not persisted to mem0) |
| Episodic | Store session summaries and decision logs as mem0 memories scoped to session |
| Semantic | Store validated patterns and rules as mem0 facts scoped to agent or project |

### graphiti (Advanced -- Temporal Knowledge Graphs)

**Repository**: [getzep/graphiti](https://github.com/getzep/graphiti) -- Apache-2.0

Temporal knowledge graph memory that supports evolving facts over time. Use when the project needs to track how facts change (e.g., "user preference was X, then changed to Y on date Z").

Best for the semantic tier when time-awareness is a requirement.

### letta / MemGPT (Architecture Reference)

**Repository**: [letta-ai/letta](https://github.com/letta-ai/letta) -- Apache-2.0

Memory-first agent architecture where the agent actively manages its own memory (reads, writes, edits, searches). Use as an architectural reference for designing stateful agents. Not recommended as a direct dependency unless the project adopts the full letta framework.

### Context Budget Strategy

For the working memory tier, implement a context budget layer in the agent runtime rather than relying on framework defaults:

| Context Tier | Strategy | Token Budget |
|-------------|----------|-------------|
| Short-term | Sliding window of recent turns | 40-60% of context window |
| Mid-term | Rolling summary compression of older turns | 15-25% of context window |
| Long-term | Retrieval from external memory store (mem0/graphiti) | 10-20% of context window |
| System | System prompt, tools, instructions | Remainder |

See [context-strategy-example.md](./context-strategy-example.md) for a fill-in template.

See `docs/research/agent_ui_memory_landscape.md` Sections 5-6 for full evaluation of memory and context management options.

## Vector Store Options

When memory retrieval needs to go beyond plain file reads (e.g., querying by semantic similarity at inference time), a vector store provides the embedding storage and search layer. These options pair with the memory backends above.

### Qdrant (Recommended)

**Repository**: [qdrant/qdrant](https://github.com/qdrant/qdrant) -- Apache-2.0, 23.5k stars

Rust-based vector database with the fastest open-source query latency (4ms p50). Scales to billions of vectors. Python, TypeScript, Go, and Rust clients. Available as open-source, cloud, or on-premise.

| Memory Tier | How Qdrant Maps |
|-------------|----------------|
| Episodic | Store session embeddings. Query by similarity to surface relevant past sessions during context loading |
| Semantic | Store pattern/rule embeddings. Query by intent to retrieve relevant validated knowledge |
| Context Strategy | Vector recall feeds into the long-term context budget (10-20% of context window) |

Includes FastEmbed library for lightweight, fast embedding generation without external API calls.

### Chroma (Prototyping and Small-Scale)

**Repository**: [chroma-core/chroma](https://github.com/chroma-core/chroma) -- Apache-2.0

Developer-friendly vector store that embeds directly into applications. 12ms p50 latency. Good for prototyping and projects under ~1M vectors. Python and TypeScript clients.

Best for: early-stage projects, local development, single-node deployments.

### pgvector (PostgreSQL-Native)

**Repository**: [pgvector/pgvector](https://github.com/pgvector/pgvector) -- PostgreSQL License

Vector search as a PostgreSQL extension. SQL interface with joins to relational data. ACID transactions. 18ms p50 latency. Good for teams already on PostgreSQL who want vector search without deploying a separate service.

Best for: PostgreSQL-centric stacks, projects that need relational + vector queries in the same transaction.

### When to Adopt a Vector Store

- **Skip it** if memory is file-based only (plain markdown working/episodic/semantic memory). The three-tier model works without vectors.
- **Adopt Qdrant** if the project needs retrieval-augmented generation (RAG), semantic search over memory, or scales beyond what file-based retrieval supports.
- **Adopt Chroma** for rapid prototyping or if the project is small and single-node.
- **Adopt pgvector** if the project already uses PostgreSQL and wants to avoid a separate vector service.

See `docs/research/agent_runtime_tooling_landscape.md` Section 4 for full evaluation of vector store options.

---

## Governance

Consider adding a governance document (`docs/memory/GOVERNANCE.md`) that defines:

- Who can promote patterns from episodic to semantic memory
- How conflicts between patterns are resolved
- How often episodic logs are archived or pruned
- Which memory files agents should read at session start
