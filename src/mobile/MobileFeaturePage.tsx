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
    case 'richmessage': return <RichMessagePage onBack={onBack}/>;
    case 'multipage': return <MultiPagePage onBack={onBack}/>;
    case 'coupon': return <CouponPage onBack={onBack}/>;
    case 'stampcard': return <StampCardPage onBack={onBack}/>;
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
  const [messages, setMessages] = useState(['歡迎加入好友！']);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [toast,setToast]=useState('');
  const flash=(t:string)=>{setToast(t);setTimeout(()=>setToast(''),1500);};
  const add=(type:string)=>{
    if(messages.length>=5){flash('最多可設定 5 則歡迎訊息');return;}
    setMessages(v=>[...v,type==='文字'?'':'['+type+']']);
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
              <div className="welcome-tools"><button><Smile size={15}/> 表情貼</button><button onClick={()=>flash('插入好友顯示名稱')}>好友顯示名稱</button><button onClick={()=>flash('插入帳號名稱')}>帳號名稱</button><span>{m.length}/500</span></div>
            </div>
          </section>
        ))}
        <button className="official-add-outline" disabled={messages.length>=5} onClick={()=>setPickerOpen(true)}><Plus size={19}/> 新增</button>
        <button className="official-sub-link" onClick={()=>flash('回應設定：可開啟/關閉歡迎訊息')}>回應設定</button>
      </div>
      <div className="official-bottom-save"><button onClick={()=>flash('已儲存歡迎訊息')}>儲存</button></div>
      {pickerOpen && <TypePicker title="選擇訊息類型" onClose={()=>setPickerOpen(false)} onSelect={add}/>}
      {previewOpen && <PreviewSheet title="預覽" onClose={()=>setPreviewOpen(false)} items={messages}/>}
      <Toast text={toast}/>
    </div>
  );
}

function AutoReplyPage({ onBack }: { onBack: () => void }) {
  const [page,setPage]=useState<'list'|'create'>('list');
  const [mode,setMode]=useState<'關鍵字'|'預設回應'>('關鍵字');
  const [keyword,setKeyword]=useState('營業時間');
  const [reply,setReply]=useState('營業時間為 10:00～20:00');
  const [enabled,setEnabled]=useState(true);
  const [toast,setToast]=useState('');
  const flash=(t:string)=>{setToast(t);setTimeout(()=>setToast(''),1500);};
  return (
    <div className="oa-mobile-screen official-feature-screen">
      {page==='list'?<>
        <Header title="自動回應訊息" onBack={onBack}/>
        <div className="official-feature-body">
          <div className="official-status-select">已啟用 <ChevronDown size={17}/></div>
          <div className="official-empty-center">尚無自動回應訊息</div>
        </div>
        <div className="official-bottom-save"><button onClick={()=>setPage('create')}>建立新訊息</button></div>
      </>:<>
        <Header title="建立" onBack={()=>setPage('list')} right={<button className="feature-text-link" onClick={()=>flash('預覽：'+reply)}>預覽</button>}/>
        <div className="official-feature-body">
          <section className="official-form-section"><h3>回應類型</h3><div className="official-segment"><button className={mode==='關鍵字'?'active':''} onClick={()=>setMode('關鍵字')}>關鍵字</button><button className={mode==='預設回應'?'active':''} onClick={()=>setMode('預設回應')}>預設回應</button></div></section>
          {mode==='關鍵字'&&<section className="official-form-section"><h3>關鍵字</h3><input value={keyword} onChange={e=>setKeyword(e.target.value)}/><small>好友輸入此關鍵字時觸發回應。</small></section>}
          <section className="official-form-section"><h3>訊息內容</h3><textarea value={reply} onChange={e=>setReply(e.target.value)}/></section>
          <section className="official-form-section"><label className="official-switch-row"><span>啟用此自動回應</span><input type="checkbox" checked={enabled} onChange={e=>setEnabled(e.target.checked)}/></label></section>
        </div>
        <div className="official-bottom-save"><button onClick={()=>{flash('已儲存自動回應');setTimeout(()=>setPage('list'),500)}}>儲存</button></div>
      </>}
      <Toast text={toast}/>
    </div>
  );
}

function RichMessagePage({ onBack }: { onBack: () => void }) {
  const [page,setPage]=useState<'list'|'create'>('list');
  const [title,setTitle]=useState('');
  const [template,setTemplate]=useState('1');
  const [action,setAction]=useState('連結');
  const [toast,setToast]=useState('');
  const flash=(t:string)=>{setToast(t);setTimeout(()=>setToast(''),1500);};
  return <div className="oa-mobile-screen official-feature-screen">
    {page==='list'?<>
      <Header title="圖文訊息" onBack={onBack}/>
      <div className="official-feature-body"><div className="official-empty-center">尚無圖文訊息</div></div>
      <div className="official-bottom-save"><button onClick={()=>setPage('create')}>建立</button></div>
    </>:<>
      <Header title="建立圖文訊息" onBack={()=>setPage('list')}/>
      <div className="official-feature-body">
        <section className="official-form-section"><h3>標題</h3><input maxLength={30} value={title} onChange={e=>setTitle(e.target.value)} placeholder="輸入標題"/><small>{title.length}/30</small></section>
        <section className="official-form-section"><h3>版型</h3><div className="richmessage-template-grid">{['1','2','3','4'].map(x=><button key={x} className={template===x?'active':''} onClick={()=>setTemplate(x)}><span>{x}</span></button>)}</div></section>
        <section className="official-form-section"><h3>圖片</h3><div className="official-image-placeholder">1040 × 1040</div><button className="official-add-outline"><ImageIcon size={17}/> 選擇圖片</button></section>
        <section className="official-form-section"><h3>動作</h3><select value={action} onChange={e=>setAction(e.target.value)}><option>連結</option><option>優惠券</option></select><input placeholder="輸入網址或選擇優惠券"/></section>
      </div>
      <div className="official-bottom-save"><button onClick={()=>{flash('已儲存圖文訊息');setTimeout(()=>setPage('list'),500)}}>儲存</button></div>
    </>}
    <Toast text={toast}/>
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

function CouponPage({ onBack }: { onBack: () => void }) {
  const [page,setPage]=useState<'list'|'type'|'create'>('list');
  const [type,setType]=useState('無條件');
  const [name,setName]=useState('');
  const [visibility,setVisibility]=useState('所有人');
  const [toast,setToast]=useState('');
  const flash=(t:string)=>{setToast(t);setTimeout(()=>setToast(''),1500);};
  return <div className="oa-mobile-screen official-feature-screen">
    {page==='list'?<>
      <Header title="優惠券" onBack={onBack}/>
      <div className="official-feature-body"><div className="official-empty-center">尚無優惠券</div></div>
      <div className="official-bottom-save"><button onClick={()=>setPage('type')}>建立</button></div>
    </>:page==='type'?<>
      <Header title="建立優惠券" onBack={()=>setPage('list')}/>
      <div className="official-feature-body coupon-type-list">
        {['無條件','抽獎','好友介紹'].map(x=><button key={x} onClick={()=>{setType(x);setPage('create')}}><Ticket size={28}/><div><strong>{x}</strong><span>{x==='無條件'?'任何取得連結的用戶都可領取':x==='抽獎'?'抽獎中獎後可取得優惠券':'分享給好友後取得優惠券'}</span></div><ChevronRight/></button>)}
      </div>
    </>:<>
      <Header title={type+'優惠券'} onBack={()=>setPage('type')}/>
      <div className="official-feature-body">
        <section className="official-form-section"><h3>優惠券名稱</h3><input value={name} onChange={e=>setName(e.target.value)} placeholder="輸入優惠券名稱"/></section>
        <section className="official-form-section"><h3>有效期間</h3><input type="date"/><input type="date"/></section>
        <section className="official-form-section"><h3>公開範圍</h3><select value={visibility} onChange={e=>setVisibility(e.target.value)}><option>所有人</option><option>僅官方帳號好友</option></select></section>
        <section className="official-form-section"><h3>使用條件</h3><textarea placeholder="輸入優惠券使用條件"/></section>
      </div>
      <div className="official-bottom-save two"><button className="secondary" onClick={()=>flash('已儲存草稿')}>儲存草稿</button><button onClick={()=>{flash('優惠券已儲存');setTimeout(()=>setPage('list'),500)}}>儲存</button></div>
    </>}
    <Toast text={toast}/>
  </div>;
}

function StampCardPage({ onBack }: { onBack: () => void }) {
  const [page,setPage]=useState<'list'|'create'>('list');
  const [goal,setGoal]=useState('10');
  const [expiry,setExpiry]=useState('最後一次使用後 6 個月');
  const [toast,setToast]=useState('');
  const flash=(t:string)=>{setToast(t);setTimeout(()=>setToast(''),1500);};
  return <div className="oa-mobile-screen official-feature-screen">
    {page==='list'?<>
      <Header title="集點卡" onBack={onBack}/>
      <div className="official-feature-body"><div className="official-empty-center">尚未建立集點卡</div></div>
      <div className="official-bottom-save"><button onClick={()=>setPage('create')}>建立集點卡</button></div>
    </>:<>
      <Header title="建立集點卡" onBack={()=>setPage('list')}/>
      <div className="official-feature-body">
        <div className="stamp-preview"><div className="stamp-dots">{Array.from({length:Number(goal)}).slice(0,10).map((_,i)=><i key={i}/>)}</div><strong>集滿 {goal} 點</strong></div>
        <section className="official-form-section"><h3>卡片顏色</h3><div className="color-swatch-row">{['#06c755','#f5a623','#4a90e2','#e85d75','#8b63d9'].map(c=><button key={c} style={{background:c}}/>)}</div></section>
        <section className="official-form-section"><h3>集滿點數</h3><select value={goal} onChange={e=>setGoal(e.target.value)}>{['5','10','15','20'].map(x=><option key={x}>{x}</option>)}</select></section>
        <section className="official-form-section"><h3>滿點禮優惠</h3><button className="official-add-outline"><Gift size={17}/> 選擇優惠券</button></section>
        <section className="official-form-section"><h3>有效期限</h3><select value={expiry} onChange={e=>setExpiry(e.target.value)}><option>最後一次使用後 6 個月</option><option>首次使用後 1 年</option><option>不設定</option></select></section>
      </div>
      <div className="official-bottom-save"><button onClick={()=>{flash('集點卡已公開');setTimeout(()=>setPage('list'),500)}}>儲存並公開集點卡</button></div>
    </>}
    <Toast text={toast}/>
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
  const [welcome,setWelcome]=useState(true);
  const [webhook,setWebhook]=useState(false);
  if(sub==='回應設定') return <div className="oa-mobile-screen official-feature-screen"><Header title="回應設定" onBack={()=>setSub(null)}/><div className="official-feature-body"><section className="official-form-section"><label className="official-switch-row"><span>聊天</span><input type="checkbox" checked={chat} onChange={e=>setChat(e.target.checked)}/></label><label className="official-switch-row"><span>加入好友的歡迎訊息</span><input type="checkbox" checked={welcome} onChange={e=>setWelcome(e.target.checked)}/></label><label className="official-switch-row"><span>Webhook</span><input type="checkbox" checked={webhook} onChange={e=>setWebhook(e.target.checked)}/></label></section></div></div>;
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
