# Agentic Brain Interface — Voice-First Single-Chat UI

**Status:** Idea / Exploration
**Created:** 2026-04-12
**Project:** bluevector-template

## Problem

The current BlueVector template uses a 4-phase tab-based UI (Setup → Design → Planning → Build) where users click buttons to generate templates, view documents, and manage tasks. This is a human-in-the-loop process that requires navigating between screens and manually triggering actions. It doesn't match how the primary user (Jackson) actually works — dictating via Wispr Flow, thinking out loud, and expecting the system to keep up.

## Vision

A single conversational AI interface that serves as the **brain** for everything in a project. Instead of clicking through phases:

- **Talk to it** — voice-first input optimized for dictation (Wispr Flow, Ghost Pepper, or any STT provider)
- **It surfaces the right UI dynamically** — discussing a document? It appears. Talking about architecture? Process flows render in real-time. Planning tasks? The kanban materializes.
- **Fully agentic** — the AI doesn't wait for button clicks. It uses MCPs and tools as its rendering engine, proactively pulling up what's relevant.
- **One interface** — the chat IS the project management tool, the design tool, the planning tool, and the build dashboard. All in one.

## Key Concepts

### 1. Voice-First Input
- Primary input mode is dictation, not typing
- Optimized for natural speech patterns (incomplete sentences, corrections, thinking out loud)
- Still supports keyboard input as secondary mode
- Abstract the STT layer so we're not locked to Wispr Flow

### 2. Dynamic Contextual UI (A2UI-Driven)
- The AI decides what UI to render based on conversation context
- Uses A2UI protocol to push component trees to the frontend in real-time
- Examples:
  - "Let's look at the architecture" → renders the TAD diagram
  - "What's the status of the auth feature?" → shows task board filtered to auth
  - "Create a product design blueprint for..." → opens PDB editor with AI filling sections live
  - "Deploy to staging" → shows deployment pipeline with live status
- The UI is ephemeral and conversation-driven, not static navigation

### 3. MCP Tools as Rendering Engine
- MCPs aren't just backend tools — they're the source of what gets rendered
- GitHub MCP → renders PR diffs, issues inline
- Firebase MCP → shows live database state
- Stitch MCP → renders design components
- The AI orchestrates which tools to invoke based on what the user is talking about

### 4. Single Pane of Glass
- No more "go to the tasks page" or "open the design tab"
- Everything is accessible through the conversation
- The AI maintains context across the entire project lifecycle
- Functions as the "brain" — the one-stop shop for project owners

## Technical Considerations

- **A2UI protocol** is already in the template — this is the rendering mechanism
- **SSE streaming** for real-time UI updates as the AI thinks/acts
- **Widget Registry** needs to be expanded for all project artifacts (PDBs, TADs, task boards, deploy status, etc.)
- **Voice input abstraction layer** — pluggable STT providers (Wispr Flow, Ghost Pepper, Web Speech API, Deepgram, etc.)
- **Conversation memory** — the AI needs to maintain long-running project context across sessions
- **Multi-panel layout** — the chat is always present, but the AI can open/close contextual panels alongside it

## Open Questions

- How do we handle complex multi-step workflows that currently benefit from the structured phase UI?
- What's the fallback for users who prefer traditional navigation?
- How do we persist the dynamic UI state across sessions?
- What's the right balance between proactive AI behavior and user control?

## Related Ideas

- **Ghost Pepper evaluation** — potential Wispr Flow replacement for voice input
- **Google Meet Agent Integration** — another voice-first interaction pattern
- **Stakeholder Agent Portal** — similar "talk to the project" concept for non-technical users

## Next Steps

1. Research Ghost Pepper repo capabilities and compare with Wispr Flow
2. Prototype a minimal voice-first chat that can invoke one MCP and render results inline
3. Expand A2UI Widget Registry with project artifact components
4. Design the conversation-to-UI mapping patterns
