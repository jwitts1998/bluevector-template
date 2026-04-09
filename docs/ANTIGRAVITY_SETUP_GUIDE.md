# Antigravity IDE Setup Guide

Antigravity IDE is the primary IDE for BlueVector AI projects. This guide covers installation, configuration, and integration with the multi-agent development system.

## Installation

Download Antigravity IDE from the official source and install it on your system.

## Skills Installation

BlueVector AI integrates with **Antigravity Awesome Skills** — a collection of 946+ agentic skills that enhance AI-assisted development.

### Quick Install

```bash
# From your project root
./scripts/install-antigravity-skills.sh
```

### Install Options

```bash
# Project-level (default)
./scripts/install-antigravity-skills.sh

# User-level (available across all projects)
./scripts/install-antigravity-skills.sh --global

# Target a specific project
./scripts/install-antigravity-skills.sh --project /path/to/project

# Custom path
./scripts/install-antigravity-skills.sh --path /custom/path
```

### Using Skills

After installation, skills are available via `@skill-name` in your AI chat:

- `@brainstorming` — Structured brainstorming sessions
- `@test-driven-development` — TDD workflow guidance
- `@code-review` — Comprehensive code review
- `@architecture` — Architecture design patterns
- `@debugging` — Systematic debugging approach

Browse all available bundles: [Antigravity Awesome Skills Bundles](https://github.com/sickn33/antigravity-awesome-skills/blob/main/docs/BUNDLES.md)

## Project Configuration

The `.antigravity/settings.json` file configures Antigravity IDE for your project:

```json
{
  "name": "BlueVector AI Project",
  "description": "GCP consulting toolkit with multi-agent development system",
  "ide": {
    "defaultModel": "gemini-2.5-pro",
    "skills": {
      "enabled": true,
      "directory": ".claude/skills"
    }
  },
  "extensions": {
    "recommended": [
      "google-cloud-tools",
      "firebase-tools",
      "docker",
      "terraform"
    ]
  }
}
```

## Recommended Extensions

Install these extensions for the best GCP development experience:

- **Google Cloud Tools** — gcloud CLI integration, Cloud Run deployment
- **Firebase Tools** — Firebase project management, Firestore viewer
- **Docker** — Container management and Dockerfile support
- **Terraform** — HCL syntax highlighting and validation
- **GitLens** — Git history and blame annotations

## Integration with Claude Code

BlueVector AI projects work with both Antigravity IDE and Claude Code:

- **Subagents** (`.claude/agents/`) work in both environments
- **MCP servers** (`.mcp.json`) are shared across IDEs
- **Rules** (`.claude/rules/`) are loaded automatically
- **Skills** (`.claude/skills/`) are available in both

## Troubleshooting

### Skills not loading
1. Verify skills directory exists: `ls .claude/skills/`
2. Re-run installation: `./scripts/install-antigravity-skills.sh`
3. Restart Antigravity IDE

### Extension conflicts
If extensions conflict with Antigravity's built-in features, disable the conflicting extension and rely on Antigravity's native support.
