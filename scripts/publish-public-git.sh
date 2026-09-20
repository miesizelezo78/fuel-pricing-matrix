#!/usr/bin/env bash
# Refresh the dumb-HTTP git Grok clones (cloudflared → :43993).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
BARE="${1:-/tmp/git-host/vulcanus-bulk-paleta.git}"
git -C "$ROOT" push "$BARE" main:main
git -C "$BARE" update-server-info
git -C "$BARE" log -1 --oneline
git --git-dir="$BARE" show HEAD:PLUGIN-VERSION
