#!/usr/bin/env bash
# BlueVector AI — Install Antigravity Awesome Skills (946+ agentic skills)
# https://github.com/sickn33/antigravity-awesome-skills
#
# Skills are merged into the target directory (project skills are preserved).
#
# Usage:
#   ./scripts/install-antigravity-skills.sh                    # project-level (cwd .claude/skills)
#   ./scripts/install-antigravity-skills.sh --global             # user-level (~/.claude/skills)
#   ./scripts/install-antigravity-skills.sh --project /path      # target project's .claude/skills
#   ./scripts/install-antigravity-skills.sh --path /custom/path  # custom path

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
TARGET=""

while [[ $# -gt 0 ]]; do
  case $1 in
    --global)
      TARGET="$HOME/.claude/skills"
      shift
      ;;
    --project)
      TARGET="$2/.claude/skills"
      shift 2
      ;;
    --path)
      TARGET="$2"
      shift 2
      ;;
    *)
      break
      ;;
  esac
done

if [[ -z "$TARGET" ]]; then
  TARGET="$REPO_ROOT/.claude/skills"
fi

echo "Installing Antigravity Awesome Skills..."
echo "  Target: $TARGET"
echo ""

mkdir -p "$(dirname "$TARGET")"
npx antigravity-awesome-skills --path "$TARGET" || npx github:sickn33/antigravity-awesome-skills --path "$TARGET"

echo ""
echo "Done. Use @skill-name in Claude Code chat (e.g. @brainstorming, @test-driven-development)."
echo "Browse bundles: https://github.com/sickn33/antigravity-awesome-skills/blob/main/docs/BUNDLES.md"
