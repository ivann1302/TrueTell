#!/usr/bin/env bash
# One-time conversion; preserves the original document root in a legacy release.
set -euo pipefail
root=${1:?private deployment root}; public=${2:?public document root}
for path in "$root" "$public"; do
  [[ "$path" =~ ^/[a-zA-Z0-9_./-]+$ && "$path" != / && "$path" != *..* ]] || { echo 'Invalid absolute path' >&2; exit 1; }
done
[[ "$root/" != "$public/"* && "$public/" != "$root/"* ]] || { echo 'Deployment and public roots must be separate' >&2; exit 1; }
if [[ -L "$public" ]]; then
  [[ "$(readlink "$public")" == "$root/current/public_html" && -d "$public" ]] || exit 1
  exit 0
fi
[[ -d "$public" && ! -e "$root/current" ]] || { echo 'Host needs manual inspection before preparation' >&2; exit 1; }
umask 077
mkdir -p "$root/releases" "$root/shared/storage" "$root/shared/backups" "$root/incoming"
legacy="$root/releases/legacy-$(date +%Y%m%d%H%M%S)-$$"
mkdir "$legacy"
chmod 0711 "$root" "$root/releases" "$legacy"
# Copy first so a failed copy leaves the live directory untouched.
cp -pR "$public" "$legacy/public_html"
ln -s "$legacy" "$root/current"
backup="${public}.before-crm-$(date +%Y%m%d%H%M%S)-$$"
mv "$public" "$backup"
if ! ln -s "$root/current/public_html" "$public"; then
  mv "$backup" "$public"
  exit 1
fi
printf 'Host prepared. Original site retained at %s\n' "$backup"
