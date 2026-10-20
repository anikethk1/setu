import {guessPrompts,predictions,triages,choicesFor,type Prompt,type Role,type SessionMode} from './content';
export type Quiz={field:string;dream:string;current:string;interests:string[];factor:string;sensitive:boolean;support:number};
export type Player={token:string;role:Role;quiz:Quiz|null;score:number;correct:number;attempts:number};
export type Answer={own?:string|number;prediction?:number;ranking?:number[];votes?:Role[];skip?:boolean};
export type Round={prompt:Prompt;answers:Record<string,Answer>;samples:{id:string;text:string;role:Role}[];deadline:number;scored:boolean};
export type Line={id:string;token:string;text:string;approved:boolean};
export type Room={code:string;host:string;created:number;expires:number;status:'lobby'|'playing'|'letter';phase:'answer'|'guess'|'reveal';quick:boolean;mode?:SessionMode;players:Player[];plan:Prompt[];index:number;rounds:Round[];lines:Line[]};
export function makeRoom(code:string,host:string,quick=true,mode:SessionMode='all'):Room {return {code,host,mode,created:Date.now(),expires:Date.now()+86400000,status:'lobby',phase:'answer',quick,players:[],plan:[],index:0,rounds:[],lines:[]}}
export const uid=()=>crypto.randomUUID();
export function newPlayer(token:string,role:Role):Player{return {token,role,quiz:null,score:0,correct:0,attempts:0}}
function common(r:Room,key:'dream'|'current'){const vals=r.players.filter(p=>p.role==='student'&&p.quiz).map(p=>p.quiz![key]).filter(v=>v&&v!=='Undecided');return vals.sort((a,b)=>vals.filter(v=>v===b).length-vals.filter(v=>v===a).length)[0]|| (key==='dream'?'arts, design, or media':'engineering or technology')}
function beginRound(r:Room){r.rounds.push({prompt:r.plan[r.index],answers:{},samples:[],deadline:Date.now()+60000,scored:false});r.phase='answer'}
function top(r:Room,role:Role){const round=r.rounds[r.index];const counts=Array(choicesFor(round.prompt,role).length).fill(0);for(const p of r.players.filter(p=>p.role===role)){const a=round.answers[p.token];if(a&&!a.skip&&typeof a.own==='number')counts[a.own]++}const rankers=r.players.filter(p=>p.role===role&&round.answers[p.token]?.ranking?.length);const averages=counts.map((_,i)=>rankers.length?rankers.reduce((sum,p)=>sum+(round.answers[p.token].ranking!.indexOf(i)+1),0)/rankers.length:null);const max=Math.max(...counts);return {counts,averages,winners:max>0?counts.map((n,i)=>n===max?i:-1).filter(n=>n>=0):[]}}
export function advance(r:Room){
 if(r.status==='lobby'){
  const ready=r.players.filter(p=>p.quiz);if(ready.length<2||!ready.some(p=>p.role==='student')||!ready.some(p=>p.role==='parent'))throw Error('You need at least one ready student and one ready parent to begin.');
  r.players=ready;const mental=ready.every(p=>p.quiz?.sensitive);const pp=predictions.filter(p=>!p.sensitive||mental);
  r.plan=(r.quick?[guessPrompts[0],pp[0],triages[1]]:[...guessPrompts,...pp,...triages]).filter(p=>!r.mode||r.mode==='all'||p.game===r.mode).map(p=>({...p,text:p.text.replace('{dream}',common(r,'dream').toLowerCase()).replace('{current}',common(r,'current').toLowerCase())}));r.status='playing';beginRound(r);return;
 }
 if(r.status!=='playing')return;
 const round=r.rounds[r.index];
 if(r.phase==='answer'&&round.prompt.game==='guess'){
  round.samples=r.players.map(p=>({id:p.token,text:String(round.answers[p.token]?.own||''),role:p.role})).filter(x=>x.text).sort(()=>Math.random()-.5).slice(0,5);
  r.phase=round.samples.length?'guess':'reveal';round.deadline=Date.now()+30000;if(r.phase==='reveal')score(r);return;
 }
 if(r.phase!=='reveal'){r.phase='reveal';score(r);return}
 if(r.index+1<r.plan.length){r.index++;beginRound(r)}else r.status='letter';
}
function score(r:Room){const round=r.rounds[r.index];if(round.scored)return;round.scored=true;
 for(const p of r.players){const a=round.answers[p.token];if(!a||a.skip)continue;
  if(round.prompt.game==='guess'){const votes=a.votes||[];votes.forEach((v,i)=>{p.attempts++;if(v===round.samples[i]?.role){p.correct++;p.score++}})}else {const other=p.role==='student'?'parent':'student';const t=top(r,other);if(t.winners.length){p.attempts++;if(t.winners.includes(a.prediction??-1)){p.correct++;p.score+=round.prompt.game==='predict'?2:3}}}
 }
 if(round.prompt.game==='guess')for(const p of r.players){const text=round.answers[p.token]?.own;if(typeof text==='string'&&text.trim())r.lines.push({id:`${r.index}-${uid()}`,token:p.token,text,approved:false})}
}
export function applyAction(r:Room,token:string,host:string,body:any){
 if(body.action==='join'){
  if(r.status!=='lobby')throw Error('This room has already started. Ask the host to create a new room.');
  if(r.players.length>=60)throw Error('This room is full (60 players).');
  if(!['student','parent'].includes(body.role))throw Error('Choose student or parent.');
  const existing=r.players.find(p=>p.token===token);if(existing)return {token:existing.token};
  const t=uid();r.players.push(newPlayer(t,body.role));return {token:t};
 }
 const p=r.players.find(p=>p.token===token);
 if(body.action==='advance'){if(host!==r.host)throw Error('Only the host can advance the room.');advance(r);return {}}
 if(!p)throw Error('Join this room to continue.');
 if(body.action==='ready'){
  if(r.status!=='lobby')throw Error('The session has already started.');const q=body.quiz||{};
  p.quiz={field:String(q.field||'Undecided').slice(0,100),dream:String(q.dream||'Undecided').slice(0,100),current:String(q.current||'Undecided').slice(0,100),interests:Array.isArray(q.interests)?q.interests.slice(0,2).map((x:any)=>String(x).slice(0,60)):[],factor:String(q.factor||'').slice(0,100),sensitive:q.sensitive===true,support:Math.min(10,Math.max(1,Number(q.support)||1))};return {};
 }
 if(body.action==='answer'){
  if(r.status!=='playing'||r.phase==='reveal')throw Error('This round has closed.');
  const round=r.rounds[r.index];if(body.index!==r.index||body.phase!==r.phase)throw Error('The round has moved on. Please try the current round.');
  if(Date.now()>round.deadline+1000)throw Error('Time is up. Your host will reveal the responses shortly.');
  if(body.skip){round.answers[token]={skip:true};return {}}
  if(r.phase==='guess'){
   if(!Array.isArray(body.votes)||body.votes.length!==round.samples.length||body.votes.some((v:any)=>!['student','parent'].includes(v)))throw Error('Make a guess for each response.');
   round.answers[token]={...round.answers[token],votes:body.votes};return {};
  }
  if(round.prompt.game==='guess'){
   const text=String(body.own||'').trim();if(!text||text.length>280)throw Error('Write a response of 1–280 characters.');round.answers[token]={own:text};return {};
  }
  const choices=choicesFor(round.prompt,p.role),other=choicesFor(round.prompt,p.role==='student'?'parent':'student');
  if(!Number.isInteger(body.own)||body.own<0||body.own>=choices.length||!Number.isInteger(body.prediction)||body.prediction<0||body.prediction>=other.length)throw Error('Choose your answer and make a prediction.');
  if(round.prompt.game==='triage'&&(!Array.isArray(body.ranking)||body.ranking.length!==choices.length||new Set(body.ranking).size!==choices.length||body.ranking.some((x:any)=>!Number.isInteger(x)||x<0||x>=choices.length)||body.ranking[0]!==body.own))throw Error('Rank every choice before submitting.');
  round.answers[token]={own:body.own,prediction:body.prediction,ranking:body.ranking};return {};
 }
 if(body.action==='consent'){
  if(r.status!=='letter')throw Error('The shared letter opens at the end of the session.');
  const ids=Array.isArray(body.ids)?body.ids:[];r.lines.filter(l=>l.token===token).forEach(l=>l.approved=ids.includes(l.id));
  const text=String(body.line||'').trim().slice(0,280);const id=`closing-${uid()}`;r.lines=r.lines.filter(l=>!(l.token===token&&l.id.startsWith('closing-')));if(text)r.lines.push({id,token,text,approved:true});return {};
 }
 throw Error('That action is not available.');
}
export function snapshot(r:Room,token='',host='',letterOnly=false){
 const self=r.players.find(p=>p.token===token);const round=r.rounds[r.index];const reveal=r.phase==='reveal';const student=round?top(r,'student'):null,parent=round?top(r,'parent'):null;
 const answered=round?r.players.filter(p=>r.phase==='guess'?round.answers[p.token]?.votes||round.answers[p.token]?.skip:round.answers[p.token]).length:0;
 const approved=r.lines.filter(l=>l.approved).map(l=>({id:l.id,text:l.text}));
 if(letterOnly)return {code:r.code,status:r.status,lines:r.status==='letter'?approved:[],expires:r.expires};
 return {code:r.code,expires:r.expires,status:r.status,phase:r.phase,quick:r.quick,mode:r.mode||'all',isHost:host===r.host,index:r.index,total:r.plan.length,counts:{student:r.players.filter(p=>p.role==='student').length,parent:r.players.filter(p=>p.role==='parent').length,ready:r.players.filter(p=>p.quiz).length,total:r.players.length},self:self?{role:self.role,ready:!!self.quiz,score:self.score,correct:self.correct,attempts:self.attempts,answer:round?.answers[token],lines:r.lines.filter(l=>l.token===token).map(({id,text,approved})=>({id,text,approved}))}:null,
 round:round?{prompt:round.prompt,deadline:round.deadline,answered,samples:round.samples.map(s=>({text:s.text,...reveal?{role:s.role}:{}})),...reveal?{student,parent}:{} }:null,
 scores:['student','parent'].map(role=>({role,score:r.players.filter(p=>p.role===role).reduce((n,p)=>n+p.score,0),correct:r.players.filter(p=>p.role===role).reduce((n,p)=>n+p.correct,0),attempts:r.players.filter(p=>p.role===role).reduce((n,p)=>n+p.attempts,0)})),lines:approved};
}
export const practiceTexts=['That the people I love would think I didn’t try hard enough.','Watching my child be hard on themselves.','Not knowing what comes next, even after doing everything right.','Letting my family down when they’ve given me so much.','That a setback might make someone stop believing in themselves.'];
export function fillPractice(r:Room,self:string){if(r.status!=='playing')return;const round=r.rounds[r.index];r.players.filter(p=>p.token!==self).forEach((p,i)=>{if(r.phase==='answer'){round.answers[p.token]=round.prompt.game==='guess'?{own:practiceTexts[i%5]}:{own:i%choicesFor(round.prompt,p.role).length,prediction:(i+1)%choicesFor(round.prompt,p.role==='student'?'parent':'student').length,ranking:choicesFor(round.prompt,p.role).map((_,j)=>(j+i)%choicesFor(round.prompt,p.role).length)}}else if(r.phase==='guess')round.answers[p.token]={...round.answers[p.token],votes:round.samples.map((_,j)=>(i+j)%2?'student':'parent')};});}
