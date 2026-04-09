#!/usr/bin/env bash
set -euo pipefail

# Multi-Agent System Template — Variable Validation Script
# Checks for remaining {{VARIABLE}} placeholders in project files.

BOLD='\033[1m'
DIM='\033[2m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${BOLD}${CYAN}Checking for unresolved template variables...${NC}"
echo ""

# Files that should be fully resolved after setup
PROJECT_FILES=(
  CLAUDE.md
  AGENTS.md
  tasks.yml
)

# Directories to scan
PROJECT_DIRS=(
  .claude/agents
  tasks
  status
)

EXIT_CODE=0
TOTAL_FOUND=0
FILES_WITH_VARS=0

check_file() {
  local file=$1
  if [ ! -f "$file" ]; then
    return
  fi

  local matches
  matches=$(grep -n '{{[^}]*}}' "$file" 2>/dev/null || true)

  if [ -n "$matches" ]; then
    FILES_WITH_VARS=$((FILES_WITH_VARS + 1))
    local count
    count=$(echo "$matches" | wc -l | tr -d ' ')
    TOTAL_FOUND=$((TOTAL_FOUND + count))

    echo -e "  ${RED}✗${NC} ${BOLD}$file${NC} ${DIM}($count remaining)${NC}"

    echo "$matches" | while IFS= read -r line; do
      local line_num
      line_num=$(echo "$line" | cut -d: -f1)
      local vars
      vars=$(echo "$line" | grep -o '{{[^}]*}}' | tr '\n' ' ')
      echo -e "    ${DIM}Line $line_num:${NC} $vars"
    done
    echo ""
  fi
}

# Check individual project files
for f in "${PROJECT_FILES[@]}"; do
  check_file "$f"
done

# Check project directories
for dir in "${PROJECT_DIRS[@]}"; do
  if [ -d "$dir" ]; then
    while IFS= read -r -d '' f; do
      check_file "$f"
    done < <(find "$dir" -type f \( -name "*.md" -o -name "*.yml" -o -name "*.yaml" \) -print0 2>/dev/null)
  fi
done

# Summary
echo -e "${BOLD}─────────────────────────────────────────${NC}"
if [ "$TOTAL_FOUND" -eq 0 ]; then
  echo -e "${GREEN}${BOLD}  All template variables resolved.${NC}"
  echo -e "  ${DIM}Project files are ready for development.${NC}"
else
  echo -e "${YELLOW}${BOLD}  $TOTAL_FOUND unresolved variable(s) across $FILES_WITH_VARS file(s).${NC}"
  echo ""
  echo -e "  ${DIM}To fix, search and replace remaining {{VARIABLES}} in the listed files.${NC}"
  echo -e "  ${DIM}Variables that don't apply to your project can be replaced with${NC}"
  echo -e "  ${DIM}a descriptive value or removed from the section entirely.${NC}"
  EXIT_CODE=1
fi
echo ""

# Also list unique variable names for convenience
if [ "$TOTAL_FOUND" -gt 0 ]; then
  echo -e "${BOLD}  Unique variables still present:${NC}"
  {
    for f in "${PROJECT_FILES[@]}"; do
      [ -f "$f" ] && grep -oh '{{[^}]*}}' "$f" 2>/dev/null || true
    done
    for dir in "${PROJECT_DIRS[@]}"; do
      [ -d "$dir" ] && find "$dir" -type f \( -name "*.md" -o -name "*.yml" \) -exec grep -oh '{{[^}]*}}' {} \; 2>/dev/null || true
    done
  } | sort -u | while IFS= read -r var; do
    echo -e "    ${CYAN}$var${NC}"
  done
  echo ""
fi

exit $EXIT_CODE
