import { Bell, HelpCircle, Settings } from 'lucide-react';

export function TopBar() {
  return (
    <>
      <header className="topbar">
        <div className="brand-lockup">
          <div className="line-wordmark">LINE</div>
          <div className="oa-wordmark">Official Account<br/>Manager</div>
        </div>
        <div className="account-strip">
          <span className="account-badge">K</span>
          <strong>康立全球智能系統</strong>
          <span className="chev">⌄</span>
          <span className="muted">@k-linkintelligent</span>
          <span className="plan-pill">輕用量</span>
          <span>👥 782</span>
          <span>💬 聊天：開啟</span>
        </div>
        <div className="topbar-actions">
          <Bell size={19} />
          <span className="avatar">T</span>
          <span>Tony-LINE@</span>
          <HelpCircle size={18} />
          <span>Help</span>
        </div>
      </header>
      <nav className="mainnav">
        {['主頁','分析','聊天','商業簡介','LINE VOOM','擴充功能','開店幫手','OA Plus'].map((item, index) => (
          <button key={item} className={index === 0 ? 'active' : ''}>{item}{item === '聊天' && <span className="badge99">99+</span>}</button>
        ))}
        <button className="settings-link"><Settings size={16}/> 設定</button>
      </nav>
    </>
  );
}
