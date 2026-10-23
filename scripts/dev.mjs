import {spawnSync} from 'node:child_process';
import './sites-env.mjs';
const r=spawnSync(process.execPath,['scripts/db-local.mjs'],{stdio:'inherit'});
if(r.error)throw r.error;
if(r.status!==0)process.exit(r.status??1);
const extra=process.argv.slice(2);
process.argv=[process.execPath,new URL('./run-framework.mjs',import.meta.url).pathname,'dev',...extra];
await import('./run-framework.mjs');
