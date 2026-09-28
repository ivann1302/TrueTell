import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, symlink, readlink, rm, chmod, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
const script=resolve('scripts/deploy/activate.sh');
const prepare=resolve('scripts/deploy/prepare-host.sh');
const id='a'.repeat(40)+'-1-1';
async function fixture() {
  const top=await mkdtemp(join(tmpdir(),'truetell-activation-'));
  const root=join(top,'private');const publicPath=join(top,'public_html');const bin=join(top,'bin');
  for(const dir of ['shared/storage','releases/previous/public_html','incoming']) await mkdir(join(root,dir),{recursive:true});
  await mkdir(bin);await writeFile(join(root,'shared/.env'),'SECRET=kept');await writeFile(join(root,'releases/previous/public_html/index.html'),'old');
  await symlink(join(root,'releases/previous'),join(root,'current'));await symlink(join(root,'current/public_html'),publicPath);
  const stage=join(top,'stage');await mkdir(join(stage,'backend/vendor/composer'),{recursive:true});await mkdir(join(stage,'backend/bootstrap/cache'),{recursive:true});await mkdir(join(stage,'public_html'));await mkdir(join(stage,'ops'));
  await writeFile(join(stage,'backend/artisan'),'php');await writeFile(join(stage,'backend/vendor/composer/platform_check.php'),'<?php');await writeFile(join(stage,'public_html/index.html'),'new');await writeFile(join(stage,'release.json'),JSON.stringify({id}));
  const archive=join(root,'incoming',id+'.tar.gz');assert.equal(spawnSync('tar',['--format=ustar', '-czf',archive,'-C',stage,'backend','public_html','ops','release.json'],{env:{...process.env,COPYFILE_DISABLE:'1'}}).status,0);
  const checksum=createHash('sha256').update(await readFile(archive)).digest('hex');
  const realPhp=spawnSync('which',['php'],{encoding:'utf8'}).stdout.trim();
  await writeFile(join(bin,'php'),`#!/usr/bin/env bash\nif [[ "$1" == "-r" ]]; then exec '${realPhp}' "$@"; fi\nprintf '%s\\n' "$*" >> "$TEST_LOG"\nif [[ "$*" == *"$FAIL_STEP"* && -n "$FAIL_STEP" ]]; then exit 1; fi\nexit 0\n`);
  await chmod(join(bin,'php'),0o755);
  await writeFile(join(bin,'curl'),`#!/usr/bin/env bash\nif [[ "$FAIL_HTTP" == "1" ]]; then exit 22; fi\nfor ((i=1;i<=$#;i++)); do if [[ "\${!i}" == "--output" ]]; then j=$((i+1)); output="\${!j}"; fi; done\nprintf '%s' '{"id":"${id}","csrf_token":"test-token"}' > "$output"\n`);await chmod(join(bin,'curl'),0o755);
  if(process.platform==='darwin'){await writeFile(join(bin,'flock'),'#!/bin/sh\nexit 0\n');await chmod(join(bin,'flock'),0o755);}
  const env={...process.env,PATH:bin+':'+process.env.PATH,TEST_LOG:join(top,'commands.log'),FAIL_STEP:'',FAIL_HTTP:'0'};
  return {top,root,publicPath,bin,checksum,env,async run(extra={}){return spawnSync('bash',[script,root,publicPath,join(bin,'php'),'https://example.com',id,checksum],{env:{...env,...extra},encoding:'utf8'});}};
}
test('deployment backs up before migration and switches complete release without altering secrets',async()=>{
 const f=await fixture();try{const r=await f.run();assert.equal(r.status,0,r.stderr+r.stdout);assert.equal(await readFile(join(f.publicPath,'index.html'),'utf8'),'new');for(const path of [f.root,join(f.root,'releases'),join(f.root,'releases',id)]) assert.ok((await stat(path)).mode & 1,'nginx can traverse public ancestors');assert.equal((await stat(join(f.publicPath,'index.html'))).mode & 0o777,0o644);assert.equal((await stat(join(f.root,'releases',id,'backend'))).mode & 0o777,0o700);assert.equal(await readFile(join(f.root,'shared/.env'),'utf8'),'SECRET=kept');assert.equal(await readlink(join(f.root,'releases',id,'backend/.env')),join(f.root,'shared/.env'));const log=await readFile(f.env.TEST_LOG,'utf8');assert.ok(log.indexOf('crm:backup')<log.indexOf('migrate --force'));assert.match(log,/crm:check-deployment --after-migrate/);}finally{await rm(f.top,{recursive:true,force:true});}
});
test('migration or backup failures leave the current website intact',async()=>{
 for(const step of ['crm:backup','migrate --force']){const f=await fixture();try{const r=await f.run({FAIL_STEP:step});assert.notEqual(r.status,0);assert.match(await readFile(f.env.TEST_LOG,'utf8'),new RegExp(step));assert.equal(await readFile(join(f.publicPath,'index.html'),'utf8'),'old');}finally{await rm(f.top,{recursive:true,force:true});}}
});
test('failed HTTP verification rolls code back without reverting the database',async()=>{
 const f=await fixture();try{const r=await f.run({FAIL_HTTP:'1'});assert.notEqual(r.status,0);assert.equal(await readFile(join(f.publicPath,'index.html'),'utf8'),'old');assert.match(r.stderr,/rolled back/i);}finally{await rm(f.top,{recursive:true,force:true});}
});
test('activation refuses an unprepared public directory and checksum mismatch',async()=>{
 const f=await fixture();try{const r=spawnSync('bash',[script,f.root,f.publicPath,join(f.bin,'php'),'https://example.com',id,'0'.repeat(64)],{env:f.env,encoding:'utf8'});assert.notEqual(r.status,0);assert.equal(await readFile(join(f.publicPath,'index.html'),'utf8'),'old');await rm(f.publicPath);await mkdir(f.publicPath);const unprepared=await f.run();assert.notEqual(unprepared.status,0);assert.match(unprepared.stderr,/prepar/i);}finally{await rm(f.top,{recursive:true,force:true});}
});
test('one-time host preparation preserves old site and is repeatable',async()=>{
 const top=await mkdtemp(join(tmpdir(),'truetell-prepare-'));try{const root=join(top,'private');const pub=join(top,'public_html');await mkdir(pub);await writeFile(join(pub,'index.html'),'old');
 for(let i=0;i<2;i++){const r=spawnSync('bash',[prepare,root,pub],{encoding:'utf8'});assert.equal(r.status,0,r.stderr);assert.equal(await readFile(join(pub,'index.html'),'utf8'),'old');assert.equal(await readlink(pub),root+'/current/public_html');}
 }finally{await rm(top,{recursive:true,force:true});}
});

test('activation rejects raw tar symlinks, hardlinks and parent traversal before extraction',async()=>{
 const {gzipSync}=await import('node:zlib');
 for(const [name,type,target] of [['backend/link','2','/tmp'],['backend/link','1','backend/artisan'],['backend/../../escape','0','']]){
  const f=await fixture();
  try{
   const header=Buffer.alloc(512);
   header.write(name,0);header.write('0000644\0',100);header.write('0000000\0',108);header.write('0000000\0',116);
   header.write('00000000000\0',124);header.write('00000000000\0',136);header.fill(32,148,156);header.write(type,156);header.write(target,157);header.write('ustar\0',257);header.write('00',263);
   const sum=header.reduce((a,b)=>a+b,0).toString(8).padStart(6,'0');header.write(sum+'\0 ',148);
   const archive=gzipSync(Buffer.concat([header,Buffer.alloc(1024)]));
   await writeFile(join(f.root,'incoming',id+'.tar.gz'),archive);
   const checksum=createHash('sha256').update(archive).digest('hex');
   const r=spawnSync('bash',[script,f.root,f.publicPath,join(f.bin,'php'),'https://example.com',id,checksum],{env:f.env,encoding:'utf8'});
   assert.notEqual(r.status,0);assert.match(r.stderr,/Unsafe release archive/);
   assert.equal(await readFile(join(f.publicPath,'index.html'),'utf8'),'old');
  }finally{await rm(f.top,{recursive:true,force:true});}
 }
});
