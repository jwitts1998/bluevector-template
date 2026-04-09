# Research Context Templates

**Status**: Optional
**When to Use**: When you need to document a production system for deep research using tools like Gemini Deep Research, ChatGPT Deep Research, or similar.

## Overview

The Research Context template provides a structured format for describing an existing system so that a deep-research tool has enough grounding context to produce actionable recommendations. It is product-agnostic and works for any system you want to research improvements for.

### What It Covers

| Section | Purpose |
|---------|---------|
| **What the product does** | Product description and core problem framing |
| **Architecture (pipeline)** | End-to-end data flow with functions, APIs, and data stores |
| **Component deep-dives** | File paths, runtime budgets, costs, and step-by-step logic |
| **Core algorithm / logic** | Scoring formulas, ranking algorithms, classification rules |
| **Data schema** | Database tables and fields the system reads/writes |
| **How this system connects to others** | Downstream consumers and their dependencies |
| **Frontend / UI integration** | How the system surfaces to users |
| **Current limitations and known issues** | Concrete problems to focus research on |
| **Constraints and environment** | Hard limits the researcher must respect |
| **Evaluation** | Test data, metrics, and baselines |
| **What I want to research** | Specific research questions with sub-bullets |

## How to Use

1. Copy [RESEARCH_CONTEXT_TEMPLATE.md](./RESEARCH_CONTEXT_TEMPLATE.md) into your project or a scratch document.
2. Fill in every `[BRACKETED]` placeholder with details from your actual system.
3. Delete any sections that don't apply (e.g., "Core algorithm / logic" if your system is purely a pipeline, or "Evaluation" if you don't have one yet).
4. Paste the completed document into your deep-research tool as grounding context along with your research questions.

## Tips for Better Results

- **Be concrete**: Include actual code snippets, prompt templates, config values, and cost breakdowns. Vague descriptions produce vague recommendations.
- **Be honest about limitations**: The "Current limitations and known issues" section drives the most useful research output. Specific problems get specific solutions.
- **Scope your questions**: Aim for 5-7 research questions, each with 3-5 sub-bullets. Fewer than 5 under-utilizes the session; more than 7 tends to produce shallow answers.
- **State your constraints**: Hard limits (budget, runtime, team size, infrastructure) prevent the researcher from suggesting impractical approaches.

## Template

- [RESEARCH_CONTEXT_TEMPLATE.md](./RESEARCH_CONTEXT_TEMPLATE.md) - Fill-in-the-blank template for documenting a system for deep research.
