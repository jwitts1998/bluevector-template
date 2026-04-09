#!/usr/bin/env bash
set -euo pipefail

# Multi-Agent System Template — Apply to Existing Project
# Layers the unified template onto an existing codebase without modifying existing files.
# Creates .claude/ directory alongside any existing .cursor/ configs.

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
  echo -e "${BOLD}${CYAN}  Apply Unified Template to Existing Project${NC}"
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

prompt_yn() {
  local prompt_text=$1
  local default=${2:-y}
  echo -en "  ${BOLD}$prompt_text${NC} ${DIM}[${default}]${NC}: "
  read -r input
  input="${input:-$default}"
  [[ "$input" =~ ^[Yy] ]]
}

TOTAL_STEPS=8
TEMPLATE_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TARGET_DIR="${1:-.}"

# Resolve to absolute path
TARGET_DIR="$(cd "$TARGET_DIR" 2>/dev/null && pwd)" || {
  echo -e "${RED}Error: Target directory '$1' does not exist.${NC}"
  echo "Usage: $0 [target-project-directory]"
  exit 1
}

print_header
echo -e "  ${BOLD}Template${NC}: $TEMPLATE_ROOT"
echo -e "  ${BOLD}Target${NC}:   $TARGET_DIR"

# ─── Step 1: Scan Target Project ──────────────────────────────────────────

print_step 1 "Scanning target project"

PROJECT_TYPE=""
PRIMARY_LANGUAGE=""
FRAMEWORK=""
STATE_MANAGEMENT=""
ARCHITECTURE_PATTERN=""
TEST_FRAMEWORK=""
FIREBASE_DETECTED=false
FIREBASE_SERVICES=""

# Detect Flutter/Dart
if [ -f "$TARGET_DIR/pubspec.yaml" ]; then
  PROJECT_TYPE="mobile-app"
  PRIMARY_LANGUAGE="Dart"
  FRAMEWORK="Flutter"

  # Detect state management
  if grep -q "flutter_riverpod\|riverpod" "$TARGET_DIR/pubspec.yaml" 2>/dev/null; then
    STATE_MANAGEMENT="Riverpod"
  elif grep -q "flutter_bloc\|bloc" "$TARGET_DIR/pubspec.yaml" 2>/dev/null; then
    STATE_MANAGEMENT="BLoC"
  elif grep -q "provider:" "$TARGET_DIR/pubspec.yaml" 2>/dev/null; then
    STATE_MANAGEMENT="Provider"
  fi

  # Detect Firebase
  fb_services=()
  grep -q "firebase_auth" "$TARGET_DIR/pubspec.yaml" 2>/dev/null && fb_services+=("Auth")
  grep -q "cloud_firestore" "$TARGET_DIR/pubspec.yaml" 2>/dev/null && fb_services+=("Firestore")
  grep -q "firebase_storage" "$TARGET_DIR/pubspec.yaml" 2>/dev/null && fb_services+=("Storage")
  grep -q "cloud_functions" "$TARGET_DIR/pubspec.yaml" 2>/dev/null && fb_services+=("Functions")
  grep -q "firebase_messaging" "$TARGET_DIR/pubspec.yaml" 2>/dev/null && fb_services+=("Messaging")
  grep -q "firebase_remote_config" "$TARGET_DIR/pubspec.yaml" 2>/dev/null && fb_services+=("RemoteConfig")
  grep -q "firebase_app_check\|app_check" "$TARGET_DIR/pubspec.yaml" 2>/dev/null && fb_services+=("AppCheck")

  if [ ${#fb_services[@]} -gt 0 ]; then
    FIREBASE_DETECTED=true
    FIREBASE_SERVICES=$(IFS=', '; echo "${fb_services[*]}")
  fi

  # Detect test framework
  TEST_FRAMEWORK="flutter_test"

  # Detect architecture
  if [ -d "$TARGET_DIR/lib/core" ] && [ -d "$TARGET_DIR/lib/features" ]; then
    ARCHITECTURE_PATTERN="Clean Architecture"
  else
    ARCHITECTURE_PATTERN="Feature-First"
  fi

# Detect Next.js
elif [ -f "$TARGET_DIR/package.json" ] && grep -q '"next"' "$TARGET_DIR/package.json" 2>/dev/null; then
  PROJECT_TYPE="full-stack"
  PRIMARY_LANGUAGE="TypeScript"
  FRAMEWORK="Next.js"

  if grep -q '"zustand"' "$TARGET_DIR/package.json" 2>/dev/null; then STATE_MANAGEMENT="Zustand"
  elif grep -q '"@reduxjs/toolkit"' "$TARGET_DIR/package.json" 2>/dev/null; then STATE_MANAGEMENT="Redux Toolkit"
  else STATE_MANAGEMENT="React Context"; fi

  if grep -q '"vitest"' "$TARGET_DIR/package.json" 2>/dev/null; then TEST_FRAMEWORK="Vitest"
  elif grep -q '"jest"' "$TARGET_DIR/package.json" 2>/dev/null; then TEST_FRAMEWORK="Jest"
  fi

  ARCHITECTURE_PATTERN="Feature-First"

# Detect React (without Next.js)
elif [ -f "$TARGET_DIR/package.json" ] && grep -q '"react"' "$TARGET_DIR/package.json" 2>/dev/null && ! grep -q '"next"' "$TARGET_DIR/package.json" 2>/dev/null; then
  PROJECT_TYPE="web-app"
  PRIMARY_LANGUAGE="TypeScript"
  FRAMEWORK="React"

  if grep -q '"zustand"' "$TARGET_DIR/package.json" 2>/dev/null; then STATE_MANAGEMENT="Zustand"
  elif grep -q '"@reduxjs/toolkit"' "$TARGET_DIR/package.json" 2>/dev/null; then STATE_MANAGEMENT="Redux Toolkit"
  else STATE_MANAGEMENT="React Context"; fi

  if grep -q '"vitest"' "$TARGET_DIR/package.json" 2>/dev/null; then TEST_FRAMEWORK="Vitest"
  elif grep -q '"jest"' "$TARGET_DIR/package.json" 2>/dev/null; then TEST_FRAMEWORK="Jest"
  fi

  ARCHITECTURE_PATTERN="Feature-First"

# Detect Node.js backend
elif [ -f "$TARGET_DIR/package.json" ] && (grep -q '"express"' "$TARGET_DIR/package.json" 2>/dev/null || grep -q '"fastify"' "$TARGET_DIR/package.json" 2>/dev/null); then
  PROJECT_TYPE="backend-service"
  PRIMARY_LANGUAGE="TypeScript"
  if grep -q '"fastify"' "$TARGET_DIR/package.json" 2>/dev/null; then
    FRAMEWORK="Fastify"
  else
    FRAMEWORK="Express"
  fi
  STATE_MANAGEMENT="N/A"
  ARCHITECTURE_PATTERN="Layered Architecture"

  if grep -q '"vitest"' "$TARGET_DIR/package.json" 2>/dev/null; then TEST_FRAMEWORK="Vitest"
  elif grep -q '"jest"' "$TARGET_DIR/package.json" 2>/dev/null; then TEST_FRAMEWORK="Jest"
  fi

# Detect Python
elif [ -f "$TARGET_DIR/requirements.txt" ] || [ -f "$TARGET_DIR/pyproject.toml" ]; then
  PROJECT_TYPE="backend-service"
  PRIMARY_LANGUAGE="Python"
  if grep -q "fastapi\|FastAPI" "$TARGET_DIR/requirements.txt" "$TARGET_DIR/pyproject.toml" 2>/dev/null; then
    FRAMEWORK="FastAPI"
  elif grep -q "django\|Django" "$TARGET_DIR/requirements.txt" "$TARGET_DIR/pyproject.toml" 2>/dev/null; then
    FRAMEWORK="Django"
  elif grep -q "flask\|Flask" "$TARGET_DIR/requirements.txt" "$TARGET_DIR/pyproject.toml" 2>/dev/null; then
    FRAMEWORK="Flask"
  fi
  STATE_MANAGEMENT="N/A"
  TEST_FRAMEWORK="pytest"
  ARCHITECTURE_PATTERN="Layered Architecture"

else
  print_warning "Could not auto-detect project stack"
  PROJECT_TYPE="web-app"
  PRIMARY_LANGUAGE="TypeScript"
  FRAMEWORK="React"
fi

# Detect project name
PROJECT_NAME=""
if [ -f "$TARGET_DIR/pubspec.yaml" ]; then
  PROJECT_NAME=$(grep "^name:" "$TARGET_DIR/pubspec.yaml" 2>/dev/null | head -1 | sed 's/name: *//' | tr -d "'" | tr -d '"')
elif [ -f "$TARGET_DIR/package.json" ]; then
  PROJECT_NAME=$(python3 -c "import json; print(json.load(open('$TARGET_DIR/package.json')).get('name',''))" 2>/dev/null || echo "")
fi
PROJECT_NAME="${PROJECT_NAME:-$(basename "$TARGET_DIR")}"

print_success "Detected stack"

# ─── Step 2: Detect Existing AI Configs ────────────────────────────────────

print_step 2 "Detecting existing configurations"

HAS_CURSORRULES=false
HAS_CURSOR_DIR=false
HAS_CURSOR_AGENTS=false
HAS_CURSOR_MCP=false
HAS_CLAUDE_DIR=false
HAS_CLAUDE_MD=false
HAS_AGENTS_MD=false
HAS_DOCS=false
HAS_INDEX_FOR_AI=false

[ -f "$TARGET_DIR/.cursorrules" ] && HAS_CURSORRULES=true && print_info "Found .cursorrules"
[ -d "$TARGET_DIR/.cursor" ] && HAS_CURSOR_DIR=true && print_info "Found .cursor/ directory"
[ -d "$TARGET_DIR/.cursor/agents" ] && HAS_CURSOR_AGENTS=true && print_info "Found .cursor/agents/ ($(ls "$TARGET_DIR/.cursor/agents/"*.md 2>/dev/null | wc -l | tr -d ' ') agents)"
[ -f "$TARGET_DIR/.cursor/mcp.json" ] && HAS_CURSOR_MCP=true && print_info "Found .cursor/mcp.json"
[ -d "$TARGET_DIR/.claude" ] && HAS_CLAUDE_DIR=true && print_warning "Found existing .claude/ directory"
[ -f "$TARGET_DIR/CLAUDE.md" ] && HAS_CLAUDE_MD=true && print_info "Found existing CLAUDE.md"
[ -f "$TARGET_DIR/AGENTS.md" ] && HAS_AGENTS_MD=true && print_info "Found existing AGENTS.md"
[ -d "$TARGET_DIR/docs" ] && HAS_DOCS=true && print_info "Found docs/ directory"
[ -f "$TARGET_DIR/docs/INDEX_FOR_AI.md" ] && HAS_INDEX_FOR_AI=true && print_info "Found docs/INDEX_FOR_AI.md"

if [ "$HAS_CLAUDE_DIR" = true ]; then
  echo ""
  if ! prompt_yn "  .claude/ already exists. Continue and merge? (y/n)" "y"; then
    echo -e "  ${RED}Aborted.${NC}"
    exit 0
  fi
fi

# ─── Step 3: Confirm/Override Detection ────────────────────────────────────

print_step 3 "Confirm detected configuration"

echo ""
echo -e "  ${BOLD}Detected stack:${NC}"
echo -e "    Project name:      ${CYAN}$PROJECT_NAME${NC}"
echo -e "    Project type:      ${CYAN}$PROJECT_TYPE${NC}"
echo -e "    Language:          ${CYAN}$PRIMARY_LANGUAGE${NC}"
echo -e "    Framework:         ${CYAN}$FRAMEWORK${NC}"
echo -e "    State management:  ${CYAN}${STATE_MANAGEMENT:-N/A}${NC}"
echo -e "    Architecture:      ${CYAN}${ARCHITECTURE_PATTERN:-N/A}${NC}"
echo -e "    Test framework:    ${CYAN}${TEST_FRAMEWORK:-unknown}${NC}"
if [ "$FIREBASE_DETECTED" = true ]; then
  echo -e "    Firebase:          ${CYAN}Yes ($FIREBASE_SERVICES)${NC}"
fi
echo ""

if ! prompt_yn "Is this correct? (y/n)" "y"; then
  echo ""
  prompt PROJECT_NAME "Project name" "$PROJECT_NAME"
  prompt PROJECT_TYPE "Project type (mobile-app/web-app/backend-service/full-stack)" "$PROJECT_TYPE"
  prompt PRIMARY_LANGUAGE "Primary language" "$PRIMARY_LANGUAGE"
  prompt FRAMEWORK "Framework" "$FRAMEWORK"
  prompt STATE_MANAGEMENT "State management" "${STATE_MANAGEMENT:-N/A}"
  prompt ARCHITECTURE_PATTERN "Architecture pattern" "${ARCHITECTURE_PATTERN:-Feature-First}"
  prompt TEST_FRAMEWORK "Test framework" "${TEST_FRAMEWORK:-}"
fi

PROJECT_DESCRIPTION=""
prompt PROJECT_DESCRIPTION "One-line project description" ""

# ─── Step 4: Create .claude/ Directory Structure ───────────────────────────

print_step 4 "Creating .claude/ directory structure"

mkdir -p "$TARGET_DIR/.claude/agents/generic"
mkdir -p "$TARGET_DIR/.claude/agents/ideation"
mkdir -p "$TARGET_DIR/.claude/agents/specialists"
mkdir -p "$TARGET_DIR/.claude/agents/domains"
mkdir -p "$TARGET_DIR/.claude/agents/system"
mkdir -p "$TARGET_DIR/.claude/rules"
mkdir -p "$TARGET_DIR/.claude/skills"

# Copy settings.json if not present
if [ ! -f "$TARGET_DIR/.claude/settings.json" ] && [ -f "$TEMPLATE_ROOT/.claude/settings.json" ]; then
  cp "$TEMPLATE_ROOT/.claude/settings.json" "$TARGET_DIR/.claude/settings.json"
  print_success "Created .claude/settings.json"
fi

print_success "Created .claude/ directory structure"

# ─── Step 5: Copy Agents ──────────────────────────────────────────────────

print_step 5 "Copying agents based on detected stack"

# Always copy: generic agents
cp "$TEMPLATE_ROOT/templates/subagents/generic/"*.md "$TARGET_DIR/.claude/agents/generic/" 2>/dev/null && \
  print_success "Copied generic agents (code-reviewer, test-writer, debugger, designer, etc.)" || true

# Always copy: ideation agents
cp "$TEMPLATE_ROOT/templates/subagents/ideation/"*.md "$TARGET_DIR/.claude/agents/ideation/" 2>/dev/null && \
  print_success "Copied ideation agents (idea-to-pdb, pdb-to-tasks, etc.)" || true

# Always copy: ingestion agents (for existing projects)
if [ -d "$TEMPLATE_ROOT/templates/subagents/ingestion" ]; then
  mkdir -p "$TARGET_DIR/.claude/agents/ingestion"
  cp "$TEMPLATE_ROOT/templates/subagents/ingestion/"*.md "$TARGET_DIR/.claude/agents/ingestion/" 2>/dev/null && \
    print_success "Copied ingestion agents (codebase-auditor, gap-analysis, documentation-backfill)" || true
fi

# Stack-conditional specialists
case "$PROJECT_TYPE" in
  mobile-app)
    cp "$TEMPLATE_ROOT/templates/subagents/specialists/flutter-specialist.md" "$TARGET_DIR/.claude/agents/specialists/" 2>/dev/null && \
      print_success "Copied flutter-specialist"
    if [ "$FIREBASE_DETECTED" = true ]; then
      cp "$TEMPLATE_ROOT/templates/subagents/specialists/firebase-specialist.md" "$TARGET_DIR/.claude/agents/specialists/" 2>/dev/null && \
        print_success "Copied firebase-specialist"
    fi
    ;;
  web-app)
    cp "$TEMPLATE_ROOT/templates/subagents/specialists/react-specialist.md" "$TARGET_DIR/.claude/agents/specialists/" 2>/dev/null && \
      print_success "Copied react-specialist"
    ;;
  full-stack)
    cp "$TEMPLATE_ROOT/templates/subagents/specialists/react-specialist.md" "$TARGET_DIR/.claude/agents/specialists/" 2>/dev/null && \
      print_success "Copied react-specialist"
    ;;
  backend-service)
    if [ "$FRAMEWORK" = "Express" ] || [ "$FRAMEWORK" = "Fastify" ] || [ "$FRAMEWORK" = "Node" ]; then
      cp "$TEMPLATE_ROOT/templates/subagents/specialists/node-specialist.md" "$TARGET_DIR/.claude/agents/specialists/" 2>/dev/null && \
        print_success "Copied node-specialist"
    fi
    ;;
esac

# Always available specialists
for specialist in a2ui-specialist data-science-specialist web-scraping-specialist orchestration-specialist; do
  if [ -f "$TEMPLATE_ROOT/templates/subagents/specialists/${specialist}.md" ]; then
    cp "$TEMPLATE_ROOT/templates/subagents/specialists/${specialist}.md" "$TARGET_DIR/.claude/agents/specialists/" 2>/dev/null
  fi
done
print_success "Copied cross-cutting specialists (a2ui, data-science, web-scraping, orchestration)"

# Domain agents
echo ""
if prompt_yn "Include domain micro-agents (vertical expertise)? (y/n)" "y"; then
  cp "$TEMPLATE_ROOT/templates/subagents/domains/"*.md "$TARGET_DIR/.claude/agents/domains/" 2>/dev/null && \
    print_success "Copied all domain agents"
  if [ -d "$TEMPLATE_ROOT/templates/subagents/system" ]; then
    cp "$TEMPLATE_ROOT/templates/subagents/system/"*.md "$TARGET_DIR/.claude/agents/system/" 2>/dev/null && \
      print_success "Copied system agents (domain-router, product-orchestrator)"
  fi
fi

# Copy rules
cp "$TEMPLATE_ROOT/.claude/rules/"*.md "$TARGET_DIR/.claude/rules/" 2>/dev/null && \
  print_success "Copied rules (domain-routing, a2ui, data-ingestion, token-efficiency, etc.)" || true

# Replace variables in all copied files
replace_var() {
  local var_name=$1
  local var_value=$2
  while IFS= read -r -d '' f; do
    if grep -q "{{${var_name}}}" "$f" 2>/dev/null; then
      sed -i '' "s|{{${var_name}}}|${var_value}|g" "$f" 2>/dev/null || \
      sed -i "s|{{${var_name}}}|${var_value}|g" "$f" 2>/dev/null || true
    fi
  done < <(find "$TARGET_DIR/.claude" -name "*.md" -print0 2>/dev/null)
}

replace_var "PROJECT_NAME" "$PROJECT_NAME"
replace_var "PROJECT_DESCRIPTION" "${PROJECT_DESCRIPTION:-$PROJECT_NAME}"
replace_var "PRIMARY_LANGUAGE" "$PRIMARY_LANGUAGE"
replace_var "FRAMEWORK" "$FRAMEWORK"
replace_var "STATE_MANAGEMENT" "${STATE_MANAGEMENT:-N/A}"
replace_var "ARCHITECTURE_PATTERN" "${ARCHITECTURE_PATTERN:-Feature-First}"
replace_var "TEST_FRAMEWORK" "${TEST_FRAMEWORK:-}"
replace_var "TEST_COVERAGE_TARGET" "80"
replace_var "LAST_UPDATED_DATE" "$(date +%Y-%m-%d)"
replace_var "DATE" "$(date +%Y-%m-%d)"
replace_var "MAINTAINER" "$(git -C "$TARGET_DIR" config user.name 2>/dev/null || echo 'Development Team')"

print_success "Replaced template variables in all copied agents"

# ─── Step 6: Generate Merged CLAUDE.md ─────────────────────────────────────

print_step 6 "Generating merged CLAUDE.md"

CLAUDE_MD_SRC="$TEMPLATE_ROOT/templates/claude-config/${PROJECT_TYPE}.md"
AGENTS_MD_SRC="$TEMPLATE_ROOT/templates/agents/AGENTS-$(echo "$PROJECT_TYPE" | cut -d'-' -f1).md"

# Map to correct AGENTS template
case "$PROJECT_TYPE" in
  mobile-app)  AGENTS_MD_SRC="$TEMPLATE_ROOT/templates/agents/AGENTS-mobile.md" ;;
  web-app)     AGENTS_MD_SRC="$TEMPLATE_ROOT/templates/agents/AGENTS-web.md" ;;
  backend-service) AGENTS_MD_SRC="$TEMPLATE_ROOT/templates/agents/AGENTS-backend.md" ;;
  full-stack)  AGENTS_MD_SRC="$TEMPLATE_ROOT/templates/agents/AGENTS-full-stack.md" ;;
esac

# Backup existing CLAUDE.md if present
if [ -f "$TARGET_DIR/CLAUDE.md" ]; then
  cp "$TARGET_DIR/CLAUDE.md" "$TARGET_DIR/CLAUDE.md.backup"
  print_info "Backed up existing CLAUDE.md → CLAUDE.md.backup"
fi

# Generate merged CLAUDE.md
if [ -f "$CLAUDE_MD_SRC" ]; then
  # Start with template
  cp "$CLAUDE_MD_SRC" "$TARGET_DIR/CLAUDE.md"

  # Replace variables in CLAUDE.md
  for var_pair in \
    "PROJECT_NAME:$PROJECT_NAME" \
    "PROJECT_DESCRIPTION:${PROJECT_DESCRIPTION:-$PROJECT_NAME}" \
    "PRIMARY_LANGUAGE:$PRIMARY_LANGUAGE" \
    "FRAMEWORK:$FRAMEWORK" \
    "STATE_MANAGEMENT:${STATE_MANAGEMENT:-N/A}" \
    "ARCHITECTURE_PATTERN:${ARCHITECTURE_PATTERN:-Feature-First}" \
    "TEST_FRAMEWORK:${TEST_FRAMEWORK:-}" \
    "TEST_COVERAGE_TARGET:80" \
    "LAST_UPDATED_DATE:$(date +%Y-%m-%d)" \
    "MAINTAINER:$(git -C "$TARGET_DIR" config user.name 2>/dev/null || echo 'Development Team')"; do
    vname="${var_pair%%:*}"
    vvalue="${var_pair#*:}"
    sed -i '' "s|{{${vname}}}|${vvalue}|g" "$TARGET_DIR/CLAUDE.md" 2>/dev/null || \
    sed -i "s|{{${vname}}}|${vvalue}|g" "$TARGET_DIR/CLAUDE.md" 2>/dev/null || true
  done

  # Append project-specific conventions section
  {
    echo ""
    echo "---"
    echo ""
    echo "## Project-Specific Conventions"
    echo ""
    echo "The following conventions were detected from the existing project configuration."
    echo ""

    # Include .cursorrules content if present
    if [ "$HAS_CURSORRULES" = true ]; then
      echo "### Existing Project Rules (from .cursorrules)"
      echo ""
      echo "<details>"
      echo "<summary>Click to expand original .cursorrules</summary>"
      echo ""
      cat "$TARGET_DIR/.cursorrules"
      echo ""
      echo "</details>"
      echo ""
    fi

    # Include INDEX_FOR_AI if present
    if [ "$HAS_INDEX_FOR_AI" = true ]; then
      echo "### AI Navigation Guide"
      echo ""
      echo "See \`docs/INDEX_FOR_AI.md\` for canonical file paths, feature maps, and architectural patterns."
      echo ""
    fi

    # Note Cursor agents
    if [ "$HAS_CURSOR_AGENTS" = true ]; then
      echo "### Cursor Agent Ecosystem"
      echo ""
      echo "This project also has Cursor agents in \`.cursor/agents/\`. The \`.claude/agents/\` system coexists — both can be used depending on your IDE."
      echo ""
    fi

    # Note Firebase
    if [ "$FIREBASE_DETECTED" = true ]; then
      echo "### Firebase Services"
      echo ""
      echo "This project uses Firebase: $FIREBASE_SERVICES"
      echo "See \`@firebase-specialist\` for Firebase-specific patterns."
      echo ""
    fi

  } >> "$TARGET_DIR/CLAUDE.md"

  print_success "Generated merged CLAUDE.md"
else
  print_warning "Template $CLAUDE_MD_SRC not found, skipping CLAUDE.md generation"
fi

# Generate AGENTS.md
if [ -f "$AGENTS_MD_SRC" ]; then
  if [ -f "$TARGET_DIR/AGENTS.md" ]; then
    cp "$TARGET_DIR/AGENTS.md" "$TARGET_DIR/AGENTS.md.backup"
    print_info "Backed up existing AGENTS.md → AGENTS.md.backup"
  fi
  cp "$AGENTS_MD_SRC" "$TARGET_DIR/AGENTS.md"
  # Replace variables
  sed -i '' "s|{{PROJECT_NAME}}|${PROJECT_NAME}|g" "$TARGET_DIR/AGENTS.md" 2>/dev/null || \
  sed -i "s|{{PROJECT_NAME}}|${PROJECT_NAME}|g" "$TARGET_DIR/AGENTS.md" 2>/dev/null || true
  print_success "Generated AGENTS.md"
fi

# ─── Step 7: Merge MCP Configs ────────────────────────────────────────────

print_step 7 "Merging MCP configurations"

TEMPLATE_MCP="$TEMPLATE_ROOT/.mcp.json"
TARGET_MCP="$TARGET_DIR/.mcp.json"
CURSOR_MCP="$TARGET_DIR/.cursor/mcp.json"

if [ -f "$TEMPLATE_MCP" ]; then
  if [ -f "$CURSOR_MCP" ] || [ -f "$TARGET_MCP" ]; then
    # Merge using python3
    EXISTING_MCP="${TARGET_MCP}"
    [ ! -f "$EXISTING_MCP" ] && EXISTING_MCP="$CURSOR_MCP"

    python3 -c "
import json, sys

with open('$TEMPLATE_MCP') as f:
    template = json.load(f)

with open('$EXISTING_MCP') as f:
    existing = json.load(f)

# Merge: template servers + existing servers (existing wins on conflicts)
merged_servers = {}
for key, val in template.get('mcpServers', {}).items():
    if not key.startswith('//'):
        merged_servers[key] = val

for key, val in existing.get('mcpServers', {}).items():
    if not key.startswith('//'):
        merged_servers[key] = val  # Existing project servers take priority

result = {'mcpServers': merged_servers}

with open('$TARGET_DIR/.mcp.json', 'w') as f:
    json.dump(result, f, indent=2)
" 2>/dev/null && print_success "Merged MCP configs (template + existing)" || {
      # Fallback: just copy template
      cp "$TEMPLATE_MCP" "$TARGET_DIR/.mcp.json"
      print_warning "Could not merge MCP configs, copied template version"
    }
  else
    cp "$TEMPLATE_MCP" "$TARGET_DIR/.mcp.json"
    print_success "Copied template MCP config"
  fi

  # Replace env var placeholders
  sed -i '' "s|\${BRAIN_ROOT}|${BRAIN_ROOT:-\${BRAIN_ROOT}}|g" "$TARGET_DIR/.mcp.json" 2>/dev/null || true
else
  print_warning "Template .mcp.json not found"
fi

# Command Center integration
echo ""
if prompt_yn "Connect to Command Center (Brain)? (y/n)" "y"; then
  prompt BRAIN_ROOT "Path to Command Center (BRAIN_ROOT)" "${BRAIN_ROOT:-}"
  if [ -n "$BRAIN_ROOT" ] && [ -d "$BRAIN_ROOT" ]; then
    REPO_ID=$(echo "$PROJECT_NAME" | tr '[:upper:]' '[:lower:]' | tr ' ' '-' | tr -cd 'a-z0-9-')

    # Create or append to .env
    if ! grep -q "BRAIN_ROOT" "$TARGET_DIR/.env" 2>/dev/null; then
      echo "" >> "$TARGET_DIR/.env" 2>/dev/null || touch "$TARGET_DIR/.env"
      echo "# Command Center Integration" >> "$TARGET_DIR/.env"
      echo "BRAIN_ROOT=$BRAIN_ROOT" >> "$TARGET_DIR/.env"
      echo "REPO_ID=$REPO_ID" >> "$TARGET_DIR/.env"
      echo "REPO_NAME=\"$PROJECT_NAME\"" >> "$TARGET_DIR/.env"
      print_success "Added Command Center config to .env"
    else
      print_info "BRAIN_ROOT already in .env, skipping"
    fi
  fi
fi

# ─── Step 8: Summary ──────────────────────────────────────────────────────

print_step 8 "Setup complete"

echo ""
echo -e "${BOLD}${GREEN}  Template applied successfully!${NC}"
echo ""
echo -e "  ${BOLD}Project${NC}:       $PROJECT_NAME"
echo -e "  ${BOLD}Type${NC}:          $PROJECT_TYPE"
echo -e "  ${BOLD}Language${NC}:      $PRIMARY_LANGUAGE"
echo -e "  ${BOLD}Framework${NC}:     $FRAMEWORK"
if [ "$FIREBASE_DETECTED" = true ]; then
echo -e "  ${BOLD}Firebase${NC}:      $FIREBASE_SERVICES"
fi
echo ""
echo -e "${BOLD}  Files created:${NC}"
echo -e "    .claude/agents/       ${DIM}— Agent configurations (Claude Code)${NC}"
echo -e "    .claude/rules/        ${DIM}— Auto-loaded rules${NC}"
echo -e "    .claude/skills/       ${DIM}— Skill directory${NC}"
echo -e "    CLAUDE.md             ${DIM}— Project rules (merged with existing conventions)${NC}"
echo -e "    AGENTS.md             ${DIM}— Agent role definitions${NC}"
if [ -f "$TARGET_DIR/.mcp.json" ]; then
echo -e "    .mcp.json             ${DIM}— MCP server config (merged)${NC}"
fi
echo ""
if [ "$HAS_CURSOR_DIR" = true ]; then
echo -e "  ${BOLD}Coexistence:${NC}"
echo -e "    .cursor/              ${DIM}— Preserved (Cursor IDE)${NC}"
echo -e "    .claude/              ${DIM}— Added (Claude Code)${NC}"
echo -e "    ${DIM}Both systems work independently with the same project.${NC}"
echo ""
fi
echo -e "${BOLD}  Next steps:${NC}"
echo -e "    1. ${CYAN}Review generated CLAUDE.md — customize remaining {{VARIABLES}}${NC}"
echo -e "    2. ${CYAN}Open project in Claude Code${NC}"
echo -e "    3. ${CYAN}Run @codebase-auditor to analyze existing code${NC}"
echo -e "    4. ${CYAN}Run @gap-analysis to identify improvement areas${NC}"
echo -e "    5. ${CYAN}Run @documentation-backfill to generate PDB from existing code${NC}"
echo ""
echo -e "  ${DIM}Template source: $TEMPLATE_ROOT${NC}"
echo ""
