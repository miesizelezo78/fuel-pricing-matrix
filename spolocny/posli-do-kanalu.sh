#!/bin/bash
set -euo pipefail
ROOT="${1:-/workspace}"
HOST="${GIT_HOST:-/tmp/git-host}"
SRC="$(mktemp -d)"
printf '2.3.7\n' > "$SRC/PLUGIN-VERSION"
cp "$ROOT/spolocny/TERAZ.md" "$SRC/TERAZ.md"
cp "$ROOT/spolocny/README.md" "$SRC/README.md"
cp -a "$ROOT/bulk-paleta" "$SRC/bulk-paleta"
git -C "$SRC" init -b main >/dev/null
git -C "$SRC" -c user.email="cursor@vulcanus.local" -c user.name="Cursor" add .
git -C "$SRC" -c user.email="cursor@vulcanus.local" -c user.name="Cursor" commit -m "drop pre Groka" >/dev/null
rm -rf "$HOST/kanal.git"
git clone --bare "$SRC" "$HOST/kanal.git" >/dev/null
git -C "$HOST/kanal.git" update-server-info
rm -rf "$SRC"
mkdir -p "$HOST/spolocny"
cp "$ROOT/spolocny/TERAZ.md" "$ROOT/spolocny/PLUGIN-VERSION" "$ROOT/spolocny/README.md" "$HOST/spolocny/"
cp "$ROOT/handoff-paliva/od-cursora/vulcanus-bulk-paleta-2.3.7.zip" "$HOST/spolocny/vulcanus-bulk-paleta.zip" 2>/dev/null || true
echo "kanal.git updated"
