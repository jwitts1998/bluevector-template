---
name: apply-multi-agent-template
description: Guides through deploying the multi-agent system template into a target project. Use when the user wants to set up or refresh the multi-agent system from this template, copy templates to another project, or replace template variables.
disable-model-invocation: true
allowed-tools: Bash, Read, Write, Edit
---

# Apply Multi-Agent Template

## When to Use

- User wants to set up the multi-agent system in a new or existing project
- User wants to refresh or update template files in a project
- User asks to "apply", "deploy", or "copy" the template to a project

## Prerequisites

- Know the template repo location (`$TEMPLATE_DIR` or the repo root)
- Know the target project path
- Know the project type: `mobile-app`, `web-app`, `backend`, or `full-stack`

If any are missing, ask the user before proceeding.

## Steps

### 1. Determine Project Type

Ask or infer the project type. The mapping is:

| Project Type | CLAUDE.md template | AGENTS.md template | Specialist(s) |
|---|---|---|---|
| mobile-app | `mobile-app.md` | `AGENTS-mobile.md` | `flutter-specialist.md` or framework-specific |
| web-app | `web-app.md` | `AGENTS-web.md` | `react-specialist.md` or framework-specific |
| backend | `backend-service.md` | `AGENTS-backend.md` | `node-specialist.md` or framework-specific |
| full-stack | `full-stack.md` | `AGENTS-full-stack.md` | Multiple specialists |

### 2. Copy Core Templates

Run from the template repo (adjust `TARGET` to the target project path):

```bash
TARGET=/path/to/your/project
TYPE=web-app  # or mobile-app, backend, full-stack

cp $TEMPLATE_DIR/templates/claude-config/${TYPE}.md $TARGET/CLAUDE.md
cp $TEMPLATE_DIR/templates/agents/AGENTS-${TYPE}.md $TARGET/AGENTS.md
```

### 3. Copy Subagents

```bash
mkdir -p $TARGET/.claude/agents
cp $TEMPLATE_DIR/templates/subagents/generic/*.md $TARGET/.claude/agents/
cp $TEMPLATE_DIR/templates/subagents/specialists/<specialist>.md $TARGET/.claude/agents/
```

### 4. Copy Task Schema and Workflow Docs

```bash
cp $TEMPLATE_DIR/templates/tasks/tasks-schema.yml $TARGET/tasks.yml
mkdir -p $TARGET/tasks $TARGET/docs/workflow
cp $TEMPLATE_DIR/templates/tasks/feature-task-template.yml $TARGET/tasks/
cp $TEMPLATE_DIR/templates/workflow/*.md $TARGET/docs/workflow/
```

### 5. (Optional) Copy .claude/rules/

If the user prefers file-scoped rules:

```bash
mkdir -p $TARGET/.claude/rules
cp $TEMPLATE_DIR/templates/claude-config/rules/*.md $TARGET/.claude/rules/
```

### 6. Replace Variables

Guide the user through replacing all `{{VARIABLE}}` placeholders. The required variables are:

- `{{PROJECT_NAME}}` — Project name
- `{{PROJECT_DESCRIPTION}}` — One-sentence description
- `{{PRIMARY_LANGUAGE}}` — Main language (e.g., TypeScript, Dart)
- `{{FRAMEWORK}}` — Primary framework (e.g., React, Flutter)
- `{{ARCHITECTURE_PATTERN}}` — Architecture style (e.g., Clean Architecture, Feature-First)

See the full variable list in [SETUP_GUIDE.md](../../SETUP_GUIDE.md#variable-reference).

### 7. Validate

Run the validation script to ensure no placeholders remain:

```bash
$TEMPLATE_DIR/scripts/validate-no-placeholders.sh $TARGET
```

## Post-Setup

Remind the user to:

1. Set `TEMPLATE_DIR` in their shell profile if not already done
2. Commit `CLAUDE.md`, `AGENTS.md`, `.claude/agents/`, and optionally `.claude/rules/`
3. Add `.claude/settings/` to `.gitignore` (user-specific settings)
4. Test agent invocation: ask Claude Code to "use the code-reviewer subagent to review a file"

### Optional: Antigravity Awesome Skills

You can install 946+ additional agent skills at any time — during setup or when the user asks. Run:

```bash
$TEMPLATE_DIR/scripts/install-antigravity-skills.sh --project $TARGET
```

Skills merge into `$TARGET/.claude/skills/`; project skills are preserved. See `docs/CLAUDE_CODE_CAPABILITIES.md` for details. All agents have permission to leverage these skills and create new ones.

## Quick Alternative

The init script automates steps 1-4:

```bash
$TEMPLATE_DIR/scripts/init-to-project.sh $TARGET [PROJECT_TYPE]
```
