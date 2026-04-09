# Research Context: [SYSTEM NAME]

Use this document as grounding context for deep research into improving our [SYSTEM NAME] system. Everything below describes the production system as it exists today.

---

## What the product does

[PRODUCT NAME] is a [brief product description — what it does and who it's for]. Users [primary user action], and the system [what the system does in response].

The core [SYSTEM NAME] problem: **[one-sentence problem statement framing the input, output, and challenge].**

This is a **[CS/ML problem category]** problem. The output is [describe the system's output format and how it's consumed].

---

## Architecture (pipeline)

```
[Trigger event]
  → [Step 1: function/service name] ([what it does])
       → [External API or model call if any]
       → [Data store read/write]
       → [Output artifact]

  → [Step 2: function/service name] ([what it does])
       → ...

  → [Step N: function/service name] ([what it does])
       → [Final output: what gets stored or returned]
```

---

## Component deep-dives

### [Component 1 Name]

**File**: `[path/to/file]` ([N] lines)
**Runtime**: [runtime environment], ~[N]s budget
**Cost**: ~$[N] per [unit] ([breakdown of API calls])

#### Step 1: [Step Name]

[Describe what happens, with code snippets for any prompts, configs, or formulas:]

```
[Code snippet, prompt template, config, or formula]
```

#### Step 2: [Step Name]

[Continue for each step...]

### [Component 2 Name]

**File**: `[path/to/file]` ([N] lines)
**Cost**: ~$[N] per [unit]

[Steps...]

---

## Core algorithm / logic

### [Algorithm Name] (v[VERSION])

```
[The actual formula, with all weights and thresholds]
```

### Thresholds / classification boundaries

```
[Any threshold values that determine output categories]
```

---

## Data schema

### [Table/Model 1]

```
[field_name]    [TYPE]    [Brief note if non-obvious]
[field_name]    [TYPE]
...
```

### [Table/Model 2]

```
...
```

---

## How this system connects to others

The [SYSTEM NAME] system's output feeds into:

1. **[Downstream system 1] ([impact %])**: [How the output is used and why it matters]
2. **[Downstream system 2] ([impact %])**: [...]
3. **[Downstream system 3]**: [...]

**Bottom line**: [One sentence summarizing why this system's quality is critical to the overall product.]

---

## Frontend / UI integration

### [UI Component 1]

- [What it shows / what triggers it]
- [User interactions available]
- [How data refreshes]

### [UI Component 2]

- [...]

---

## Current limitations and known issues

1. **[Issue name]**: [Specific description of the problem and its impact]
2. **[Issue name]**: [...]
3. **[Issue name]**: [...]
4. **[Issue name]**: [...]
5. **[Issue name]**: [...]

---

## Constraints and environment

- **Runtime**: [environment, time budget per invocation]
- **Language**: [language/framework — what code must be written in]
- **APIs**: [list external APIs with cost info]
- **Scale**: [typical data volumes — e.g., "50-500 contacts per user"]
- **Database**: [database type and any extensions]
- **Budget**: [cost ceiling per unit of work]
- **Hard limits**: [anything that's absolutely off the table — e.g., "no browser automation", "no GPU", "no fine-tuning"]

---

## Evaluation (if applicable)

- **Test data**: [description of any golden set, labeled data, or test fixtures]
- **Metrics**: [what you measure — e.g., precision@5, MRR, accuracy, latency]
- **Current baseline**: [current metric values if known]
- **How to run**: [command or process to run evaluation]

---

## What I want to research

Given the system described above, I want deep research into:

1. **[Research area 1]**: [One-sentence framing of what you want to learn]. Research:
   - [Sub-question about alternatives or approaches]
   - [Sub-question about tradeoffs or comparisons]
   - [Sub-question about evidence or case studies]
   - [Sub-question about implementation specifics]

2. **[Research area 2]**: [One-sentence framing]. Research:
   - [...]
   - [...]
   - [...]

3. **[Research area 3]**: [One-sentence framing]. Research:
   - [...]
   - [...]
   - [...]

4. **[Research area 4]**: [One-sentence framing]. Research:
   - [...]
   - [...]
   - [...]

5. **[Research area 5]**: [One-sentence framing]. Research:
   - [...]
   - [...]
   - [...]

Please focus on **practical, implementable approaches** that work at our scale ([describe your scale constraints]). We're a [team size] team running on [infrastructure] — we need methods that can be implemented in [language/runtime] without [excluded infrastructure]. Prefer approaches with clear evidence of working at [your scale descriptor] over theoretically optimal methods that require [what you can't afford — e.g., "millions of training examples", "GPU clusters", "dedicated ML infrastructure"].
