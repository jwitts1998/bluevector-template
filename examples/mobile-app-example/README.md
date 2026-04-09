# Mobile App Example — FitTracker

A complete walkthrough of using the multi-agent system template for a **net-new mobile app idea**, from clone to development.

## The Idea

"I want to build a fitness tracking app for iOS and Android — workout plans, progress tracking, social accountability."

## Step 1: Clone and Setup

```bash
git clone https://github.com/jwitts1998/multi-agent-system-template.git fittracker
cd fittracker
./setup.sh
```

**Setup answers**:

| Prompt | Value |
|--------|-------|
| Project name | FitTracker |
| One-line description | Fitness tracking mobile app for iOS and Android |
| Project type | mobile-app |
| Primary language | Dart |
| Framework | Flutter |
| State management | Riverpod |
| Architecture | Clean Architecture |
| Test framework | Flutter Test |
| Test coverage target | 80 |
| Remove template files? | y |

After setup, the repo looks like:

```
fittracker/
├── CLAUDE.md                       # Configured for Flutter/Dart/Riverpod
├── AGENTS.md                          # Mobile-specific agent roles
├── tasks.yml                          # Portfolio-level tracking
├── tasks/
│   └── feature-task-template.yml      # Template for creating feature tasks
├── docs/
│   ├── product_design/                # PDB goes here (empty, ready for step 2)
│   └── architecture/
├── .claude/
│   └── agents/
│       ├── generic/                   # code-reviewer, debugger, designer, etc.
│       ├── ideation/                  # idea-to-pdb, pdb-to-tasks
│       └── specialists/
│           └── flutter-specialist.md
├── setup.sh
├── validate.sh
└── templates/                         # Source reference (can remove later)
```

Verify setup:

```bash
./validate.sh
```

## Step 2: Flush the Idea

Open the project in Claude Code and invoke the ideation agent:

```
idea-to-pdb subagent

I want to build a fitness tracking app called FitTracker for iOS and Android.

Core idea: Users can log workouts, follow preset or custom workout plans,
track progress over time (weight, reps, personal records), and connect
with friends for social accountability.

Target users: Casual gym-goers who want structure without complexity.
Success in 30 days: Working prototype with workout logging and basic progress charts.
Constraints: Flutter, Firebase backend, solo developer.
MVP first.
```

The agent asks clarifying questions, explores the idea, and produces a **lightweight PDB** saved to:

```
docs/product_design/fittracker_pdb.md
```

The PDB covers: Executive Summary, Core Features (MVP/Phase 2/Future), Personas, User Journeys, Technical Architecture, Data Architecture, System Flows, and UX/UI Specification.

## Step 3: Create Tasks from the PDB

```
pdb-to-tasks subagent

Read docs/product_design/fittracker_pdb.md and decompose it into epics and task files.
```

The agent:
1. Summarizes the PDB and confirms understanding
2. Proposes an epic list — you approve or adjust
3. Generates task file outlines — you approve
4. Creates the full YAML files

Result:

```
tasks/
├── 00_phase0_build_prep.yml           # Repo setup, schema definitions, Firebase config
├── 01_user_onboarding.yml             # Auth, profile creation, onboarding flow
├── 02_workout_logging.yml             # Log workouts, exercise library, sets/reps
├── 03_progress_tracking.yml           # Charts, personal records, streaks
├── 04_workout_plans.yml               # Preset plans, custom plans, scheduling
└── 05_social_features.yml             # Friends, activity feed, challenges (Phase 2)
```

Each task file has `spec_refs` pointing back to PDB sections:

```yaml
epic: E02_Workout_Logging
feature: Core_Workout_Log

context:
  phase: 1
  spec_refs:
    - "PDB: docs/product_design/fittracker_pdb.md — Section 3.2: Workout Logging"
    - "PDB: docs/product_design/fittracker_pdb.md — Section 6: Data Architecture"

tasks:
  - id: E02_T1_define_workout_schema
    title: "Define workout data schema (schema-first)"
    type: chore
    status: todo
    priority: high
    agent_roles:
      - implementation
      - documentation
    spec_refs:
      - "PDB: docs/product_design/fittracker_pdb.md — Section 6: Data Architecture"
    description: >
      Define Firestore collections for workouts, exercises, sets.
      Create schema doc at docs/schemas/workout_schema.md.
    acceptance_criteria:
      - "Schema document created with all entities"
      - "Firestore collection structure defined"
      - "Relationships between workout, exercise, set documented"

  - id: E02_T2_implement_workout_service
    title: "Implement workout logging service"
    type: story
    status: todo
    priority: high
    agent_roles:
      - implementation
    spec_refs:
      - "PDB: docs/product_design/fittracker_pdb.md — Section 3.2: Workout Logging"
    description: >
      Create WorkoutService with CRUD operations for workouts.
      Follow Clean Architecture: data layer (Firestore) → domain → presentation.
    code_areas:
      - "lib/features/workout/data/services/workout_service.dart"
      - "lib/features/workout/data/models/"
    acceptance_criteria:
      - "User can create, read, update, delete workouts"
      - "Data persists to Firestore"
      - "Error handling for network failures"
    tests:
      - "Unit tests for WorkoutService"
    blocked_by:
      - E02_T1_define_workout_schema
    blocks:
      - E02_T3_workout_logging_ui
```

## Step 4: Begin Development

Select the first high-priority task:

```
Open tasks/00_phase0_build_prep.yml
Find task with status: todo and priority: high
```

Work through tasks using the multi-agent workflow:

```
1. Implementation Agent → implements the feature
2. code-reviewer → reviews code quality and architecture
3. flutter-specialist → provides Flutter-specific guidance
4. test-writer → creates tests
5. designer → reviews UI for Material 3 consistency
```

## Resulting Workflow

```
Clone repo
    ↓
./setup.sh (mobile-app, Flutter, Riverpod)
    ↓
idea-to-pdb subagent → docs/product_design/fittracker_pdb.md
    ↓
pdb-to-tasks subagent → tasks/00-05_*.yml
    ↓
Pick first task → implement → review → test → done
    ↓
Pick next task → repeat
```

## Success Metrics

- Implementation follows Clean Architecture
- Uses Material 3 design tokens consistently
- Works on both iOS and Android
- Test coverage > 80%
- All acceptance criteria met per task
- Code reviewed automatically after implementation
- No hardcoded values or secrets
