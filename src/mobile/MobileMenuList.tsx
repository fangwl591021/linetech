import {useState} from 'react';
import {ChevronLeft,CircleHelp} from 'lucide-react';
import type {SavedMenu} from './MobileMenuPractice';
import {loadMenu} from './MobileMenuPractice';
import {templates} from '../domain/templates';

export interface MenuRecord extends SavedMenu {
  id:string;
  draft:boolean;
  labels?:string[];
}
const KEY='linetech.mobile.menu.records.v1';
export function readMenuRecords():MenuRecord[]{
  try {
    const raw=localStorage.getItem(KEY);
    if(raw!==null){const data=JSON.parse(raw);if(Array.isArray(data))return data.filter(x=>x&&typeof x.id==='string'&&x.config?.actions&&templates.some(t=>t.id===x.templateId));}
  }catch{/* Preserve legacy fallback. */}
  const legacy=loadMenu();
  return legacy&&templates.some(t=>t.id===legacy.templateId)?[{...legacy,id:'legacy-menu',draft:false}]:[];
}
export function writeMenuRecords(records:MenuRecord[]):boolean{
  try{localStorage.setItem(KEY,JSON.stringify(records));return true;}catch{return false;}
}
export function menuState(record:MenuRecord,now=Date.now()):'current'|'scheduled'|'pending'{
  const start=new Date(record.config.start).getTime(),end=new Date(record.config.end).getTime();
  if(record.draft||!Number.isFinite(start)||!Number.isFinite(end)||end<=start||end<now)return 'pending';
  return start>now?'scheduled':'current';
}
export function MenuStatusBar(){
  const time=new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Taipei',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).format(new Date());
  return <div className="menu-tw-status" aria-hidden="true"><strong>{time}</strong><span><svg viewBox="0 0 22 15" width="21" height="15" fill="currentColor"><rect x="0" y="10" width="4" height="5" rx="1"/><rect x="6" y="7" width="4" height="8" rx="1"/><rect x="12" y="4" width="4" height="11" rx="1"/><rect x="18" y="0" width="4" height="15" rx="1"/></svg>5G <svg viewBox="0 0 30 15" width="27" height="15"><rect x="0" y="1" width="27" height="13" rx="4" fill="#111"/><rect x="28" y="5" width="2" height="5" rx="1" fill="#888"/><text x="13.5" y="11" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold">89</text></svg></span></div>;
}
export function MobileMenuList({records,tab,onTab,onCreate,onEdit,onBack,onHelp}:{records:MenuRecord[];tab:'scheduled'|'pending';onTab:(t:'scheduled'|'pending')=>void;onCreate:()=>void;onEdit:(r:MenuRecord)=>void;onBack:()=>void;onHelp:()=>void}){
  const now=Date.now();
  const current=records.find(r=>menuState(r,now)==='current');
  const visible=records.filter(r=>menuState(r,now)===tab);
  return <div className="oa-mobile-screen menu-tw-list-screen">
    <MenuStatusBar/>
    <div className="oa-mobile-header menu-tw-header"><button className="mobile-back" aria-label="返回" onClick={onBack}><ChevronLeft size={28}/></button><strong>圖文選單</strong><span/></div>
    <div className="menu-tw-list-scroll">
      <section className="menu-tw-current"><h3>目前顯示的選單 <button aria-label="目前顯示的選單說明" onClick={onHelp}><CircleHelp size={15}/></button></h3>
        {current?<button className="menu-tw-current-item" onClick={()=>onEdit(current)}>{current.imageDataUrl&&<img src={current.imageDataUrl} alt="目前顯示的圖文選單"/>}<span>{current.config.title}</span></button>:<div className="menu-tw-current-empty">未顯示選單</div>}
      </section>
      <div className="menu-tw-tabs" role="tablist" aria-label="圖文選單狀態"><button role="tab" aria-selected={tab==='scheduled'} onClick={()=>onTab('scheduled')}>已預約</button><button role="tab" aria-selected={tab==='pending'} onClick={()=>onTab('pending')}>待設定</button></div>
      <div role="tabpanel" className="menu-tw-records">
        {!visible.length?<div className="menu-tw-list-empty">尚無圖文選單</div>:visible.map(r=><button className="menu-tw-record" key={r.id} onClick={()=>onEdit(r)}>{r.imageDataUrl&&<img src={r.imageDataUrl} alt=""/>}<span><strong>{r.config.title||'未命名圖文選單'}</strong><small>{r.draft?'本機草稿':r.config.start.replace('T',' ')+' ～ '+r.config.end.replace('T',' ')}</small></span></button>)}
      </div>
    </div>
    <div className="mobile-fixed-action menu-tw-create"><button onClick={onCreate}>建立</button></div>
  </div>;
}
