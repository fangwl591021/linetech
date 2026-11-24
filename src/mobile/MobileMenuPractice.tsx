import { useEffect, useState } from 'react';
import type { RichMenuTemplate, ActionType } from '../domain/types';
import { useTraining, resolveReply, welcomeText } from './trainingState';

export interface MobileMenuConfig {
  title:string; start:string; end:string; barText:string; show:boolean;
  actions:Record<string,{type:ActionType;value:string;label:string}>;
}
export const emptyMenu:MobileMenuConfig={title:'',start:'',end:'',barText:'選單',show:true,actions:{}};
export const mobileMenuKey='linetech.mobile.menu.v2';
export interface SavedMenu { templateId:string; imageDataUrl:string; imageName:string; config:MobileMenuConfig }
export function loadMenu():SavedMenu|null {
  try {const data=JSON.parse(localStorage.getItem(mobileMenuKey)||'null');return data&&typeof data.templateId==='string'&&data.config?.actions?data:null;}catch{return null;}
}
export function saveMenu(data:SavedMenu):boolean {try{localStorage.setItem(mobileMenuKey,JSON.stringify(data));return true;}catch{return false;}}
const actionLabels:Record<ActionType,string>={none:'不設定',text:'文字',url:'網址',coupon:'優惠券',reward:'集點卡'};
const actionTypes:ActionType[]=['none','text','url','coupon','reward'];
export function validateMenu(config:MobileMenuConfig,template:RichMenuTemplate):boolean {
  return template.areas.some(a=>config.actions[a.id]&&config.actions[a.id].type!=='none')&&template.areas.every(a=>{
    const action=config.actions[a.id];if(!action||action.type==='none')return true;
    if(!action.value.trim())return false;
    if(action.type==='url'){try {const url=new URL(action.value);if(!['https:','http:'].includes(url.protocol))return false;}catch{return false;}}
    if(['url','coupon'].includes(action.type)&&!action.label.trim())return false;
    return true;
  });
}
interface StepProps {step:2|3;template:RichMenuTemplate;image:string;config:MobileMenuConfig;onChange:(x:MobileMenuConfig)=>void;onNext:()=>void;onBack:()=>void;done:boolean}
export function MobileMenuStep({step,template,image,config,onChange,onNext,onBack,done}:StepProps){
  const patch=(p:Partial<MobileMenuConfig>)=>onChange({...config,...p});
  const valid=validateMenu(config,template);
  const dateValid=Boolean(config.start&&config.end&&new Date(config.start)<new Date(config.end));
  return <div className="oa-mobile-screen menu-practice-screen">
    <div className="oa-mobile-header"><button aria-label="返回" onClick={onBack}>‹</button><strong>{step===2?'內容設定（2/3）':'內容設定（3/3）'}</strong><span/></div>
    <div className="menu-practice-body">
      {step===2?<><div className="menu-practice-image" style={{aspectRatio:template.aspectRatio}}><img src={image} alt="圖文選單預覽"/>{template.areas.map(a=><span key={a.id} style={{left:a.x*100+'%',top:a.y*100+'%',width:a.width*100+'%',height:a.height*100+'%'}}>{a.id}</span>)}</div>
      {template.areas.map(a=>{const action=config.actions[a.id]||{type:'none' as ActionType,value:'',label:''};const update=(next:typeof action)=>patch({actions:{...config.actions,[a.id]:next}});return <section className="official-form-section" key={a.id}><h3>動作 {a.id}</h3><label>類型<select value={action.type} onChange={e=>update({type:e.target.value as ActionType,value:'',label:''})}>{actionTypes.map(t=><option key={t} value={t}>{actionLabels[t]}</option>)}</select></label>{action.type!=='none'&&<label>{actionLabels[action.type]}<input value={action.value} onChange={e=>update({...action,value:e.target.value})} placeholder={action.type==='url'?'https://example.com':'輸入內容'}/></label>}{['url','coupon'].includes(action.type)&&<label>動作標籤<input maxLength={20} value={action.label} onChange={e=>update({...action,label:e.target.value})}/></label>}</section>})}</>:<>
      <section className="official-form-section"><h3>基本設定</h3><label>標題<input maxLength={30} value={config.title} onChange={e=>patch({title:e.target.value})}/></label><label>使用期間（開始）<input type="datetime-local" value={config.start} onChange={e=>patch({start:e.target.value})}/></label><label>使用期間（結束）<input type="datetime-local" value={config.end} onChange={e=>patch({end:e.target.value})}/></label></section>
      <section className="official-form-section"><h3>設定選單列</h3><label>選單列顯示文字<input maxLength={14} value={config.barText} onChange={e=>patch({barText:e.target.value})}/></label><label>預設顯示方式<select value={config.show?'show':'hide'} onChange={e=>patch({show:e.target.value==='show'})}><option value="show">顯示</option><option value="hide">隱藏</option></select></label></section>
      {done&&<p role="status">已儲存至本機，未發布至 LINE。</p>}</>}
    </div>
    <div className="menu-practice-footer"><button disabled={!valid||(step===3&&(!config.title.trim()||!dateValid||!config.barText.trim()))} onClick={onNext}>{step===2?'下一步':'儲存'}</button></div>
  </div>;
}
interface ChatMessage {role:'friend'|'oa';text:string}
export function CustomerPractice({template,image,config}:{template:RichMenuTemplate|null;image:string;config:MobileMenuConfig}){
  const training=useTraining();
  const [messages,setMessages]=useState<ChatMessage[]>([]);
  const [text,setText]=useState('');
  const [open,setOpen]=useState(config.show);
  const [notice,setNotice]=useState('');
  const [frame,setFrame]=useState(false);
  useEffect(()=>setOpen(config.show),[config.show]);
  const send=(value:string)=>{
    if(!value.trim())return;
    const reply=resolveReply(value,training);
    setMessages(m=>[...m,{role:'friend',text:value},...(reply?[{role:'oa' as const,text:reply}]:[])]);
    setText('');setNotice(reply?'已命中回應規則':'未命中回應規則');
  };
  const follow=()=>{setMessages(training.welcomeEnabled?training.welcome.map(text=>({role:'oa',text:welcomeText(text)})):[]);setNotice(training.welcomeEnabled?'已模擬加入好友':'歡迎訊息已停用');setOpen(config.show);};
  const tap=(id:string)=>{const a=config.actions[id];if(!a||a.type==='none'){setNotice('區域 '+id+' 尚未設定動作');return;}if(a.type==='text'){send(a.value);return;}setNotice((actionLabels[a.type]+'：'+a.value)+'（僅模擬，不會開啟外部服務）');};
  return <div className="customer-practice">
    <h3>顧客手機即時測試</h3><small>Linetech 教學擴充・本機模擬</small>
    <div className="customer-practice-tools"><button onClick={follow}>模擬加入好友</button><button onClick={()=>{setMessages([]);setNotice('');}}>清空對話</button><label><input type="checkbox" checked={frame} onChange={e=>setFrame(e.target.checked)}/>熱區</label></div>
    <div className="customer-phone"><div className="customer-head">康立全球智能系統</div><div className="customer-chat" aria-live="polite">{messages.map((m,i)=><div key={i} className={'customer-bubble '+m.role}>{m.text}</div>)}</div>
    {open&&template&&image&&<div className="customer-menu" style={{aspectRatio:template.aspectRatio}}><img src={image} alt="顧客圖文選單"/>{template.areas.map(a=><button key={a.id} aria-label={'熱區 '+a.id} className={frame?'with-frame':''} style={{left:a.x*100+'%',top:a.y*100+'%',width:a.width*100+'%',height:a.height*100+'%'}} onClick={()=>tap(a.id)}>{frame?a.id:''}</button>)}</div>}
    <button className="customer-chatbar" onClick={()=>setOpen(v=>!v)}>{config.barText||'選單'} {open?'⌄':'⌃'}</button><form className="customer-input" onSubmit={e=>{e.preventDefault();send(text);}}><input aria-label="顧客訊息" placeholder="輸入關鍵字" value={text} onChange={e=>setText(e.target.value)}/><button disabled={!text.trim()}>傳送</button></form></div>
    {notice&&<p role="status">{notice}</p>}
  </div>;
}
