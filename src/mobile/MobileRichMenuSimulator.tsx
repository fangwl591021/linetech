import { useMemo, useRef, useState } from 'react';
import {
  BarChart3,
  Bell,
  BriefcaseBusiness,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  CreditCard,
  Grid2X2,
  Home,
  Image as ImageIcon,
  Info,
  Menu,
  MessageCircle,
  MousePointer2,
  Play,
  Puzzle,
  RadioTower,
  Settings,
  Ticket,
  UserPlus,
  X
} from 'lucide-react';
import { templates } from '../domain/templates';
import type { RichMenuTemplate } from '../domain/types';
import { presetIndustries, richMenuPresets } from './presets';

type MobilePage = 'home' | 'intro' | 'step1';
type SizeTab = 'compact' | 'large';

const homeItems = [
  { label: '群發訊息', icon: RadioTower },
  { label: '加入好友\n的歡迎訊息', icon: MessageCircle },
  { label: '自動回應\n訊息', icon: MousePointer2 },
  { label: '圖文訊息', icon: ImageIcon },
  { label: '多頁訊息', icon: ImageIcon },
  { label: '優惠券', icon: Ticket },
  { label: '集點卡', icon: CreditCard },
  { label: '增加好友人\n數', icon: UserPlus },
  { label: '商業簡介', icon: BriefcaseBusiness },
  { label: '圖文選單', icon: Grid2X2, key: 'rich-menu' },
  { label: 'LINE Touch', icon: MousePointer2 },
  { label: '最新資訊', icon: Info },
  { label: '設定', icon: Settings },
  { label: 'Help', icon: CircleHelp },
  { label: '擴充功能', icon: Puzzle }
];

function TemplateThumb({ template, selected, onClick }: { template: RichMenuTemplate; selected: boolean; onClick: () => void }) {
  return (
    <button className={`mobile-template-thumb ${selected ? 'selected' : ''}`} onClick={onClick}>
      <div className="mobile-template-canvas" style={{ aspectRatio: template.aspectRatio }}>
        {template.areas.map(area => (
          <span
            key={area.id}
            style={{ left: `${area.x * 100}%`, top: `${area.y * 100}%`, width: `${area.width * 100}%`, height: `${area.height * 100}%` }}
          />
        ))}
      </div>
      <small>{template.label.replace(/^.*・/, '')}</small>
    </button>
  );
}

function MobileHeader({ title, onBack }: { title: string; onBack?: () => void }) {
  return (
    <div className="oa-mobile-header">
      {onBack ? <button className="mobile-back" onClick={onBack}><ChevronLeft size={28} /></button> : <button className="mobile-menu"><Menu size={24} /></button>}
      <strong>{title}</strong>
      <span className="mobile-header-spacer" />
    </div>
  );
}

export function MobileRichMenuSimulator() {
  const [page, setPage] = useState<MobilePage>('home');
  const [pickerOpen, setPickerOpen] = useState(false);
  const [presetOpen, setPresetOpen] = useState(false);
  const [presetIndustry, setPresetIndustry] = useState('全部');
  const [pendingPresetId, setPendingPresetId] = useState<string | null>(null);
  const [sizeTab, setSizeTab] = useState<SizeTab>('compact');
  const [templateId, setTemplateId] = useState<string | null>(null);
  const [pendingTemplateId, setPendingTemplateId] = useState<string | null>(null);
  const [imageDataUrl, setImageDataUrl] = useState('');
  const [imageName, setImageName] = useState('');
  const [done, setDone] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const selectedTemplate = useMemo(
    () => templates.find(t => t.id === templateId) ?? null,
    [templateId]
  );

  const selectedPreset = useMemo(
    () => richMenuPresets.find(item => item.id === pendingPresetId) ?? null,
    [pendingPresetId]
  );

  const visiblePresets = useMemo(
    () => richMenuPresets.filter(item => presetIndustry === '全部' || item.industry === presetIndustry),
    [presetIndustry]
  );

  const pickerTemplates = templates.filter(t => t.size === sizeTab);
  const canUpload = Boolean(selectedTemplate);
  const canNext = Boolean(selectedTemplate && imageDataUrl);

  const openPicker = () => {
    setPendingTemplateId(templateId);
    setSizeTab(selectedTemplate?.size ?? 'compact');
    setPickerOpen(true);
  };

  const applyTemplate = () => {
    if (!pendingTemplateId) return;
    setTemplateId(pendingTemplateId);
    setImageDataUrl('');
    setImageName('');
    setDone(false);
    setPickerOpen(false);
  };

  const onUpload = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImageDataUrl(String(reader.result ?? ''));
      setImageName(file.name);
      setDone(false);
    };
    reader.readAsDataURL(file);
  };

  const openPresetLibrary = () => {
    setPendingPresetId(null);
    setPresetIndustry('全部');
    setPresetOpen(true);
  };

  const applyPreset = () => {
    if (!selectedPreset) return;
    setTemplateId(selectedPreset.templateId);
    setImageDataUrl(selectedPreset.imageDataUrl);
    setImageName(`Linetech 範本｜${selectedPreset.name}`);
    setDone(false);
    setPresetOpen(false);
    setPendingPresetId(null);
  };

  const reset = () => {
    setPage('home');
    setPickerOpen(false);
    setPresetOpen(false);
    setPresetIndustry('全部');
    setPendingPresetId(null);
    setTemplateId(null);
    setPendingTemplateId(null);
    setImageDataUrl('');
    setImageName('');
    setDone(false);
  };

  return (
    <div className="mobile-training-stage">
      <div className="mobile-training-head">
        <div>
          <strong>手機版圖文選單教學模擬器</strong>
          <span>Mobile Rich Menu Simulator – Phase 1</span>
        </div>
        <button onClick={reset}>重新開始</button>
      </div>

      <div className="mobile-training-layout">
        <section className="oa-mobile-device" aria-label="LINE Official Account 手機版模擬器">
          {page === 'home' && (
            <div className="oa-mobile-screen">
              <MobileHeader title="主頁" />
              <div className="mobile-account-card">
                <div className="mobile-account-avatar">K</div>
                <div className="mobile-account-copy"><strong>康立全球智能系統</strong><span>@k-linkintelligent</span></div>
                <ChevronRight className="mobile-row-chevron" />
              </div>
              <div className="mobile-stat-row"><span>目標好友數</span><strong>782</strong><ChevronRight /></div>
              <div className="mobile-stat-row"><span>免費訊息則數</span><strong>0 <small>/ 200</small></strong><ChevronRight /></div>
              <button className="mobile-broadcast-btn">傳送群發訊息</button>
              <div className="mobile-progress-row">
                <div className="mobile-progress-ring">◎</div>
                <div><strong>接著有效率地增加好友人數吧！</strong><span>還剩3個步驟</span></div>
                <ChevronRight />
              </div>
              <div className="mobile-home-grid">
                {homeItems.map(item => {
                  const Icon = item.icon;
                  return (
                    <button key={item.label} onClick={() => item.key === 'rich-menu' && setPage('intro')}>
                      <Icon size={34} strokeWidth={2.2} />
                      <span>{item.label.split('\n').map((line, i) => <span key={`${line}-${i}`}>{line}</span>)}</span>
                    </button>
                  );
                })}
              </div>
              <div className="mobile-bottom-tabs">
                <button className="active"><Home /><span>主頁</span></button>
                <button><Play /><span>內容</span></button>
                <button className="badge-tab"><MessageCircle /><b>99+</b><span>聊天</span></button>
                <button><BarChart3 /><span>分析</span></button>
                <button><Bell /><span>通知</span></button>
              </div>
            </div>
          )}

          {page === 'intro' && (
            <div className="oa-mobile-screen mobile-simple-page">
              <MobileHeader title="圖文選單" onBack={() => setPage('home')} />
              <div className="mobile-intro-content">
                <h2>可以在聊天室顯示螢幕選單，引導用戶執行動作。</h2>
                <div className="mobile-intro-illustration">
                  <div className="intro-person">👩🏻‍💼</div>
                  <div className="intro-phone">
                    <div className="intro-phone-head">Brown Coffee</div>
                    <div className="intro-chat">您好，歡迎使用官方帳號</div>
                    <div className="intro-rich"><b>優惠券發放中</b><span>預約</span><span>本月菜單</span><span>交通方式</span></div>
                  </div>
                </div>
                <p>圖文選單可以在官方帳號的聊天室中，把選單放大顯示的功能。</p>
                <p>只要指定背景照片及選擇選單時導往的網站網址，就能輕鬆地完成設定。</p>
                <p>每當用戶打開聊天室，選單就會顯示在畫面上的顯眼位置，能更有效地引導用戶使用優惠券及預約等各式各樣的動作。</p>
              </div>
              <div className="mobile-fixed-action"><button onClick={() => setPage('step1')}>建立</button></div>
            </div>
          )}

          {page === 'step1' && (
            <div className="oa-mobile-screen mobile-simple-page">
              <MobileHeader title="內容設定（1/3）" onBack={() => setPage('intro')} />
              <div className="mobile-step1-preview">
                {!selectedTemplate ? (
                  <span>請選擇版型並上傳背景圖片。</span>
                ) : (
                  <div className="mobile-selected-preview" style={{ aspectRatio: selectedTemplate.aspectRatio }}>
                    {imageDataUrl && <img src={imageDataUrl} alt="圖文選單背景" />}
                    {selectedTemplate.areas.map(area => (
                      <span
                        className="mobile-area-label"
                        key={area.id}
                        style={{ left: `${area.x * 100}%`, top: `${area.y * 100}%`, width: `${area.width * 100}%`, height: `${area.height * 100}%` }}
                      >{area.id}</span>
                    ))}
                    {!imageDataUrl && <em>請選擇版型並上傳背景圖片。</em>}
                  </div>
                )}
              </div>
              <div className="mobile-step1-controls">
                <button className="mobile-outline-green" onClick={openPicker}>選擇版型</button>
                <button className="mobile-outline-green" disabled={!canUpload} onClick={() => fileRef.current?.click()}>上傳圖片</button>
                <input ref={fileRef} type="file" accept="image/jpeg,image/png" hidden onChange={e => onUpload(e.target.files?.[0])} />
                <ul>
                  <li>檔案格式：JPG、JPEG、PNG</li>
                  <li>檔案容量：10MB以下</li>
                  <li>圖片尺寸（大）：2500px × 1686px</li>
                  <li>圖片尺寸（小）：2500px × 843px</li>
                </ul>
                <button className="mobile-preset-btn" onClick={openPresetLibrary}>選擇預設圖片</button>
                <div className="linetech-extension-note">Linetech 擴充：可直接選用原創產業範本，版型會同步套用。</div>
                {imageName && <div className="mobile-file-status">已選擇：{imageName}</div>}
              </div>
              <div className="mobile-next-area">
                <button disabled={!canNext} onClick={() => setDone(true)}>下一步</button>
                {done && <div className="mobile-phase-done">✓ 第一階段完成：版型與背景圖片已設定</div>}
              </div>
            </div>
          )}

          {pickerOpen && (
            <div className="mobile-picker-overlay">
              <div className="mobile-picker-sheet">
                <div className="mobile-picker-head"><strong>選擇版型</strong><button onClick={() => setPickerOpen(false)}><X size={25} /></button></div>
                <div className="mobile-picker-tabs">
                  <button className={sizeTab === 'compact' ? 'active' : ''} onClick={() => { setSizeTab('compact'); setPendingTemplateId(null); }}>小</button>
                  <button className={sizeTab === 'large' ? 'active' : ''} onClick={() => { setSizeTab('large'); setPendingTemplateId(null); }}>大</button>
                </div>
                <p>{sizeTab === 'compact' ? '適合顯示版面較小或項目較少的圖文選單。' : '適合顯示版面較大或項目較多的圖文選單。'}</p>
                <div className="mobile-template-grid">
                  {pickerTemplates.map(template => (
                    <TemplateThumb key={template.id} template={template} selected={pendingTemplateId === template.id} onClick={() => setPendingTemplateId(template.id)} />
                  ))}
                </div>
                <div className="mobile-picker-actions">
                  <button className="select" disabled={!pendingTemplateId} onClick={applyTemplate}>選擇</button>
                  <button className="cancel" onClick={() => setPickerOpen(false)}>取消</button>
                </div>
              </div>
            </div>
          )}

          {presetOpen && (
            <div className="mobile-picker-overlay linetech-library-overlay">
              <div className="linetech-library-sheet">
                <div className="linetech-library-head">
                  <div><strong>Linetech 範本庫</strong><span>原創 LINE Rich Menu 圖庫</span></div>
                  <button onClick={() => setPresetOpen(false)}><X size={25} /></button>
                </div>
                <div className="linetech-library-banner">此區為 Linetech 教學擴充功能，非 LINE 官方內建圖庫。</div>
                <div className="linetech-library-filters">
                  {presetIndustries.map(industry => (
                    <button key={industry} className={presetIndustry === industry ? 'active' : ''} onClick={() => { setPresetIndustry(industry); setPendingPresetId(null); }}>{industry}</button>
                  ))}
                </div>
                <div className="linetech-preset-grid">
                  {visiblePresets.map(preset => (
                    <button key={preset.id} className={`linetech-preset-card ${pendingPresetId === preset.id ? 'selected' : ''}`} onClick={() => setPendingPresetId(preset.id)}>
                      <div className="linetech-preset-image" style={{ aspectRatio: preset.size === 'large' ? 2500 / 1686 : 2500 / 843 }}>
                        <img src={preset.imageDataUrl} alt={preset.name} />
                      </div>
                      <div className="linetech-preset-copy">
                        <strong>{preset.name}</strong>
                        <span>{preset.industry}・{preset.purpose}</span>
                        <small>{preset.style}｜{preset.size === 'large' ? '大版型' : '小版型'}</small>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="linetech-library-actions">
                  <button className="apply" disabled={!selectedPreset} onClick={applyPreset}>套用範本</button>
                  <button className="cancel" onClick={() => setPresetOpen(false)}>取消</button>
                </div>
              </div>
            </div>
          )}
        </section>

        <aside className="mobile-teaching-panel">
          <span className="teacher-only">教學輔助區・非 LINE 官方畫面</span>
          <h2>手機版圖文選單</h2>
          <p>這一版依你提供的 2026 LINE Official Account App 實際畫面製作，讓學員先建立操作肌肉記憶。</p>
          <ol>
            <li className={page === 'home' ? 'active' : 'done'}><b>1</b><div><strong>主頁</strong><span>點選「圖文選單」</span></div></li>
            <li className={page === 'intro' ? 'active' : page === 'step1' ? 'done' : ''}><b>2</b><div><strong>圖文選單介紹</strong><span>點「建立」</span></div></li>
            <li className={page === 'step1' && !selectedTemplate ? 'active' : selectedTemplate ? 'done' : ''}><b>3</b><div><strong>選擇版型</strong><span>小 / 大版型；也可由 Linetech 範本同步套用</span></div></li>
            <li className={page === 'step1' && selectedTemplate && !imageDataUrl ? 'active' : imageDataUrl ? 'done' : ''}><b>4</b><div><strong>上傳圖片</strong><span>或進入 Linetech 原創範本庫</span></div></li>
            <li className={done ? 'done active' : ''}><b>5</b><div><strong>完成 Step 1</strong><span>「下一步」變為可按</span></div></li>
          </ol>
          <div className="mobile-teaching-note">
            <strong>原創範本庫 V0.1</strong>
            <span>目前先放入餐飲、美容、房地產、顧問、教育、零售 6 套範本；後續可擴充到 30 套並加入色系、用途、格數篩選。</span>
          </div>
        </aside>
      </div>
    </div>
  );
}
