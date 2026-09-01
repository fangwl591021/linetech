import type { ReactNode } from 'react';
import { BarChart3, Database, Megaphone, MessageCircleReply, MessagesSquare, PackageOpen, Users, UserRoundPlus } from 'lucide-react';

interface SidebarProps {
  active: 'rich-menu';
}

export function Sidebar({ active }: SidebarProps) {
  return (
    <aside className="sidebar">
      <NavItem icon={<Megaphone size={19}/>} label="群發訊息" />
      <NavItem icon={<BarChart3 size={19}/>} label="漸進式訊息" />
      <NavItem icon={<MessageCircleReply size={19}/>} label="自動回應" />
      <div className="sidebar-divider" />
      <NavItem icon={<PackageOpen size={19}/>} label="訊息項目" />
      <NavItem icon={<Users size={19}/>} label="推廣相關" />
      <div className="sidebar-divider" />
      <div className="nav-group open">
        <div className="nav-row green">
          <MessagesSquare size={19}/><span>聊天室相關</span><span className="arrow">⌄</span>
        </div>
        <div className="subnav">加入好友的歡迎訊息</div>
        <div className={`subnav ${active === 'rich-menu' ? 'active' : ''}`}>圖文選單</div>
      </div>
      <NavItem icon={<Database size={19}/>} label="資料管理" />
      <div className="sidebar-divider" />
      <NavItem icon={<UserRoundPlus size={19}/>} label="增加好友人數" />
    </aside>
  );
}

function NavItem({ icon, label }: { icon: ReactNode; label: string }) {
  return <div className="nav-row">{icon}<span>{label}</span><span className="arrow">›</span></div>;
}
