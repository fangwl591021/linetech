import { useMemo, useState, type ReactNode } from 'react';
import {
  BarChart3,
  Bell,
  BriefcaseBusiness,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Copy,
  CreditCard,
  Database,
  ExternalLink,
  Gift,
  Image as ImageIcon,
  Link2,
  MapPin,
  MessageCircle,
  Mic,
  MousePointer2,
  Pencil,
  Phone,
  PlaySquare,
  Plus,
  QrCode,
  Search,
  Settings,
  Share2,
  Smile,
  Smartphone,
  Ticket,
  Trash2,
  UserPlus,
  X
} from 'lucide-react';

import { readTraining, updateTraining, useTraining, welcomeText, normalizeKeyword, ruleKeywords, ruleMessages, type ReplyRule } from './trainingState';

import { AssetEditors } from './AssetEditors';
export type FeatureKey =
  | 'welcome'
  | 'autoreply'
  | 'richmessage'
  | 'multipage'
  | 'coupon'
  | 'stampcard'
  | 'addfriend'
  | 'businessProfile'
  | 'lineTouch'
  | 'billing'
  | 'latest'
  | 'settings'
  | 'help'
  | 'extensions'
  | 'chat'
  | 'analytics'
  | 'notifications';

interface Props {
  feature: FeatureKey;
  onBack: () => void;
}

const featureTitles: Record<FeatureKey, string> = {
  welcome: '加入好友的歡迎訊息',
  autoreply: '自動回應訊息',
  richmessage: '圖文訊息',
  multipage: '多頁訊息',
  coupon: '優惠券',
  stampcard: '集點卡',
  addfriend: '增加好友人數',
  businessProfile: '商業簡介',
  lineTouch: 'LINE Touch',
  billing: '帳務專區',
  latest: '最新資訊',
  settings: '設定',
  help: 'Help',
  extensions: '擴充功能',
  chat: '聊天',
  analytics: '分析',
  notifications: '通知'
};

const messageTypes = ['文字','照片','圖文訊息','多頁訊息','影片','優惠券','進階影片訊息','貼圖','語音訊息','問卷調查'];

function Header({ title, onBack, right }: { title: string; onBack: () => void; right?: ReactNode }) {
  return (
    <div className="oa-mobile-header feature-official-header">
      <button className="mobile-back" onClick={onBack}><ChevronLeft size={28}/></button>
      <strong>{title}</strong>
      <div className="feature-header-right">{right || <span/>}</div>
    </div>
  );
}

function Toast({ text }: { text: string }) {
  return text ? <div className="feature-toast">{text}</div> : null;
}

export function MobileFeaturePage({ feature, onBack }: Props) {
  return <FeatureRouter feature={feature} onBack={onBack}/>;
}

function FeatureRouter({ feature, onBack }: Props) {
  switch (feature) {
    case 'welcome': return <WelcomePage onBack={onBack}/>;
    case 'autoreply': return <AutoReplyPage onBack={onBack}/>;
    case 'richmessage': return <AssetEditors kind="richmessage" onBack={onBack}/>;
    case 'multipage': return <MultiPagePage onBack={onBack}/>;
    case 'coupon': return <AssetEditors kind="coupon" onBack={onBack}/>;
    case 'stampcard': return <AssetEditors kind="stampcard" onBack={onBack}/>;
    case 'addfriend': return <AddFriendPage onBack={onBack}/>;
    case 'businessProfile': return <BusinessProfilePage onBack={onBack}/>;
    case 'lineTouch': return <LineTouchPage onBack={onBack}/>;
    case 'billing': return <BillingPage onBack={onBack}/>;
    case 'latest': return <LatestInfoPage onBack={onBack}/>;
    case 'settings': return <SettingsPage onBack={onBack}/>;
    case 'help': return <HelpPage onBack={onBack}/>;
    case 'extensions': return <ExtensionsPage onBack={onBack}/>;
    case 'chat': return <ChatPage onBack={onBack}/>;
    case 'analytics': return <AnalyticsPage onBack={onBack}/>;
    case 'notifications': return <NotificationsPage onBack={onBack}/>;
  }
}

function WelcomePage({ onBack }: { onBack: () => void }) {
  const [messages, setMessages] = useState(()=>readTraining().welcome);
  const config=useTraining();
  const [settingsOpen,setSettingsOpen]=useState(false);
  const insert=(i:number,token:string)=>setMessages(v=>v.map((x,idx)=>idx===i?(x+token).slice(0,500):x));
  const [pickerOpen, setPickerOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [toast,setToast]=useState('');
  const flash=(t:string)=>{setToast(t);setTimeout(()=>setToast(''),1500);};
  const add=(type:string)=>{
    if(messages.length>=5){flash('最多可設定 5 則歡迎訊息');return;}
    if(type!=='文字'){flash('此格式尚未完成，先使用文字練習');return;}
    setMessages(v=>[...v,'']);
    setPickerOpen(false);
  };
  return (
    <div className="oa-mobile-screen official-feature-screen">
      <Header title="加入好友的歡迎訊息" onBack={onBack} right={<button className="feature-text-link" onClick={()=>setPreviewOpen(true)}>預覽</button>}/>
      <div className="official-feature-body welcome-editor-body">
        {messages.map((m,i)=>(
          <section className="welcome-message-row" key={i}>
            <div className="broadcast-slot-avatar">K</div>
            <div className="welcome-message-card">
              <div className="welcome-message-head"><strong>訊息 {i+1}</strong><button onClick={()=>setMessages(v=>v.filter((_,idx)=>idx!==i))}><X size={17}/></button></div>
              <textarea maxLength={500} value={m} onChange={e=>setMessages(v=>v.map((x,idx)=>idx===i?e.target.value:x))}/>
              <div className="welcome-tools"><button onClick={()=>insert(i,'😊')}><Smile size={15}/> 表情貼</button><button onClick={()=>insert(i,'[好友顯示名稱]')}>好友顯示名稱</button><button onClick={()=>insert(i,'[帳號名稱]')}>帳號名稱</button><span>{m.length}/500</span></div>
            </div>
          </section>
        ))}
        <button className="official-add-outline" disabled={messages.length>=5} onClick={()=>setPickerOpen(true)}><Plus size={19}/> 新增</button>
        <button className="official-sub-link" onClick={()=>setSettingsOpen(v=>!v)}>回應設定</button>
        {settingsOpen&&<section className="official-form-section"><label className="official-switch-row"><span>加入好友的歡迎訊息</span><input type="checkbox" checked={config.welcomeEnabled} onChange={e=>{if(!updateTraining({welcomeEnabled:e.target.checked}))flash('儲存失敗');}}/></label></section>}
      </div>
      <div className="official-bottom-save"><button disabled={!messages.length||messages.some(x=>!x.trim())} onClick={()=>flash(updateTraining({welcome:messages})?'歡迎訊息已儲存於本機':'儲存失敗')}>儲存</button></div>
      {pickerOpen && <TypePicker title="選擇訊息類型" onClose={()=>setPickerOpen(false)} onSelect={add}/>}
      {previewOpen && <PreviewSheet title="預覽" onClose={()=>setPreviewOpen(false)} items={messages.map(welcomeText)}/>}
      <Toast text={toast}/>
    </div>
  );
}

function AutoReplyPage({ onBack }: { onBack: () => void }) {
  const config=useTraining();
  const [page,setPage]=useState<'list'|'content'|'settings'|'schedule'>('list');
  const [editId,setEditId]=useState<string|null>(null);
  const [title,setTitle]=useState('');
  const [keywords,setKeywords]=useState<string[]>([]);
  const [keyword,setKeyword]=useState('');
  const [messages,setMessages]=useState<string[]>([]);
  const [mode,setMode]=useState<'關鍵字'|'預設回應'>('預設回應');
  const [statusOpen,setStatusOpen]=useState(false);
  const [schedule,setSchedule]=useState(false);
  const [scheduleKind,setScheduleKind]=useState<'period'|'daily'>('period');
  const [timezone,setTimezone]=useState('Asia/Taipei');
  const [start,setStart]=useState('');
  const [end,setEnd]=useState('');
  const [picker,setPicker]=useState(false);
  const [preview,setPreview]=useState(false);
  const [toast,setToast]=useState('');
  const flash=(t:string)=>setToast(t);
  const fresh=()=>{setEditId(null);setTitle('');setKeywords([]);setKeyword('');setMessages([]);setMode('預設回應');setSchedule(false);setScheduleKind('period');setTimezone('Asia/Taipei');setStart('');setEnd('');setToast('');setPage('settings');setPicker(false);};
  const edit=(r:ReplyRule)=>{setEditId(r.id);setTitle(r.title||r.keyword||'自動回應');setKeywords(ruleKeywords(r));setKeyword('');setMessages(ruleMessages(r));setMode(ruleKeywords(r).length?'關鍵字':'預設回應');setScheduleKind(r.scheduleKind||'period');setTimezone(r.timezone||'Asia/Taipei');setStart(r.scheduleKind==='daily'?r.start||'':(r.start||'').slice(0,10));setEnd(r.scheduleKind==='daily'?r.end||'':(r.end||'').slice(0,10));setSchedule(Boolean(r.start||r.end));setToast('');setPage('settings');};
  const addKeyword=()=>{
    const k=keyword.trim();
    if(!k)return;
    if(keywords.length>=51){flash('最多登錄 51 個關鍵字');return;}
    if(/\p{Extended_Pictographic}/u.test(k)){flash('關鍵字不支援表情符號');return;}
    if(keywords.some(x=>normalizeKeyword(x)===normalizeKeyword(k))){flash('關鍵字已登錄');return;}
    setKeywords(v=>[...v,k]);setKeyword('');setToast('');
  };
  const contentValid=messages.length>0&&messages.every(x=>x.trim());
  const scheduleValid=!schedule||Boolean(start&&end&&(scheduleKind==='daily'?start!==end:start<=end));
  const settingsValid=Boolean(title.trim()&&(mode==='預設回應'||keywords.length>0)&&!keyword.trim()&&scheduleValid);
  const valid=contentValid&&settingsValid;
  const save=(enabled:boolean)=>{
    if(!valid)return;
    if(keyword.trim()){flash('請先完成關鍵字登錄');return;}
    const rule:ReplyRule={id:editId||String(Date.now()),title:title.trim(),mode,keyword:mode==='關鍵字'?keywords[0]||'':'',keywords:mode==='關鍵字'?[...keywords]:[],reply:messages[0],messages:[...messages],enabled,start:schedule?start:undefined,end:schedule?end:undefined,scheduleKind:schedule?scheduleKind:undefined,timezone:schedule?timezone:undefined};
    if(updateTraining({rules:[...config.rules.filter(r=>r.id!==rule.id),rule]})){setPage('list');setToast('');}else flash('本機儲存失敗');
  };
  return <div className={"oa-mobile-screen auto-reply-screen auto-tw-screen auto-page-"+page}>
    <div className="auto-tw-status" aria-hidden="true"><span>07:14</span><span>▂▄▆▇ 5G ▰</span></div>
    {page==='list'?<>
      <Header title="自動回應訊息" onBack={onBack} right={<button aria-label="目前狀態" className="feature-text-link" onClick={()=>setStatusOpen(true)}><svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 4h18M2 11h18M2 18h9M14 17l4 4 5-6"/></svg></button>}/>
      <div className="auto-reply-body">
        <p className="auto-tw-description">可設定當用戶傳訊給本帳號時，系統將自動回傳的訊息內容。</p>
        {!config.rules.length&&<div className="auto-empty">尚無自動回應訊息</div>}
        {config.rules.map(r=><div className="auto-rule-row" key={r.id}>
          <button className="auto-tw-rule-button" onClick={()=>edit(r)}><span className="auto-rule-thumb"><ImageIcon size={27} fill="#caccd0" stroke="#e9eaed"/></span><span className="auto-tw-rule-info"><strong>{r.title||r.keyword||'自動回應'}</strong><span>{r.mode==='關鍵字'?'關鍵字回應':'一律回應'}</span><span className={r.enabled?'auto-on':'auto-off'}>{r.enabled?'使用中':'停用中'}</span></span></button>
        </div>)}
      </div>
      <div className="auto-reply-footer"><button onClick={fresh}>建立</button></div>
    </>:page==='content'?<>
      <Header title="訊息設定" onBack={()=>{setPage('settings');setPicker(false);}} right={<button className="feature-text-link" onClick={()=>setPreview(true)}>預覽</button>}/>
      <div className="auto-reply-body auto-compose">
        {messages.map((m,i)=><div key={i} className="auto-message-card"><div className="auto-message-heading">文字<div><button aria-label="向上移動" disabled={i===0} onClick={()=>setMessages(v=>{const n=[...v];[n[i-1],n[i]]=[n[i],n[i-1]];return n;})}>⌃</button><button aria-label="向下移動" disabled={i===messages.length-1} onClick={()=>setMessages(v=>{const n=[...v];[n[i+1],n[i]]=[n[i],n[i+1]];return n;})}>⌄</button><button aria-label="刪除對話框" onClick={()=>setMessages(v=>v.filter((_,j)=>j!==i))}><X size={16}/></button></div></div>
          <div className="auto-message-content"><textarea aria-label={'回應訊息 '+(i+1)} maxLength={500} placeholder="輸入文字" value={m} onChange={e=>setMessages(v=>v.map((x,j)=>j===i?e.target.value:x))}/><div className="auto-count">{m.length}/500</div><div className="auto-message-tools"><button onClick={()=>setMessages(v=>v.map((x,j)=>j===i?(x+'😊').slice(0,500):x))}>表情貼</button><button onClick={()=>setMessages(v=>v.map((x,j)=>j===i?(x+'[好友顯示名稱]').slice(0,500):x))}>好友的顯示名稱</button><button onClick={()=>setMessages(v=>v.map((x,j)=>j===i?(x+'[帳號名稱]').slice(0,500):x))}>帳號名稱</button></div></div>
        </div>)}
        <button className="official-add-outline auto-add" disabled={messages.length>=5} onClick={()=>{setPicker(true);setToast('');}}><Plus size={18}/> 新增</button>
        {toast&&<p role="alert" className="menu-practice-error">{toast}</p>}
      </div>
      <div className="auto-reply-footer auto-stack"><button disabled={!valid} onClick={()=>save(true)}>啟用</button><button className="auto-secondary" disabled={!valid} onClick={()=>save(false)}>儲存</button></div>
      {picker&&<div className="broadcast-type-backdrop"><div className="broadcast-type-sheet"><div className="broadcast-type-sheet-head"><strong>選擇訊息類型</strong><button onClick={()=>setPicker(false)}><X size={27}/></button></div><div className="broadcast-type-grid">{['文字','照片','圖文訊息','多頁訊息','影片','優惠券','進階影片訊息','貼圖','語音訊息'].map((t,i)=><button key={t} style={{gridColumn:i%2+1,gridRow:Math.floor(i/2)+1}} onClick={()=>{setPicker(false);if(t==='文字')setMessages(v=>[...v,'']);else flash(t+'內容編輯尚待完成，請先使用文字。');}}><span className="broadcast-type-icon">{t==='文字'?<span style={{fontSize:28}}>T</span>:t==='照片'?<ImageIcon/>:t==='優惠券'?<Ticket/>:t==='貼圖'?<Smile/>:t==='語音訊息'?<Mic/>:t.includes('影片')?<PlaySquare/>:<MessageCircle/>}</span><strong>{t}</strong></button>)}</div></div></div>}
    </>:page==='settings'?<>
      <Header title={editId?'編輯':'建立'} onBack={()=>setPage('list')} right={<button className="feature-text-link" onClick={()=>setPreview(true)}>預覽</button>}/>
      <div className="auto-reply-body auto-settings">
        <section className="auto-source-section auto-tw-title"><strong>標題</strong><input aria-label="標題" maxLength={20} value={title} onChange={e=>setTitle(e.target.value)} placeholder="輸入標題"/><div className="auto-tw-title-foot"><small>標題為方便後台管理用，不會向用戶顯示。</small><small>{title.length}/20</small></div></section>
        <section className="auto-source-section auto-tw-types"><strong>回應類型</strong><a className="auto-tw-help" href="https://tw.linebiz.com/manual/line-official-account/oa-manager-autoreply/" target="_blank" rel="noreferrer"><CircleHelp size={15}/> Help</a><label className="auto-radio"><input type="radio" name="reply-mode" checked={mode==='預設回應'} onChange={()=>{setMode('預設回應');setKeyword('');}}/>一律回應</label><label className="auto-radio"><input type="radio" name="reply-mode" checked={mode==='關鍵字'} onChange={()=>setMode('關鍵字')}/>關鍵字回應</label>
        {mode==='關鍵字'&&<><form className="auto-keyword-entry" onSubmit={e=>{e.preventDefault();addKeyword();}}><input aria-label="輸入關鍵字" maxLength={30} value={keyword} onChange={e=>setKeyword(e.target.value)} placeholder="輸入關鍵字"/><button aria-disabled={!keyword.trim()}>新增</button></form><small className="auto-keyword-count">{keyword.length}/30</small><div className="auto-chips">{keywords.map(k=><span key={k}>{k}<button aria-label={'刪除關鍵字 '+k} onClick={()=>setKeywords(v=>v.filter(x=>x!==k))}><X size={14}/></button></span>)}</div></>}
        </section>
        <section className="auto-source-section auto-tw-options"><strong>選項設定</strong><button className="auto-link-row" onClick={()=>{setPage('schedule');setToast('');}}>指定日期或時間 <span>{schedule?'已設定':'不設定'} <ChevronRight size={16}/></span></button></section>
        {toast&&<p role="alert" className="menu-practice-error">{toast}</p>}
        <div className="auto-inline-action"><button onClick={()=>{if(!settingsValid){flash(!title.trim()?'請輸入標題':mode==='關鍵字'&&(!keywords.length||keyword.trim())?'請完成關鍵字登錄':'請完成指定日期或時間設定');return;}setPage('content');setToast('');setPicker(false);}}>下一步</button></div>
        {editId&&<><div className="auto-inline-action"><button className="auto-secondary" onClick={()=>{if(config.rules.find(r=>r.id===editId&&!r.enabled&&!ruleMessages(r).some(m=>m.trim()))){flash('請先設定回應訊息內容');return;}if(updateTraining({rules:config.rules.map(r=>r.id===editId?{...r,enabled:!r.enabled}:r)}))setPage('list');else flash('儲存失敗');}}>{config.rules.find(r=>r.id===editId)?.enabled?'停止使用':'啟用已儲存訊息'}</button></div><button className="auto-delete-link" onClick={()=>{if(updateTraining({rules:config.rules.filter(r=>r.id!==editId)}))setPage('list');else flash('刪除失敗');}}>刪除</button></>}
      </div>
    </>:<>
      <Header title="指定日期或時間" onBack={()=>setPage('settings')}/>
      <div className="auto-reply-body"><div className="auto-field"><span>設定排程</span><label className="auto-switch"><input aria-label="設定排程" type="checkbox" checked={schedule} onChange={e=>setSchedule(e.target.checked)}/></label></div>
        <div className="auto-dates"><select aria-label="時區" disabled={!schedule} value={timezone} onChange={e=>setTimezone(e.target.value)}><option value="Asia/Taipei">(UTC+08:00) Asia/Taipei</option><option value="Asia/Tokyo">(UTC+09:00) Asia/Tokyo</option><option value="UTC">(UTC+00:00) UTC</option></select>{(['period','daily'] as const).map(kind=><section className="auto-schedule-group" key={kind}><label className="auto-radio"><input type="radio" disabled={!schedule} checked={scheduleKind===kind} onChange={()=>{setScheduleKind(kind);setStart(kind==='daily'?'00:00':'');setEnd(kind==='daily'?'23:59':'');}}/>{kind==='period'?'期間':'時間（每天）'}</label><label>開始<input aria-label={kind+' 開始'} type={kind==='period'?'date':'time'} disabled={!schedule||scheduleKind!==kind} value={scheduleKind===kind?start:''} onChange={e=>setStart(e.target.value)}/></label><label>結束<input aria-label={kind+' 結束'} type={kind==='period'?'date':'time'} disabled={!schedule||scheduleKind!==kind} value={scheduleKind===kind?end:''} onChange={e=>setEnd(e.target.value)}/></label></section>)}</div>
        <div className="auto-inline-action"><button disabled={!scheduleValid} onClick={()=>setPage('settings')}>儲存</button></div>
      </div>
    </>}
    {statusOpen&&<div className="broadcast-type-backdrop"><div className="broadcast-type-sheet"><div className="broadcast-type-sheet-head"><strong>目前狀態</strong><button aria-label="關閉" onClick={()=>setStatusOpen(false)}><X size={23}/></button></div><div className="auto-status-copy"><p>{config.autoEnabled?'自動回應功能已開啟。':'自動回應功能已關閉。'}</p><p>已啟用訊息：{config.rules.filter(r=>r.enabled).length} 則</p><p>回應設定請由主頁進入「設定」。</p></div></div></div>}
    {preview&&<PreviewSheet title="預覽" onClose={()=>setPreview(false)} items={messages.map(x=>x.replaceAll('[好友顯示名稱]','{Nickname}'))}/>}
  </div>;
}

function MultiPagePage({ onBack }: { onBack: () => void }) {
  return <div className="oa-mobile-screen official-feature-screen">
    <Header title="多頁訊息" onBack={onBack}/>
    <div className="official-feature-body">
      <div className="official-info-card"><ImageIcon size={42}/><strong>多頁訊息目前請使用電腦版設定</strong><p>LINE 官方操作手冊目前明確註記，多頁訊息格式尚未開放手機版建立。手機版可在其他訊息功能中選取已建立的多頁訊息。</p></div>
      <div className="official-empty-center">尚無可選用的多頁訊息</div>
    </div>
  </div>;
}

function AddFriendPage({ onBack }: { onBack: () => void }) {
  const [channel,setChannel]=useState('官方網站');
  const [source,setSource]=useState('首頁橫幅');
  const [campaign,setCampaign]=useState('');
  const [toast,setToast]=useState('');
  const flash=(t:string)=>{setToast(t);setTimeout(()=>setToast(''),1500);};
  return <div className="oa-mobile-screen official-feature-screen">
    <Header title="增加好友" onBack={onBack}/>
    <div className="official-feature-body">
      <section className="addfriend-qr-card"><QrCode size={112}/><strong>@k-linkintelligent</strong><button onClick={()=>flash('已複製加入好友網址')}><Copy size={16}/> 複製加入好友網址</button></section>
      <section className="official-form-section"><h3>好友加入管道</h3><label>管道<input value={channel} onChange={e=>setChannel(e.target.value)}/></label><label>來源<input value={source} onChange={e=>setSource(e.target.value)}/></label><label>活動名稱<input value={campaign} onChange={e=>setCampaign(e.target.value)} placeholder="輸入活動名稱"/></label><button className="official-add-outline" onClick={()=>flash('已建立好友加入管道')}>建立管道</button></section>
      <section className="official-list-button"><Share2/><span>建立行動條碼 / URL</span><ChevronRight/></section>
      <section className="official-list-button"><BarChart3/><span>查看加入好友分析</span><ChevronRight/></section>
    </div>
    <Toast text={toast}/>
  </div>;
}

function BusinessProfilePage({ onBack }: { onBack: () => void }) {
  const [status,setStatus]=useState<'草稿'|'已發布'>('草稿');
  const [name,setName]=useState('康立全球智能系統');
  const [phone,setPhone]=useState('');
  const [address,setAddress]=useState('');
  const [toast,setToast]=useState('');
  const flash=(t:string)=>{setToast(t);setTimeout(()=>setToast(''),1500);};
  return <div className="oa-mobile-screen official-feature-screen">
    <Header title="商業簡介" onBack={onBack}/>
    <div className="official-feature-body">
      <section className="business-profile-summary"><div className="mobile-account-avatar">K</div><div><strong>{name}</strong><span>@k-linkintelligent</span></div><b>{status}</b></section>
      <section className="official-form-section"><h3>基本資訊</h3><label>商業名稱<input value={name} onChange={e=>setName(e.target.value)}/></label><label>電話<input value={phone} onChange={e=>setPhone(e.target.value)}/></label><label>地址<input value={address} onChange={e=>setAddress(e.target.value)}/></label></section>
      <section className="official-list-button"><BriefcaseBusiness/><span>按鈕設定（最多 3 個）</span><ChevronRight/></section>
      <section className="official-list-button"><ImageIcon/><span>封面照片 / 背景顏色</span><ChevronRight/></section>
      <section className="official-list-button"><Plus/><span>新增擴充</span><ChevronRight/></section>
      <section className="official-list-button"><InfoIcon/><span>基本資訊</span><ChevronRight/></section>
    </div>
    <div className="official-bottom-save two"><button className="secondary" onClick={()=>flash('已儲存草稿')}>儲存</button><button onClick={()=>{setStatus('已發布');flash('已公開商業簡介')}}>公開</button></div>
    <Toast text={toast}/>
  </div>;
}

function InfoIcon() {
  return <CircleHelp size={20}/>;
}

function LineTouchPage({ onBack }: { onBack: () => void }) {
  const [enabled,setEnabled]=useState(false);
  const [tags,setTags]=useState<string[]>([]);
  const [toast,setToast]=useState('');
  const flash=(t:string)=>{setToast(t);setTimeout(()=>setToast(''),1500);};
  return <div className="oa-mobile-screen official-feature-screen">
    <Header title="LINE Touch" onBack={onBack}/>
    <div className="official-feature-body">
      {!enabled?<div className="line-touch-start"><Smartphone size={54}/><strong>開始使用 LINE Touch</strong><p>使用前需完成官方帳號認證並擁有管理員權限。NFC 標籤需由手機版 App 登錄。</p><label><input type="checkbox"/> 我已閱讀並同意 LINE Touch 使用條款</label><button onClick={()=>setEnabled(true)}>開始使用 LINE Touch</button></div>:<>
        <section className="official-list-button"><MousePointer2/><span>動作設定</span><ChevronRight/></section>
        <section className="official-list-button"><Smartphone/><span>NFC 標籤</span><b>{tags.length}</b></section>
        <button className="official-add-outline" onClick={()=>setTags(v=>[...v,'NFC-'+(v.length+1)])}><Plus size={17}/> 登錄 NFC 標籤</button>
        {tags.map((x,i)=><section className="official-list-button" key={x}><Smartphone/><span>{x}</span><button onClick={()=>{setTags(v=>v.filter((_,idx)=>idx!==i));flash('已刪除 NFC 標籤')}}><Trash2 size={16}/></button></section>)}
      </>}
    </div>
    <Toast text={toast}/>
  </div>;
}

function BillingPage({ onBack }: { onBack: () => void }) {
  const [tab,setTab]=useState('總覽');
  const tabs=['總覽','推廣方案','專屬ID','付款紀錄','付款方式','電子發票資訊'];
  return <div className="oa-mobile-screen official-feature-screen">
    <Header title="帳務專區" onBack={onBack}/>
    <div className="official-horizontal-tabs">{tabs.map(x=><button key={x} className={tab===x?'active':''} onClick={()=>setTab(x)}>{x}</button>)}</div>
    <div className="official-feature-body">
      {tab==='總覽'?<>
        <section className="billing-plan-card"><span>目前方案</span><strong>輕用量</strong></section>
        <section className="billing-usage-card"><div><span>免費訊息則數</span><strong>9 / 200</strong></div><button>查看詳情</button></section>
        <section className="official-list-button"><Database/><span>本月帳單</span><strong>NT$0</strong></section>
      </>:<div className="official-empty-center">{tab}目前沒有資料</div>}
    </div>
  </div>;
}

function LatestInfoPage({ onBack }: { onBack: () => void }) {
  const [page,setPage]=useState<'list'|'create'>('list');
  const [title,setTitle]=useState('');
  const [body,setBody]=useState('');
  const [items,setItems]=useState<string[]>([]);
  return <div className="oa-mobile-screen official-feature-screen">
    {page==='list'?<>
      <Header title="最新資訊" onBack={onBack}/>
      <div className="official-feature-body">{items.length?items.map(x=><section className="official-list-button" key={x}><MessageCircle/><span>{x}</span><small>草稿</small></section>):<div className="official-empty-center">尚無最新資訊</div>}</div>
      <div className="official-bottom-save"><button onClick={()=>setPage('create')}>建立</button></div>
    </>:<>
      <Header title="建立最新資訊" onBack={()=>setPage('list')}/>
      <div className="official-feature-body"><section className="official-form-section"><h3>標題</h3><input value={title} onChange={e=>setTitle(e.target.value)}/></section><section className="official-form-section"><h3>內容</h3><textarea value={body} onChange={e=>setBody(e.target.value)}/></section></div>
      <div className="official-bottom-save"><button disabled={!title.trim()} onClick={()=>{setItems(v=>[title,...v].slice(0,20));setTitle('');setBody('');setPage('list')}}>儲存</button></div>
    </>}
  </div>;
}

function SettingsPage({ onBack }: { onBack: () => void }) {
  const [sub,setSub]=useState<string|null>(null);
  const [chat,setChat]=useState(true);
  const config=useTraining();
  const welcome=config.welcomeEnabled;
  const setWelcome=(value:boolean)=>updateTraining({welcomeEnabled:value});
  const [webhook,setWebhook]=useState(false);
  if(sub==='回應設定') return <div className="oa-mobile-screen official-feature-screen"><Header title="回應設定" onBack={()=>setSub(null)}/><div className="official-feature-body"><section className="official-form-section"><label className="official-switch-row"><span>聊天</span><input type="checkbox" checked={chat} onChange={e=>setChat(e.target.checked)}/></label><label className="official-switch-row"><span>加入好友的歡迎訊息</span><input type="checkbox" checked={welcome} onChange={e=>setWelcome(e.target.checked)}/></label><label className="official-switch-row"><span>自動回應訊息</span><input type="checkbox" checked={config.autoEnabled} onChange={e=>updateTraining({autoEnabled:e.target.checked})}/></label><label className="official-switch-row"><span>Webhook（模擬）</span><input type="checkbox" checked={webhook} onChange={e=>setWebhook(e.target.checked)}/></label></section></div></div>;
  return <div className="oa-mobile-screen official-feature-screen">
    <Header title="設定" onBack={onBack}/>
    <div className="official-feature-body">
      {['帳號設定','權限管理','回應設定','Messaging API','帳務專區'].map(x=><button className="official-list-button" key={x} onClick={()=>x==='回應設定'?setSub(x):undefined}><Settings/><span>{x}</span><ChevronRight/></button>)}
    </div>
  </div>;
}

function HelpPage({ onBack }: { onBack: () => void }) {
  const [q,setQ]=useState('');
  const topics=['帳號設定','群發訊息','歡迎訊息','聊天與自動回應','圖文訊息','圖文選單','優惠券','集點卡','LINE Touch','帳務專區'];
  const list=useMemo(()=>topics.filter(x=>x.includes(q.trim())),[q]);
  return <div className="oa-mobile-screen official-feature-screen"><Header title="Help" onBack={onBack}/><div className="official-feature-body"><div className="help-search"><Search size={18}/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="搜尋說明"/></div>{list.map(x=><section className="official-list-button" key={x}><CircleHelp/><span>{x}</span><ExternalLink size={16}/></section>)}</div></div>;
}

function ExtensionsPage({ onBack }: { onBack: () => void }) {
  return <div className="oa-mobile-screen official-feature-screen"><Header title="擴充功能" onBack={onBack}/><div className="official-feature-body"><div className="official-info-card"><Plus size={38}/><strong>可用功能會依帳號資格顯示</strong><p>商業簡介相關內容已改採集中管理與發布；LINE Touch 等服務需符合資格後才會顯示。</p></div><section className="official-list-button"><BriefcaseBusiness/><span>商業簡介相關服務</span><ChevronRight/></section><section className="official-list-button"><Smartphone/><span>LINE Touch</span><ChevronRight/></section></div></div>;
}

function ChatPage({ onBack }: { onBack: () => void }) {
  const [selected,setSelected]=useState(false);
  const [text,setText]=useState('');
  const [messages,setMessages]=useState(['您好，請問今天有營業嗎？']);
  if(selected) return <div className="oa-mobile-screen official-feature-screen"><Header title="王小明" onBack={()=>setSelected(false)}/><div className="chat-thread-latest">{messages.map((m,i)=><div key={i} className={i===0?'incoming':'outgoing'}>{m}</div>)}</div><div className="chat-input-latest"><input value={text} onChange={e=>setText(e.target.value)} placeholder="輸入訊息"/><button disabled={!text.trim()} onClick={()=>{setMessages(v=>[...v,text]);setText('')}}><MessageCircle size={18}/></button></div></div>;
  return <div className="oa-mobile-screen official-feature-screen"><Header title="聊天" onBack={onBack}/><div className="chat-list-latest"><div className="help-search"><Search size={18}/><input placeholder="搜尋聊天"/></div><button onClick={()=>setSelected(true)}><div className="chat-avatar">王</div><div><strong>王小明</strong><span>您好，請問今天有營業嗎？</span></div><small>剛剛</small></button></div></div>;
}

function AnalyticsPage({ onBack }: { onBack: () => void }) {
  const [tab,setTab]=useState('總覽');
  const tabs=['總覽','好友','訊息','聊天','優惠券','集點卡'];
  return <div className="oa-mobile-screen official-feature-screen"><Header title="分析" onBack={onBack}/><div className="official-horizontal-tabs">{tabs.map(x=><button key={x} className={tab===x?'active':''} onClick={()=>setTab(x)}>{x}</button>)}</div><div className="official-feature-body"><div className="analysis-card-grid"><section><span>好友</span><strong>12</strong></section><section><span>訊息則數</span><strong>9</strong></section><section><span>開封率</span><strong>32%</strong></section><section><span>點擊率</span><strong>8%</strong></section></div><section className="official-form-section"><h3>{tab}趨勢</h3><div className="analysis-bars">{[35,50,42,70,58,82,76].map((h,i)=><i key={i} style={{height:h+'%'}}/>)}</div></section></div></div>;
}

function NotificationsPage({ onBack }: { onBack: () => void }) {
  const [all,setAll]=useState(true);
  const [chat,setChat]=useState(true);
  const [system,setSystem]=useState(true);
  return <div className="oa-mobile-screen official-feature-screen"><Header title="提醒" onBack={onBack}/><div className="official-feature-body"><section className="official-form-section"><label className="official-switch-row"><span>允許 LINE 官方帳號應用程式通知</span><input type="checkbox" checked={all} onChange={e=>setAll(e.target.checked)}/></label><label className="official-switch-row"><span>聊天通知</span><input type="checkbox" checked={chat} onChange={e=>setChat(e.target.checked)}/></label><label className="official-switch-row"><span>系統通知</span><input type="checkbox" checked={system} onChange={e=>setSystem(e.target.checked)}/></label></section><section className="official-list-button"><Bell/><span>通知音</span><ChevronRight/></section><section className="official-list-button"><UserPlus/><span>接收提醒的帳號</span><ChevronRight/></section></div></div>;
}

function TypePicker({ title, onClose, onSelect }: { title:string; onClose:()=>void; onSelect:(type:string)=>void }) {
  return <div className="broadcast-type-backdrop"><div className="broadcast-type-sheet"><div className="broadcast-type-sheet-head"><strong>{title}</strong><button onClick={onClose}><X size={27}/></button></div><div className="broadcast-type-grid">{messageTypes.map((type,index)=><button key={type} style={{gridColumn:index%2+1,gridRow:Math.floor(index/2)+1}} onClick={()=>onSelect(type)}><span className="broadcast-type-icon">{type==='照片'?<ImageIcon/>:type==='優惠券'?<Ticket/>:type==='影片'||type==='進階影片訊息'?<PlaySquare/>:type==='語音訊息'?<Mic/>:type==='貼圖'?<Smile/>:<MessageCircle/>}</span><strong>{type}</strong></button>)}</div></div></div>;
}

function PreviewSheet({ title, onClose, items }: { title:string; onClose:()=>void; items:string[] }) {
  return <div className="broadcast-preview-backdrop"><div className="broadcast-preview-sheet"><div className="broadcast-type-sheet-head"><strong>{title}</strong><button onClick={onClose}><X size={27}/></button></div><div className="broadcast-preview-body">{items.map((x,i)=><div className="broadcast-preview-chip" key={i}>{x||'未輸入文字'}</div>)}</div></div></div>;
}
