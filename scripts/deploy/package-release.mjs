import { cp, lstat, mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { resolve, join, basename } from 'node:path';
import { pathToFileURL } from 'node:url';
import { spawnSync } from 'node:child_process';

const idPattern = /^[a-f0-9]{40}-[0-9]+-[0-9]+$/;
async function copyTree(source, destination) {
  const stat = await lstat(source);
  if (stat.isSymbolicLink()) throw new Error(`Symlink is not allowed in release: ${source}`);
  if (/[\r\n]/.test(basename(source))) throw new Error('Invalid release filename');
  if (stat.isDirectory()) {
    await mkdir(destination, { recursive: true });
    for (const entry of await readdir(source)) {
      if (entry === '.git' || entry === '.gitignore' || entry.startsWith('.env') || entry.endsWith('.sqlite') || entry.endsWith('.log')) continue;
      await copyTree(join(source, entry), join(destination, entry));
    }
  } else if (stat.isFile()) {
    await mkdir(resolve(destination, '..'), { recursive: true });
    await cp(source, destination, { preserveTimestamps: true });
  } else throw new Error(`Non-regular file in release: ${source}`);
}

export async function buildRelease({ root, destination, releaseId }) {
  if (!idPattern.test(releaseId)) throw new Error('Invalid release identifier');
  const installed = JSON.parse(await readFile(join(root, 'backend/vendor/composer/installed.json'), 'utf8'));
  if (installed.dev !== false) throw new Error('Remove development dependencies before packaging');
  await mkdir(destination); // Refuse reuse of a dirty staging directory.
  await copyTree(join(root, 'dist'), join(destination, 'public_html'));
  for (const entry of ['app', 'config', 'database/migrations', 'lang', 'resources/views', 'routes', 'vendor', 'artisan', 'composer.json', 'composer.lock', 'public/index.php']) {
    await copyTree(join(root, 'backend', entry), join(destination, 'backend', entry));
  }
  for (const entry of ['app.php', 'providers.php']) {
    await copyTree(join(root, 'backend/bootstrap', entry), join(destination, 'backend/bootstrap', entry));
  }
  await mkdir(join(destination, 'backend/bootstrap/cache'), { recursive: true });
  await cp(join(root, 'backend/.env.example'), join(destination, 'backend/.env.example'));
  await copyTree(join(root, 'scripts/deploy'), join(destination, 'ops'));
  const metadata = JSON.stringify({ id: releaseId, revision: releaseId.split('-')[0] }) + '\n';
  await writeFile(join(destination, 'release.json'), metadata);
  await writeFile(join(destination, 'public_html/release.json'), metadata);
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const [releaseId, output = '.deploy-artifact'] = process.argv.slice(2);
  const parent = resolve(output);
  await mkdir(parent, { recursive: true });
  const stage = join(parent, 'release');
  await buildRelease({ root: process.cwd(), destination: stage, releaseId });
  const archive = join(parent, 'release.tar.gz');
  const result = spawnSync('tar', ['--format=ustar', '-czf', archive, '-C', stage, 'public_html', 'backend', 'ops', 'release.json'], { stdio: 'inherit', env: { ...process.env, COPYFILE_DISABLE: '1' } });
  if (result.status !== 0) throw new Error('Release archive creation failed');
  console.log(`Production release packaged: ${archive}`);
}
