import { useEffect, useState } from 'react';

export interface ReplyRule { id:string; keyword:string; reply:string; mode:'關鍵字'|'預設回應'; enabled:boolean; title?:string; keywords?:string[]; messages?:string[]; start?:string; end?:string; scheduleKind?:'period'|'daily'; timezone?:string }
export interface TrainingConfig { welcome:string[]; welcomeEnabled:boolean; autoEnabled:boolean; rules:ReplyRule[] }
const KEY='linetech.training.reply.v1';
const EVENT='linetech-training-reply';
const initial:TrainingConfig={welcome:['歡迎加入好友！'],welcomeEnabled:true,autoEnabled:true,rules:[]};
export function readTraining():TrainingConfig {
  try {return {...initial,...JSON.parse(localStorage.getItem(KEY)||'{}')};} catch {return initial;}
}
export function updateTraining(patch:Partial<TrainingConfig>):boolean {
  try {localStorage.setItem(KEY,JSON.stringify({...readTraining(),...patch}));window.dispatchEvent(new Event(EVENT));return true;}catch{return false;}
}
export function useTraining() {
  const [config,setConfig]=useState(readTraining);
  useEffect(()=>{const reload=()=>setConfig(readTraining());window.addEventListener(EVENT,reload);window.addEventListener('storage',reload);return()=>{window.removeEventListener(EVENT,reload);window.removeEventListener('storage',reload);};},[]);
  return config;
}
// Normalize only ASCII case and full-/half-width characters; preserve exact message matching.
export function normalizeKeyword(value:string):string {
  return value.replace(/[\uFF01-\uFF5E]/g,ch=>String.fromCharCode(ch.charCodeAt(0)-0xFEE0)).replace(/\u3000/g,' ').replace(/[\uFF61-\uFF9F]+/g,s=>s.normalize('NFKC')).toLowerCase();
}
export function ruleKeywords(rule:ReplyRule):string[]{return rule.keywords??(rule.mode==='關鍵字'&&rule.keyword?[rule.keyword]:[]);}
export function ruleMessages(rule:ReplyRule):string[]{return rule.messages??[rule.reply];}
export function activeRule(rule:ReplyRule,now=new Date()):boolean {
  if(!rule.enabled)return false;
  if(!rule.start&&!rule.end)return true;
  if(rule.scheduleKind){
    const parts=new Intl.DateTimeFormat('en-CA',{timeZone:rule.timezone||'Asia/Taipei',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(now);
    const get=(type:string)=>parts.find(p=>p.type===type)?.value||'';
    const today=get('year')+'-'+get('month')+'-'+get('day');
    const time=get('hour')+':'+get('minute');
    if(rule.scheduleKind==='period')return (!rule.start||today>=rule.start)&&(!rule.end||today<=rule.end);
    if(!rule.start||!rule.end)return false;
    return rule.start<=rule.end?time>=rule.start&&time<=rule.end:time>=rule.start||time<=rule.end;
  }
  return (!rule.start||new Date(rule.start)<=now)&&(!rule.end||new Date(rule.end)>=now);
}
export function resolveRule(input:string,config:TrainingConfig,now=new Date()):ReplyRule|null {
  if(!config.autoEnabled||!input.trim())return null;
  const query=normalizeKeyword(input);
  const active=config.rules.filter(r=>activeRule(r,now));
  const exact=active.find(r=>ruleKeywords(r).some(k=>normalizeKeyword(k)===query));
  if(exact)return exact;
  const fallback=active.filter(r=>ruleKeywords(r).length===0);
  // The newer Japanese official app specifies period > daily time > unscheduled.
  const ranked=[fallback.filter(r=>r.start&&r.scheduleKind!=='daily'),fallback.filter(r=>r.scheduleKind==='daily'),fallback.filter(r=>!r.start&&!r.end)];
  const pool=ranked.find(p=>p.length)||[];
  return pool.length?pool[Math.floor(Math.random()*pool.length)]:null;
}
export function resolveReply(input:string,config:TrainingConfig):string|null {
  const r=resolveRule(input,config);return r?ruleMessages(r).map(welcomeText).join('\n'):null;
}
export function welcomeText(text:string) {
  return text.replaceAll('[好友顯示名稱]','王小明').replaceAll('[帳號名稱]','康立全球智能系統');
}
