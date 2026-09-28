#!/usr/bin/env bash
set -euo pipefail
for name in SSH_HOST SSH_USER SSH_PRIVATE_KEY SSH_KNOWN_HOSTS DEPLOY_ROOT PUBLIC_ROOT PHP_BIN RELEASE_ID; do
  [[ -n "${!name:-}" ]] || { echo "Missing $name" >&2; exit 1; }
done
[[ "$SSH_HOST" =~ ^[a-zA-Z0-9.-]+$ && "$SSH_USER" =~ ^[a-zA-Z0-9_-]+$ ]] || exit 1
[[ "$RELEASE_ID" =~ ^[a-f0-9]{40}-[0-9]+-[0-9]+$ ]] || exit 1
for path in "$DEPLOY_ROOT" "$PUBLIC_ROOT" "$PHP_BIN"; do
  [[ "$path" =~ ^/[a-zA-Z0-9_./-]+$ && "$path" != / && "$path" != *..* ]] || exit 1
done
umask 077
credentials=$(mktemp -d)
trap 'rm -rf "$credentials"' EXIT
printf '%s\n' "$SSH_PRIVATE_KEY" > "$credentials/key"
printf '%s\n' "$SSH_KNOWN_HOSTS" > "$credentials/known_hosts"
unset SSH_PRIVATE_KEY SSH_KNOWN_HOSTS
options=(-i "$credentials/key" -o BatchMode=yes -o IdentitiesOnly=yes -o StrictHostKeyChecking=yes -o "UserKnownHostsFile=$credentials/known_hosts" -o ConnectTimeout=20)
target="$SSH_USER@$SSH_HOST"
archive=${1:-.deploy-artifact/release.tar.gz}
checksum=$(sha256sum "$archive" | cut -d ' ' -f 1)
ssh "${options[@]}" "$target" "test -d '$DEPLOY_ROOT/incoming' && test -f '$DEPLOY_ROOT/shared/.env'"
scp "${options[@]}" "$archive" "$target:$DEPLOY_ROOT/incoming/$RELEASE_ID.tar.gz"
ssh "${options[@]}" "$target" "bash -s -- '$DEPLOY_ROOT' '$PUBLIC_ROOT' '$PHP_BIN' 'https://truetell-retail.ru' '$RELEASE_ID' '$checksum'" < scripts/deploy/activate.sh
