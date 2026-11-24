import { useMemo, useState, type ReactNode } from 'react';
import {
  BarChart3,
  Bell,
  BriefcaseBusiness,
  ChevronLeft,
  CircleHelp,
  Copy,
  CreditCard,
  Database,
  ExternalLink,
  Gift,
  Image as ImageIcon,
  Link2,
  MessageCircle,
  MousePointer2,
  Plus,
  RadioTower,
  Save,
  Search,
  Send,
  Settings,
  Smartphone,
  Ticket,
  UserPlus
} from 'lucide-react';

export type FeatureKey =
  | 'broadcast'
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

export const featureLabels: Record<FeatureKey, string> = {
  broadcast: '群發訊息',
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

interface Props {
  feature: FeatureKey;
  onBack: () => void;
}

function MobileFeatureHeader({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <div className="oa-mobile-header">
      <button className="mobile-back" onClick={onBack}><ChevronLeft size={28} /></button>
      <strong>{title}</strong>
      <span className="mobile-header-spacer" />
    </div>
  );
}

function SaveBar({ label = '儲存', onClick }: { label?: string; onClick: () => void }) {
  return <div className="feature-savebar"><button onClick={onClick}>{label}</button></div>;
}

function Notice({ children }: { children: ReactNode }) {
  return <div className="feature-notice">{children}</div>;
}

export function MobileFeaturePage({ feature, onBack }: Props) {
  const [saved, setSaved] = useState('');
  const flash = (message: string) => {
    setSaved(message);
    window.setTimeout(() => setSaved(''), 1800);
  };

  return (
    <div className="oa-mobile-screen mobile-feature-page">
      <MobileFeatureHeader title={featureLabels[feature]} onBack={onBack} />
      <FeatureContent feature={feature} flash={flash} />
      {saved && <div className="feature-toast">{saved}</div>}
    </div>
  );
}

function FeatureContent({ feature, flash }: { feature: FeatureKey; flash: (message: string) => void }) {
  switch (feature) {
    case 'broadcast': return <BroadcastFeature flash={flash} />;
    case 'welcome': return <WelcomeFeature flash={flash} />;
    case 'autoreply': return <AutoReplyFeature flash={flash} />;
    case 'richmessage': return <RichMessageFeature flash={flash} />;
    case 'multipage': return <MultiPageFeature flash={flash} />;
    case 'coupon': return <CouponFeature flash={flash} />;
    case 'stampcard': return <StampCardFeature flash={flash} />;
    case 'addfriend': return <AddFriendFeature flash={flash} />;
    case 'businessProfile': return <BusinessProfileFeature flash={flash} />;
    case 'lineTouch': return <LineTouchFeature flash={flash} />;
    case 'billing': return <BillingFeature flash={flash} />;
    case 'latest': return <LatestInfoFeature flash={flash} />;
    case 'settings': return <SettingsFeature flash={flash} />;
    case 'help': return <HelpFeature />;
    case 'extensions': return <ExtensionsFeature />;
    case 'chat': return <ChatFeature flash={flash} />;
    case 'analytics': return <AnalyticsFeature />;
    case 'notifications': return <NotificationsFeature flash={flash} />;
  }
}

function BroadcastFeature({ flash }: { flash: (m: string) => void }) {
  const [audience, setAudience] = useState('所有好友');
  const [text, setText] = useState('本週最新消息，歡迎點擊查看！');
  const [schedule, setSchedule] = useState('立即傳送');
  return (
    <>
      <div className="feature-content">
        <Notice>群發訊息可傳送文字、貼圖、照片、優惠券、圖文訊息、進階影片訊息與影片等格式；也可搭配分眾受眾。</Notice>
        <section className="feature-card">
          <h3><RadioTower size={18}/> 傳送對象</h3>
          <select value={audience} onChange={e => setAudience(e.target.value)}>
            <option>所有好友</option><option>依受眾篩選</option>
          </select>
        </section>
        <section className="feature-card">
          <h3><MessageCircle size={18}/> 訊息內容</h3>
          <textarea maxLength={500} value={text} onChange={e => setText(e.target.value)} />
          <small>{text.length}/500</small>
          <div className="feature-chip-row"><button>文字</button><button>照片</button><button>優惠券</button><button>圖文訊息</button></div>
        </section>
        <section className="feature-card">
          <h3>傳送時間</h3>
          <select value={schedule} onChange={e => setSchedule(e.target.value)}>
            <option>立即傳送</option><option>指定時間</option>
          </select>
        </section>
      </div>
      <SaveBar label="傳送測試" onClick={() => flash(`測試：${audience}・${schedule}`)} />
    </>
  );
}

function WelcomeFeature({ flash }: { flash: (m: string) => void }) {
  const [messages, setMessages] = useState(['歡迎加入好友！很高興認識你。']);
  const add = () => messages.length < 5 && setMessages(v => [...v, '']);
  return (
    <>
      <div className="feature-content">
        <Notice>加入好友歡迎訊息最多可設定 5 則，並可使用多種訊息格式；可在回應設定中啟用或停用。</Notice>
        {messages.map((m, i) => (
          <section className="feature-card" key={i}>
            <h3>歡迎訊息 {i + 1}</h3>
            <textarea value={m} onChange={e => setMessages(items => items.map((x, idx) => idx === i ? e.target.value : x))} />
          </section>
        ))}
        <button className="feature-outline" disabled={messages.length >= 5} onClick={add}><Plus size={17}/> 新增訊息</button>
        <div className="feature-chip-row"><button>文字</button><button>照片</button><button>圖文訊息</button><button>多頁訊息</button></div>
      </div>
      <SaveBar onClick={() => flash('歡迎訊息已儲存（教學模擬）')} />
    </>
  );
}

function AutoReplyFeature({ flash }: { flash: (m: string) => void }) {
  const [keyword, setKeyword] = useState('營業時間');
  const [reply, setReply] = useState('我們的營業時間為 10:00～20:00。');
  const [enabled, setEnabled] = useState(true);
  return (
    <>
      <div className="feature-content">
        <Notice>自動回應可用「關鍵字」或預設回應內容。回應模式與啟用狀態由「設定 ＞ 回應設定」控制。</Notice>
        <section className="feature-card">
          <label className="feature-toggle"><span>啟用自動回應</span><input type="checkbox" checked={enabled} onChange={e => setEnabled(e.target.checked)} /></label>
        </section>
        <section className="feature-card">
          <h3><MousePointer2 size={18}/> 關鍵字</h3>
          <input value={keyword} onChange={e => setKeyword(e.target.value)} />
        </section>
        <section className="feature-card">
          <h3>回應內容</h3>
          <textarea value={reply} onChange={e => setReply(e.target.value)} />
          <button className="feature-outline" onClick={() => flash(`輸入「${keyword}」→ 回覆「${reply}」`)}>回應測試</button>
        </section>
      </div>
      <SaveBar onClick={() => flash('自動回應規則已儲存')} />
    </>
  );
}

function RichMessageFeature({ flash }: { flash: (m: string) => void }) {
  const [title, setTitle] = useState('新品活動');
  const [layout, setLayout] = useState('單一大圖');
  const [action, setAction] = useState('連結');
  return (
    <>
      <div className="feature-content">
        <Notice>圖文訊息使用 1040×1040px 圖片，設定版型後可為區塊指定「優惠券」或「連結」等動作。</Notice>
        <section className="feature-card"><h3>標題</h3><input value={title} onChange={e => setTitle(e.target.value)} /></section>
        <section className="feature-card"><h3>版型</h3><select value={layout} onChange={e => setLayout(e.target.value)}><option>單一大圖</option><option>上下兩格</option><option>左右兩格</option><option>四格</option></select></section>
        <section className="feature-card"><h3><ImageIcon size={18}/> 圖片</h3><button className="feature-outline">選擇圖片</button><div className="feature-image-placeholder">1040 × 1040</div></section>
        <section className="feature-card"><h3>動作</h3><select value={action} onChange={e => setAction(e.target.value)}><option>連結</option><option>優惠券</option></select></section>
      </div>
      <SaveBar onClick={() => flash(`${title}・${layout}・${action} 已儲存`)} />
    </>
  );
}

function MultiPageFeature({ flash }: { flash: (m: string) => void }) {
  const [cards, setCards] = useState(['商品 A', '商品 B', '商品 C']);
  const [type, setType] = useState('商品型');
  return (
    <>
      <div className="feature-content">
        <Notice>多頁訊息先選擇頁面類型，再為各頁設定圖片、說明文字與對應動作，可搭配關鍵字與圖文選單呼叫。</Notice>
        <section className="feature-card"><h3>頁面類型</h3><select value={type} onChange={e => setType(e.target.value)}><option>商品型</option><option>圖片型</option></select></section>
        <div className="feature-carousel-preview">{cards.map((x,i)=><div key={i}><div className="feature-image-placeholder">圖片</div><strong>{x}</strong></div>)}</div>
        <button className="feature-outline" onClick={() => setCards(v => [...v, `商品 ${String.fromCharCode(65 + v.length)}`])}><Plus size={17}/> 新增一頁</button>
      </div>
      <SaveBar onClick={() => flash(`多頁訊息已儲存（${cards.length} 頁）`)} />
    </>
  );
}

function CouponFeature({ flash }: { flash: (m: string) => void }) {
  const [name, setName] = useState('新好友 9 折券');
  const [condition, setCondition] = useState('無條件');
  const [visibility, setVisibility] = useState('所有人');
  return (
    <>
      <div className="feature-content">
        <Notice>優惠券目前可依領取條件建立「無條件、抽獎、好友介紹」等類型，並設定公開範圍。</Notice>
        <section className="feature-card"><h3><Ticket size={18}/> 優惠券名稱</h3><input value={name} onChange={e=>setName(e.target.value)} /></section>
        <section className="feature-card"><h3>領取條件</h3><select value={condition} onChange={e=>setCondition(e.target.value)}><option>無條件</option><option>抽獎</option><option>好友介紹</option></select></section>
        <section className="feature-card"><h3>公開範圍</h3><select value={visibility} onChange={e=>setVisibility(e.target.value)}><option>所有人</option><option>僅官方帳號好友</option></select></section>
      </div>
      <SaveBar onClick={() => flash(`${name} 已建立：${condition}`)} />
    </>
  );
}

function StampCardFeature({ flash }: { flash: (m: string) => void }) {
  const [goal, setGoal] = useState('10');
  const [expiry, setExpiry] = useState('最後一次使用後 6 個月');
  return (
    <>
      <div className="feature-content">
        <Notice>集點卡可設定滿點禮優惠、有效期限、升級集點卡，公開後可產生「點數發放行動條碼」。</Notice>
        <section className="feature-card"><h3><CreditCard size={18}/> 集滿點數</h3><select value={goal} onChange={e=>setGoal(e.target.value)}><option>5</option><option>10</option><option>15</option><option>20</option></select></section>
        <section className="feature-card"><h3>滿點禮</h3><button className="feature-outline"><Gift size={17}/> 選擇優惠券</button></section>
        <section className="feature-card"><h3>有效期限</h3><select value={expiry} onChange={e=>setExpiry(e.target.value)}><option>最後一次使用後 6 個月</option><option>首次使用後 1 年</option><option>不設定</option></select></section>
      </div>
      <SaveBar label="儲存並公開集點卡" onClick={() => flash(`集點卡已公開：${goal} 點`)} />
    </>
  );
}

function AddFriendFeature({ flash }: { flash: (m: string) => void }) {
  const [source, setSource] = useState('門市海報');
  return (
    <div className="feature-content">
      <Notice>增加好友工具提供 QR Code、加入好友網址與按鈕；也可設定「好友加入管道」，之後在分析中檢視各管道成效。</Notice>
      <section className="feature-card feature-center">
        <div className="mock-qr">▦</div>
        <strong>@k-linkintelligent</strong>
        <button className="feature-outline" onClick={()=>flash('加入好友網址已複製')}><Copy size={17}/> 複製加好友網址</button>
      </section>
      <section className="feature-card"><h3>好友加入管道</h3><input value={source} onChange={e=>setSource(e.target.value)} /><button className="feature-outline" onClick={()=>flash(`已建立管道：${source}`)}>建立管道</button></section>
    </div>
  );
}

function BusinessProfileFeature({ flash }: { flash: (m: string) => void }) {
  const [businessName, setBusinessName] = useState('康立全球智能系統');
  const [website, setWebsite] = useState('https://example.com');
  const [phone, setPhone] = useState('03-000-0000');
  const [status, setStatus] = useState('草稿');
  return (
    <>
      <div className="feature-content">
        <Notice>2026/10/28 起改為新的「商業簡介」管理方式：基本資訊集中管理，擴充項目改採儲存／發布；按鍵顯示規格也同步更新。</Notice>
        <section className="feature-card"><h3><BriefcaseBusiness size={18}/> 商業簡介設定</h3><label>名稱<input value={businessName} onChange={e=>setBusinessName(e.target.value)} /></label><label>網站<input value={website} onChange={e=>setWebsite(e.target.value)} /></label><label>電話<input value={phone} onChange={e=>setPhone(e.target.value)} /></label></section>
        <section className="feature-card"><h3>目前狀態</h3><div className={`feature-status ${status === '已發布' ? 'published' : ''}`}>{status}</div></section>
      </div>
      <SaveBar label={status === '已發布' ? '儲存更新' : '儲存並發布'} onClick={()=>{setStatus('已發布');flash('商業簡介已發布')}} />
    </>
  );
}

function LineTouchFeature({ flash }: { flash: (m: string) => void }) {
  const [enabled, setEnabled] = useState(false);
  const [tags, setTags] = useState(0);
  return (
    <div className="feature-content">
      <Notice>LINE Touch 透過 NFC 標籤快速導向官方帳號商業簡介、優惠券、集點卡或 LINE MINI App；註冊 NFC 標籤需使用手機版 App。</Notice>
      {!enabled ? <section className="feature-card feature-center"><Smartphone size={44}/><h3>首次使用 LINE Touch</h3><p>須為認證帳號並擁有管理員權限。</p><button className="feature-primary" onClick={()=>{setEnabled(true);flash('LINE Touch 已啟用')}}>開始使用 LINE Touch</button></section>
      : <section className="feature-card"><h3>已登錄 NFC 標籤</h3><div className="feature-metric">{tags}</div><button className="feature-outline" onClick={()=>setTags(v=>v+1)}><Plus size={17}/> 模擬登錄標籤</button><button className="feature-outline" onClick={()=>flash('已建立 NFC 動作：開啟優惠券')}>建立動作</button></section>}
    </div>
  );
}

function BillingFeature({ flash }: { flash: (m: string) => void }) {
  const tabs = ['總覽','推廣方案','專屬ID','付款紀錄','付款方式','電子發票資訊'];
  const [tab,setTab]=useState('總覽');
  return (
    <div className="feature-content">
      <Notice>帳務專區可查看目前方案、訊息使用狀態、付款紀錄、付款方式與電子發票資訊。</Notice>
      <div className="feature-chip-row">{tabs.map(x=><button className={tab===x?'active':''} key={x} onClick={()=>setTab(x)}>{x}</button>)}</div>
      <section className="feature-card"><h3><Database size={18}/> {tab}</h3>{tab==='總覽'?<><div className="feature-metric-row"><span>方案</span><strong>輕用量</strong></div><div className="feature-metric-row"><span>本月訊息</span><strong>9 / 200</strong></div><button className="feature-outline" onClick={()=>flash('已進入方案設定（教學模擬）')}>變更上限</button></>:<p>此頁顯示 {tab} 相關設定與紀錄。</p>}</section>
    </div>
  );
}

function LatestInfoFeature({ flash }: { flash: (m: string) => void }) {
  const [items,setItems]=useState(['十一月最新活動','服務時間調整']);
  const [title,setTitle]=useState('');
  return (
    <div className="feature-content">
      <Notice>新版商業簡介規格中，「最新資訊」最多保留 20 則；較舊內容會依新版規格處理。</Notice>
      <section className="feature-card"><h3>新增最新資訊</h3><input value={title} onChange={e=>setTitle(e.target.value)} placeholder="輸入標題"/><button className="feature-outline" disabled={!title.trim()} onClick={()=>{setItems(v=>[title,...v].slice(0,20));setTitle('');flash('最新資訊已加入草稿')}}><Plus size={17}/> 新增</button></section>
      {items.map((x,i)=><section className="feature-list-row" key={i}><Info size={18}/><span>{x}</span><small>草稿</small></section>)}
    </div>
  );
}

function SettingsFeature({ flash }: { flash: (m: string) => void }) {
  const [chat,setChat]=useState(true);
  const [welcome,setWelcome]=useState(true);
  const [webhook,setWebhook]=useState(false);
  return (
    <div className="feature-content">
      <Notice>設定目前包含帳號設定、權限管理、回應設定、Messaging API 與帳務專區。</Notice>
      <section className="feature-list-row"><Settings/><span>帳號設定</span></section>
      <section className="feature-list-row"><UserPlus/><span>權限管理</span></section>
      <section className="feature-card"><h3>回應設定</h3><label className="feature-toggle"><span>聊天</span><input type="checkbox" checked={chat} onChange={e=>setChat(e.target.checked)}/></label><label className="feature-toggle"><span>歡迎訊息</span><input type="checkbox" checked={welcome} onChange={e=>setWelcome(e.target.checked)}/></label><label className="feature-toggle"><span>Webhook</span><input type="checkbox" checked={webhook} onChange={e=>setWebhook(e.target.checked)}/></label><button className="feature-outline" onClick={()=>flash('回應設定已儲存')}>儲存回應設定</button></section>
      <section className="feature-list-row"><Link2/><span>Messaging API</span></section>
      <section className="feature-list-row"><Database/><span>帳務專區</span></section>
    </div>
  );
}

function HelpFeature() {
  const [q,setQ]=useState('');
  const topics=['帳號設定','群發訊息','聊天與自動回應','圖文選單','優惠券與集點卡','LINE Touch','付款與帳務'];
  const visible=useMemo(()=>topics.filter(x=>x.includes(q.trim())),[q]);
  return <div className="feature-content"><section className="feature-card"><h3><Search size={18}/> 搜尋說明</h3><input value={q} onChange={e=>setQ(e.target.value)} placeholder="搜尋問題"/></section>{visible.map(x=><section className="feature-list-row" key={x}><CircleHelp/><span>{x}</span><ExternalLink size={15}/></section>)}</div>;
}

function ExtensionsFeature() {
  return (
    <div className="feature-content">
      <Notice>「擴充功能」顯示內容會依帳號資格、已啟用服務與地區而不同。商業簡介相關內容已改採新版集中管理與發布規格。</Notice>
      <section className="feature-list-row"><BriefcaseBusiness/><span>商業簡介相關服務</span></section>
      <section className="feature-list-row"><Smartphone/><span>LINE Touch</span></section>
      <section className="feature-list-row"><Gift/><span>OA Plus / 其他可用服務</span></section>
    </div>
  );
}

function ChatFeature({ flash }: { flash: (m: string) => void }) {
  const [text,setText]=useState('');
  const [messages,setMessages]=useState(['您好，請問今天有營業嗎？']);
  return (
    <div className="feature-content chat-feature">
      <Notice>一對一聊天可與好友直接溝通；啟用聊天後也可搭配回應時間、LINE Call 與預約訊息。</Notice>
      <div className="feature-chat-thread">{messages.map((x,i)=><div key={i} className={i===0?'incoming':'outgoing'}>{x}</div>)}</div>
      <div className="feature-chat-input"><input value={text} onChange={e=>setText(e.target.value)} placeholder="輸入訊息"/><button disabled={!text.trim()} onClick={()=>{setMessages(v=>[...v,text]);setText('');flash('訊息已送出（模擬）')}}><Send size={18}/></button></div>
    </div>
  );
}

function AnalyticsFeature() {
  return (
    <div className="feature-content">
      <Notice>分析可查看好友、活動、訊息及追蹤（LINE Tag）等數據。</Notice>
      <div className="feature-analytics-grid">
        <section><span>好友</span><strong>12</strong></section>
        <section><span>本月訊息</span><strong>9</strong></section>
        <section><span>點擊率</span><strong>32%</strong></section>
        <section><span>封鎖率</span><strong>4%</strong></section>
      </div>
      <section className="feature-card"><h3><BarChart3 size={18}/> 趨勢</h3><div className="feature-chart-bars"><i/><i/><i/><i/><i/><i/><i/></div></section>
    </div>
  );
}

function NotificationsFeature({ flash }: { flash: (m: string) => void }) {
  const [enabled,setEnabled]=useState(true);
  return (
    <div className="feature-content">
      <section className="feature-card"><h3><Bell size={18}/> 應用程式通知</h3><label className="feature-toggle"><span>啟用通知</span><input type="checkbox" checked={enabled} onChange={e=>{setEnabled(e.target.checked);flash(e.target.checked?'通知已開啟':'通知已關閉')}}/></label></section>
      <section className="feature-list-row"><Bell/><span>系統公告：服務功能更新</span><small>今天</small></section>
      <section className="feature-list-row"><MessageCircle/><span>聊天室有新訊息</span><small>剛剛</small></section>
    </div>
  );
}
