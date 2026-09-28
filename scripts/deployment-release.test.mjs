import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, readdir, symlink, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { buildRelease } from './deploy/package-release.mjs';
const id='a'.repeat(40)+'-1-1';
async function fixture() {
  const root=await mkdtemp(join(tmpdir(),'truetell-release-'));
  for(const name of ['dist','backend/app','backend/bootstrap/cache','backend/config','backend/database/migrations','backend/public','backend/resources/views','backend/routes','backend/vendor/composer','backend/lang','scripts/deploy']) await mkdir(join(root,name),{recursive:true});
  const files={'dist/index.html':'site','dist/.htaccess':'rules','backend/bootstrap/app.php':'php','backend/bootstrap/providers.php':'php','backend/artisan':'artisan','backend/composer.json':'{}','backend/composer.lock':'{}','backend/.env.example':'APP_KEY=','backend/vendor/autoload.php':'php','backend/vendor/composer/installed.json':'{"dev":false,"packages":[]}','backend/config/company.json':'{"brandName":"Test"}','backend/public/index.php':'php','backend/app/Test.php':'app','backend/.env':'SECRET','backend/database/private.sqlite':'SECRET','backend/bootstrap/cache/config.php':'SECRET','backend/storage/logs/app.log':'SECRET','backend/tests/secret.php':'SECRET'};
  for(const [file,content] of Object.entries(files)){await mkdir(join(root,file,'..'),{recursive:true});await writeFile(join(root,file),content);}
  return root;
}
test('release contains only deployable code and static site, never secrets or runtime state',async()=>{
  const root=await fixture();try {
    const destination=join(root,'stage');await buildRelease({root,destination,releaseId:id});
    assert.equal(await readFile(join(destination,'public_html/index.html'),'utf8'),'site');
    assert.equal(await readFile(join(destination,'backend/app/Test.php'),'utf8'),'app');
    for(const file of ['backend/.env','backend/database/private.sqlite','backend/bootstrap/cache/config.php','backend/storage','backend/tests']) await assert.rejects(readFile(join(destination,file)));
    assert.deepEqual(await readdir(join(destination,'backend/bootstrap/cache')),[]);
    assert.equal(JSON.parse(await readFile(join(destination,'public_html/release.json'),'utf8')).id,id);
  } finally {await rm(root,{recursive:true,force:true});}
});
test('release rejects dev dependencies, unsafe identifiers and symlinks',async()=>{
  const root=await fixture();try {
    await assert.rejects(buildRelease({root,destination:join(root,'stage1'),releaseId:'../../escape'}),/release/i);
    await writeFile(join(root,'backend/vendor/composer/installed.json'),'{"dev":true,"packages":[]}');
    await assert.rejects(buildRelease({root,destination:join(root,'stage2'),releaseId:id}),/development/i);
    await writeFile(join(root,'backend/vendor/composer/installed.json'),'{"dev":false,"packages":[]}');
    await symlink(join(root,'backend/.env'),join(root,'dist/leak'));
    await assert.rejects(buildRelease({root,destination:join(root,'stage3'),releaseId:id}),/symlink/i);
  } finally {await rm(root,{recursive:true,force:true});}
});
