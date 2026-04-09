#!/usr/bin/env bash
set -euo pipefail

# BlueVector AI — Project Setup Script
# Converts this cloned template into a configured GCP project.

BOLD='\033[1m'
DIM='\033[2m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
CYAN='\033[0;36m'
RED='\033[0;31m'
NC='\033[0m'

print_header() {
  echo ""
  echo -e "${BOLD}${CYAN}═══════════════════════════════════════════════${NC}"
  echo -e "${BOLD}${CYAN}  BlueVector AI — Project Setup${NC}"
  echo -e "${BOLD}${CYAN}═══════════════════════════════════════════════${NC}"
  echo ""
}

print_step() {
  echo -e "\n${BOLD}${GREEN}[$1/$TOTAL_STEPS]${NC} ${BOLD}$2${NC}"
}

print_info() {
  echo -e "  ${DIM}$1${NC}"
}

print_success() {
  echo -e "  ${GREEN}✓${NC} $1"
}

print_warning() {
  echo -e "  ${YELLOW}!${NC} $1"
}

prompt() {
  local var_name=$1
  local prompt_text=$2
  local default=$3
  if [ -n "$default" ]; then
    echo -en "  ${BOLD}$prompt_text${NC} ${DIM}[$default]${NC}: "
    read -r input
    eval "$var_name=\"${input:-$default}\""
  else
    echo -en "  ${BOLD}$prompt_text${NC}: "
    read -r input
    eval "$var_name=\"$input\""
  fi
}

prompt_choice() {
  local var_name=$1
  local prompt_text=$2
  shift 2
  local options=("$@")

  echo -e "\n  ${BOLD}$prompt_text${NC}"
  for i in "${!options[@]}"; do
    echo -e "    ${CYAN}$((i+1)))${NC} ${options[$i]}"
  done
  echo -en "  ${BOLD}Choice${NC}: "
  read -r choice

  if [[ "$choice" =~ ^[0-9]+$ ]] && [ "$choice" -ge 1 ] && [ "$choice" -le "${#options[@]}" ]; then
    eval "$var_name=\"${options[$((choice-1))]}\""
  else
    echo -e "  ${RED}Invalid choice. Using first option.${NC}"
    eval "$var_name=\"${options[0]}\""
  fi
}

TOTAL_STEPS=7

print_header

# ─── Step 1: Collect project info ───────────────────────────────────────────

print_step 1 "Project Information"

prompt PROJECT_NAME "Project name" ""
while [ -z "$PROJECT_NAME" ]; do
  echo -e "  ${RED}Project name is required.${NC}"
  prompt PROJECT_NAME "Project name" ""
done

prompt PROJECT_DESCRIPTION "One-line description" ""

prompt_choice PROJECT_TYPE "Project type:" \
  "mobile-app" "web-app" "backend-service" "full-stack"

# ─── Step 2: Tech stack ─────────────────────────────────────────────────────

print_step 2 "Technology Stack"

case "$PROJECT_TYPE" in
  mobile-app)
    prompt PRIMARY_LANGUAGE "Primary language" "Dart"
    prompt FRAMEWORK "Framework" "Flutter"
    prompt STATE_MANAGEMENT "State management" "Riverpod"
    prompt ARCHITECTURE_PATTERN "Architecture" "Clean Architecture"
    DATABASE_TYPE="Firestore"
    ;;
  web-app)
    prompt PRIMARY_LANGUAGE "Primary language" "TypeScript"
    prompt FRAMEWORK "Framework" "React"
    prompt STATE_MANAGEMENT "State management" "Redux Toolkit"
    prompt ARCHITECTURE_PATTERN "Architecture" "Feature-First"
    DATABASE_TYPE="Cloud SQL (PostgreSQL)"
    ;;
  backend-service)
    prompt PRIMARY_LANGUAGE "Primary language" "TypeScript"
    prompt FRAMEWORK "Framework" "Express"
    prompt DATABASE_TYPE "Database" "Cloud SQL (PostgreSQL)"
    prompt ARCHITECTURE_PATTERN "Architecture" "Layered Architecture"
    STATE_MANAGEMENT="N/A"
    ;;
  full-stack)
    prompt PRIMARY_LANGUAGE "Primary language" "TypeScript"
    prompt FRAMEWORK "Framework" "Next.js"
    prompt STATE_MANAGEMENT "State management" "React Context"
    prompt DATABASE_TYPE "Database" "Cloud SQL (PostgreSQL)"
    prompt ARCHITECTURE_PATTERN "Architecture" "Feature-First"
    ;;
esac

prompt TEST_FRAMEWORK "Test framework" ""
prompt TEST_COVERAGE_TARGET "Test coverage target (%)" "80"

# ─── Step 3: GCP Configuration ─────────────────────────────────────────────

print_step 3 "GCP Configuration"

prompt GCP_PROJECT_ID "GCP Project ID" ""
prompt FIREBASE_PROJECT_ID "Firebase Project ID (or same as GCP)" "${GCP_PROJECT_ID}"
prompt GCP_REGION "Default GCP region" "us-central1"

# Write GCP config to .env
touch .env
cat >> .env <<EOF

# GCP Configuration
GCP_PROJECT_ID=${GCP_PROJECT_ID}
FIREBASE_PROJECT_ID=${FIREBASE_PROJECT_ID}
GCP_REGION=${GCP_REGION}
GOOGLE_APPLICATION_CREDENTIALS=./service-account.json
EOF
print_success "Added GCP configuration to .env"

# ─── Step 4: Copy templates to root ─────────────────────────────────────────

print_step 4 "Configuring project files"

CURSORRULES_SRC="templates/claude-config/${PROJECT_TYPE}.md"
AGENTS_SRC="templates/agents/AGENTS-${PROJECT_TYPE%%%-*}.md"

# Map project type to AGENTS template name
case "$PROJECT_TYPE" in
  mobile-app)  AGENTS_SRC="templates/agents/AGENTS-mobile.md" ;;
  web-app)     AGENTS_SRC="templates/agents/AGENTS-web.md" ;;
  backend-service) AGENTS_SRC="templates/agents/AGENTS-backend.md" ;;
  full-stack)  AGENTS_SRC="templates/agents/AGENTS-full-stack.md" ;;
esac

if [ -f "$CURSORRULES_SRC" ]; then
  cp "$CURSORRULES_SRC" CLAUDE.md
  print_success "Copied ${PROJECT_TYPE} CLAUDE.md → CLAUDE.md"
else
  print_warning "Template $CURSORRULES_SRC not found, keeping generic CLAUDE.md"
fi

if [ -f "$AGENTS_SRC" ]; then
  cp "$AGENTS_SRC" AGENTS.md
  print_success "Copied $(basename $AGENTS_SRC) → AGENTS.md"
else
  print_warning "Template $AGENTS_SRC not found, keeping generic AGENTS.md"
fi

# Set up directories
mkdir -p tasks docs/product_design docs/architecture docs/workflow \
  .claude/agents/generic .claude/agents/ideation .claude/agents/specialists \
  .claude/agents/ingestion .claude/rules .claude/skills

# Copy subagents — generic (always)
cp templates/subagents/generic/*.md .claude/agents/generic/ 2>/dev/null && \
  print_success "Copied generic agents (code-reviewer, test-writer, debugger, designer, etc.)" || \
  print_warning "Could not copy generic subagents"

# Copy subagents — ideation (always)
cp templates/subagents/ideation/*.md .claude/agents/ideation/ 2>/dev/null && \
  print_success "Copied ideation agents (idea-to-pdb, pdb-to-tasks, vertical-calibrator)" || \
  print_warning "Could not copy ideation subagents"

# Copy subagents — ingestion (always, needed for existing code analysis)
cp templates/subagents/ingestion/*.md .claude/agents/ingestion/ 2>/dev/null && \
  print_success "Copied ingestion agents (codebase-auditor, gap-analysis, documentation-backfill)" || true

# Copy GCP specialist (always)
if [ -f "templates/subagents/specialists/gcp-specialist.md" ]; then
  cp templates/subagents/specialists/gcp-specialist.md .claude/agents/specialists/ 2>/dev/null && \
    print_success "Copied gcp-specialist"
fi

# Copy Firebase specialist (always for GCP projects)
if [ -f "templates/subagents/specialists/firebase-specialist.md" ]; then
  cp templates/subagents/specialists/firebase-specialist.md .claude/agents/specialists/ 2>/dev/null && \
    print_success "Copied firebase-specialist"
fi

# Copy stack-specific specialist
case "$PROJECT_TYPE" in
  mobile-app)
    if [ "$FRAMEWORK" = "Flutter" ] || [ "$FRAMEWORK" = "flutter" ]; then
      cp templates/subagents/specialists/flutter-specialist.md .claude/agents/specialists/ 2>/dev/null && \
        print_success "Copied flutter-specialist"
    fi
    ;;
  web-app)
    if [ "$FRAMEWORK" = "React" ] || [ "$FRAMEWORK" = "react" ]; then
      cp templates/subagents/specialists/react-specialist.md .claude/agents/specialists/ 2>/dev/null && \
        print_success "Copied react-specialist"
    fi
    ;;
  backend-service)
    if [ "$FRAMEWORK" = "Express" ] || [ "$FRAMEWORK" = "express" ] || [ "$FRAMEWORK" = "Node" ] || [ "$FRAMEWORK" = "Fastify" ]; then
      cp templates/subagents/specialists/node-specialist.md .claude/agents/specialists/ 2>/dev/null && \
        print_success "Copied node-specialist"
    fi
    ;;
  full-stack)
    cp templates/subagents/specialists/react-specialist.md .claude/agents/specialists/ 2>/dev/null && \
      print_success "Copied react-specialist"
    ;;
esac

# Copy cross-cutting specialists (always)
for specialist in a2ui-specialist data-science-specialist web-scraping-specialist orchestration-specialist stitch-specialist; do
  if [ -f "templates/subagents/specialists/${specialist}.md" ]; then
    cp "templates/subagents/specialists/${specialist}.md" .claude/agents/specialists/ 2>/dev/null
  fi
done
print_success "Copied cross-cutting specialists (a2ui, data-science, web-scraping, orchestration, stitch)"

# Copy rules (always)
cp .claude/rules/*.md .claude/rules/ 2>/dev/null 2>&1 || \
  cp templates/claude-config/rules/*.md .claude/rules/ 2>/dev/null 2>&1 || true
print_success "Copied rules (domain-routing, a2ui, data-ingestion, gcp-best-practices, token-efficiency, etc.)"

# Copy domain micro-agents (optional)
echo ""
printf "  Include domain micro-agents (17 vertical expertise agents)? [y/N]: "
read -r INCLUDE_DOMAINS
if [ "$INCLUDE_DOMAINS" = "y" ] || [ "$INCLUDE_DOMAINS" = "Y" ]; then
  mkdir -p .claude/agents/domains .claude/agents/system
  cp templates/subagents/domains/*.md .claude/agents/domains/ 2>/dev/null && \
    print_success "Copied 17 domain agents → .claude/agents/domains/"
  cp templates/subagents/system/*.md .claude/agents/system/ 2>/dev/null && \
    print_success "Copied system agents (domain-router, product-orchestrator, etc.)"
  DOMAINS_ENABLED=true
else
  DOMAINS_ENABLED=false
fi

# Copy task templates
cp templates/tasks/tasks-schema.yml tasks.yml 2>/dev/null && \
  print_success "Copied tasks-schema.yml → tasks.yml" || true
cp templates/tasks/feature-task-template.yml tasks/ 2>/dev/null && \
  print_success "Copied feature-task-template.yml → tasks/" || true

# ─── Step 5: Replace variables ──────────────────────────────────────────────

print_step 5 "Replacing template variables"

replace_var() {
  local var_name=$1
  local var_value=$2
  local target_files=("$@")

  # Replace in all project config files (not in templates/ directory)
  local files_to_process=(
    CLAUDE.md
    AGENTS.md
    tasks.yml
  )

  # Also process files in .claude/agents/ and tasks/
  while IFS= read -r -d '' f; do
    files_to_process+=("$f")
  done < <(find .claude/agents tasks -name "*.md" -o -name "*.yml" 2>/dev/null | tr '\n' '\0')

  for f in "${files_to_process[@]}"; do
    if [ -f "$f" ]; then
      if grep -q "{{${var_name}}}" "$f" 2>/dev/null; then
        sed -i '' "s|{{${var_name}}}|${var_value}|g" "$f" 2>/dev/null || \
        sed -i "s|{{${var_name}}}|${var_value}|g" "$f" 2>/dev/null || true
      fi
    fi
  done
}

replace_var "PROJECT_NAME" "$PROJECT_NAME"
print_success "Replaced {{PROJECT_NAME}} → $PROJECT_NAME"

replace_var "PROJECT_DESCRIPTION" "${PROJECT_DESCRIPTION:-$PROJECT_NAME}"
replace_var "PROJECT_TYPE" "$PROJECT_TYPE"
replace_var "PRIMARY_LANGUAGE" "$PRIMARY_LANGUAGE"
replace_var "FRAMEWORK" "$FRAMEWORK"
replace_var "STATE_MANAGEMENT" "${STATE_MANAGEMENT:-N/A}"
replace_var "ARCHITECTURE_PATTERN" "$ARCHITECTURE_PATTERN"
replace_var "TEST_FRAMEWORK" "${TEST_FRAMEWORK:-Jest}"
replace_var "TEST_COVERAGE_TARGET" "$TEST_COVERAGE_TARGET"
replace_var "DATABASE_TYPE" "${DATABASE_TYPE:-}"
replace_var "GCP_PROJECT_ID" "${GCP_PROJECT_ID:-}"
replace_var "FIREBASE_PROJECT_ID" "${FIREBASE_PROJECT_ID:-}"
replace_var "GCP_REGION" "${GCP_REGION:-us-central1}"
replace_var "LAST_UPDATED_DATE" "$(date +%Y-%m-%d)"
replace_var "DATE" "$(date +%Y-%m-%d)"
replace_var "MAINTAINER" "$(git config user.name 2>/dev/null || echo 'Development Team')"

print_success "Replaced core template variables in project files"

# Count remaining variables
REMAINING=$(grep -roh '{{[^}]*}}' CLAUDE.md AGENTS.md tasks.yml .claude/agents/ tasks/ 2>/dev/null | sort -u | wc -l | tr -d ' ')
if [ "$REMAINING" -gt 0 ]; then
  print_warning "$REMAINING unique template variables remain — customize these manually or run ./validate.sh to see them"
else
  print_success "All template variables replaced"
fi

# ─── Step 6: Prune unused templates ─────────────────────────────────────────

print_step 6 "Cleaning up template scaffolding"

echo -en "  ${BOLD}Remove template-library files not needed for your project? (y/n)${NC} ${DIM}[y]${NC}: "
read -r do_prune
do_prune="${do_prune:-y}"

if [[ "$do_prune" =~ ^[Yy] ]]; then
  # Remove other project type templates (keep the one we used)
  for type_file in templates/claude-config/*.md; do
    if [ "$type_file" != "$CURSORRULES_SRC" ]; then
      rm -f "$type_file"
    fi
  done
  print_success "Removed unused CLAUDE.md templates"

  for agent_file in templates/agents/AGENTS-*.md; do
    if [ "$agent_file" != "$AGENTS_SRC" ]; then
      rm -f "$agent_file"
    fi
  done
  print_success "Removed unused AGENTS.md templates"

  # Remove example projects (they're reference material)
  rm -rf examples/
  print_success "Removed examples/ (reference material)"

  # Remove feedback directory (template meta)
  rm -rf feedback/
  print_success "Removed feedback/ (template meta)"

  # Remove template-level docs that are now in project root or irrelevant
  rm -f INSTALLATION.md
  rm -f PROJECT_QUESTIONNAIRE.md
  rm -f QUICK_START.md
  print_success "Removed template-only docs (INSTALLATION, QUESTIONNAIRE, QUICK_START)"

  print_info "Kept: templates/ (source reference), docs/ (project docs), SETUP_GUIDE.md (reference)"
else
  print_info "Skipped pruning. You can manually remove unused files later."
fi

# ─── Step 7: Antigravity Skills & Summary ──────────────────────────────────

print_step 7 "Antigravity Skills & Summary"

echo ""
printf "  Install Antigravity Awesome Skills (946+ additional agent skills)? [Y/n]: "
read -r INSTALL_ANTIGRAVITY
INSTALL_ANTIGRAVITY="${INSTALL_ANTIGRAVITY:-Y}"

if [[ "$INSTALL_ANTIGRAVITY" =~ ^[Yy] ]]; then
  if [ -f "scripts/install-antigravity-skills.sh" ]; then
    chmod +x scripts/install-antigravity-skills.sh
    ./scripts/install-antigravity-skills.sh || print_warning "Install failed — run manually: ./scripts/install-antigravity-skills.sh"
  else
    npx antigravity-awesome-skills --path .claude/skills || npx github:sickn33/antigravity-awesome-skills --path .claude/skills
  fi
  print_success "Antigravity skills installed. Use /skill-name in Claude Code (e.g. @brainstorming)"
else
  print_info "Skip. Install later with: ./scripts/install-antigravity-skills.sh"
fi

echo ""
echo -e "${BOLD}${GREEN}  Project configured successfully!${NC}"
echo ""
echo -e "  ${BOLD}Project${NC}:       $PROJECT_NAME"
echo -e "  ${BOLD}Type${NC}:          $PROJECT_TYPE"
echo -e "  ${BOLD}Language${NC}:      $PRIMARY_LANGUAGE"
echo -e "  ${BOLD}Framework${NC}:     $FRAMEWORK"
echo -e "  ${BOLD}Architecture${NC}:  $ARCHITECTURE_PATTERN"
echo -e "  ${BOLD}GCP Project${NC}:   $GCP_PROJECT_ID"
echo -e "  ${BOLD}Firebase${NC}:      $FIREBASE_PROJECT_ID"
echo -e "  ${BOLD}Region${NC}:        $GCP_REGION"
echo ""
echo -e "${BOLD}  Project structure:${NC}"
echo -e "    CLAUDE.md             ${DIM}— AI agent rules (configured)${NC}"
echo -e "    AGENTS.md             ${DIM}— Agent role definitions (configured)${NC}"
echo -e "    tasks.yml             ${DIM}— Portfolio-level task tracking${NC}"
echo -e "    tasks/                ${DIM}— Feature task files${NC}"
echo -e "    docs/product_design/  ${DIM}— Product Design Blueprint (PDB)${NC}"
echo -e "    docs/architecture/    ${DIM}— Architecture documentation${NC}"
echo -e "    .claude/agents/       ${DIM}— Subagent configurations${NC}"
echo ""
echo -e "${BOLD}  Next steps:${NC}"
echo -e "    1. ${CYAN}Set up GCP: gcloud config set project $GCP_PROJECT_ID${NC}"
echo -e "    2. ${CYAN}Set up Firebase: firebase use $FIREBASE_PROJECT_ID${NC}"
echo -e "    3. ${CYAN}Open this project in Antigravity IDE or Claude Code${NC}"
echo -e "    4. ${CYAN}Invoke idea-to-pdb subagent to explore your idea and generate a PDB${NC}"
if [ "$DOMAINS_ENABLED" = true ]; then
echo -e "    5. ${CYAN}Invoke vertical-calibrator subagent to configure domain agents for your vertical${NC}"
echo -e "    6. ${CYAN}Invoke pdb-to-tasks subagent to create domain-aware task files${NC}"
echo -e "    7. ${CYAN}Start developing with domain expertise active${NC}"
else
echo -e "    5. ${CYAN}Invoke pdb-to-tasks subagent to create task files from the PDB${NC}"
echo -e "    6. ${CYAN}Start developing — agents will follow your project conventions${NC}"
fi
echo ""
echo -e "  ${DIM}Run ./scripts/validate.sh to check for remaining template variables.${NC}"
echo ""
