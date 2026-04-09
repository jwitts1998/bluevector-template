# Idea to Product Design Blueprint (PDB)

**Purpose**: Guide for turning a net-new idea into a structured Product Design Blueprint before starting implementation with the multi-agent system.

**When to Use**: You're on **Path A** (greenfield) or have a raw idea that needs to be fleshed out into a formal product design before you can use implementation agents.

---

## The Gap This Fills

The multi-agent system template assumes you already have a PDB (or equivalent design documentation) before implementation begins. The **Documentation Backfill** agent can reverse-engineer a PDB from *existing code*, but there is no built-in path for going from *nothing but an idea* to a PDB.

This guide covers that missing step.

---

## Recommended Workflow

```
1. Idea Exploration (divergent)
   ↓ explore, pressure-test, expand the idea
2. Product Design Blueprint (convergent)
   ↓ structured output: FRD, TAD, flows, UX spec
3. Epic / Task Breakdown
   ↓ epics, features, tasks/*.yml
4. Multi-Agent Implementation
   ↓ use PDB as spec_refs, run standard agents
```

### Phase 1: Idea Exploration

Before locking into a design, spend a session exploring the idea:

- Define the core problem or opportunity
- Identify target users and their unmet needs
- Explore multiple directions before converging
- Surface assumptions, risks, and constraints
- Establish success criteria

**Where to do this**: Use a conversational AI session (Gemini, ChatGPT, Claude, or Cursor itself). The goal is a clear articulation of *what* you're building and *why*, not implementation details.

**In-repo option**: Use the `idea-to-pdb subagent` agent (see [templates/subagents/ideation/](../templates/subagents/ideation/)) to run this step in Claude Code.

### Phase 2: Generate the PDB

Once the idea is clear, produce a structured Product Design Blueprint. The PDB is the single document that downstream agents, task files, and developers reference as the source of truth.

**Expected PDB Sections**:

| # | Section | What It Covers |
|---|---------|----------------|
| 1 | Cover Page | Product name, version, date, mission statement, tagline |
| 2 | Executive Summary | Purpose, value proposition, target users, differentiators, primary use cases |
| 3 | Functional Requirements (FRD) | Core features, detailed feature requirements, personas, user journeys |
| 4 | Technical Architecture (TAD) | System topology, client/backend/API architecture, auth, cloud, integrations |
| 5 | AI Architecture (if applicable) | Model classes, RAG/agent workflows, prompt strategy, cost/latency |
| 6 | Data Architecture | Data models, entity relationships, storage, ingestion, governance |
| 7 | System Flows | User flows (step-by-step) and system-layer flows (backend orchestration) |
| 8 | UX / UI Design Specification | Screen inventory, components, interaction patterns, accessibility |
| 9 | Google Stitch Prompt Package (optional) | Design system prompt, screen prompts, component prompts |
| 10 | Cursor Task Files (optional) | Initial `task.yml` outlines for project setup and core features |
| 11 | Appendix | Glossary, scenarios, expansion paths, risks and mitigations |

**Depth options**:

- **Lightweight PDB**: Optimize for speed. Focus on MVP scope, practical decisions, and near-term buildability. Sections are condensed; 2-4 personas; MVP-only features.
- **Deep-Dive PDB**: Optimize for rigor. Surface assumptions and tradeoffs explicitly. Explore alternatives before converging. Distinguish MVP vs Phase 2 vs Future. Full component breakdown, API contracts, and environment strategy.

**Where to do this**:

- **External tool (recommended for deep PDBs)**: Use Gemini Deep Research, ChatGPT, or Claude with a PDB-generation prompt. Paste your idea exploration notes as context.
- **In Cursor**: Use the `idea-to-pdb subagent` agent for a lightweight PDB. For a deep-dive, run the agent to produce the initial structure and then expand in an external tool.

### Phase 3: Save and Integrate the PDB

1. **Save the PDB** to your project:
   ```
   docs/product_design/{{PROJECT_NAME}}_pdb.md
   ```

2. **Reference it in task files** via `spec_refs`:
   ```yaml
   spec_refs:
     - "PDB: docs/product_design/myapp_pdb.md — Section 3.2"
   ```

3. **Continue with standard setup**: Follow [SETUP_GUIDE.md](../SETUP_GUIDE.md) Path B (you now have a PDB).

---

## Using the Idea-to-PDB Agent

The template includes an ideation agent at `templates/subagents/ideation/idea-to-pdb.md` that can run the idea exploration and lightweight PDB generation in Claude Code.

### Setup

```bash
TEMPLATE_DIR=/path/to/multi-agent-system-template

mkdir -p .claude/agents/ideation
cp $TEMPLATE_DIR/templates/subagents/ideation/idea-to-pdb.md .claude/agents/ideation/
```

### Invocation

```
idea-to-pdb subagent

Prompt: "I have a new product idea: [describe your idea]. Help me explore it and produce a Product Design Blueprint."
```

The agent will:
1. Ask kickoff questions (who is it for, success criteria, constraints, MVP vs full plan)
2. Explore the idea space and surface assumptions
3. Produce a structured PDB (lightweight by default, deep-dive on request)
4. Optionally produce an epic/feature/task outline compatible with `tasks/*.yml`

### When to Use External Tools Instead

- **Deep-dive PDBs** with 10+ pages of detail: use Gemini or ChatGPT with a dedicated PDB prompt for longer context windows and richer output.
- **Visual design exploration**: use Stitch or design tools alongside the PDB.
- **Market research**: use deep-research tools (Gemini Deep Research) that can search the web.

The `idea-to-pdb subagent` agent is best for quick, in-Claude Code ideation sessions that produce a working PDB you can immediately reference in task files.

---

## PDB Quality Checklist

Before using a PDB with implementation agents, verify:

- [ ] Executive summary clearly states what the product is and who it's for
- [ ] Core features are listed with priorities (MVP / Phase 2 / Future)
- [ ] At least 2-3 personas are defined with goals and pain points
- [ ] Primary user flows are documented step-by-step
- [ ] Technical architecture covers client, backend, and data layers
- [ ] Data models and key entities are defined
- [ ] API contracts are specified (at least major endpoints)
- [ ] Non-goals and constraints are explicit
- [ ] Assumptions are called out and labeled
- [ ] The document is saved in `docs/product_design/` and referenced in task files

---

## Relationship to Other Components

```
Idea Exploration ──→ PDB ──→ tasks/*.yml ──→ Implementation
     ↑                ↑           ↑                ↑
idea-to-pdb subagent    This guide   TASK_SCHEMA     Standard agents
(or external)                 GUIDE.md     (Implementation,
                                            QA, Testing)
```

| Starting point | What to use |
|----------------|-------------|
| Raw idea, no code or docs | This guide + `idea-to-pdb subagent` agent |
| Existing code, no PDB | [Ingestion agents](../templates/subagents/ingestion/README.md) (Documentation Backfill) |
| Have PDB, ready to build | [SETUP_GUIDE.md](../SETUP_GUIDE.md) Path B |
| Have code + PDB | [SETUP_GUIDE.md](../SETUP_GUIDE.md) Path C |

---

## Tips

- **Start messy**: The first pass doesn't need to be perfect. Capture the idea, then refine.
- **Iterate**: Run `idea-to-pdb subagent` multiple times as the idea evolves. Each session can build on the previous PDB.
- **Schema-first**: For any feature involving persistent data or external APIs, define the data model in the PDB before implementation.
- **Keep it alive**: The PDB is a living document. Update it as you learn from implementation. Use the Doc-Generator agent to keep it in sync.

---

**Next Steps**: After creating your PDB, continue to [SETUP_GUIDE.md](../SETUP_GUIDE.md) to set up the multi-agent system for implementation.
