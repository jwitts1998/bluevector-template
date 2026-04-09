# Cursor → Claude Code Migration Guide

This guide helps you migrate existing Cursor-based multi-agent projects to Claude Code format.

---

## Quick Start

```bash
# Preview changes (dry run)
./scripts/migrate-from-cursor.sh ~/projects/my-app --dry-run

# Apply migration
./scripts/migrate-from-cursor.sh ~/projects/my-app
```

---

## What Gets Migrated

### File/Directory Renaming

| From | To | Notes |
|------|-----|-------|
| `.cursor/` | `.claude/` | Main configuration directory |
| `.cursorrules` | `CLAUDE.md` | Root configuration file |
| `.cursor/mcp.json` | `.mcp.json` | Moved to project root |
| `templates/cursorrules/` | `templates/claude-config/` | Template directory |
| `*.mdc` files | `*.md` files | Rules and template files |
| `*.cursorrules` files | `*.md` files | Template configuration files |

### Content Updates

1. **Headers**: "Cursor AI Agent Rules" → "Claude Code Agent Rules"
2. **References**: "Cursor plugins and skills" → "Claude Code capabilities"
3. **MCP Config**: Adds `"type": "stdio"` to each server entry

### New Files Added

- `.claude/hooks/session-logger.sh` — Session event logging
- `.claude/hooks/README.md` — Hooks documentation
- `.claude/logs/.gitkeep` — Logs directory
- `.claude/settings.local.json` — Local settings template
- `.claude/rules/token-efficiency.md` — Token usage guidelines

---

## Before You Begin

### Prerequisites

1. **jq installed** (for .mcp.json formatting):
   ```bash
   brew install jq  # macOS
   apt install jq   # Ubuntu/Debian
   ```

2. **Backup your project** (optional - script creates backup automatically):
   ```bash
   cp -r ~/projects/my-app ~/projects/my-app.backup
   ```

3. **Close any Cursor sessions** in the target project

### Verify Project Structure

Your Cursor project should have:
```
my-app/
├── .cursor/           # Will become .claude/
├── .cursorrules       # Will become CLAUDE.md
└── templates/
    └── cursorrules/   # Will become claude-config/
```

---

## Migration Process

### Step 1: Preview Changes (Dry Run)

Always start with a dry run to see what will change:

```bash
./scripts/migrate-from-cursor.sh ~/projects/my-app --dry-run
```

**Output example:**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Cursor → Claude Code Migration
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Target: /Users/you/projects/my-app
Mode: DRY RUN (no changes will be made)

[1/10] Creating backup...
  → Would create backup at: .pre-migration-backup/

[2/10] Renaming .cursor/ → .claude/...
  → Would rename: .cursor/ → .claude/

[3/10] Renaming .cursorrules → CLAUDE.md...
  → Would rename: .cursorrules → CLAUDE.md

...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Migration Summary
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Dry run complete - no changes made

  Would rename:  8 files/dirs
  Would update:  12 files
  Would create:  5 new files
```

Review the output carefully. If everything looks correct, proceed to the next step.

### Step 2: Run Migration

Execute the migration without `--dry-run`:

```bash
./scripts/migrate-from-cursor.sh ~/projects/my-app
```

**What happens:**
1. ✓ Backup created at `.pre-migration-backup/`
2. ✓ Directories and files renamed
3. ✓ Content updated with new headers
4. ✓ .mcp.json reformatted
5. ✓ New files copied from template

**Output example:**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Migration Summary
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✓ Migration complete!

  Files renamed:  8
  Files updated:  12
  Files created:  5

Next steps:
  1. Review changes in: /Users/you/projects/my-app
  2. Test with Claude Code CLI
  3. If issues occur, restore from: .pre-migration-backup
  4. Delete backup when satisfied: rm -rf .pre-migration-backup
```

### Step 3: Verify Migration

Check that the migration completed successfully:

```bash
cd ~/projects/my-app

# Verify directory structure
ls -la .claude/
# Should show: agents/ hooks/ logs/ rules/ skills/ settings.local.json

# Verify CLAUDE.md exists
cat CLAUDE.md | head -20

# Verify .mcp.json format
cat .mcp.json | jq '.mcpServers'
# Each server should have "type": "stdio"

# Check new files
ls -la .claude/hooks/
ls -la .claude/logs/
cat .claude/rules/token-efficiency.md | head -10
```

### Step 4: Test with Claude Code

Open the migrated project with Claude Code:

```bash
cd ~/projects/my-app
claude
```

**Test checklist:**
- [ ] Claude loads without errors
- [ ] CLAUDE.md instructions are recognized
- [ ] Agents can be invoked with `@agent-name`
- [ ] Skills work with `/skill-name`
- [ ] MCP servers connect (check with available tools)
- [ ] Session logger creates .jsonl files in `.claude/logs/`

### Step 5: Clean Up

Once you've verified everything works:

```bash
# Remove backup
rm -rf .pre-migration-backup

# Optional: commit the migration
git add .
git commit -m "Migrate from Cursor to Claude Code format

- Renamed .cursor/ → .claude/
- Renamed .cursorrules → CLAUDE.md
- Updated MCP config format
- Added hooks, logs, and token-efficiency guidelines

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Handling Edge Cases

### Already Partially Migrated

If your project already has `.claude/` or `CLAUDE.md`:

```
Warning: .claude/ already exists (.cursor/ does not)
Continue anyway? (y/N)
```

The script will:
- Merge directories instead of replacing
- Backup existing files before overwriting
- Skip files that already exist in the new format

### Missing jq

If jq is not installed:

```
○ jq not installed, skipping .mcp.json format update
  Manual action required: Add '"type": "stdio"' to each server in .mcp.json
```

**Manual fix:**

Edit `.mcp.json` and add `"type": "stdio"` to each server:

```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["@context7/server"],
      "type": "stdio"  // ← Add this line
    }
  }
}
```

### Conflicts with Existing Files

If the script encounters conflicts:

```
Warning: CLAUDE.md already exists, backing up to CLAUDE.md.old
```

Backup files are created with `.old` extension. Review and merge manually if needed.

---

## Rollback Procedure

If migration causes issues, restore from backup:

```bash
cd ~/projects/my-app

# Remove migrated files
rm -rf .claude/ CLAUDE.md .mcp.json templates/claude-config/

# Restore from backup
cp -r .pre-migration-backup/.cursor ./
cp .pre-migration-backup/.cursorrules ./
cp -r .pre-migration-backup/cursorrules ./templates/

# Verify restoration
ls -la .cursor/
cat .cursorrules
```

---

## Migrating Multiple Projects

To migrate all your Cursor projects:

```bash
# List your projects
ls -d ~/projects/*/.cursor | sed 's|/.cursor||'

# Migrate each one
for project in ~/projects/*/; do
  if [ -d "$project/.cursor" ]; then
    echo "Migrating: $project"
    ./scripts/migrate-from-cursor.sh "$project"
  fi
done
```

**Recommended approach:**
1. Migrate one project first
2. Test thoroughly
3. Once confident, batch migrate the rest
4. Use `--dry-run` on the batch first

---

## Key Differences: Cursor vs Claude Code

### Configuration Files

| Aspect | Cursor | Claude Code |
|--------|--------|-------------|
| Config dir | `.cursor/` | `.claude/` |
| Root config | `.cursorrules` | `CLAUDE.md` |
| MCP config | `.cursor/mcp.json` | `.mcp.json` (root) |
| Rules extension | `.mdc` | `.md` |
| Template dir | `templates/cursorrules/` | `templates/claude-config/` |

### MCP Server Format

**Cursor format:**
```json
{
  "mcpServers": {
    "myserver": {
      "command": "node",
      "args": ["server.js"]
    }
  }
}
```

**Claude Code format:**
```json
{
  "mcpServers": {
    "myserver": {
      "command": "node",
      "args": ["server.js"],
      "type": "stdio"
    }
  }
}
```

### New Features in Claude Code

1. **Hooks** (`.claude/hooks/`):
   - Session lifecycle events
   - Custom automation scripts
   - Example: `session-logger.sh` tracks all sessions

2. **Logs** (`.claude/logs/`):
   - JSONL format session logs
   - Automatic tracking via hooks
   - Useful for debugging and analytics

3. **Token Efficiency Guidelines** (`.claude/rules/token-efficiency.md`):
   - Cost optimization strategies
   - Tool selection guidance
   - Anti-patterns to avoid

4. **Local Settings** (`.claude/settings.local.json`):
   - User-specific overrides
   - Git-ignored by default
   - Environment-specific configuration

---

## Troubleshooting

### Migration Script Errors

**Error: "Target directory does not exist"**
```bash
# Verify path is correct
ls -la ~/projects/my-app

# Use absolute path
./scripts/migrate-from-cursor.sh "$(pwd)/../my-app"
```

**Error: "Permission denied"**
```bash
# Make script executable
chmod +x scripts/migrate-from-cursor.sh

# Or run with bash
bash scripts/migrate-from-cursor.sh ~/projects/my-app
```

### Post-Migration Issues

**Claude Code doesn't recognize CLAUDE.md**
- Verify file exists in project root: `ls -la CLAUDE.md`
- Check file permissions: `chmod 644 CLAUDE.md`
- Ensure no BOM or encoding issues: `file CLAUDE.md`

**MCP servers don't connect**
- Verify `.mcp.json` format with: `jq . .mcp.json`
- Check each server has `"type": "stdio"`
- Test server manually: `node server.js` (check for errors)

**Agents not found**
- Verify `.claude/agents/` directory exists
- Check agent files are `.md` not `.mdc`
- Ensure no spaces in filenames

**Session logger not working**
- Check hook is executable: `chmod +x .claude/hooks/session-logger.sh`
- Verify logs directory: `ls -la .claude/logs/`
- Review hook README: `cat .claude/hooks/README.md`

---

## FAQ

### Do I need to migrate all projects at once?

No. Migrate one at a time. You can still use Cursor for other projects while testing Claude Code on migrated ones.

### Will this break my existing Cursor setup?

No. The migration only affects the target project directory. Your Cursor installation and other projects remain unchanged.

### Can I migrate back to Cursor format?

Yes, using the rollback procedure above. However, changes made in Claude Code after migration won't automatically translate back.

### What if I've customized my .cursorrules heavily?

The script preserves all content and only updates specific headers/references. Your custom rules, agents, and logic remain intact.

### Do I lose any functionality?

No. Claude Code is a superset of Cursor's multi-agent features. You gain new capabilities (hooks, better logging, token efficiency) without losing existing ones.

### How long does migration take?

Typically 5-30 seconds depending on project size. Most time is spent copying backup and reading/writing files.

---

## Next Steps

After successful migration:

1. **Update documentation**: Add Claude Code-specific notes to your project README
2. **Configure hooks**: Customize `.claude/hooks/` for your workflow
3. **Review token efficiency**: Read `.claude/rules/token-efficiency.md`
4. **Explore new capabilities**: Check what MCP servers/skills you can add
5. **Share with team**: Help teammates migrate their local clones

---

## Getting Help

- **Script issues**: Check the script's help: `./scripts/migrate-from-cursor.sh`
- **Claude Code questions**: See official documentation
- **Template questions**: Review `CLAUDE.md` in this repository
- **Rollback help**: See "Rollback Procedure" section above

---

## Migration Checklist

Use this checklist when migrating each project:

- [ ] Prerequisites installed (jq, etc.)
- [ ] Cursor sessions closed
- [ ] Dry run completed and reviewed
- [ ] Migration executed
- [ ] Directory structure verified
- [ ] CLAUDE.md content checked
- [ ] .mcp.json format validated
- [ ] New files present (hooks, logs, token-efficiency.md)
- [ ] Claude Code opens project without errors
- [ ] Agents invokable with @agent-name
- [ ] Skills work with /skill-name
- [ ] MCP servers connect
- [ ] Session logger creates logs
- [ ] Backup removed (once confident)
- [ ] Changes committed to git (optional)

---

**Script location**: `scripts/migrate-from-cursor.sh`
**Last updated**: 2025-01-09
