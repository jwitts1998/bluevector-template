---
name: migrate-from-cursor
description: Interactive guide for migrating Cursor-based multi-agent projects to Claude Code format. Runs migration script, validates changes, and helps troubleshoot issues.
allowed-tools: Bash, Read, AskUserQuestion
---

# Migrate from Cursor to Claude Code

## When to Use

- User wants to migrate an existing Cursor multi-agent project to Claude Code
- User has multiple Cursor projects to migrate
- User needs help with migration troubleshooting
- User asks about differences between Cursor and Claude Code configurations

## Prerequisites

Before migration:

1. **jq installed** (for MCP config formatting):
   ```bash
   # Check if installed
   which jq

   # Install if needed:
   # macOS: brew install jq
   # Ubuntu/Debian: apt install jq
   ```

2. **Target project path** - Know which project to migrate

3. **Cursor sessions closed** - No active Cursor sessions in the target project

If prerequisites are missing, help the user install/configure them before proceeding.

## Migration Process

### Step 1: Gather Information

Ask the user:

1. **What is the full path to the project you want to migrate?**
   - Example: `/Users/username/projects/my-app`
   - Verify the path exists and contains `.cursor/` or `.cursorrules`

2. **Is this your first migration or have you migrated projects before?**
   - First time: Explain what will happen in detail
   - Experienced: Offer quick migration option

3. **Do you want to preview changes first (dry run) or migrate directly?**
   - Recommended: Always do dry run first for first-time migrations
   - Quick option: Skip dry run if experienced

### Step 2: Validate Prerequisites

```bash
# Check jq installation
if ! command -v jq &> /dev/null; then
    echo "⚠️  jq is not installed. Installing..."
    # Provide platform-specific install command
fi

# Verify target project exists
ls -la /path/to/project/.cursor 2>/dev/null || ls -la /path/to/project/.cursorrules 2>/dev/null
```

If validation fails:
- Help install missing tools
- Verify the correct project path
- Check if project is already migrated

### Step 3: Run Dry Run (Recommended)

Always run dry run first to preview changes:

```bash
./scripts/migrate-from-cursor.sh /path/to/project --dry-run
```

**Review the output with the user:**
- How many files will be renamed?
- How many files will be updated?
- How many new files will be created?
- Are there any warnings or conflicts?

**Ask**: "Does this look correct? Should I proceed with the actual migration?"

If the user sees unexpected changes:
- Help them understand what each change means
- Refer to `docs/MIGRATION_GUIDE.md` for detailed explanations
- Offer to abort if they want to investigate first

### Step 4: Execute Migration

Once dry run is approved:

```bash
./scripts/migrate-from-cursor.sh /path/to/project
```

**Monitor the output:**
- Backup created successfully?
- Any errors during renaming?
- All steps completed?
- Final summary shows expected counts?

If errors occur:
- Read the error messages carefully
- Common issues:
  - Permission denied: `chmod +x scripts/migrate-from-cursor.sh`
  - Directory doesn't exist: Verify path is correct
  - Files already exist: Project may be partially migrated

### Step 5: Verification

After migration completes, verify the changes:

```bash
cd /path/to/project

# 1. Check directory structure
echo "Checking .claude/ directory..."
ls -la .claude/
# Should see: agents/ hooks/ logs/ rules/ skills/ settings.local.json

# 2. Verify CLAUDE.md
echo "Checking CLAUDE.md..."
head -20 CLAUDE.md

# 3. Check MCP config format
echo "Checking .mcp.json format..."
jq '.mcpServers' .mcp.json
# Each server should have "type": "stdio"

# 4. Verify new files
echo "Checking new files..."
ls -la .claude/hooks/
ls -la .claude/logs/
cat .claude/rules/token-efficiency.md | head -10
```

**Walk through verification results with the user:**
- Does the directory structure look correct?
- Is CLAUDE.md readable and contains their rules?
- Are MCP servers properly formatted?
- Are new files present?

### Step 6: Test with Claude Code

Guide the user to test:

```bash
cd /path/to/project
claude
```

**Test checklist (review with user):**
- [ ] Claude opens without errors
- [ ] CLAUDE.md instructions are recognized
- [ ] Can invoke agents with `@agent-name`
- [ ] Skills work with `/skill-name`
- [ ] MCP servers connect (test a command)
- [ ] Session logger creates files in `.claude/logs/`

If any tests fail:
- Review error messages
- Check relevant files (CLAUDE.md, .mcp.json, etc.)
- Refer to troubleshooting section below

### Step 7: Cleanup

Once everything works:

```bash
# Remove backup
rm -rf .pre-migration-backup

# Optional: Commit changes
git add .
git commit -m "Migrate from Cursor to Claude Code format

- Renamed .cursor/ → .claude/
- Renamed .cursorrules → CLAUDE.md
- Updated MCP config format
- Added hooks, logs, and token-efficiency guidelines

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

**Ask user**: "Would you like me to commit these changes to git?"

---

## Migrating Multiple Projects

If the user has multiple projects to migrate:

### Option A: Batch Migration (Recommended for 3+ projects)

1. **Create a list of projects:**
   ```bash
   # Find all Cursor projects
   find ~/projects -maxdepth 2 -name ".cursor" -type d | sed 's|/.cursor||' > cursor-projects.txt

   # Review the list
   cat cursor-projects.txt
   ```

2. **Ask**: "I found these Cursor projects. Which ones should I migrate?"
   - User can edit the list
   - Or specify a pattern (e.g., "all except legacy-*")

3. **Run dry run on all:**
   ```bash
   while read project; do
     echo "=== Dry run: $project ==="
     ./scripts/migrate-from-cursor.sh "$project" --dry-run
     echo ""
   done < cursor-projects.txt
   ```

4. **Review and confirm**: "All dry runs look good. Proceed with migration?"

5. **Execute batch migration:**
   ```bash
   while read project; do
     echo "=== Migrating: $project ==="
     ./scripts/migrate-from-cursor.sh "$project"
     echo ""
   done < cursor-projects.txt
   ```

### Option B: One-by-one (Recommended for first-time or <3 projects)

Repeat Steps 1-7 for each project individually.

---

## Troubleshooting Guide

### Common Issues

#### 1. "jq not installed"

**Symptom**: Script warns about missing jq, .mcp.json not updated

**Solution**:
```bash
# macOS
brew install jq

# Ubuntu/Debian
sudo apt install jq

# Then manually update .mcp.json
cd /path/to/project
jq '.mcpServers |= with_entries(.value.type = "stdio")' .mcp.json > .mcp.json.tmp
mv .mcp.json.tmp .mcp.json
```

#### 2. "Project appears to already be migrated"

**Symptom**: Script detects existing `.claude/` directory

**Options**:
- Type 'y' to continue anyway (will merge/update)
- Type 'n' to abort and investigate
- Check if project needs re-migration or is already complete

**Verification**:
```bash
# Check what exists
ls -la .claude/ .cursor/ CLAUDE.md .cursorrules 2>/dev/null

# If both .cursor and .claude exist: incomplete migration
# If only .claude exists: already migrated
```

#### 3. MCP Servers Don't Connect

**Symptom**: After migration, MCP tools not available in Claude

**Debug steps**:
```bash
# 1. Verify .mcp.json format
jq . .mcp.json

# 2. Check each server has "type": "stdio"
jq '.mcpServers | to_entries[] | select(.value.type != "stdio")' .mcp.json

# 3. Test server manually
# Example for a Node server:
cd /path/to/mcp/server
node index.js
```

**Common fixes**:
- Add missing `"type": "stdio"`
- Fix invalid JSON syntax
- Update server paths if they changed

#### 4. Agents Not Found

**Symptom**: `@agent-name` doesn't work in Claude

**Debug**:
```bash
# Check agents directory
ls -la .claude/agents/

# Check file extensions
find .claude/agents -name "*.mdc"  # Should be empty
find .claude/agents -name "*.md"   # Should list agents

# Verify agent file format
head -20 .claude/agents/code-reviewer.md
```

**Fixes**:
- Rename any remaining `.mdc` to `.md`
- Check YAML frontmatter is valid
- Ensure no spaces in filenames

#### 5. Session Logger Not Working

**Symptom**: No `.jsonl` files created in `.claude/logs/`

**Debug**:
```bash
# Check hook exists and is executable
ls -la .claude/hooks/session-logger.sh

# Make executable if needed
chmod +x .claude/hooks/session-logger.sh

# Test manually
.claude/hooks/session-logger.sh --event session-start

# Check logs directory
ls -la .claude/logs/
```

---

## Key Differences: Cursor vs Claude Code

Help the user understand what changed:

### File Structure
```
Cursor:                      Claude Code:
.cursor/                     .claude/
├── mcp.json          →      ├── hooks/
├── rules/                   ├── logs/
├── agents/                  ├── rules/
└── skills/                  ├── agents/
                             ├── skills/
.cursorrules          →      └── settings.local.json

                             CLAUDE.md (project root)
                             .mcp.json (project root)
```

### Configuration Changes

1. **MCP Format**: Added `"type": "stdio"` to each server
2. **Headers**: "Cursor AI" → "Claude Code"
3. **File Extensions**: `.mdc` → `.md`, `.cursorrules` → `.md`

### New Features

1. **Hooks** (`.claude/hooks/`):
   - Event-driven automation
   - Session lifecycle tracking
   - Custom scripts

2. **Logs** (`.claude/logs/`):
   - JSONL session logs
   - Automatic via hooks
   - Analytics and debugging

3. **Token Efficiency** (`.claude/rules/token-efficiency.md`):
   - Cost optimization guidelines
   - Tool selection hierarchy
   - Anti-patterns to avoid

---

## Quick Reference

### Migration Commands

```bash
# Preview changes (always run first)
./scripts/migrate-from-cursor.sh /path/to/project --dry-run

# Execute migration
./scripts/migrate-from-cursor.sh /path/to/project

# Verify migration
cd /path/to/project
ls -la .claude/
cat CLAUDE.md | head -20
jq '.mcpServers' .mcp.json
```

### Rollback

If migration causes issues:

```bash
cd /path/to/project

# Remove migrated files
rm -rf .claude/ CLAUDE.md .mcp.json templates/claude-config/

# Restore from backup
cp -r .pre-migration-backup/.cursor ./
cp .pre-migration-backup/.cursorrules ./
cp -r .pre-migration-backup/cursorrules ./templates/
```

---

## User Questions to Anticipate

**"Will this break my Cursor setup?"**
- No, migration only affects the target project directory
- Your Cursor installation and other projects are unchanged
- You can still use Cursor for unmigrated projects

**"Can I undo the migration?"**
- Yes, via the rollback procedure above
- Script creates `.pre-migration-backup/` automatically
- Keep backup until you're confident everything works

**"Do I lose any features?"**
- No, Claude Code is a superset of Cursor's capabilities
- You gain new features (hooks, better logging, token efficiency)
- All agents, rules, and skills are preserved

**"How long does it take?"**
- Typically 5-30 seconds per project
- Dry run: ~5 seconds
- Actual migration: ~10-30 seconds
- Most time is backup creation and file I/O

**"Should I migrate all projects at once?"**
- Recommended: Migrate and test one project first
- Once confident, batch migrate the rest
- Use `--dry-run` on batch migrations first

---

## Success Criteria

Migration is complete when:

- [ ] Script completed without errors
- [ ] Directory structure verified (`.claude/` exists with all subdirs)
- [ ] CLAUDE.md readable and contains user's rules
- [ ] .mcp.json properly formatted with `"type": "stdio"`
- [ ] New files present (hooks, logs, token-efficiency.md)
- [ ] Claude Code opens project without errors
- [ ] Agents invokable with `@agent-name`
- [ ] Skills work with `/skill-name`
- [ ] MCP servers connect and provide tools
- [ ] Session logger creates `.jsonl` logs
- [ ] User tested core functionality
- [ ] Backup removed (after user confirms)

---

## Additional Resources

- **Detailed guide**: `docs/MIGRATION_GUIDE.md`
- **Migration script**: `scripts/migrate-from-cursor.sh`
- **Script help**: `./scripts/migrate-from-cursor.sh` (no args)
- **Token efficiency**: `.claude/rules/token-efficiency.md` (after migration)
- **Hooks documentation**: `.claude/hooks/README.md` (after migration)

---

## Workflow Summary

1. **Gather info**: Project path, experience level, dry run preference
2. **Validate**: Check jq, verify project exists
3. **Dry run**: Preview changes, get approval
4. **Execute**: Run migration script
5. **Verify**: Check files, structure, content
6. **Test**: Open in Claude, test features
7. **Cleanup**: Remove backup, commit changes
8. **Celebrate**: User now has Claude Code multi-agent setup!

For multiple projects:
- Find all Cursor projects
- Batch dry run
- Review and approve
- Batch migrate
- Spot-check verification
- Test representative projects
