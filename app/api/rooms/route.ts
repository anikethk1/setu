import {env} from 'cloudflare:workers';
import {makeRoom,uid} from '../../lib/engine';
import {sessionModes,type SessionMode} from '../../lib/content';
export async function POST(request:Request){
 try {
  const input=await request.json() as any;
  if(input.mode!==undefined&&!sessionModes.includes(input.mode))throw Error('Choose a valid game.');
  if(!env.DB)throw Error('Room storage is temporarily unavailable. Try practice mode.');
  await env.DB.prepare('DELETE FROM rooms WHERE expires_at < ?').bind(Date.now()).run();
  for(let i=0;i<5;i++){
   const letters='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';const bytes=crypto.getRandomValues(new Uint8Array(6));const code=Array.from(bytes,b=>letters[b%letters.length]).join('');
   const host=uid(),r=makeRoom(code,host,input.quick!==false,(input.mode||'all') as SessionMode);
   const result=await env.DB.prepare('INSERT OR IGNORE INTO rooms (code,state,revision,expires_at) VALUES (?,?,0,?)').bind(code,JSON.stringify(r),r.expires).run();
   if(result.meta.changes)return Response.json({code,host},{headers:{'Cache-Control':'no-store'}});
  }
  throw Error('Could not create a room. Please try again.');
 }catch(e){return Response.json({error:e instanceof Error?e.message:'Could not create room.'},{status:400})}
}
