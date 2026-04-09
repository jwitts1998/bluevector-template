# Frequently Asked Questions

**Version**: 1.0.0  
**Last Updated**: January 2026

## 🎯 General Questions

### Q: What is a multi-agent development system?

**A**: A system where specialized AI agents collaborate on different aspects of development (implementation, design, testing, quality assurance) using shared project context and task tracking.

### Q: Do I need to use all the templates?

**A**: No. Use what makes sense for your project:
- Minimum: `CLAUDE.md` + `AGENTS.md`
- Recommended: Above + task files + subagents
- Maximum: All templates for complete system

### Q: How long does setup take?

**A**: 
- Basic setup: 30 minutes
- Full customization: 2-3 hours
- Refinement: Ongoing as project evolves

---

## 🔄 Ingestion & Modernization Questions

### Q: What if I have existing code but no documentation?

**A**: Use the **Ingestion & Modernization workflow** (Path E or F in SETUP_GUIDE.md):
1. Run @codebase-auditor to analyze your code
2. Run @gap-analysis to identify issues
3. Run @documentation-backfill to generate PDB and TAD
4. Validate generated documentation
5. Set up standard multi-agent system

Timeline: 3-7 days depending on codebase complexity.

### Q: Can this work with code from Replit, Bolt, or V0?

**A**: Yes! Use **Path F: MVP/Prototype Import**:
- Import your MVP code
- Run ingestion agents (auditor → gap analysis → backfill)
- Get a modernization roadmap prioritizing security and infrastructure
- Use multi-agent system to execute hardening

This is specifically designed for rapid-prototype tools that need production hardening.

### Q: What's the difference between Codebase Auditor and Gap Analysis?

**A**:
- **Codebase Auditor**: Documents what EXISTS in code (architecture, data models, APIs)
- **Gap Analysis**: Identifies what's MISSING for production (security issues, infrastructure gaps, test coverage)

Run Auditor first, then Gap Analysis uses that output.

### Q: How accurate is auto-generated documentation?

**A**: Depends on code quality:
- **Well-structured code**: 70-85% accurate, needs validation and business context
- **MVP/prototype code**: 60-75% accurate, more inference required
- **Legacy code**: 50-70% accurate, more ambiguity

ALWAYS validate generated docs. AI can extract structure but needs human input for:
- Business reasoning (WHY decisions were made)
- Product context (target users, use cases)
- Future vision and roadmap

### Q: Do I need to use ingestion agents for a greenfield project?

**A**: No. Ingestion agents are only for:
- Path D: Existing code with docs but no PDB
- Path E: Existing code with minimal/no documentation
- Path F: MVP/prototype imports

For greenfield (Path A) or design-first (Path B), skip ingestion and use standard setup.

### Q: Can I run ingestion agents periodically to keep docs updated?

**A**: Yes! Use @documentation-backfill iteratively:
- After major refactors
- When architecture changes
- Quarterly as maintenance

But prefer incremental updates using doc-generator subagent for individual files.

---

## 🔧 Setup Questions

### Q: Which template should I use?

**A**: Based on project type:
- Mobile app → `mobile-appCLAUDE.md` + `AGENTS-mobile.md`
- Web app → `web-appCLAUDE.md` + `AGENTS-web.md`
- Backend → `backend-serviceCLAUDE.md` + `AGENTS-backend.md`
- Full-stack → `full-stack.md` + `AGENTS-full-stack.md`

### Q: Can I mix templates?

**A**: Yes! Start with closest match, then add sections from others as needed.

### Q: Do I need to replace ALL variables?

**A**: Yes. Search for `{{` to find remaining variables. Replace or remove them.

---

## 🤖 Agent Questions

### Q: How do agents know what to do?

**A**: Agents read:
1. `CLAUDE.md` - Project context and standards
2. `AGENTS.md` - Their specific responsibilities
3. `tasks/*.yml` - Specific work items
4. Subagent configs - Specialized guidance

### Q: Can I create custom agents?

**A**: Yes! Add new agent roles to `AGENTS.md` and create corresponding subagent configs.

### Q: What if agents give conflicting advice?

**A**: 
1. Prioritize specialist over generic (e.g., flutter-specialist > general)
2. Clarify responsibilities in `AGENTS.md`
3. Use sequential workflow to avoid conflicts

---

## 📋 Task Questions

### Q: Do I need task files?

**A**: Recommended but not required. Task files integrate agents with your workflow and provide context.

### Q: How detailed should tasks be?

**A**: Include:
- Clear `description`
- Specific `acceptance_criteria`
- `spec_refs` to requirements
- `agent_roles` for multi-agent work

### Q: Can I use other task tracking tools?

**A**: Yes. You can:
- Use YAML tasks as supplementary to Jira/GitHub Issues
- Generate YAML from your existing system
- Use task format as documentation only

---

## 🔄 Workflow Questions

### Q: What's the difference between sequential and parallel workflows?

**A**:
- **Sequential**: Agents work one after another (design → implement → test)
- **Parallel**: Agents work simultaneously on independent tasks

Use sequential for single features, parallel for independent work.

### Q: How do agents hand off work?

**A**: Via task notes and status updates:
```yaml
# Agent A completes work
status: in_progress
notes: "Implementation Agent: Feature complete. Ready for QA."

# Agent B takes over
notes: "QA Agent: Review complete. Ready for Testing Agent."
```

---

## 🎨 Customization Questions

### Q: Can I add custom sections to `CLAUDE.md`?

**A**: Yes! Add sections as needed:
```markdown
## Custom Section for {{PROJECT_NAME}}

[Your content]
```

### Q: How much should I customize?

**A**: Start minimal, add as needed:
- Day 1: Replace variables
- Week 1: Add project-specific patterns
- Month 1: Refine based on usage

### Q: Can I use this with non-Claude Code CLIs?

**A**: Templates are Cursor-optimized but principles apply to any AI assistant. You may need to adapt the format.

---

## 🧪 Testing Questions

### Q: Do agents write tests automatically?

**A**: The `test-writer` subagent can suggest/create tests when invoked or when it detects missing tests.

### Q: What test coverage should I target?

**A**: Common targets:
- Business logic: 90-100%
- UI components: 70-80%
- Integration tests: Critical paths
- Overall: 80%+ recommended

---

## 📚 Documentation Questions

### Q: Do I need to document everything?

**A**: Focus on:
- Complex business logic
- Architecture decisions
- Public APIs
- Non-obvious patterns

The `doc-generator` subagent helps with this.

### Q: Where should documentation live?

**A**: 
- Code docs: Inline (JSDoc, Dartdoc, etc.)
- Feature docs: `docs/features/`
- Architecture docs: `docs/architecture/`
- API docs: `docs/api/`

---

## 🔐 Security Questions

### Q: Are there security considerations?

**A**: Yes:
- Never commit secrets or API keys
- Review `security-auditor` subagent recommendations
- Follow security section in `CLAUDE.md`
- Regular security audits

### Q: Will agents expose sensitive data?

**A**: No, if you:
- Don't hardcode secrets in code
- Use `.gitignore` for sensitive files
- Follow security best practices
- Review code before committing

---

## 🚀 Performance Questions

### Q: Does this slow down development?

**A**: Initial setup takes time, but then:
- Faster code reviews (automatic)
- Better consistency (agents follow standards)
- Fewer bugs (multiple perspectives)
- Faster onboarding (documented patterns)

Net result: Faster long-term development.

### Q: Do agents make mistakes?

**A**: Yes, agents are assistants, not replacements. Always:
- Review agent output
- Verify against requirements
- Run tests
- Use judgment

---

## 🔄 Maintenance Questions

### Q: How often should I update templates?

**A**: 
- Weekly: Update task files
- Monthly: Review agent effectiveness
- Quarterly: Update `CLAUDE.md` and `AGENTS.md`
- As needed: Add new patterns and subagents

### Q: What if my project changes significantly?

**A**: Update templates to reflect:
- New architecture patterns
- Additional tech stack
- New team members/roles
- Lessons learned

---

## 💡 Best Practices

### Q: What are the most important things to get right?

**A**:
1. **Replace all variables** in templates
2. **Make `CLAUDE.md` specific** to your project
3. **Use task files** for context
4. **Review agent output** - don't blindly accept
5. **Iterate and refine** based on usage

### Q: How do I know if it's working?

**A**: Success indicators:
- ✅ Agents follow project patterns
- ✅ Code reviews happen automatically
- ✅ Fewer bugs reach production
- ✅ Consistent code quality
- ✅ Faster feature development

---

## 🆘 Getting Help

### Still stuck?

1. Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
2. Review [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)
3. Look at [examples/](../examples/) for reference
4. Review [SETUP_GUIDE.md](../SETUP_GUIDE.md) again

---

**Questions not answered here?** Consider contributing to this FAQ!
