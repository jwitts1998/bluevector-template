# Context Budget Strategy -- [PROJECT_NAME]

**Last Updated**: [DATE]

This document defines how the agent runtime allocates its context window across memory tiers. Tune the percentages based on your model's context window size and your project's needs.

---

## Model Context

- **Model**: [MODEL_NAME] (e.g., Claude 3.5 Sonnet, GPT-4o)
- **Context Window**: [TOKEN_COUNT] tokens (e.g., 128k, 200k)
- **Effective Budget**: [EFFECTIVE_TOKENS] tokens (reserve 10-15% for output generation)

---

## Token Budget Allocation

| Tier | Purpose | Budget | Tokens | Strategy |
|------|---------|--------|--------|----------|
| System | System prompt, tool definitions, instructions | [N]% | [N] | Static; update only when tools or instructions change |
| Short-term | Recent conversation turns | [N]% | [N] | Sliding window; drop oldest turns when budget exceeded |
| Mid-term | Compressed summaries of older turns | [N]% | [N] | Rolling summarization; compress every [N] turns into a summary paragraph |
| Long-term | Retrieved memories from external store | [N]% | [N] | Retrieval by intent; inject only memories relevant to current query |
| Reserved | Output generation headroom | [N]% | [N] | Never allocate for input context |

### Example Allocation (128k context window)

| Tier | Budget | Tokens |
|------|--------|--------|
| System | 10% | ~12,800 |
| Short-term | 50% | ~64,000 |
| Mid-term | 20% | ~25,600 |
| Long-term | 10% | ~12,800 |
| Reserved | 10% | ~12,800 |

---

## Short-Term Context (Sliding Window)

- **Window size**: Last [N] turns (or last [N] tokens, whichever is smaller)
- **Eviction policy**: Drop oldest user/assistant turn pairs first
- **Preserve**: Always keep the most recent user message and any in-progress tool calls

---

## Mid-Term Context (Rolling Summarization)

- **Trigger**: When short-term window evicts turns, summarize the evicted turns
- **Summarizer**: [APPROACH] (e.g., separate LLM call, in-context compression prompt)
- **Format**: One paragraph per [N] evicted turns, preserving key decisions and outcomes
- **Retention**: Keep the last [N] summary paragraphs; discard oldest when budget exceeded

---

## Long-Term Context (Memory Retrieval)

- **Backend**: [BACKEND] (e.g., mem0, graphiti, vector store, markdown files)
- **Retrieval trigger**: Every user message (or every [N]th message to reduce latency/cost)
- **Query strategy**: [STRATEGY] (e.g., embed user query and retrieve top-K similar memories, keyword extraction, intent classification)
- **Top-K**: Retrieve [N] memory entries per query
- **Injection point**: After system prompt, before conversation history

---

## Overflow Handling

When total context exceeds the effective budget:

1. Reduce long-term retrieval results first (fewer top-K)
2. Compress mid-term summaries more aggressively
3. Shrink short-term window
4. Never truncate system prompt or current user message

---

## Monitoring

Track these metrics to tune the budget over time:

- **Context utilization**: % of context window used per request
- **Eviction rate**: How often turns are evicted from short-term window
- **Retrieval relevance**: % of retrieved long-term memories that the agent actually references
- **Summary quality**: Spot-check that compressed summaries preserve key decisions
