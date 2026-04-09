# Agent Runtime, Evaluation, and Tooling Research

## Open-Source Components for Orchestration, Evaluation, Structured Output, Vector Stores, Safety, and Interoperability

---

# 0. Objectives

This document identifies open-source repositories that can serve as base-layer components for:

1. Agent orchestration and runtime
2. Evaluation and testing of LLM outputs and agent trajectories
3. Structured output extraction and validation
4. Vector stores for embedding retrieval
5. Agent safety and guardrails
6. Interoperability protocols for tool access and agent communication
7. RAG frameworks for document-grounded generation

Each section includes:

* Repository
* License
* Stack
* Modularity assessment
* Why It Matters
* Integration Strategy
* Recommendation

---

# 1. Agent Orchestration and Runtime

## 1.1 langchain-ai/langgraph

Repository:
[https://github.com/langchain-ai/langgraph](https://github.com/langchain-ai/langgraph)

License:
MIT

Stars:
24.9k

Stack:
Python

Modularity:
High

Why It Matters:

* Graph-based state machines for complex multi-agent workflows
* Nodes represent agent steps, edges represent transitions with conditional branching
* Checkpointing, human-in-the-loop, parallel execution
* Used by LinkedIn, Uber, Klarna
* Maps directly to sequential/parallel/review workflow patterns

Integration Strategy:

* Primary Python orchestration framework
* Graph structure maps to multi-agent workflow patterns (sequential, parallel, review-based)
* Checkpoint system enables durable execution
* Use for complex workflows requiring conditional branching and state persistence

Recommendation:
Primary orchestration framework for Python projects.

---

## 1.2 crewAIInc/crewAI

Repository:
[https://github.com/crewAIInc/crewAI](https://github.com/crewAIInc/crewAI)

License:
MIT

Stars:
44.5k

Stack:
Python (standalone, no LangChain dependency)

Modularity:
High

Why It Matters:

* Role-based team metaphor
* Agents have personas, goals, backstories
* Hierarchical task delegation through manager LLM
* Lower learning curve, good for rapid prototyping
* Maps to Implementation/QA/Testing/Docs agent roles

Integration Strategy:

* Alternative Python orchestration for simpler projects
* Role-based model maps naturally to agent roles defined in AGENTS.md
* Good for rapid prototyping before graduating to LangGraph

Recommendation:
Simpler Python alternative to LangGraph.

---

## 1.3 vercel/ai (AI SDK)

Repository:
[https://github.com/vercel/ai](https://github.com/vercel/ai)

License:
Apache-2.0

Stars:
22k

Stack:
TypeScript (React, Next.js, Vue, Svelte, Node.js)

Modularity:
Very high

Why It Matters:

* Multi-provider toolkit (20+ providers including OpenAI, Anthropic, Google)
* Streaming, tool calling with schema validation, structured output
* Framework-agnostic hooks (useChat, useCompletion)
* AI SDK Core for server-side + AI SDK UI for frontend

Integration Strategy:

* Primary TypeScript agent runtime
* useChat/useCompletion hooks for frontend
* Server-side streaming with edge runtime
* Pairs with assistant-ui for chat UI and xyflow for visualization

Recommendation:
Primary orchestration toolkit for TypeScript projects.

---

## 1.4 openai/openai-agents-python

Repository:
[https://github.com/openai/openai-agents-python](https://github.com/openai/openai-agents-python)

License:
MIT

Stars:
19k

Stack:
Python

Modularity:
Medium

Why It Matters:

* Lightweight multi-agent workflows
* Built-in handoffs (agents delegate to each other as tool calls)
* Guardrails for input/output validation
* Tracing and MCP server integration
* Pydantic validation
* Supports 100+ LLMs

Integration Strategy:

* Alternative for teams wanting minimal orchestration overhead
* Handoff pattern is a good reference for the template's agent delegation model

Recommendation:
Lightweight orchestration alternative.

---

## 1.5 huggingface/smolagents

Repository:
[https://github.com/huggingface/smolagents](https://github.com/huggingface/smolagents)

License:
Apache-2.0

Stars:
25.5k

Stack:
Python

Modularity:
High

Why It Matters:

* Minimal code-first agents (~1000 lines core)
* CodeAgent writes Python actions instead of JSON
* Model-agnostic (local models, OpenAI, Anthropic, 100+ via LiteLLM)
* Sandboxed execution (Docker, E2B, Pyodide)
* MCP server and LangChain tool support

Integration Strategy:
Use as architectural reference for minimal agent design.
CodeAgent pattern useful for tool-heavy workflows.

Recommendation:
Reference for minimal agent architecture.

---

## 1.6 pydantic/pydantic-ai

Repository:
[https://github.com/pydantic/pydantic-ai](https://github.com/pydantic/pydantic-ai)

License:
MIT

Stars:
15k

Stack:
Python

Modularity:
High

Why It Matters:

* Full type-safety through Pydantic validation
* Supports 40+ model providers
* MCP support, A2A communication, durable execution
* Streaming and human-in-the-loop
* Includes Pydantic Evals for evaluation
* Trusted by OpenAI, Anthropic, Google

Integration Strategy:
Use as reference for type-safe agent design.
Pydantic Evals useful for evaluation layer.

Recommendation:
Reference for type-safe Python agent design.

---

# 2. Evaluation and Testing

## 2.1 confident-ai/deepeval

Repository:
[https://github.com/confident-ai/deepeval](https://github.com/confident-ai/deepeval)

License:
Apache-2.0

Stars:
13.8k

Stack:
Python

Modularity:
High

Why It Matters:

* Comprehensive LLM evaluation with 14+ metrics
* Metrics include faithfulness, answer relevancy, hallucination, bias, toxicity, contextual recall/precision
* CI/CD integration
* pytest-like interface
* Synthetic dataset generation

Integration Strategy:

* Primary evaluation framework
* Wire into CI pipeline for prompt regression testing
* Use with Langfuse for eval data storage

Recommendation:
Primary LLM/agent evaluation framework.

---

## 2.2 stanfordnlp/dspy

Repository:
[https://github.com/stanfordnlp/dspy](https://github.com/stanfordnlp/dspy)

License:
MIT

Stars:
32.3k

Stack:
Python

Modularity:
High

Why It Matters:

* Programmatic prompt optimization from Stanford
* Replaces manual prompt engineering with learnable programs
* Signatures define input/output contracts
* Optimizers automatically refine prompts from examples and metrics
* Supports classifiers to RAG pipelines to agent loops

Integration Strategy:

* Use for prompt optimization layer
* Define agent prompts as DSPy modules
* Optimize against evaluation metrics from DeepEval
* Compile optimized prompts back into template system prompts

Recommendation:
Primary prompt programming and optimization framework.

---

## 2.3 langchain-ai/agentevals

Repository:
[https://github.com/langchain-ai/agentevals](https://github.com/langchain-ai/agentevals)

License:
MIT

Stars:
483

Stack:
Python + TypeScript

Modularity:
High

Why It Matters:

* Specialized for evaluating agent trajectories (multi-step workflows)
* Readymade evaluators for agent performance
* Trajectory comparison and scoring

Integration Strategy:
Use alongside DeepEval for multi-step agent workflow evaluation.

Recommendation:
Use alongside DeepEval for multi-step agent workflow evaluation.

---

## 2.4 groq/openbench

Repository:
[https://github.com/groq/openbench](https://github.com/groq/openbench)

License:
MIT

Stars:
731

Why It Matters:

* Provider-agnostic evaluation infrastructure
* 95+ benchmarks (MMLU, GPQA, HumanEval, etc.)
* Supports 30+ model providers
* Built on inspect-ai framework

Recommendation:
Reference for standardized model benchmarking.

---

## 2.5 huggingface/lighteval

Repository:
[https://github.com/huggingface/lighteval](https://github.com/huggingface/lighteval)

License:
MIT

Stars:
1.5k

Why It Matters:

* Hugging Face's all-in-one LLM evaluation toolkit
* Multiple backend support

Recommendation:
Reference for model evaluation.

---

# 3. Structured Output

## 3.1 instructor-ai/instructor

Repository:
[https://github.com/instructor-ai/instructor](https://github.com/instructor-ai/instructor)

License:
MIT

Stars:
12.2k

Stack:
Python, TypeScript, Go, Ruby, Elixir, Rust

Modularity:
Very high

Why It Matters:

* Type-safe data extraction from LLMs via Pydantic
* Automatic validation, retries, streaming
* 3M+ monthly downloads
* Supports 15+ LLM providers
* Schema-first extraction without extra agent framework overhead

Integration Strategy:

* Cross-cutting tool for both orchestration and evaluation
* Use in orchestration specialist for tool call validation
* Use in evaluation specialist for structured eval output

Recommendation:
Primary structured output library.

---

## 3.2 dottxt-ai/outlines

Repository:
[https://github.com/dottxt-ai/outlines](https://github.com/dottxt-ai/outlines)

License:
Apache-2.0

Stack:
Python

Why It Matters:

* Generation-time constrained output
* Guarantees valid JSON/regex during generation (not parsing afterward)
* Microsecond overhead vs seconds of retries
* Used by vLLM, TGI, LoRAX, SGLang

Recommendation:
Alternative for self-hosted model deployments where generation-time constraints are needed.

---

# 4. Vector Stores

## 4.1 qdrant/qdrant

Repository:
[https://github.com/qdrant/qdrant](https://github.com/qdrant/qdrant)

License:
Apache-2.0

Stars:
23.5k

Stack:
Rust (Python/TypeScript/Go clients)

Modularity:
High

Why It Matters:

* Fastest open-source vector DB (4ms p50 query latency)
* Scales to billions of vectors
* 8,000-20,000 throughput
* Includes FastEmbed library for lightweight embeddings
* Open-source, cloud, and on-premise options

Integration Strategy:

* Recommended primary vector store for memory retrieval tier
* Use for episodic retrieval (session similarity) and semantic retrieval (pattern/rule relevance)

Recommendation:
Primary vector store.

---

## 4.2 chroma-core/chroma

Repository:
[https://github.com/chroma-core/chroma](https://github.com/chroma-core/chroma)

License:
Apache-2.0

Stack:
Python (TypeScript client)

Why It Matters:

* Developer-friendly
* Embeds directly into applications
* 12ms p50 latency
* Good for prototyping and small-scale production
* Limit ~1M vectors on single node

Recommendation:
Prototyping and small-scale alternative.

---

## 4.3 pgvector/pgvector

Repository:
[https://github.com/pgvector/pgvector](https://github.com/pgvector/pgvector)

License:
PostgreSQL License (BSD-like)

Stack:
PostgreSQL extension

Why It Matters:

* Vector search inside PostgreSQL
* SQL interface with joins to relational data
* ACID transactions
* 18ms p50 latency
* Good for teams already on Postgres who want vector search without a separate service

Recommendation:
Alternative for PostgreSQL-centric stacks.

---

## 4.4 milvus-io/milvus

Repository:
[https://github.com/milvus-io/milvus](https://github.com/milvus-io/milvus)

License:
Apache-2.0

Stars:
30k+

Why It Matters:

* Enterprise-grade
* 8 indexing algorithms including GPU support
* 6ms p50 latency
* Billions+ vectors

Recommendation:
Reference for enterprise-scale deployments.

---

# 5. Agent Safety and Guardrails

## 5.1 NVIDIA/NeMo-Guardrails

Repository:
[https://github.com/NVIDIA/NeMo-Guardrails](https://github.com/NVIDIA/NeMo-Guardrails)

License:
Apache-2.0

Stars:
4.7k

Stack:
Python

Modularity:
High

Why It Matters:

* Programmable guardrails for LLM-based systems
* Input/output rails, topical containment, jailbreak detection, fact-checking
* Colang language for defining conversation flows and safety policies

Integration Strategy:

* Add to security auditor template as AI-specific security layer
* Define input rails (prompt injection detection)
* Define output rails (content filtering)
* Define topical rails (off-topic prevention)

Recommendation:
Primary AI guardrails framework.

---

## 5.2 meta-llama/PurpleLlama (LlamaFirewall)

Repository:
[https://github.com/meta-llama/PurpleLlama](https://github.com/meta-llama/PurpleLlama)

License:
Apache-2.0

Stack:
Python

Why It Matters:

* Agent-specific security
* PromptGuard 2 (universal jailbreak detector)
* Agent Alignment Checks (chain-of-thought auditor for prompt injection)
* CodeShield (static analysis for insecure code generation)
* In production at Meta
* Customizable scanners

Recommendation:
Reference and secondary guardrails option.

---

## 5.3 openguardrails/openguardrails

Repository:
[https://github.com/openguardrails/openguardrails](https://github.com/openguardrails/openguardrails)

License:
Apache-2.0

Stars:
231

Stack:
TypeScript

Why It Matters:

* 10 built-in security scanners
* MCP tool poisoning detection

Recommendation:
Reference for MCP-specific security concerns.

---

## 5.4 mozilla-ai/any-guardrail

Repository:
[https://github.com/mozilla-ai/any-guardrail](https://github.com/mozilla-ai/any-guardrail)

License:
Apache-2.0

Stars:
65

Why It Matters:

* Unified interface to switch between guardrail providers (Llama Guard, ShieldGemma, etc.)

Recommendation:
Reference for provider-agnostic guardrails.

---

# 6. Interoperability Protocols

## 6.1 google/A2A (Agent2Agent Protocol)

Repository:
[https://github.com/google/A2A](https://github.com/google/A2A)

License:
Apache-2.0

Stars:
21.9k

Stack:
Python, TypeScript, Java SDKs

Modularity:
High

Why It Matters:

* Open standard for cross-framework agent communication
* JSON-RPC 2.0 over HTTP(S)
* Agent Cards for capability discovery
* Streaming via SSE
* Donated to Linux Foundation
* Complements MCP (tools) with agent-to-agent task delegation
* Works with LangGraph, CrewAI, Google ADK

Integration Strategy:

* Add to workflow templates as the standard for agent-to-agent communication
* Use when agents built with different frameworks need to collaborate

Recommendation:
Primary agent-to-agent interoperability protocol.

---

## 6.2 modelcontextprotocol (MCP)

Repository:
[https://github.com/modelcontextprotocol](https://github.com/modelcontextprotocol)

License:
MIT

Stack:
Python SDK (21.8k stars), TypeScript SDK (11.7k stars)

Why It Matters:

* Standard for tool discovery and calling
* Already used by Cursor, Claude, and many other AI tools
* MCP Inspector for testing/debugging
* Already integrated into this template system via Claude Code skills

Integration Strategy:

* Document how projects should expose their own tools via MCP servers
* Reference existing Claude Code skill integration

Recommendation:
Standard for tool access (already in use).

---

# 7. RAG Frameworks

## 7.1 infiniflow/ragflow

Repository:
[https://github.com/infiniflow/ragflow](https://github.com/infiniflow/ragflow)

License:
Apache-2.0

Stars:
52k

Why It Matters:

* Most mature open-source RAG engine
* Deep document understanding
* Agent capabilities
* Production-ready

Recommendation:
Reference for production RAG deployments.

---

# 8. Recommended Runtime Stack Architecture

## Python Projects

* Orchestration: LangGraph (complex) or CrewAI (simple)
* Evaluation: DeepEval + DSPy
* Structured Output: Instructor
* Guardrails: NeMo Guardrails
* Vector Store: Qdrant
* Observability: Langfuse (from v2.1.0 report)
* Memory: mem0 + graphiti (from v2.1.0 report)

## TypeScript Projects

* Runtime: Vercel AI SDK
* Chat UI: assistant-ui + tool-ui (from v2.1.0 report)
* Visualization: xyflow (from v2.1.0 report)
* Structured Output: Instructor (TypeScript)
* Vector Store: Qdrant (TypeScript client)

## Cross-cutting

* Tool Access: MCP
* Agent Communication: A2A Protocol
* Interoperability: Both MCP and A2A

---

# 9. Integration Philosophy

Avoid importing entire platforms unless:

* They are MIT/Apache-2.0
* They are modular
* They do not impose UI branding constraints
* They are actively maintained

Prefer:

* Orchestration libraries with clear graph/pipeline abstractions
* Evaluation frameworks with CI/CD integration
* Structured output tools that work across providers
* Vector stores with language-native clients
* Guardrails that compose with existing pipelines

Avoid:

* Monolithic platforms with licensing nuance
* Frameworks that tightly couple orchestration, UI, and infrastructure
* Tools that require vendor lock-in or proprietary model access
