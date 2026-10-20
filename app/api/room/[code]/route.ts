import {env} from 'cloudflare:workers';
import {applyAction,snapshot,type Room} from '../../../lib/engine';
const reply=(data:any,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store'}});
async function load(code:string){if(!env.DB)throw Error('Room storage is temporarily unavailable.');const row=await env.DB.prepare('SELECT state,revision,expires_at FROM rooms WHERE code = ?').bind(code).first<{state:string;revision:number;expires_at:number}>();if(!row||row.expires_at<Date.now())throw Error('Room not found or expired. Check your code or ask the host for a new room.');return row}
export async function GET(request:Request,{params}:{params:Promise<{code:string}>}){try{const {code}=await params;const row=await load(code.toUpperCase());return reply(snapshot(JSON.parse(row.state),request.headers.get('X-Setu-Token')||'',request.headers.get('X-Setu-Host')||'',new URL(request.url).searchParams.has('letter')))}catch(e){return reply({error:e instanceof Error?e.message:'Room unavailable.'},404)}}
export async function POST(request:Request,{params}:{params:Promise<{code:string}>}){
 try{const {code}=await params;if(Number(request.headers.get('content-length')||0)>12000)throw Error('That response is too large.');const body=await request.json() as any;const token=request.headers.get('X-Setu-Token')||'',host=request.headers.get('X-Setu-Host')||'';
  for(let i=0;i<5;i++){const row=await load(code.toUpperCase());const room:Room=JSON.parse(row.state);const result=applyAction(room,token,host,body);const update=await env.DB!.prepare('UPDATE rooms SET state = ?, revision = revision + 1 WHERE code = ? AND revision = ?').bind(JSON.stringify(room),room.code,row.revision).run();if(update.meta.changes)return reply({...result,room:snapshot(room,(result as any).token||token,host)})}
  throw Error('The room is busy. Please try again.');
 }catch(e){return reply({error:e instanceof Error?e.message:'Could not save your response.'},400)}
}
