import type { RichMenuTemplate } from '../domain/types';

interface TemplateModalProps {
  open: boolean;
  templates: RichMenuTemplate[];
  selectedId: string;
  onSelect: (id: string) => void;
  onCancel: () => void;
  onApply: () => void;
}

export function TemplateModal({ open, templates, selectedId, onSelect, onCancel, onApply }: TemplateModalProps) {
  if (!open) return null;
  const large = templates.filter(t => t.size === 'large');
  const compact = templates.filter(t => t.size === 'compact');

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="template-modal">
        <div className="modal-head"><h3>選擇版型</h3><button onClick={onCancel}>×</button></div>
        <section>
          <h4>大（2500px × 1686px、1200px × 810px、800px × 540px）</h4>
          <p>適合顯示版面較大或項目較多的圖文選單。</p>
          <div className="template-grid">{large.map(t => <TemplateCard key={t.id} template={t} active={t.id === selectedId} onClick={() => onSelect(t.id)} />)}</div>
        </section>
        <section>
          <h4>小（2500px × 843px、1200px × 405px、800px × 270px）</h4>
          <p>適合顯示版面較小或項目較少的圖文選單。</p>
          <div className="template-grid">{compact.map(t => <TemplateCard key={t.id} template={t} active={t.id === selectedId} onClick={() => onSelect(t.id)} />)}</div>
        </section>
        <div className="modal-actions"><button className="btn secondary" onClick={onCancel}>取消</button><button className="btn primary" onClick={onApply}>套用</button></div>
      </div>
    </div>
  );
}

function TemplateCard({ template, active, onClick }: { template: RichMenuTemplate; active: boolean; onClick: () => void }) {
  return (
    <button className={`template-card ${active ? 'selected' : ''}`} onClick={onClick} title={template.label}>
      <div className="template-thumb" style={{ aspectRatio: template.aspectRatio }}>
        {template.areas.map(a => <span key={a.id} style={{ left: `${a.x*100}%`, top: `${a.y*100}%`, width: `${a.width*100}%`, height: `${a.height*100}%` }} />)}
      </div>
      <small>{template.label}</small>
    </button>
  );
}
