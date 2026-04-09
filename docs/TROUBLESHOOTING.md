# Troubleshooting Guide

**Version**: 1.0.0  
**Last Updated**: January 2026

## 🐛 Common Issues

### Issue: Agents Not Following Project Standards

**Symptoms**: AI gives generic advice, doesn't follow `CLAUDE.md`

**Causes**:
- `CLAUDE.md` too generic or incomplete
- Variables not replaced
- No project-specific examples

**Solutions**:
1. Search for `{{` in `CLAUDE.md` - replace all variables
2. Add project-specific examples to `CLAUDE.md`
3. Make architecture section more specific
4. Add code examples showing patterns

### Issue: Subagents Not Activating

**Symptoms**: Expected subagent doesn't invoke automatically

**Causes**:
- Description not specific enough
- Missing "Use proactively" phrase
- Subagent file not in correct location

**Solutions**:
1. Check YAML frontmatter is valid
2. Ensure description mentions when to activate
3. Verify file in `.claude/agents/` directory
4. Try manual invocation first

### Issue: Agents Giving Conflicting Advice

**Symptoms**: Different agents suggest different approaches

**Causes**:
- Agent roles overlap
- Priorities unclear
- Missing guidelines in `CLAUDE.md`

**Solutions**:
1. Clarify agent roles in `AGENTS.md`
2. Establish priority (specialist > generic)
3. Add decision rules to `CLAUDE.md`
4. Use sequential workflow instead of parallel

### Issue: Task Files Not Being Read

**Symptoms**: Agents don't reference task context

**Causes**:
- `CLAUDE.md` doesn't mention tasks
- Task schema invalid
- File naming wrong

**Solutions**:
1. Check `CLAUDE.md` has task workflow section
2. Validate YAML syntax
3. Ensure tasks in `tasks/*.yml` location
4. Explicitly reference task: "Review task FEATURE_T1"

### Issue: Variables Still Present

**Symptoms**: Templates show `{{VARIABLE_NAME}}`

**Causes**:
- Forgot to replace all variables
- Used wrong template
- Missed conditional sections

**Solutions**:
1. Search entire project for `{{`
2. Replace all instances systematically
3. Check conditional sections properly handled
4. Use find-and-replace for efficiency
5. Run the validation script to find all remaining placeholders:
   ```bash
   ./validate.sh
   ```

---

## 🔍 Debugging Steps

### Step 1: Verify File Locations

```bash
# Check all required files exist
ls CLAUDE.md                  # Should exist
ls AGENTS.md                     # Should exist
ls tasks.yml                     # Should exist
ls -la .claude/agents/           # Should have subagent configs
ls -la docs/workflow/            # Should have workflow docs
```

### Step 2: Validate File Contents

```bash
# Check for remaining variables
grep -r "{{" CLAUDE.md AGENTS.md tasks.yml

# Should return nothing - if it does, replace those variables

# Or use the automated validation script:
./validate.sh
```

### Step 3: Test Agent Invocation

```
# In Cursor, test manual invocation:
"Use the code-reviewer subagent to review [file]"

# Should activate and use project context
```

---

## 💡 Quick Fixes

### Fix: Generic Advice from Agents

Add to `CLAUDE.md`:
```markdown
## Project-Specific Patterns

[Your specific patterns with examples]
```

### Fix: Subagent Won't Activate

Update subagent description:
```markdown
---
description: [Description]. Use proactively when [specific scenario].
---
```

### Fix: Task Context Ignored

Add to `CLAUDE.md`:
```markdown
### Task Files and Task-Driven Development

Tasks are in `tasks/*.yml`. Always:
1. Read task description and acceptance_criteria
2. Check agent_roles to verify your role
3. Reference spec_refs for requirements
```

---

## 🔗 Related Documentation

- [SETUP_GUIDE.md](../SETUP_GUIDE.md)
- [CUSTOMIZATION_GUIDE.md](./CUSTOMIZATION_GUIDE.md)
- [FAQ.md](./FAQ.md)

---

**Still Having Issues?** See [FAQ.md](./FAQ.md)
