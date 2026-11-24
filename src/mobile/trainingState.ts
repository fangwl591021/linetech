import { useEffect, useState } from 'react';

export interface ReplyRule { id:string; keyword:string; reply:string; mode:'關鍵字'|'預設回應'; enabled:boolean }
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
export function resolveReply(input:string,config:TrainingConfig):string|null {
  if(!config.autoEnabled)return null;
  const query=input.trim();
  if(!query)return null;
  return config.rules.find(r=>r.enabled&&r.mode==='關鍵字'&&r.keyword.trim()===query)?.reply
    ??config.rules.find(r=>r.enabled&&r.mode==='預設回應')?.reply??null;
}
export function welcomeText(text:string) {
  return text.replaceAll('[好友顯示名稱]','王小明').replaceAll('[帳號名稱]','康立全球智能系統');
}
