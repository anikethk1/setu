import {spawnSync} from 'node:child_process';
import './sites-env.mjs';
console.log('\nPreparing your local-only game database…');
const r=spawnSync(process.execPath,['--import','./scripts/sites-env.mjs','./node_modules/wrangler/bin/wrangler.js','d1','migrations','apply','DB','--local','--config','wrangler.json','--persist-to','.wrangler/state'],{stdio:'inherit',env:{...process.env,CI:'true'}});
if(r.error)throw r.error;
process.exitCode=r.status??1;
