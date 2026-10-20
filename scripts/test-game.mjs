import assert from 'node:assert/strict';
import {build} from 'esbuild';
const bundle=await build({entryPoints:['app/lib/engine.ts'],bundle:true,platform:'node',format:'esm',write:false});
const {makeRoom,applyAction,snapshot}=await import('data:text/javascript;base64,'+Buffer.from(bundle.outputFiles[0].text).toString('base64'));
const q={field:'Engineering or technology',dream:'Arts, design, or media',current:'Engineering or technology',interests:[],factor:'interest',sensitive:false,support:1};
const r=makeRoom('TEST23','host');
const a=applyAction(r,'','',{action:'join',role:'student'}).token;
const b=applyAction(r,'','',{action:'join',role:'parent'}).token;
for(const token of [a,b])applyAction(r,token,'',{action:'ready',quiz:q});
assert.throws(()=>applyAction(r,a,'wrong',{action:'advance'}));
applyAction(r,'','host',{action:'advance'});
assert.equal(r.plan.length,3);
for(const token of [a,b])applyAction(r,token,'',{action:'answer',index:0,phase:'answer',own:'An anonymous response'});
assert.equal(snapshot(r,a).round.samples.length,0);
applyAction(r,'','host',{action:'advance'});
assert(snapshot(r,a).round.samples.every(s=>!('role'in s)));
assert(!JSON.stringify(snapshot(r,a)).includes(b));
for(const token of [a,b])applyAction(r,token,'',{action:'answer',index:0,phase:'guess',votes:r.rounds[0].samples.map(s=>s.role)});
applyAction(r,'','host',{action:'advance'});
assert.equal(r.players[0].score,2);assert.equal(snapshot(r,a).lines.length,0);
applyAction(r,'','host',{action:'advance'});
for(const token of [a,b])applyAction(r,token,'',{action:'answer',index:1,phase:'answer',own:0,prediction:0});
applyAction(r,'','host',{action:'advance'});assert.equal(r.players[0].score,4);
applyAction(r,'','host',{action:'advance'});
for(const token of [a,b])applyAction(r,token,'',{action:'answer',index:2,phase:'answer',own:0,prediction:0,ranking:[0,1,2,3]});
applyAction(r,'','host',{action:'advance'});assert.equal(r.players[0].score,7);
applyAction(r,'','host',{action:'advance'});assert.equal(r.status,'letter');
applyAction(r,a,'',{action:'consent',ids:r.lines.filter(l=>l.token===a).map(l=>l.id),line:'A closing line.'});
assert.equal(snapshot(r,'','',true).lines.length,2);
assert(!JSON.stringify(snapshot(r,'','',true)).includes(a));
applyAction(r,a,'',{action:'consent',ids:[],line:''});assert.equal(snapshot(r,'','',true).lines.length,0);
const full=makeRoom('FULL23','host',false);for(const role of ['student','parent']){let token=applyAction(full,'','',{action:'join',role}).token;applyAction(full,token,'',{action:'ready',quiz:q})}applyAction(full,'','host',{action:'advance'});assert.equal(full.plan.length,17);assert(!full.plan.some(p=>p.sensitive));assert(full.plan.find(p=>p.id==='career').text.includes('arts, design, or media'));
console.log('PASS: authorization, anonymous snapshot, 3 games, scores, consent, revocation, full-session opt-in and personalization');
for(const mode of ['guess','predict','triage']){
 for(const quick of [true,false]){
  const single=makeRoom('SINGLE','host',quick,mode);
  for(const role of ['student','parent']){const {token}=applyAction(single,'','',{action:'join',role});applyAction(single,token,'',{action:'ready',quiz:q})}
  applyAction(single,'','host',{action:'advance'});
  assert(single.plan.every(p=>p.game===mode));
  assert.equal(single.plan.length,quick?1:mode==='guess'?7:mode==='predict'?4:6);
  assert.equal(snapshot(single).mode,mode);
  const round=single.rounds[0];
  if(mode!=='guess'){
   for(const p of single.players){const choices=p.role==='parent'&&round.prompt.parents?round.prompt.parents:round.prompt.choices;applyAction(single,p.token,'',{action:'answer',index:0,phase:'answer',own:0,prediction:0,...mode==='triage'?{ranking:choices.map((_,i)=>i)}:{}})}
   applyAction(single,'','host',{action:'advance'});
   assert.equal(single.players[0].score,mode==='predict'?2:3);
  }
 }
}
console.log('PASS: individual game selection, quick/full plans and direct prediction/triage scoring');
