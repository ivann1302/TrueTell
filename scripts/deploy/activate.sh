#!/usr/bin/env bash
set -euo pipefail
root=${1:?}; public=${2:?}; php=${3:?}; url=${4:?}; id=${5:?}; checksum=${6:?}
fail() { echo "$*" >&2; exit 1; }
for path in "$root" "$public" "$php"; do
  [[ "$path" =~ ^/[a-zA-Z0-9_./-]+$ && "$path" != / && "$path" != *..* ]] || fail 'Invalid absolute path'
done
[[ "$id" =~ ^[a-f0-9]{40}-[0-9]+-[0-9]+$ && "$checksum" =~ ^[a-f0-9]{64}$ ]] || fail 'Invalid release identifier or checksum'
[[ "$url" =~ ^https://[a-zA-Z0-9.-]+$ ]] || fail 'Expected HTTPS site origin'
[[ -L "$public" && "$(readlink "$public")" == "$root/current/public_html" ]] || fail 'Run host preparation first'
[[ -L "$root/current" && -f "$root/shared/.env" ]] || fail 'Shared environment or current release missing'
exec 9>"$root/deploy.lock"
flock -n 9 || fail 'Another deployment is active'
umask 077
archive="$root/incoming/$id.tar.gz"; candidate="$root/releases/$id"
actual=$("$php" -r 'echo hash_file("sha256", $argv[1]);' "$archive")
[[ "$actual" == "$checksum" ]] || fail 'Release checksum mismatch'
[[ ! -e "$candidate" ]] || fail 'Release already exists; use a new run attempt'
# Read raw ustar headers: PharData normalizes traversal and hides link types.
"$php" -r '
$f = gzopen($argv[1], "rb");
if (!$f) exit(1);
$seen = []; $bytes = 0; $ended = false;
while (!gzeof($f)) {
    $h = gzread($f, 512);
    if ($h === "") break;
    if (strlen($h) !== 512) exit(1);
    if ($h === str_repeat(chr(0), 512)) { $ended = true; continue; }
    if ($ended) exit(1);
    $sum = substr_replace($h, str_repeat(" ", 8), 148, 8);
    $oct = trim(substr($h, 148, 8), " ".chr(0));
    if (!preg_match("/^[0-7]+$/", $oct) || octdec($oct) !== array_sum(unpack("C*", $sum))) exit(1);
    if (substr($h, 257, 5) !== "ustar") exit(1);
    $name = rtrim(substr($h, 0, 100), chr(0));
    $prefix = rtrim(substr($h, 345, 155), chr(0));
    $name = rtrim(($prefix === "" ? "" : $prefix."/").$name, "/");
    if (!preg_match("~^(backend|public_html|ops|release\\.json)(/|$)~", $name)
        || preg_match("~(^|/)\\.\\.?(/|$)|//|[\\x00-\\x1f\\x7f]~", $name) || isset($seen[$name])) exit(1);
    $seen[$name] = true;
    $type = $h[156];
    if (!in_array($type, ["0", chr(0), "5"], true)) exit(1);
    $size = trim(substr($h, 124, 12), " ".chr(0));
    if (!preg_match("/^[0-7]+$/", $size)) exit(1);
    $n = (int) ceil(octdec($size) / 512) * 512;
    if ($type === "5" && $n !== 0) exit(1);
    $bytes += $n;
    if ($bytes > 1073741824) exit(1);
    while ($n > 0) { $data = gzread($f, min($n, 65536)); if ($data === false || $data === "") exit(1); $n -= strlen($data); }
}
if (!$ended) exit(1);
gzclose($f);
' "$archive" || fail 'Unsafe release archive'
mkdir "$candidate"
tar -xzf "$archive" -C "$candidate" --no-same-owner
chmod 0711 "$root" "$root/releases" "$candidate"
find "$candidate/public_html" -type d -exec chmod 0755 {} +
find "$candidate/public_html" -type f -exec chmod 0644 {} +
chmod 0700 "$candidate/backend"
"$php" -r '$m=json_decode(file_get_contents($argv[1]),true); exit(($m["id"]??null)===$argv[2]?0:1);' "$candidate/release.json" "$id" || fail 'Release manifest mismatch'
[[ ! -e "$candidate/backend/.env" && ! -e "$candidate/backend/storage" ]] || fail 'Release contains persistent state'
mkdir -p "$root/shared/storage/framework/cache/data" "$root/shared/storage/framework/sessions" "$root/shared/storage/framework/views" "$root/shared/storage/logs" "$root/shared/storage/app/private" "$root/shared/backups"
ln -s "$root/shared/.env" "$candidate/backend/.env"
ln -s "$root/shared/storage" "$candidate/backend/storage"
cd "$candidate/backend"
"$php" vendor/composer/platform_check.php
"$php" artisan package:discover --ansi
"$php" artisan crm:check-deployment
"$php" artisan crm:backup "$root/shared/backups"
"$php" artisan migrate --force
"$php" artisan crm:check-deployment --after-migrate
"$php" artisan config:cache
"$php" artisan route:cache
# Views live in shared storage; cache after migration, before activation.
"$php" artisan view:cache
previous=$(readlink "$root/current")
next="$root/.current-$id"
ln -s "$candidate" "$next"
"$php" -r 'exit(rename($argv[1],$argv[2])?0:1);' "$next" "$root/current"
rollback() {
  local code=$?
  if [[ "$code" != 0 ]]; then
    ln -s "$previous" "$next"
    "$php" -r 'exit(rename($argv[1],$argv[2])?0:1);' "$next" "$root/current"
    echo 'HTTP verification failed: code rolled back; database migrations retained.' >&2
  fi
  rm -f "$root/incoming/health-$id.json"
  exit "$code"
}
trap rollback EXIT
health="$root/incoming/health-$id.json"
curl --fail --silent --show-error --retry 2 --max-time 30 --output "$health" "$url/release.json?release=$id"
"$php" -r '$m=json_decode(file_get_contents($argv[1]),true); exit(($m["id"]??null)===$argv[2]?0:1);' "$health" "$id"
curl --fail --silent --show-error --retry 2 --max-time 30 --output "$health" "$url/api/lead-session?release=$id"
"$php" -r '$m=json_decode(file_get_contents($argv[1]),true); exit(is_string($m["csrf_token"]??null)&&strlen($m["csrf_token"])>0?0:1);' "$health"
echo "Activated release $id"
