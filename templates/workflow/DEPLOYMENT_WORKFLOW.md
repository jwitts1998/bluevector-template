# Deployment Workflow

**Date**: February 2026
**Status**: Active

## Overview

This document defines the environment promotion process, deployment gates, and rollback procedures for {{PROJECT_NAME}}. It connects the task system's `envs` field to concrete deployment actions.

---

## Environments

| Environment | Purpose | Branch | URL Pattern | Who Deploys |
|-------------|---------|--------|-------------|-------------|
| `dev` | Active development and integration testing | Feature branches / `main` | `dev.{{DOMAIN}}` | Automated on merge to `main` |
| `staging` | Pre-production validation, UAT, final QA | `main` (tagged release candidate) | `staging.{{DOMAIN}}` | Manual promotion or automated on RC tag |
| `prod` | Live production | `main` (tagged release) | `{{DOMAIN}}` | Manual approval required |

### Environment Expectations

**dev**:
- Latest code from `main` (or feature branch for preview environments)
- May be unstable — breakage is acceptable
- Uses development-grade infrastructure (smaller instances, relaxed rate limits)
- Test data and seed data are acceptable
- Debug logging enabled

**staging**:
- Mirrors production configuration as closely as possible
- Uses production-like infrastructure (same services, similar sizing)
- Uses anonymized or synthetic production-like data — never real user data
- Production logging levels
- All integrations point to sandbox/test endpoints (payment providers, email, etc.)

**prod**:
- Live user traffic
- Production infrastructure with auto-scaling, CDN, monitoring
- Real integrations (payment, email, analytics)
- Structured logging with alerting
- Zero tolerance for test data or debug flags

---

## Promotion Process

```
Feature branch → PR → main → dev → staging → prod
                              ↑         ↑         ↑
                         auto-deploy  gate 1    gate 2
```

### Step 1: Feature Development

1. Agent works on a feature branch (see GIT_BRANCHING_STRATEGY.md)
2. All acceptance criteria from the task file are met
3. Task `envs` field determines which environments the feature targets
4. PR created, code review passes

### Step 2: Merge to main (auto-deploys to dev)

1. PR merged to `main`
2. CI pipeline runs: lint, test, build
3. If CI passes, auto-deploy to `dev` environment
4. Smoke tests run against `dev`

### Step 3: Promote to staging (Gate 1)

**Prerequisites** (all must pass):
- [ ] All CI checks green on `main`
- [ ] Smoke tests pass in `dev`
- [ ] No critical bugs open against the release candidate
- [ ] Database migrations tested in `dev` successfully
- [ ] Feature flags configured for gradual rollout (if applicable)

**Process**:
1. Create a release candidate tag: `git tag -a vX.Y.Z-rc.N -m "Release candidate"`
2. Deploy to `staging` (automated on RC tag, or manual trigger)
3. Run staging smoke tests and integration tests
4. Perform UAT: stakeholders validate against acceptance criteria
5. Update task status: tasks verified in staging get `envs` updated to include `staging`

### Step 4: Promote to production (Gate 2)

**Prerequisites** (all must pass):
- [ ] Staging smoke tests pass
- [ ] UAT sign-off received (if applicable)
- [ ] No open P0/P1 bugs against the release
- [ ] Rollback plan documented and tested
- [ ] Monitoring and alerting confirmed operational
- [ ] Database migration rollback path verified
- [ ] On-call or responsible party identified for the deployment window

**Process**:
1. Create release tag: `git tag -a vX.Y.Z -m "Release vX.Y.Z"`
2. Deploy to production (manual trigger with approval)
3. Run production smoke tests
4. Monitor error rates, latency, and key metrics for 15-30 minutes
5. If metrics are healthy, deployment is complete
6. Update task status: tasks in the release get `envs` updated to include `prod` and `status: done`

---

## Smoke Tests

Each environment should have a smoke test suite that validates core functionality.

### Minimum Smoke Test Coverage

| Test | dev | staging | prod |
|------|-----|---------|------|
| Health check endpoint responds 200 | Yes | Yes | Yes |
| Database connection healthy | Yes | Yes | Yes |
| Authentication flow works | Yes | Yes | Yes |
| Core business operation completes | Yes | Yes | Yes |
| Third-party integrations respond | — | Sandbox | Live |
| Background jobs processing | — | Yes | Yes |

### Smoke Test Timing

- **dev**: Automated, runs after every deploy. Failures logged but don't block.
- **staging**: Automated, runs after deploy. Failures block promotion to prod.
- **prod**: Automated, runs after deploy. Failures trigger rollback evaluation.

---

## Rollback Procedures

### Automated Rollback Triggers

Roll back automatically if any of these occur within 30 minutes of deployment:
- Error rate exceeds 2x the pre-deployment baseline
- P50 latency exceeds 3x the pre-deployment baseline
- Health check endpoint returns non-200 for 3 consecutive checks
- Critical alert fires from monitoring system

### Manual Rollback Process

1. **Decide**: Confirm rollback is necessary (not a transient issue)
2. **Execute**: Redeploy the previous known-good version
   - Option A (preferred): `git revert` the merge commit and deploy
   - Option B: Redeploy the previous tagged release
   - Option C: Feature flag — disable the problematic feature without redeploying
3. **Verify**: Run smoke tests against the rolled-back version
4. **Communicate**: Notify stakeholders of the rollback and reason
5. **Document**: Add a note to the task file explaining the rollback and root cause
6. **Fix forward**: Create a new task for the fix, don't re-merge the broken code

### Database Migration Rollback

- Every migration must have a reversible `down` migration
- Test `down` migrations in `dev` before promoting to `staging`
- If a migration cannot be reversed (e.g., column deletion), use a multi-phase approach:
  1. Phase 1: Deploy code that works with both old and new schema
  2. Phase 2: Run the migration
  3. Phase 3: Deploy code that only uses the new schema
- Never delete data in the same release that adds the feature consuming it

---

## Task Integration

The `envs` field in task files tracks which environments a feature has been deployed to and verified in.

### How `envs` Relates to Deployment

```yaml
# Task starts targeting dev only
- id: AUTH_T1_login
  status: in_progress
  envs: [dev]

# After staging verification
- id: AUTH_T1_login
  status: in_progress
  envs: [dev, staging]

# After production deployment and verification
- id: AUTH_T1_login
  status: done
  envs: [dev, staging, prod]
```

### Rules

- A task's `status` should not be `done` until it is verified in all target environments
- The `defaults.envs` in a task file sets the starting target — typically `[dev]`
- Tasks with `envs: [dev]` only need dev verification (e.g., internal tooling, dev-only features)
- Tasks targeting production must pass through all three environments in order

---

## Deployment Checklist

Use this checklist before any staging or production deployment.

### Pre-Deployment

- [ ] All CI checks pass
- [ ] Smoke tests pass in the source environment
- [ ] Database migrations reviewed and tested
- [ ] Environment variables and secrets configured in target environment
- [ ] Feature flags set to appropriate state
- [ ] Rollback plan identified (revert commit, previous tag, or feature flag)
- [ ] Monitoring dashboards open and baseline metrics noted
- [ ] On-call or responsible party confirmed

### Post-Deployment

- [ ] Smoke tests pass in the target environment
- [ ] Error rates within normal range
- [ ] Latency within normal range
- [ ] Key business metrics unaffected (sign-ups, purchases, etc.)
- [ ] No new critical alerts
- [ ] Task files updated with environment status

---

## Related Documentation

- **[GIT_BRANCHING_STRATEGY.md](GIT_BRANCHING_STRATEGY.md)**: Branch naming, CI/CD triggers, environment-branch mapping
- **[RELEASE_MANAGEMENT.md](RELEASE_MANAGEMENT.md)**: Versioning, changelogs, tagging conventions
- **[TASK_LIFECYCLE_EXAMPLE.md](TASK_LIFECYCLE_EXAMPLE.md)**: How tasks move through statuses
- **`docs/CLAUDE_CODE_CAPABILITIES.md`**: Available MCP tools and skills for deployment automation
