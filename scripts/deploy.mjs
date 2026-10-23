import {spawnSync} from 'node:child_process';
import {existsSync} from 'node:fs';
import './sites-env.mjs';
if(!existsSync('dist/server/wrangler.json'))throw Error('Build first: npm run build');
for(const args of [
 ['d1','migrations','apply','DB','--remote','--config','wrangler.json'],
 ['deploy','--config','dist/server/wrangler.json']
]){
 const r=spawnSync(process.execPath,['--import','./scripts/sites-env.mjs','./node_modules/wrangler/bin/wrangler.js',...args],{stdio:'inherit',env:{...process.env,CI:'true'}});
 if(r.error)throw r.error;
 if(r.status!==0)process.exit(r.status??1);
}
