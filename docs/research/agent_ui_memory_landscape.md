# Multi-Agent UI + Memory Stack Research

## Base-Layer Components for Mobile (Flutter), Web Ops, Memory, and Context

---

# 0. Objectives

This document identifies open-source repositories that can serve as base-layer components for:

1. Flutter mobile conversational UI
2. Web-based agent dashboards and monitoring consoles
3. Agent workflow visualization
4. Multi-agent observability
5. Session and context window management
6. Long-term and episodic AI memory systems
7. Memory integration inside multi-agent frameworks

Each section includes:

* Repository
* License
* Stack
* Modularity assessment
* Integration guidance
* Maintenance considerations
* Recommendation status

---

# 1. Flutter Mobile Conversational UI (Primary Priority)

## 1.1 flyerhq/flutter_chat_ui

Repository:
[https://github.com/flyerhq/flutter_chat_ui](https://github.com/flyerhq/flutter_chat_ui)

License:
Apache-2.0

Stack:
Flutter / Dart

Category:
UI component library (not full app)

Modularity:
High

Why It Matters:

* Clean message models
* Custom message types
* Theming support
* Production-grade chat rendering
* Designed to be embedded into existing architecture

Integration Strategy:

* Create internal domain model (e.g., AgentMessage)
* Map to Flyer message types
* Implement streaming updates via message mutation
* Use custom message type for:

  * Tool results
  * Structured cards
  * Approval prompts
  * Action confirmations

Best Use:
Core mobile assistant thread UI.

Recommendation:
Primary mobile chat UI layer.

---

## 1.2 extrawest/local-llm-flutter-chat

Repository:
[https://github.com/extrawest/local-llm-flutter-chat](https://github.com/extrawest/local-llm-flutter-chat)

License:
BSD-3-Clause

Stack:
Flutter + local LLM providers

Modularity:
Medium (more app template than library)

Why It Matters:

* Provider abstraction examples
* Streaming UX patterns
* Settings + model switching UX

Integration Strategy:
Use as architectural reference only.
Do not import as dependency.

Recommendation:
Reference template.

---

## 1.3 PocketLLM/PocketLLM

Repository:
[https://github.com/PocketLLM/PocketLLM](https://github.com/PocketLLM/PocketLLM)

License:
Verify in repo before reuse.

Stack:
Flutter

Why It Matters:
Modern AI chat UX reference.
Good conversation management patterns.

Recommendation:
UX reference only.

---

## 1.4 c0sogi/LLMChat

Repository:
[https://github.com/c0sogi/LLMChat](https://github.com/c0sogi/LLMChat)

License:
MIT

Stack:
Python backend + Flutter frontend

Why It Matters:

* Clean backend/frontend separation
* Streaming via API
* Good full-stack reference

Recommendation:
Architecture reference.

---

# 2. Web Agent Console (Chat + Tool Rendering)

## 2.1 assistant-ui/assistant-ui

Repository:
[https://github.com/assistant-ui/assistant-ui](https://github.com/assistant-ui/assistant-ui)

License:
MIT

Stack:
React + TypeScript

Modularity:
High

Why It Matters:

* ChatGPT-style UI primitives
* Message streaming
* Tool output rendering
* Designed for production embedding

Integration Strategy:
Use as base layer for:

* Web agent console
* Multi-user admin panel
* Tool approval workflows

Recommendation:
Primary web chat UI library.

---

## 2.2 assistant-ui/tool-ui

Repository:
[https://github.com/assistant-ui/tool-ui](https://github.com/assistant-ui/tool-ui)

License:
MIT

Purpose:
Structured tool result components.

Best Use:
Render:

* Tables
* Receipts
* Approval forms
* Action confirmations

Recommendation:
Pair with assistant-ui.

---

## 2.3 vercel/ai-chatbot

Repository:
[https://github.com/vercel/ai-chatbot](https://github.com/vercel/ai-chatbot)

License:
MIT

Stack:
Next.js + Vercel AI SDK

Why It Matters:
Complete chatbot template.
Good baseline for rapid web deployment.

Recommendation:
Template reference.

---

## 2.4 open-webui/open-webui

Repository:
[https://github.com/open-webui/open-webui](https://github.com/open-webui/open-webui)

License:
Mixed + branding requirement.

Recommendation:
Reference only.
Avoid as embedded dependency due to license nuance.

---

# 3. Agent Workflow Visualization

Two strategic paths exist:

A. Embed workflow engine into your console
B. Use full workflow builder product

---

## 3.1 xyflow/xyflow (React Flow)

Repository:
[https://github.com/xyflow/xyflow](https://github.com/xyflow/xyflow)

License:
MIT

Stack:
React

Modularity:
Very high

Why It Matters:
Foundation for:

* Agent graph view
* Tool call visualization
* Execution DAG view
* Multi-agent topology maps

Integration Strategy:

* Agents as nodes
* Tool calls as edges
* Expandable side panel inspector

Recommendation:
Primary workflow visualization engine.

---

## 3.2 projectstorm/react-diagrams

Repository:
[https://github.com/projectstorm/react-diagrams](https://github.com/projectstorm/react-diagrams)

License:
MIT

Why It Matters:
More generalized diagram engine.

Recommendation:
Alternative to React Flow.

---

## 3.3 langflow-ai/langflow

Repository:
[https://github.com/langflow-ai/langflow](https://github.com/langflow-ai/langflow)

License:
MIT

Why It Matters:
Full workflow builder product.
Active releases.

Recommendation:
Reference UX patterns.
Avoid embedding entire product unless needed.

---

## 3.4 FlowiseAI/Flowise

Repository:
[https://github.com/FlowiseAI/Flowise](https://github.com/FlowiseAI/Flowise)

License:
Apache-2.0

Recommendation:
Reference for workflow builder UX.

---

# 4. Multi-Agent Observability / Ops

## 4.1 langfuse/langfuse

Repository:
[https://github.com/langfuse/langfuse](https://github.com/langfuse/langfuse)

Why It Matters:

* LLM traces
* Prompt management
* Evaluation runs
* Team collaboration

Best Use:
Primary observability backend + UI.

Recommendation:
Top choice for agent monitoring.

---

## 4.2 Arize-ai/phoenix

Repository:
[https://github.com/Arize-ai/phoenix](https://github.com/Arize-ai/phoenix)

License:
Elastic License 2.0

Why It Matters:
Strong evaluation tooling.

Note:
ELv2 may restrict SaaS resale.

Recommendation:
Internal use only unless license reviewed.

---

## 4.3 openlit/openlit

Repository:
[https://github.com/openlit/openlit](https://github.com/openlit/openlit)

License:
Apache-2.0

Why It Matters:
OpenTelemetry-native LLM observability.

Recommendation:
Strong alternative to Langfuse.

---

# 5. Context Window + Session Management

This is pattern-based rather than UI-based.

Design Strategy:

Short-Term Context:

* Sliding window of recent turns

Mid-Term Context:

* Rolling summary compression

Long-Term Context:

* External memory store retrieval

Technical Anchors:

* LangChain token buffer memory
* llama.cpp context shifting
* vLLM paged attention KV cache

Recommendation:
Implement context budget layer in agent runtime.
Do not rely purely on framework defaults.

---

# 6. Long-Term / Episodic Memory Systems

## 6.1 mem0ai/mem0

Repository:
[https://github.com/mem0ai/mem0](https://github.com/mem0ai/mem0)

License:
Apache-2.0

Why It Matters:
Universal memory layer abstraction.
Agent-focused.

Recommendation:
Strong base memory layer.

---

## 6.2 letta-ai/letta (MemGPT)

Repository:
[https://github.com/letta-ai/letta](https://github.com/letta-ai/letta)

License:
Apache-2.0

Why It Matters:
Memory-first agent architecture.

Recommendation:
Reference architecture for stateful agents.

---

## 6.3 getzep/graphiti

Repository:
[https://github.com/getzep/graphiti](https://github.com/getzep/graphiti)

License:
Apache-2.0

Why It Matters:
Temporal knowledge graph memory.
Supports evolving facts over time.

Recommendation:
Advanced memory option if time-awareness required.

---

# 7. Multi-Agent Frameworks With Memory Integration

## 7.1 microsoft/autogen

Repository:
[https://github.com/microsoft/autogen](https://github.com/microsoft/autogen)

Why It Matters:
Multi-agent orchestration framework.

Recommendation:
Use as reference or orchestration layer.

---

## 7.2 victordibia/autogen-ui

Repository:
[https://github.com/victordibia/autogen-ui](https://github.com/victordibia/autogen-ui)

Why It Matters:
Reference UI for multi-agent chat systems.

Recommendation:
UI pattern reference only.

---

# 8. Recommended Base Stack Architecture

## Mobile

* Flutter UI: flutter_chat_ui
* Custom domain message model
* Streaming agent runtime
* Memory retrieval injected before inference

## Web Console

* assistant-ui + tool-ui
* React Flow (xyflow) for graph view
* Langfuse or OpenLIT for observability

## Memory Layer

* mem0 (initial)
* Graphiti (advanced temporal memory)

## Context Strategy

* Hard token budget
* Sliding window
* Conversation summarizer
* Memory recall by intent

---

# 9. Integration Philosophy

Avoid importing entire platforms unless:

* They are MIT/Apache-2.0
* They are modular
* They do not impose UI branding constraints
* They are actively maintained

Prefer:

* UI component libraries
* Infrastructure layers
* Observability engines
* Reference architectures

Avoid:

* Monolithic UI platforms with licensing nuance
* Archived diagram libraries
* Frameworks that tightly couple orchestration and UI
