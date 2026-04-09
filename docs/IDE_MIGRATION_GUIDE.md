# IDE Migration Guide

This guide helps you migrate from other IDEs to Antigravity IDE + Claude Code for BlueVector AI projects.

## From Cursor

### What Changes
- `.cursorrules` → `.antigravity/settings.json` + `.claude/rules/`
- `.cursor/rules/` → `.claude/rules/`
- Cursor's AI chat → Antigravity IDE + Claude Code

### Migration Steps

1. **Remove Cursor config** (already done in this template):
   ```bash
   rm -f .cursorrules
   rm -rf .cursor/
   ```

2. **Rules are already migrated**: All rules from `.cursor/rules/` have been moved to `.claude/rules/` and work in both Antigravity IDE and Claude Code.

3. **Install Antigravity skills**:
   ```bash
   ./scripts/install-antigravity-skills.sh
   ```

4. **Open in Antigravity IDE** and verify the project loads correctly.

## From VS Code

### What Changes
- `.vscode/settings.json` → `.antigravity/settings.json`
- VS Code extensions → Antigravity extensions
- Copilot → Antigravity AI + Claude Code subagents

### Migration Steps

1. **Keep `.vscode/`** if you want to maintain VS Code compatibility alongside Antigravity.

2. **Install recommended extensions** listed in `.antigravity/settings.json`.

3. **Install Antigravity skills**:
   ```bash
   ./scripts/install-antigravity-skills.sh
   ```

## Key Differences

| Feature | Cursor | VS Code | Antigravity IDE |
|---------|--------|---------|-----------------|
| AI Chat | Built-in | Copilot extension | Built-in + 946+ skills |
| Rules | `.cursorrules` | N/A | `.antigravity/settings.json` |
| Agent System | Manual | Manual | First-class with Claude Code |
| GCP Integration | Extension | Extension | Native + extensions |
| MCP Support | Limited | None | Full via Claude Code |

## Keeping Both IDEs

You can use Antigravity IDE alongside Claude Code CLI:

- **Antigravity IDE**: Primary coding environment with visual editor
- **Claude Code CLI**: `claude .` for agent-driven development from the terminal

Both share the same configuration (`.claude/`, `.mcp.json`, `.antigravity/`).
