import { Menu, Search, SquareUserRound } from 'lucide-react';
import type { RichMenuDraft, RichMenuTemplate } from '../domain/types';

interface Props {
  draft: RichMenuDraft;
  template: RichMenuTemplate;
  teachingMode: boolean;
  onAreaClick: (areaId: string) => void;
  messages: string[];
  webView: string | null;
  notice: string | null;
  onCloseWebView: () => void;
  onToggleMenu: () => void;
  menuOpen: boolean;
  onToggleTeaching: () => void;
}

export function PhoneSimulator({ draft, template, teachingMode, onAreaClick, messages, webView, notice, onCloseWebView, onToggleMenu, menuOpen, onToggleTeaching }: Props) {
  return (
    <aside className="simulator-panel">
      <div className="simulator-title">
        <div><strong>LINE 手機即時模擬</strong><span>設定後立即呈現</span></div>
        <button className={`teaching-indicator ${teachingMode ? 'on' : ''}`} onClick={onToggleTeaching}>{teachingMode ? '教學模式 ON' : '教學模式 OFF'}</button>
      </div>
      <div className="phone-shell">
        <div className="phone-notch" />
        <div className="phone-screen">
          <div className="phone-status"><span>9:41</span><span>▰ ◔ ▰</span></div>
          <div className="chat-head">
            <span className="back">‹</span>
            <span className="verified">●</span>
            <strong>康立全球智能系統</strong>
            <span className="head-icons"><Search size={15}/><SquareUserRound size={15}/><Menu size={16}/></span>
          </div>
          <div className="chat-timeline">
            <div className="welcome-bubble">您好，這裡是 LINE OA 教學模擬器。<br/>請從下方圖文選單操作。</div>
            {messages.map((m, i) => <div key={`${m}-${i}`} className="message-row"><div className="user-bubble">{m}</div></div>)}
            {notice && <div className="sim-notice">{notice}</div>}
          </div>
          {webView && <div className="webview-mock"><div className="webview-head"><button onClick={onCloseWebView}>×</button><strong>LINE WebView</strong></div><div className="webview-body"><div className="globe">🌐</div><strong>模擬開啟網址</strong><code>{webView}</code><p>教學模式不會真的離開目前畫面。</p></div></div>}
          {menuOpen && <div className="rich-menu-preview" style={{ aspectRatio: template.aspectRatio }}>
            {draft.imageDataUrl ? <img src={draft.imageDataUrl} alt="Rich Menu"/> : <div className="rich-menu-placeholder">請在左側選擇圖片</div>}
            {template.areas.map(a => (
              <button
                key={a.id}
                className={`hotspot ${teachingMode || draft.showFrame ? 'visible' : ''}`}
                style={{ left: `${a.x*100}%`, top: `${a.y*100}%`, width: `${a.width*100}%`, height: `${a.height*100}%` }}
                onClick={() => onAreaClick(a.id)}
              >
                {(teachingMode || draft.showFrame) && <span>{a.id}</span>}
              </button>
            ))}
          </div>}
          <button className="chatbar" onClick={onToggleMenu}><span>▦</span><strong>{draft.chatBarTextMode === 'custom' && draft.chatBarText ? draft.chatBarText : '選單'}</strong><span>{menuOpen ? '⌄' : '⌃'}</span></button>
        </div>
      </div>
      <div className="simulator-help"><strong>測試方式</strong><span>左側完成 Action 後，直接點手機圖文選單熱區。</span></div>
    </aside>
  );
}
