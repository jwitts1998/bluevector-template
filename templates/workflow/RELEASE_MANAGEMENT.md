# Release Management

**Date**: February 2026
**Status**: Active

## Overview

This document defines the versioning strategy, changelog conventions, tagging practices, and release checklist for {{PROJECT_NAME}}. It ensures consistent, traceable releases that connect task completion to deployed artifacts.

---

## Versioning Strategy

Use [Semantic Versioning](https://semver.org/) (SemVer): `MAJOR.MINOR.PATCH`

| Component | When to increment | Example |
|-----------|-------------------|---------|
| **MAJOR** | Breaking changes to public APIs, data model changes requiring migration, removal of features | `1.0.0` → `2.0.0` |
| **MINOR** | New features, non-breaking additions, significant enhancements | `1.0.0` → `1.1.0` |
| **PATCH** | Bug fixes, security patches, minor corrections | `1.0.0` → `1.0.1` |

### Pre-Release Tags

| Tag | Purpose | Example |
|-----|---------|---------|
| `-rc.N` | Release candidate — staging validation | `1.2.0-rc.1` |
| `-beta.N` | Beta — feature-complete but not fully validated | `1.2.0-beta.1` |
| `-alpha.N` | Alpha — incomplete, for early testing | `1.2.0-alpha.1` |

### Version Lifecycle

```
Development → alpha → beta → rc → release
                                    ↓
                              patch (if needed)
```

For most projects, skip alpha/beta and go directly from development to release candidate:

```
feature branches → main → vX.Y.Z-rc.1 → vX.Y.Z
```

---

## Tagging Conventions

### Creating Tags

```bash
# Release candidate
git tag -a v1.2.0-rc.1 -m "Release candidate 1 for v1.2.0"

# Production release
git tag -a v1.2.0 -m "Release v1.2.0 — User profile management"

# Hotfix
git tag -a v1.2.1 -m "Hotfix: fix token expiry race condition"
```

### Tag Rules

- Tags are always on `main` branch
- Tags are annotated (not lightweight) — use `git tag -a`
- Tag messages include a brief summary of what the release contains
- Tags are immutable — never delete and recreate a tag; if a mistake is made, increment the version
- Push tags explicitly: `git push origin v1.2.0`

---

## Changelog

Maintain a `CHANGELOG.md` in the project root. Follow [Keep a Changelog](https://keepachangelog.com/) conventions.

### Format

```markdown
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added
- Feature descriptions go here as they are merged to main

## [1.2.0] - 2026-02-25

### Added
- User profile management with avatar upload (#AUTH_T3)
- Email notification preferences (#NOTIF_T1)

### Changed
- Improved token refresh flow for better reliability (#AUTH_T5)

### Fixed
- Race condition in concurrent session handling (#AUTH_T7)

### Security
- Updated dependency X to address CVE-YYYY-NNNNN

## [1.1.0] - 2026-02-10

### Added
- ...
```

### Change Categories

| Category | When to use |
|----------|------------|
| **Added** | New features and capabilities |
| **Changed** | Changes to existing functionality |
| **Deprecated** | Features that will be removed in a future version |
| **Removed** | Features that have been removed |
| **Fixed** | Bug fixes |
| **Security** | Vulnerability patches and security improvements |

### Changelog Rules

- Write entries from the user's perspective, not the developer's
- Reference task IDs so entries trace back to the task system
- Update `[Unreleased]` as features merge to `main` — don't batch at release time
- Move `[Unreleased]` entries to a versioned section when cutting a release
- Every `MAJOR` and `MINOR` release must have a changelog entry; `PATCH` should as well

---

## Release Process

### Regular Release (MINOR or MAJOR)

1. **Prepare**
   - Review `[Unreleased]` section in CHANGELOG.md
   - Verify all tasks included in the release have `status: done` and `envs` includes `staging`
   - Confirm no open P0/P1 bugs against the release scope

2. **Cut the release candidate**
   ```bash
   # Update CHANGELOG.md: move [Unreleased] to [X.Y.Z] with today's date
   # Commit the changelog update
   git add CHANGELOG.md
   git commit -m "docs: prepare changelog for vX.Y.Z"
   
   # Tag the release candidate
   git tag -a vX.Y.Z-rc.1 -m "Release candidate 1 for vX.Y.Z"
   git push origin main --tags
   ```

3. **Validate in staging**
   - Deploy the RC to staging (see DEPLOYMENT_WORKFLOW.md)
   - Run smoke tests and integration tests
   - Perform UAT if required
   - If issues are found, fix on `main`, re-tag as `-rc.2`, `-rc.3`, etc.

4. **Release to production**
   ```bash
   # Tag the release (same commit as the passing RC)
   git tag -a vX.Y.Z -m "Release vX.Y.Z — <summary>"
   git push origin --tags
   ```
   - Deploy to production (see DEPLOYMENT_WORKFLOW.md, Gate 2)
   - Monitor metrics for 15-30 minutes

5. **Finalize**
   - Update task files: set `envs: [dev, staging, prod]` and `status: done`
   - Create a GitHub release (if using GitHub) with changelog entries as the body
   - Notify stakeholders

### Hotfix Release (PATCH)

Hotfixes bypass the normal RC cycle when a critical issue is found in production.

1. **Fix on main**
   - Create a branch: `fix/critical-issue-description`
   - Implement the fix with tests
   - PR and merge to `main`

2. **Tag and deploy**
   ```bash
   # Update CHANGELOG.md with the fix
   git add CHANGELOG.md
   git commit -m "docs: changelog for vX.Y.Z"
   git tag -a vX.Y.Z -m "Hotfix: <description>"
   git push origin main --tags
   ```
   - Deploy to staging, verify smoke tests pass
   - Deploy to production immediately after staging verification
   - Monitor closely

3. **Create a task** for the hotfix retroactively (if one doesn't exist) to maintain task traceability

---

## Release Checklist

Copy this checklist into your release notes or PR.

### Pre-Release

- [ ] All tasks in release scope have `status: done`
- [ ] CHANGELOG.md updated with all changes
- [ ] Version numbers updated in relevant files (package.json, setup.py, etc.)
- [ ] All CI checks pass on `main`
- [ ] No open P0/P1 bugs against this release
- [ ] Database migrations reviewed and reversible
- [ ] Breaking changes documented (MAJOR releases)
- [ ] Deprecation notices added (if applicable)

### Release Candidate

- [ ] RC tag created and pushed
- [ ] Deployed to staging successfully
- [ ] Smoke tests pass in staging
- [ ] UAT sign-off received (if required)
- [ ] Performance benchmarks acceptable (no regressions)

### Production Release

- [ ] Release tag created and pushed
- [ ] Deployed to production successfully
- [ ] Production smoke tests pass
- [ ] Error rates within baseline
- [ ] Latency within baseline
- [ ] Key business metrics unaffected
- [ ] GitHub release created (if applicable)
- [ ] Stakeholders notified

### Post-Release

- [ ] Task files updated with final `envs` and `status`
- [ ] Monitoring confirmed stable for 24 hours
- [ ] CHANGELOG.md `[Unreleased]` section reset for next cycle
- [ ] Retrospective notes captured (if issues occurred)

---

## Related Documentation

- **[DEPLOYMENT_WORKFLOW.md](DEPLOYMENT_WORKFLOW.md)**: Environment promotion, deployment gates, rollback
- **[GIT_BRANCHING_STRATEGY.md](GIT_BRANCHING_STRATEGY.md)**: Branch naming, CI/CD triggers
- **[TASK_LIFECYCLE_EXAMPLE.md](TASK_LIFECYCLE_EXAMPLE.md)**: How tasks move through statuses
