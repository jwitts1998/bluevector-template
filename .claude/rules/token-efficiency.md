---
description: Guidelines for cost-effective token usage during Claude Code sessions. Loaded at startup, always active.
---

# Token Efficiency Guidelines

## Purpose

These guidelines help Claude Code sessions stay cost-effective by minimizing unnecessary token usage while maintaining quality output.

---

## Core Principles

### 1. Ask Before Diving Deep

Before extensive research or documentation:
```
❌ Expensive: Read 10 files, create comprehensive report
✅ Efficient: "Do you want (A) quick summary, (B) detailed analysis, or (C) just execute?"
```

**When to ask:**
- Task has multiple valid approaches
- Output format is ambiguous (summary vs detailed)
- Scope is unclear (one file vs entire codebase)

### 2. Use the Exploration Hierarchy

Cost increases down the list. Start at the top:

| Level | Method | Token Cost | Use When |
|-------|--------|------------|----------|
| 1 | `find`, `ls`, `wc -l` | ~50 | Counting files, checking existence |
| 2 | `grep -c`, `grep -l` | ~100 | Finding which files contain patterns |
| 3 | Glob patterns | ~200 | Listing files by pattern |
| 4 | Grep with context | ~500 | Finding specific code patterns |
| 5 | Read specific lines | ~300 | Targeted section reads |
| 6 | Read full file | ~1000+ | Only when necessary |
| 7 | Agent delegation | ~5000+ | Complex multi-step tasks |

### 3. Sample Instead of Exhaustive Read

```
❌ Expensive: Read all 5 template variants
✅ Efficient: Read 1 template, note "4 similar variants exist"
```

When files follow patterns:
- Read one representative example
- Use grep to confirm others follow same pattern
- Document the pattern, not every instance

### 4. Incremental Documentation

```
❌ Expensive: Write 500-line document immediately
✅ Efficient: Write outline → get approval → expand sections
```

**Workflow:**
1. Create bullet-point outline (50-100 lines)
2. Ask: "Should I expand any section?"
3. Elaborate only requested sections

### 5. Targeted Agent Prompts

```
❌ Expensive: "Tell me about the authentication system"
✅ Efficient: "What file handles JWT token validation?"
```

**Rules:**
- Ask specific questions, not open-ended exploration
- Request specific output format
- Set scope boundaries ("only in src/auth/")

---

## Session Start Checklist

Before beginning work, quickly establish:

1. **Scope**: What files/directories are relevant?
2. **Output**: Summary, detailed report, or direct action?
3. **Approach**: One best way, or explore options?
4. **Validation**: How will we verify success?

**Quick template:**
```
"I'll [action]. This involves [scope].
Want me to (A) proceed directly, (B) show outline first, or (C) explore options?"
```

---

## Tool Selection Guide

### For Finding Files
```
✅ Glob: find files by pattern
❌ Read + scan: reading to find files
```

### For Finding Code
```
✅ Grep: search for patterns
✅ Grep with -l: just list matching files
❌ Read multiple files: then search manually
```

### For Understanding Structure
```
✅ ls, find, tree: directory structure
✅ head -20: quick file preview
❌ Read full file: to understand structure
```

### For Making Changes
```
✅ Edit: surgical changes
✅ sed (via Bash): bulk pattern replacement
❌ Read + Write: for simple substitutions
```

### For Complex Tasks
```
✅ Concise agent prompt: specific task, clear scope
❌ Verbose agent prompt: excessive context repetition
```

---

## Anti-Patterns to Avoid

### 1. Reading Before Asking
```
❌ Read 5 files, then ask "which approach do you prefer?"
✅ Ask first: "The codebase uses X pattern. Should I follow it or try Y?"
```

### 2. Comprehensive When Targeted Works
```
❌ "Let me read all the documentation to understand the project"
✅ "I'll check README.md for setup instructions"
```

### 3. Repeating Context to Agents
```
❌ Copy entire conversation history into agent prompt
✅ Summarize: "User wants X. Relevant files: A, B, C. Execute Y."
```

### 4. Over-Documenting Progress
```
❌ Create detailed todo list for 2 simple tasks
✅ Just do the tasks, summarize at end
```

### 5. Speculative Reading
```
❌ "Let me read these 10 files in case they're relevant"
✅ "I'll grep for the function name first to find where it's used"
```

---

## Cost-Saving Shortcuts

### Bulk Text Replacement
```bash
# Instead of Edit on 50 files:
find . -name "*.md" -exec sed -i '' 's/old/new/g' {} \;
```

### Quick File Counts
```bash
# Instead of reading to understand scope:
find src -name "*.ts" | wc -l  # "47 TypeScript files"
```

### Pattern Verification
```bash
# Instead of reading each file:
grep -l "import React" src/**/*.tsx | wc -l  # "23 files use React"
```

### Structure Overview
```bash
# Instead of reading README:
ls -la && head -20 README.md  # Quick orientation
```

---

## When to Spend Tokens

Some situations warrant higher token usage:

1. **Security-sensitive code**: Read thoroughly, don't assume
2. **Complex refactoring**: Understand before changing
3. **User explicitly requests detail**: Give them what they asked for
4. **Debugging failures**: Need full context to diagnose
5. **First-time codebase exploration**: Initial investment pays off

---

## Session Efficiency Metrics

Track these mentally during sessions:

- **Files read vs files modified**: Aim for low ratio
- **Questions asked before action**: More upfront = less rework
- **Agent delegations**: Each should accomplish significant work
- **Documentation created**: Match detail level to user needs

---

## Quick Reference Card

```
┌─────────────────────────────────────────────────────┐
│ TOKEN EFFICIENCY QUICK GUIDE                        │
├─────────────────────────────────────────────────────┤
│ ✓ Ask scope/format before deep work                 │
│ ✓ Use grep/find before read                         │
│ ✓ Sample 1 of N similar files                       │
│ ✓ Outline → approve → expand                        │
│ ✓ Specific agent prompts with clear scope           │
├─────────────────────────────────────────────────────┤
│ ✗ Read everything "just in case"                    │
│ ✗ Comprehensive docs without asking                 │
│ ✗ Repeat context in agent prompts                   │
│ ✗ Over-engineer todo lists                          │
│ ✗ Read to find (use grep instead)                   │
└─────────────────────────────────────────────────────┘
```
