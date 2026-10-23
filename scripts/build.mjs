import {spawnSync} from 'node:child_process';
import {writeFileSync} from 'node:fs';
import './sites-env.mjs';
const git=spawnSync('git',['rev-parse','HEAD'],{encoding:'utf8'});
const commit=git.status===0?git.stdout.trim():'unknown';
writeFileSync('public/version.json',JSON.stringify({commit,builtAt:new Date().toISOString()})+'\n');
process.argv=[process.execPath,new URL('./run-framework.mjs',import.meta.url).pathname,'build',...process.argv.slice(2)];
await import('./run-framework.mjs');
