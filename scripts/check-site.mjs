import assert from 'node:assert/strict';
const prod=process.argv.includes('--production');
const url=new URL(prod?'https://setu.anikethkalagara.com/':'http://127.0.0.1:5173/');
const response=await fetch(url,{signal:AbortSignal.timeout(20000)}).catch(()=>{throw Error(`Could not reach ${url}. ${prod?'Check Cloudflare deployment status.':'Start npm run dev in another terminal first.'}`)});
assert.equal(response.status,200,'The homepage must return HTTP 200.');
const html=await response.text();
assert(html.includes('Different generations.'),'The Setu homepage is missing.');
assert(!html.includes('Log in to access'),'A sign-in gate is blocking visitors.');
const api=await fetch(new URL('/api/room/INVALID',url),{signal:AbortSignal.timeout(20000)});
assert.equal(api.status,404,'An unknown room should return 404.');
const data=await api.json();
assert(data.error?.includes('Room not found or expired'),'The multiplayer database is unavailable.');
if(prod){
 assert.equal(new URL(response.url).protocol,'https:','Production must use HTTPS.');
 const version=await fetch(new URL('/version.json?check='+Date.now(),url),{signal:AbortSignal.timeout(20000)}).then(r=>r.ok?r.json():null);
 if(version)console.log('Production commit:',version.commit,'Built:',version.builtAt);
 const redirect=await fetch('http://setu.anikethkalagara.com/',{redirect:'manual',signal:AbortSignal.timeout(20000)});
 assert([301,302,307,308].includes(redirect.status)&&redirect.headers.get('location')?.startsWith('https://setu.anikethkalagara.com'),'HTTP must redirect to HTTPS.');
}
console.log(`PASS: ${prod?'Production':'Local'} homepage, anonymous access and multiplayer database${prod?', trusted HTTPS and HTTP redirect':''}.`);
