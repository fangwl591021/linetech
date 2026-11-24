import { useEffect, useState } from 'react';

export interface ReplyRule { id:string; keyword:string; reply:string; mode:'關鍵字'|'預設回應'; enabled:boolean; title?:string; keywords?:string[]; messages?:string[]; start?:string; end?:string }
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
  return rule.enabled&&(!rule.start||new Date(rule.start)<=now)&&(!rule.end||new Date(rule.end)>=now);
}
export function resolveRule(input:string,config:TrainingConfig,now=new Date()):ReplyRule|null {
  if(!config.autoEnabled||!input.trim())return null;
  const query=normalizeKeyword(input);
  const active=config.rules.filter(r=>activeRule(r,now));
  const exact=active.find(r=>ruleKeywords(r).some(k=>normalizeKeyword(k)===query));
  if(exact)return exact;
  const fallback=active.filter(r=>ruleKeywords(r).length===0);
  return fallback.length?fallback[Math.floor(Math.random()*fallback.length)]:null;
}
export function resolveReply(input:string,config:TrainingConfig):string|null {
  const r=resolveRule(input,config);return r?ruleMessages(r).map(welcomeText).join('\n'):null;
}
export function welcomeText(text:string) {
  return text.replaceAll('[好友顯示名稱]','王小明').replaceAll('[帳號名稱]','康立全球智能系統');
}
