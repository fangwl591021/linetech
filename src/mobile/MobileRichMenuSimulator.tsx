import { useMemo, useRef, useState } from 'react';
import {
  BarChart3,
  Bell,
  BriefcaseBusiness,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  CreditCard,
  Database,
  Grid2X2,
  Home,
  Image as ImageIcon,
  Info,
  Menu,
  MessageCircle,
  MousePointer2,
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
import { PresetEditor } from './PresetEditor';
import type { PresetEditorResult } from './PresetEditor';
import { MobileBroadcastSimulator } from './MobileBroadcastSimulator';
import { MobileFeaturePage } from './MobileFeaturePage';
import type { FeatureKey } from './MobileFeaturePage';
import { MobileMenuStep, CustomerPractice, emptyMenu, loadMenu, saveMenu } from './MobileMenuPractice';
import type { MobileMenuConfig } from './MobileMenuPractice';
import { useAssets, usableCoupons } from './trainingAssets';
import { useTraining } from './trainingState';

type MobilePage = 'home' | 'intro' | 'step1' | 'step2' | 'step3' | 'broadcast' | 'feature';
type SizeTab = 'compact' | 'large';

const homeItems = [
  { label: '群發訊息', icon: RadioTower, key: 'broadcast' },
  { label: '加入好友\n的歡迎訊息', icon: MessageCircle, key: 'welcome' },
  { label: '自動回應\n訊息', icon: MousePointer2, key: 'autoreply' },
  { label: '圖文訊息', icon: MessageCircle, key: 'richmessage' },
  { label: '多頁訊息', icon: ImageIcon, key: 'multipage' },
  { label: '優惠券', icon: Ticket, key: 'coupon' },
  { label: '集點卡', icon: CreditCard, key: 'stampcard' },
  { label: '增加好友人數', icon: UserPlus, key: 'addfriend' },
  { label: '商業簡介', icon: BriefcaseBusiness, key: 'businessProfile' },
  { label: '圖文選單', icon: Grid2X2, key: 'rich-menu' },
  { label: 'LINE Touch', icon: MousePointer2, key: 'lineTouch' },
  { label: '帳務專區', icon: Database, key: 'billing' },
  { label: '最新資訊', icon: Info, key: 'latest' },
  { label: '設定', icon: Settings, key: 'settings' },
  { label: 'Help', icon: CircleHelp, key: 'help' },
  { label: '擴充功能', icon: Puzzle, key: 'extensions' }
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

function MobileHeader({ title, onBack, onMenu }: { title: string; onBack?: () => void; onMenu?: () => void }) {
  return (
    <div className="oa-mobile-header">
      {onBack ? <button className="mobile-back" onClick={onBack}><ChevronLeft size={28} /></button> : <button className="mobile-menu" onClick={onMenu}><Menu size={24} /></button>}
      <strong>{title}</strong>
      <span className="mobile-header-spacer" />
    </div>
  );
}

export function MobileRichMenuSimulator() {
  const [page, setPage] = useState<MobilePage>('home');
  const assets=useAssets();
  const training=useTraining();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [presetOpen, setPresetOpen] = useState(false);
  const [presetIndustry, setPresetIndustry] = useState('全部');
  const [pendingPresetId, setPendingPresetId] = useState<string | null>(null);
  const [editingPresetId, setEditingPresetId] = useState<string | null>(null);
  const [sizeTab, setSizeTab] = useState<SizeTab>('compact');
  const [templateId, setTemplateId] = useState<string | null>(()=>loadMenu()?.templateId??null);
  const [menuConfig,setMenuConfig]=useState<MobileMenuConfig>(()=>loadMenu()?.config??emptyMenu);
  const [menuError,setMenuError]=useState('');
  const [pendingTemplateId, setPendingTemplateId] = useState<string | null>(null);
  const [imageDataUrl, setImageDataUrl] = useState(()=>loadMenu()?.imageDataUrl??'');
  const [imageName, setImageName] = useState(()=>loadMenu()?.imageName??'');
  const [menuLabels, setMenuLabels] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const [officialPresetOpen, setOfficialPresetOpen] = useState(false);
  const [activeFeature, setActiveFeature] = useState<FeatureKey>('welcome');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [bannerIndex, setBannerIndex] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  const banners = [
    ['官方帳號訊息費折抵方案', 'LINE 商家俱樂部會員獨享'],
    ['LINE Official Account', '最新功能與服務公告'],
    ['LINE Touch', 'NFC 輕觸即開啟服務']
  ] as const;

  const openFeature = (key: string, _label?: string) => {
    setDrawerOpen(false);
    if (key === 'rich-menu') {
      setPage('intro');
      return;
    }
    if (key === 'broadcast') {
      setPage('broadcast');
      return;
    }
    setActiveFeature(key as FeatureKey);
    setPage('feature');
  };

  const selectedTemplate = useMemo(
    () => templates.find(t => t.id === templateId) ?? null,
    [templateId]
  );

  const selectedPreset = useMemo(
    () => richMenuPresets.find(item => item.id === pendingPresetId) ?? null,
    [pendingPresetId]
  );

  const editingPreset = useMemo(
    () => richMenuPresets.find(item => item.id === editingPresetId) ?? null,
    [editingPresetId]
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
    if(templateId!==pendingTemplateId)setMenuConfig(v=>({...v,actions:{}}));
    setTemplateId(pendingTemplateId);
    setImageDataUrl('');
    setImageName('');
    setMenuLabels([]);
    setDone(false);
    setPickerOpen(false);
  };

  const onUpload = (file?: File) => {
    if (!file || !selectedTemplate) return;
    setMenuError('');
    if(!['image/jpeg','image/png'].includes(file.type)||file.size>10*1024*1024){setMenuError('請上傳 10MB 以下 JPG 或 PNG');return;}
    const reader = new FileReader();
    reader.onload = () => {
      const url=String(reader.result??'');
      const img=new Image();img.onload=()=>{
        const expected=selectedTemplate.size==='large'?1686:843;
        if(img.width!==2500||img.height!==expected){setMenuError('圖片尺寸不符，請使用 2500 × '+expected+' px');return;}
        setImageDataUrl(url);setImageName(file.name);setMenuLabels([]);setDone(false);
      };img.onerror=()=>setMenuError('圖片無法讀取');img.src=url;
    };
    reader.onerror=()=>setMenuError('檔案讀取失敗');
    reader.readAsDataURL(file);
  };

  const openPresetLibrary = () => {
    setPendingPresetId(null);
    setEditingPresetId(null);
    setPresetIndustry('全部');
    setPresetOpen(true);
  };

  const applyOfficialPreset = () => {
    const officialTemplate = templates.find(t => t.id === 'compact-3') ?? templates[0];
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="405" viewBox="0 0 1200 405">
      <rect width="1200" height="405" fill="#f5f6f7"/>
      <rect x="8" y="8" width="384" height="389" rx="16" fill="#ffffff" stroke="#d2d7da"/>
      <rect x="408" y="8" width="384" height="389" rx="16" fill="#ffffff" stroke="#d2d7da"/>
      <rect x="808" y="8" width="384" height="389" rx="16" fill="#ffffff" stroke="#d2d7da"/>
      <text x="200" y="210" text-anchor="middle" font-family="Arial" font-size="34" fill="#333">預設圖片 A</text>
      <text x="600" y="210" text-anchor="middle" font-family="Arial" font-size="34" fill="#333">預設圖片 B</text>
      <text x="1000" y="210" text-anchor="middle" font-family="Arial" font-size="34" fill="#333">預設圖片 C</text>
    </svg>`;
    setTemplateId(officialTemplate.id);
    setMenuConfig(v=>({...v,actions:{}}));
    setImageDataUrl(`data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`);
    setImageName('LINE 官方預設圖片（教學模擬）');
    setMenuLabels(['預設圖片 A','預設圖片 B','預設圖片 C']);
    setDone(false);
    setOfficialPresetOpen(false);
  };

  const openPresetEditor = () => {
    if (!selectedPreset) return;
    setEditingPresetId(selectedPreset.id);
  };

  const applyEditedPreset = (result: PresetEditorResult) => {
    if (!editingPreset) return;
    setTemplateId(editingPreset.templateId);
    setMenuConfig(v=>({...v,actions:{}}));
    setImageDataUrl(result.imageDataUrl);
    setImageName(`Linetech 自訂範本｜${result.brandName}`);
    setMenuLabels(result.labels);
    setDone(false);
    setEditingPresetId(null);
    setPresetOpen(false);
    setPendingPresetId(null);
  };

  const reset = () => {
    setPage('home');
    setMenuConfig(loadMenu()?.config??emptyMenu);setMenuError('');setOfficialPresetOpen(false);
    setPickerOpen(false);
    setPresetOpen(false);
    setPresetIndustry('全部');
    setPendingPresetId(null);
    setEditingPresetId(null);
    setTemplateId(loadMenu()?.templateId??null);
    setPendingTemplateId(null);
    setImageDataUrl(loadMenu()?.imageDataUrl??'');
    setImageName(loadMenu()?.imageName??'');
    setMenuLabels([]);
    setDone(false);
    setDrawerOpen(false);
    setBannerIndex(0);
  };

  return (
    <div className="mobile-training-stage">
      <div className="mobile-training-head">
        <div>
          <strong>手機版 LINE OA 教學模擬器</strong>
          <span>LINE OA Training ・ Build 2026.11.25-RC5</span>
        </div>
        <button onClick={reset}>重新開始</button>
      </div>

      <div className="mobile-training-layout">
        <section className="oa-mobile-device" aria-label="LINE Official Account 手機版模擬器">
          {page === 'home' && (
            <div className="oa-mobile-screen mobile-home-screen">
              <MobileHeader title="主頁" onMenu={() => setDrawerOpen(true)} />
              <div className="mobile-home-scroll">
              <button className="mobile-account-card mobile-account-button" onClick={() => openFeature('businessProfile', '商業簡介')}>
                <div className="mobile-account-avatar">K</div>
                <div className="mobile-account-copy"><strong>康立全球智能系統</strong><span>@k-linkintelligent</span></div>
                <ChevronRight className="mobile-row-chevron" />
              </button>
              <button className="mobile-stat-row mobile-stat-button" onClick={() => openFeature('addfriend', '增加好友人數')}><span>目標好友數</span><strong>12</strong><ChevronRight /></button>
              <button className="mobile-stat-row mobile-stat-button" onClick={() => openFeature('billing', '帳務專區')}><span>免費訊息則數</span><strong>9 <small>/ 200</small></strong><ChevronRight /></button>
              <button className="mobile-broadcast-btn" onClick={() => openFeature('broadcast', '群發訊息')}>傳送群發訊息</button>
              <button className="mobile-progress-row mobile-progress-button" onClick={() => openFeature('addfriend', '增加好友人數')}>
                <div className="mobile-progress-ring">◎</div>
                <div><strong>接著有效率地增加好友人數吧！</strong><span>還剩4個步驟</span></div>
                <ChevronRight />
              </button>
              <div className="mobile-home-grid">
                {homeItems.map(item => {
                  const Icon = item.icon;
                  return (
                    <button key={item.label} onClick={() => openFeature(item.key, item.label.replace('\n',''))}>
                      <Icon size={34} strokeWidth={2.2} />
                      <span>{item.label.split('\n').map((line, i) => <span key={`${line}-${i}`}>{line}</span>)}</span>
                    </button>
                  );
                })}
              </div>
              <div className="mobile-home-banner">
                <button className="banner-arrow" onClick={() => setBannerIndex(i => (i + banners.length - 1) % banners.length)}>‹</button>
                <button className="banner-copy" onClick={() => openFeature(bannerIndex === 2 ? 'lineTouch' : 'latest', bannerIndex === 2 ? 'LINE Touch' : '最新資訊')}>
                  <strong>{banners[bannerIndex][0]}</strong>
                  <span>{banners[bannerIndex][1]}</span>
                </button>
                <div className="banner-people">👩🏻‍💼💬👩🏻‍💼</div>
                <button className="banner-arrow" onClick={() => setBannerIndex(i => (i + 1) % banners.length)}>›</button>
              </div>
              </div>
              <div className="mobile-bottom-tabs current-four">
                <button className="active" onClick={() => setPage('home')}><Home /></button>
                <button className="badge-tab" onClick={() => openFeature('chat', '聊天')}><MessageCircle /><b>99+</b></button>
                <button onClick={() => openFeature('analytics', '分析')}><BarChart3 /></button>
                <button onClick={() => openFeature('notifications', '通知')}><Bell /></button>
              </div>
              {drawerOpen && (
                <div className="mobile-drawer-backdrop" onClick={() => setDrawerOpen(false)}>
                  <div className="mobile-side-drawer" onClick={e => e.stopPropagation()}>
                    <div className="drawer-account"><div className="mobile-account-avatar">K</div><div><strong>康立全球智能系統</strong><span>@k-linkintelligent</span></div></div>
                    <button onClick={() => openFeature('businessProfile','商業簡介')}>商業簡介</button>
                    <button onClick={() => openFeature('settings','設定')}>設定</button>
                    <button onClick={() => openFeature('billing','帳務專區')}>帳務專區</button>
                    <button onClick={() => openFeature('help','Help')}>Help</button>
                  </div>
                </div>
              )}
            </div>
          )}

          {page === 'broadcast' && (
            <MobileBroadcastSimulator onBack={() => setPage('home')} />
          )}

          {page === 'feature' && (
            <MobileFeaturePage feature={activeFeature} onBack={() => setPage('home')} />
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
                <button className="mobile-preset-btn" onClick={() => setOfficialPresetOpen(true)}>選擇預設圖片</button>
                <button className="mobile-linetech-btn" onClick={openPresetLibrary}>Linetech 原創範本庫</button>
                <div className="official-mobile-note">「選擇預設圖片」為 LINE 官方流程；下方 Linetech 圖庫為教學擴充，兩者分開呈現。</div>
                {imageName && <div className="mobile-file-status">已選擇：{imageName}</div>}
                {menuLabels.length > 0 && <div className="linetech-label-summary">選單文字：{menuLabels.join('・')}</div>}
              </div>
              <div className="mobile-next-area">
                {menuError&&<p role="alert" className="menu-practice-error">{menuError}</p>}
                <button disabled={!canNext} onClick={() => {setDone(false);setPage('step2');}}>下一步</button>
              </div>
            </div>
          )}

          {(page==='step2'||page==='step3')&&selectedTemplate&&<MobileMenuStep step={page==='step2'?2:3} template={selectedTemplate} image={imageDataUrl} config={menuConfig} onChange={v=>{setMenuConfig(v);setDone(false);}} onBack={()=>setPage(page==='step3'?'step2':'step1')} done={done} onNext={()=>{if(page==='step2'){setPage('step3');return;}const success=saveMenu({templateId:selectedTemplate.id,imageDataUrl,imageName,config:menuConfig});setDone(success);setMenuError(success?'':'本機儲存失敗，請縮小圖片或清理空間');}}/>}
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

          {officialPresetOpen && (
            <div className="mobile-picker-overlay official-preset-overlay">
              <div className="official-preset-sheet">
                <div className="mobile-picker-head"><strong>選擇預設圖片</strong><button onClick={() => setOfficialPresetOpen(false)}><X size={25} /></button></div>
                <div className="official-preset-note">LINE 官方預設圖片功能・教學模擬畫面</div>
                <div className="official-preset-card">
                  <div className="official-preset-thumb">
                    <span>預設圖片 A</span><span>預設圖片 B</span><span>預設圖片 C</span>
                  </div>
                  <p>選擇後會自動帶入對應版型，下一步再設定各區塊動作與顯示期間。</p>
                </div>
                <div className="mobile-picker-actions">
                  <button className="select" onClick={applyOfficialPreset}>選擇</button>
                  <button className="cancel" onClick={() => setOfficialPresetOpen(false)}>取消</button>
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
                <div className="linetech-library-banner">此區為 Linetech 教學擴充功能，非 LINE 官方內建圖庫。範本為原創可編輯設計。</div>
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
                  <button className="apply" disabled={!selectedPreset} onClick={openPresetEditor}>編輯並套用</button>
                  <button className="cancel" onClick={() => setPresetOpen(false)}>取消</button>
                </div>
              </div>
            </div>
          )}

          {editingPreset && (
            <PresetEditor
              key={editingPreset.id}
              preset={editingPreset}
              onBack={() => setEditingPresetId(null)}
              onApply={applyEditedPreset}
            />
          )}
        </section>

        <aside className="mobile-teaching-panel">
          <span className="teacher-only">教學輔助區・非 LINE 官方畫面</span>
          {page==='feature'&&activeFeature==='autoreply'?<><h2>自動回應訊息｜操作與測試</h2><p>先建立標題、選擇回應類型並登錄關鍵字，點「下一步」設定訊息，啟用後在右側測試。</p><div className="mobile-teaching-note"><strong>目前回應設定</strong><span>全域自動回應：{training.autoEnabled?'開啟':'關閉'}・已啟用規則：{training.rules.filter(r=>r.enabled).length} 筆</span>{training.rules.filter(r=>r.enabled).map(r=><span key={r.id}>{r.title||r.keyword||'自動回應'}：{(r.keywords??(r.keyword?[r.keyword]:[])).join('、')||'未登錄關鍵字'}</span>)}</div><a href="https://tw.linebiz.com/manual/line-official-account/oa-manager-autoreply/" target="_blank" rel="noreferrer">LINE 官方操作手冊</a><details className="auto-reference"><summary>畫面依據與驗證範圍</summary><p>列表及建立頁依 2026.11.25 台灣 iOS 實機截圖重製。Default 初始停用，未見實際回覆內容。指定日期或時間、後續訊息設定頁及右上狀態選單仍待台灣實機核對。</p><a href="https://www.lycbiz.com/jp/manual/OfficialAccountManager/Auto-response-messages/" target="_blank" rel="noreferrer">日本官方手冊（未核對頁面參考）</a><a href="https://tw.linebiz.com/skill/courses/oafeature/line-oa-auto-reply/" target="_blank" rel="noreferrer">台灣官方課程</a></details></>:page==='feature'&&activeFeature==='welcome'?<><h2>加入好友的歡迎訊息｜測試</h2><p>儲存歡迎訊息後，點「模擬加入好友」確認顧客端收到的內容。</p></>:page==='intro'||page==='step1'||page==='step2'||page==='step3'?<><h2>圖文選單｜操作與測試</h2><p>選擇版型、設定熱區動作及使用期間，並於顧客手機測試點擊結果。</p></>:<><h2>教學控制台</h2>
          <p>首頁與群發入口依最新實機截圖；圖文選單後續步驟依官方規則建立，畫面仍待新版 App 核對。</p></>}
          {menuError&&<p role="alert" className="menu-practice-error">{menuError}</p>}
          <CustomerPractice template={page==='feature'&&['autoreply','welcome'].includes(activeFeature)?null:selectedTemplate} image={imageDataUrl} config={menuConfig} context={page==='feature'&&activeFeature==='autoreply'?'reply':page==='feature'&&activeFeature==='welcome'?'welcome':page==='intro'||page==='step1'||page==='step2'||page==='step3'?'menu':'general'}/>
          {page==='home'&&<><div className="mobile-teaching-note"><strong>跨功能練習</strong><span>先在歡迎訊息或自動回應儲存內容，再模擬加入好友或輸入關鍵字。圖文選單的文字動作也會觸發相同回應規則。</span></div>
          <div className="mobile-teaching-note"><strong>實作練習・素材與回應設定</strong><span>完成條件以已儲存的本機資料判斷，不以點過按鈕計算；此區非 LINE 官方功能。</span>
            <div className="training-checkpoints">
              <button onClick={()=>openFeature('welcome')}>{training.welcomeEnabled&&training.welcome.some(x=>x.trim())?'✓':'○'} 歡迎訊息已設定</button>
              <button onClick={()=>openFeature('autoreply')}>{training.autoEnabled&&training.rules.some(r=>r.enabled&&r.mode==='關鍵字'&&r.keyword.trim()&&r.reply.trim())?'✓':'○'} 建立關鍵字自動回應</button>
              <button onClick={()=>openFeature('coupon')}>{usableCoupons(assets).length?'✓':'○'} 建立可選用優惠券</button>
              <button onClick={()=>openFeature('richmessage')}>{assets.richMessages.length?'✓':'○'} 建立圖文訊息</button>
              <button onClick={()=>openFeature('stampcard')}>{assets.reward?.published?'✓':'○'} 公開模擬集點卡</button>
            </div>
          </div>
          <div className="mobile-teaching-note"><strong>官方操作資料・畫面核對</strong><span>首頁及群發入口依實機圖；圖文選單後續、優惠券、圖文訊息與集點卡依官方功能規則模擬，最新手機子頁仍待核對。</span><a href="https://tw.linebiz.com/manual/line-official-account/oa-manager-sendmsg/" target="_blank" rel="noreferrer">訊息發送手冊</a><a href="https://tw.linebiz.com/manual/line-official-account/oa-manager-richmenu/" target="_blank" rel="noreferrer">圖文選單手冊</a><a href="https://tw.linebiz.com/manual/line-official-account/oa-manager-richmessage/" target="_blank" rel="noreferrer">圖文訊息版型</a><a href="https://tw.linebiz.com/manual/line-official-account/oa-manager-coupon/" target="_blank" rel="noreferrer">優惠券手冊</a><a href="https://tw.linebiz.com/manual/line-official-account/oa-manager-stampcard/" target="_blank" rel="noreferrer">集點卡手冊</a></div></>}
        </aside>
      </div>
    </div>
  );
}
