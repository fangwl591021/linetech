import { useRef, useState } from 'react';
import { Expand, List } from 'lucide-react';
import type { ActionType, RichMenuDraft, RichMenuTemplate } from '../domain/types';
import { templates } from '../domain/templates';
import { DesktopPresetLibrary } from './DesktopPresetLibrary';
import type { DesktopPresetResult } from './DesktopPresetLibrary';

interface Props {
  draft: RichMenuDraft;
  template: RichMenuTemplate;
  onChange: (draft: RichMenuDraft) => void;
  onOpenTemplate: () => void;
  onSave: () => void;
  onBack: () => void;
}

const actionLabels: Record<ActionType, string> = {
  none: '不設定',
  text: '文字',
  url: '網址',
  coupon: '優惠券',
  reward: '集點卡'
};

export function RichMenuEditor({ draft, template, onChange, onOpenTemplate, onSave, onBack }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [imageError, setImageError] = useState('');
  const [expanded, setExpanded] = useState<string>(template.areas[0]?.id ?? 'A');
  const [libraryOpen, setLibraryOpen] = useState(false);

  const patch = <K extends keyof RichMenuDraft>(key: K, value: RichMenuDraft[K]) => onChange({ ...draft, [key]: value });

  const setAction = (id: string, type: ActionType, value = '') => {
    onChange({
      ...draft,
      actions: {
        ...draft.actions,
        [id]: { id, type, value }
      }
    });
  };

  const chooseImage = (file?: File) => {
    if (!file) return;
    setImageError('');
    if (!file.type.startsWith('image/')) {
      setImageError('請選擇圖片檔案。');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setImageError('圖片超過 5MB，請先壓縮後再上傳。');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result);
      const img = new Image();
      img.onload = () => {
        const ratio = img.width / img.height;
        const expected = template.aspectRatio;
        if (Math.abs(ratio - expected) > 0.05) {
          setImageError(`圖片比例與目前版型不符。偵測到 ${img.width}×${img.height}，請使用${template.size === 'large' ? '大版型' : '小版型'}比例。`);
          return;
        }
        onChange({ ...draft, imageDataUrl: dataUrl, imageName: file.name });
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  const applyPreset = (result: DesktopPresetResult) => {
    const nextTemplate = templates.find(item => item.id === result.preset.templateId) ?? template;
    const nextActions = Object.fromEntries(
      nextTemplate.areas.map((area, index) => [
        area.id,
        {
          id: area.id,
          type: draft.actions[area.id]?.type ?? 'none',
          value: draft.actions[area.id]?.value ?? ''
        }
      ])
    );
    setImageError('');
    setExpanded(nextTemplate.areas[0]?.id ?? 'A');
    onChange({
      ...draft,
      templateId: nextTemplate.id,
      imageDataUrl: result.imageDataUrl,
      imageName: `Linetech 自訂範本｜${result.brandName}`,
      actions: nextActions
    });
    setLibraryOpen(false);
  };

  return (
    <section className="workspace-content editor-page">
      <div className="page-title rich-title-row">
        <div><h1>圖文選單</h1><p>可建立或編輯用戶可用的選單，於聊天室中提供多種功能及各類資訊讓好友進行查詢。</p></div>
        <button className="btn primary" onClick={onSave}>儲存</button>
      </div>
      <div className="editor-toolbar"><button className="btn secondary" onClick={onSave}>儲存草稿</button></div>

      <section className="form-section">
        <h2>基本設定</h2>
        <div className="form-grid basic-grid">
          <label><span>標題</span><div className="input-with-count"><input maxLength={30} value={draft.title} onChange={e => patch('title', e.target.value)} placeholder="輸入標題"/><small>{draft.title.length}/30</small></div><em>標題為方便後台管理用，不會向用戶顯示。</em></label>
          <label><span>使用期間</span><div className="date-range"><input type="date" value={draft.startDate} onChange={e => patch('startDate', e.target.value)}/><input type="time" value={draft.startTime} onChange={e => patch('startTime', e.target.value)}/><b>～</b><input type="date" value={draft.endDate} onChange={e => patch('endDate', e.target.value)}/><input type="time" value={draft.endTime} onChange={e => patch('endTime', e.target.value)}/><button className="btn tiny" onClick={() => onChange({...draft,startDate:'',startTime:'',endDate:'',endTime:''})}>清除</button></div></label>
        </div>
      </section>

      <section className="form-section content-section">
        <div className="section-head"><h2>內容設定</h2><button className="btn secondary small">◉ 設計規範</button></div>
        <div className="content-layout">
          <div className="official-preview-wrap">
            <div className="preview-label">預覽 ⓘ</div>
            <div className="official-preview">
              <div className="preview-sky"><div className="preview-account"><span className="account-badge">K</span><span>Hello!</span></div></div>
              <div className="preview-menu" style={{ aspectRatio: template.aspectRatio }}>
                {draft.imageDataUrl ? <img src={draft.imageDataUrl} alt="預覽"/> : <div className="preview-empty">請選擇版型並上傳背景圖片。</div>}
                {template.areas.map(a => <div className="preview-area" key={a.id} style={{left:`${a.x*100}%`,top:`${a.y*100}%`,width:`${a.width*100}%`,height:`${a.height*100}%`}}>{draft.showFrame && <b>{a.id}</b>}</div>)}
              </div>
              <div className="preview-chatbar">▦ <span>{draft.chatBarTextMode === 'custom' && draft.chatBarText ? draft.chatBarText : '選單⌄'}</span></div>
            </div>
            <label className="switch-line"><span>顯示版型框線</span><input type="checkbox" checked={draft.showFrame} onChange={e=>patch('showFrame',e.target.checked)}/><i /></label>
          </div>

          <div className="settings-column">
            <div className="setting-row"><span>版型</span><button className="btn outline-green" onClick={onOpenTemplate}>{draft.templateId ? '變更' : '選擇'}</button></div>
            <div className="setting-row">
              <span>圖片</span>
              <button className="btn outline-green" onClick={() => fileRef.current?.click()}>上傳圖片</button>
              <button className="btn linetech-library-btn" onClick={() => setLibraryOpen(true)}>Linetech 原創範本庫</button>
              <input ref={fileRef} type="file" accept="image/*" hidden onChange={e=>chooseImage(e.target.files?.[0])}/>
              {draft.imageName && <small className="file-name">{draft.imageName}</small>}
            </div>
            <div className="linetech-desktop-extension">Linetech 教學擴充：圖庫可修改品牌名稱、顏色及選單文字，再直接套用。</div>
            {imageError && <div className="error-box">{imageError}</div>}
            <div className="action-head"><span>動作</span><div><button className="icon-btn"><List size={17}/></button><button className="icon-btn active"><Expand size={17}/></button></div></div>
            <div className="action-list">
              {template.areas.map(area => {
                const action = draft.actions[area.id] ?? { id: area.id, type: 'none' as ActionType, value: '' };
                const isOpen = expanded === area.id;
                return <div className="action-card" key={area.id}>
                  <button className="action-card-head" onClick={() => setExpanded(isOpen ? '' : area.id)}><span>⌄</span><b>{area.id}</b></button>
                  {isOpen && <div className="action-card-body">
                    <label><span>類型</span><select value={action.type} onChange={e=>setAction(area.id,e.target.value as ActionType,'')}>
                      <option value="none">選擇</option><option value="coupon">優惠券</option><option value="url">網址</option><option value="text">文字</option><option value="reward">集點卡</option>
                    </select></label>
                    {action.type !== 'none' && <label><span>{actionLabels[action.type]}</span><input value={action.value} onChange={e=>setAction(area.id,action.type,e.target.value)} placeholder={placeholderFor(action.type)} /></label>}
                  </div>}
                </div>;
              })}
            </div>

            <div className="display-settings">
              <h3>設定選單列</h3>
              <div className="radio-line"><span>選單列顯示文字 ⓘ</span><label><input type="radio" checked={draft.chatBarTextMode === 'menu'} onChange={()=>patch('chatBarTextMode','menu')}/> 選單</label><label><input type="radio" checked={draft.chatBarTextMode === 'custom'} onChange={()=>patch('chatBarTextMode','custom')}/> 自訂文字</label>{draft.chatBarTextMode === 'custom' && <input maxLength={14} value={draft.chatBarText} onChange={e=>patch('chatBarText',e.target.value)} placeholder="輸入自訂文字"/>}</div>
              <div className="radio-line"><span>預設顯示方式 ⓘ</span><label><input type="radio" checked={draft.initialDisplay === 'show'} onChange={()=>patch('initialDisplay','show')}/> 顯示</label><label><input type="radio" checked={draft.initialDisplay === 'hide'} onChange={()=>patch('initialDisplay','hide')}/> 隱藏</label></div>
            </div>
          </div>
        </div>
      </section>

      <div className="bottom-actions"><button className="btn secondary" onClick={onSave}>儲存草稿</button><button className="btn primary" onClick={onSave}>儲存</button></div>
      <button className="back-list" onClick={onBack}>‹ 返回一覽</button>

      <DesktopPresetLibrary open={libraryOpen} onClose={() => setLibraryOpen(false)} onApply={applyPreset} />
    </section>
  );
}

function placeholderFor(type: ActionType) {
  if (type === 'url') return 'https://example.com';
  if (type === 'text') return '輸入點擊後傳送的文字';
  if (type === 'coupon') return '輸入模擬優惠券名稱';
  if (type === 'reward') return '輸入模擬集點卡名稱';
  return '';
}
