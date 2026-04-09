# Git Branching Strategy

**Date**: February 2026  
**Status**: Active

## Overview

Branch conventions for multi-agent development. Features get isolated branches; agents work on branches to keep `main` stable.

---

## Branch Naming

| Prefix | Purpose | Example |
|--------|---------|---------|
| `feature/` | New features and enhancements | `feature/auth-module` |
| `fix/` | Bug fixes | `fix/token-expiry-race` |
| `refactor/` | Code restructuring | `refactor/db-layer` |
| `docs/` | Documentation only | `docs/api-reference` |
| `chore/` | Tooling, deps, config | `chore/upgrade-deps` |
| `experiment/` | Exploratory work, spikes | `experiment/vector-search` |

Use lowercase, hyphens for spaces. Keep names short but descriptive.

---

## Workflow

### Feature Development

```
main
  └── feature/auth-module    ← agent works here
        ├── commit: feat: add auth service
        ├── commit: feat: add token rotation
        ├── commit: test: auth module tests
        └── PR → main
```

1. **Create branch** from `main`: `git checkout -b feature/<name>`
2. **Implement** on the branch — commit early and often
3. **PR** when acceptance criteria are met
4. **Review** — QA agent reviews on the same branch
5. **Merge** to `main` via squash or merge commit

### Multi-Agent on One Feature

When multiple agents work on the same feature sequentially:

```
feature/user-dashboard
  ├── [Implementation Agent] feat: dashboard components
  ├── [Implementation Agent] feat: data fetching layer
  ├── [QA Agent] fix: address review findings
  ├── [Testing Agent] test: dashboard integration tests
  └── [Documentation Agent] docs: dashboard usage guide
```

All agents commit to the same feature branch. Handoff notes go in commit messages or task file notes.

### Parallel Features

Independent features get independent branches. Merge conflicts are resolved when PRing to `main`.

```
main
  ├── feature/auth-module      ← Agent A
  ├── feature/user-dashboard   ← Agent B
  └── feature/notification-api ← Agent C
```

---

## Commit Message Convention

```
<type>: <short description>

[optional body]
```

**Types**: `feat`, `fix`, `test`, `docs`, `refactor`, `chore`, `perf`, `security`

Examples:
- `feat: implement JWT auth with refresh rotation`
- `fix: handle expired token edge case`
- `test: add auth service unit tests`
- `refactor: extract token validation to service`

---

## Rules

- **Never push directly to `main`** — always use a feature branch + PR
- **Never force-push to shared branches** unless coordinated
- **Delete branches after merge** — keep the branch list clean
- **One feature per branch** — don't mix unrelated changes
- **Rebase or merge from `main`** before PR to avoid stale conflicts

---

## Environment-Branch Mapping

Branches map to environments for deployment purposes:

| Branch / Ref | Deploys to | Trigger | Approval |
|-------------|-----------|---------|----------|
| Feature branches | Preview env (optional) | Push | None |
| `main` | `dev` | Merge/push | None (auto-deploy) |
| `vX.Y.Z-rc.N` tag | `staging` | Tag creation | None or manual trigger |
| `vX.Y.Z` tag | `prod` | Tag creation | Manual approval required |

```
feature/auth-module ──PR──► main ──auto──► dev
                                              │
                              vX.Y.Z-rc.1 tag ──► staging
                                              │
                                  vX.Y.Z tag ──► prod (manual approval)
```

### Preview Environments (Optional)

For projects that support it, create ephemeral preview environments per PR. This lets reviewers test features in isolation before merge.

- Preview environments are created on PR open, destroyed on PR close/merge
- URL pattern: `pr-{number}.preview.{{DOMAIN}}`
- Keep preview environments small (no background workers, minimal data)

---

## CI/CD Trigger Points

### On Every Push to a Feature Branch

```
push → lint → test (unit) → build
```

- Fast feedback loop — should complete in under 5 minutes
- Fail the PR check if any step fails
- Cache dependencies between runs

### On PR Creation / Update

```
push → lint → test (unit + integration) → build → preview deploy (optional)
```

- Full test suite including integration tests
- Build produces the deployment artifact
- Optional: deploy to a preview environment
- Required status checks must pass before merge is allowed

### On Merge to `main`

```
merge → lint → test (full) → build → deploy to dev → smoke test
```

- Full CI pipeline re-runs against `main` (not just the branch)
- On success, auto-deploy to `dev` environment
- Run smoke tests against `dev`
- If smoke tests fail, alert the team (do not auto-rollback dev)

### On Release Candidate Tag (`vX.Y.Z-rc.N`)

```
tag → build (from tag) → deploy to staging → smoke test → integration test
```

- Build from the tagged commit (same artifact as dev if using immutable builds)
- Deploy to `staging`
- Run full smoke test and integration test suite
- If tests fail, do not promote — fix and re-tag as `rc.N+1`

### On Release Tag (`vX.Y.Z`)

```
tag → manual approval → deploy to prod → smoke test → monitor
```

- Requires manual approval before deployment starts
- Deploy the same artifact that passed staging
- Run production smoke tests
- Monitor error rates and latency for 15-30 minutes
- Auto-rollback if error thresholds are exceeded (see DEPLOYMENT_WORKFLOW.md)

---

## Branch Protection

Configure branch protection rules to enforce quality gates.

### `main` Branch Protection

| Rule | Setting | Rationale |
|------|---------|-----------|
| Require PR before merging | Yes | No direct pushes — all changes go through review |
| Required status checks | lint, test, build | CI must pass before merge |
| Require review approval | 1+ approval (or QA agent sign-off) | Code review before merge |
| Dismiss stale reviews on new push | Yes | Re-review after changes |
| Require branches to be up to date | Yes | Prevents merge conflicts in CI |
| Restrict force pushes | Yes | Protect commit history |
| Restrict deletions | Yes | Prevent accidental branch deletion |

### Tag Protection

| Rule | Setting | Rationale |
|------|---------|-----------|
| Restrict tag creation | Authorized users / CI only | Prevent accidental releases |
| Require signed tags | Recommended for prod | Verify tag authenticity |

### Feature Branch Conventions

Feature branches are not protected (agents need freedom to push), but follow these conventions:

- Prefix determines the type of work (see Branch Naming above)
- Delete after merge — stale branches create confusion
- Force-push is allowed on your own feature branch (for rebasing) but never on shared branches

---

## Agent Integration

Tasks in `tasks/*.yml` should reference their branch:

```yaml
- id: AUTH_T1_jwt_module
  title: "Implement JWT authentication"
  status: in_progress
  branch: "feature/auth-module"
  agent_roles: [implementation, quality_assurance, testing]
```

The `branch` field helps agents know where to work and helps the execution monitor track which branches are active.

---

## Related Documentation

- **[DEPLOYMENT_WORKFLOW.md](DEPLOYMENT_WORKFLOW.md)**: Environment promotion process, deployment gates, rollback procedures
- **[RELEASE_MANAGEMENT.md](RELEASE_MANAGEMENT.md)**: Versioning strategy, changelog conventions, tagging
- **[MULTI_AGENT_WORKFLOW.md](MULTI_AGENT_WORKFLOW.md)**: How agents collaborate on branches
