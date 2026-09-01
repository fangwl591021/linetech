import { useEffect, useMemo, useState } from 'react';
import { TopBar } from './components/TopBar';
import { Sidebar } from './components/Sidebar';
import { RichMenuLanding } from './components/RichMenuLanding';
import { RichMenuEditor } from './components/RichMenuEditor';
import { PhoneSimulator } from './components/PhoneSimulator';
import { TemplateModal } from './components/TemplateModal';
import { defaultTemplate, templates } from './domain/templates';
import type { RichMenuDraft } from './domain/types';

const STORAGE_KEY = 'linetech.richmenu.v01';

function localDate(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

function createInitialDraft(): RichMenuDraft {
  return {
    title: '',
    startDate: localDate(0),
    startTime: '00:00',
    endDate: localDate(6),
    endTime: '23:59',
    templateId: defaultTemplate.id,
    imageDataUrl: '',
    imageName: '',
    actions: Object.fromEntries(defaultTemplate.areas.map(a => [a.id, { id: a.id, type: 'none', value: '' }])),
    chatBarTextMode: 'menu',
    chatBarText: '',
    initialDisplay: 'show',
    showFrame: true
  };
}

function loadDraft(): RichMenuDraft {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...createInitialDraft(), ...JSON.parse(raw) } : createInitialDraft();
  } catch {
    return createInitialDraft();
  }
}

export default function App() {
  const [page, setPage] = useState<'landing'|'editor'>('landing');
  const [draft, setDraft] = useState<RichMenuDraft>(() => loadDraft());
  const [templateOpen, setTemplateOpen] = useState(false);
  const [pendingTemplateId, setPendingTemplateId] = useState(draft.templateId);
  const [teachingMode, setTeachingMode] = useState(true);
  const [messages, setMessages] = useState<string[]>([]);
  const [webView, setWebView] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(draft.initialDisplay === 'show');
  const [toast, setToast] = useState('');

  const template = useMemo(() => templates.find(t => t.id === draft.templateId) ?? defaultTemplate, [draft.templateId]);

  useEffect(() => {
    setMenuOpen(draft.initialDisplay === 'show');
  }, [draft.initialDisplay]);

  const save = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
      setToast('已儲存於本機瀏覽器');
      window.setTimeout(() => setToast(''), 2200);
    } catch {
      setToast('儲存失敗：圖片可能過大，請更換較小圖片');
      window.setTimeout(() => setToast(''), 3500);
    }
  };

  const applyTemplate = () => {
    const next = templates.find(t => t.id === pendingTemplateId) ?? defaultTemplate;
    const nextActions = Object.fromEntries(next.areas.map(a => [a.id, draft.actions[a.id] ?? { id: a.id, type: 'none', value: '' }]));
    setDraft({ ...draft, templateId: next.id, actions: nextActions, imageDataUrl: '', imageName: '' });
    setTemplateOpen(false);
  };

  const simulateAction = (areaId: string) => {
    const action = draft.actions[areaId];
    setNotice(null);
    setWebView(null);
    if (!action || action.type === 'none') {
      setNotice(`區域 ${areaId} 尚未設定動作`);
      return;
    }
    if (action.type === 'text') {
      if (!action.value.trim()) { setNotice(`區域 ${areaId} 的文字內容尚未填寫`); return; }
      setMessages(prev => [...prev, action.value]);
      return;
    }
    if (action.type === 'url') {
      if (!action.value.trim()) { setNotice(`區域 ${areaId} 的網址尚未填寫`); return; }
      setWebView(action.value);
      return;
    }
    if (action.type === 'coupon') {
      setNotice(`優惠券：${action.value || '尚未命名的優惠券'}（模擬）`);
      return;
    }
    if (action.type === 'reward') {
      setNotice(`集點卡：${action.value || '尚未命名的集點卡'}（模擬）`);
    }
  };

  return (
    <div className="app-shell">
      <TopBar />
      <div className="body-shell">
        <Sidebar active="rich-menu" />
        <main className="main-stage">
          <div className="oa-workspace">
            {page === 'landing' ? (
              <RichMenuLanding onCreate={() => setPage('editor')} />
            ) : (
              <RichMenuEditor
                draft={draft}
                template={template}
                onChange={setDraft}
                onOpenTemplate={() => { setPendingTemplateId(draft.templateId); setTemplateOpen(true); }}
                onSave={save}
                onBack={() => setPage('landing')}
              />
            )}
          </div>
          <PhoneSimulator
            draft={draft}
            template={template}
            teachingMode={teachingMode}
            onToggleTeaching={() => setTeachingMode(v => !v)}
            onAreaClick={simulateAction}
            messages={messages}
            webView={webView}
            notice={notice}
            onCloseWebView={() => setWebView(null)}
            onToggleMenu={() => setMenuOpen(v => !v)}
            menuOpen={menuOpen}
          />
        </main>
      </div>
      <TemplateModal
        open={templateOpen}
        templates={templates}
        selectedId={pendingTemplateId}
        onSelect={setPendingTemplateId}
        onCancel={() => setTemplateOpen(false)}
        onApply={applyTemplate}
      />
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
