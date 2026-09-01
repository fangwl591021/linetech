import { useMemo, useState } from 'react';
import { X } from 'lucide-react';
import { presetIndustries, renderPresetImage, richMenuPresets } from '../mobile/presets';
import type { PresetTheme, RichMenuPreset } from '../mobile/presets';

export interface DesktopPresetResult {
  preset: RichMenuPreset;
  brandName: string;
  labels: string[];
  theme: PresetTheme;
  imageDataUrl: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onApply: (result: DesktopPresetResult) => void;
}

export function DesktopPresetLibrary({ open, onClose, onApply }: Props) {
  const [industry, setIndustry] = useState('全部');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const selected = useMemo(() => richMenuPresets.find(item => item.id === selectedId) ?? null, [selectedId]);
  const visible = useMemo(() => richMenuPresets.filter(item => industry === '全部' || item.industry === industry), [industry]);

  if (!open) return null;

  return (
    <div className="desktop-library-overlay" role="dialog" aria-modal="true" aria-label="Linetech 原創範本庫">
      <div className="desktop-library-modal">
        {!editing ? (
          <>
            <header className="desktop-library-head">
              <div><strong>Linetech 原創範本庫</strong><span>Rich Menu 可編輯產業範本</span></div>
              <button onClick={onClose}><X size={22} /></button>
            </header>
            <div className="desktop-library-note">Linetech 教學擴充功能，非 LINE 官方內建功能。套用後會同步切換正確版型與熱區。</div>
            <div className="desktop-library-filters">
              {presetIndustries.map(item => (
                <button key={item} className={industry === item ? 'active' : ''} onClick={() => { setIndustry(item); setSelectedId(null); }}>{item}</button>
              ))}
            </div>
            <div className="desktop-library-grid">
              {visible.map(preset => (
                <button key={preset.id} className={`desktop-preset-card ${selectedId === preset.id ? 'selected' : ''}`} onClick={() => setSelectedId(preset.id)}>
                  <div className="desktop-preset-image" style={{ aspectRatio: preset.size === 'large' ? 2500 / 1686 : 2500 / 843 }}><img src={preset.imageDataUrl} alt={preset.name} /></div>
                  <div className="desktop-preset-copy"><strong>{preset.name}</strong><span>{preset.industry}・{preset.purpose}</span><small>{preset.style}｜{preset.size === 'large' ? '大版型' : '小版型'}</small></div>
                </button>
              ))}
            </div>
            <footer className="desktop-library-actions">
              <button className="btn secondary" onClick={onClose}>取消</button>
              <button className="btn primary" disabled={!selected} onClick={() => selected && setEditing(true)}>編輯並套用</button>
            </footer>
          </>
        ) : selected ? (
          <DesktopPresetEditor preset={selected} onBack={() => setEditing(false)} onApply={onApply} />
        ) : null}
      </div>
    </div>
  );
}

function DesktopPresetEditor({ preset, onBack, onApply }: { preset: RichMenuPreset; onBack: () => void; onApply: (result: DesktopPresetResult) => void }) {
  const [brandName, setBrandName] = useState(preset.name);
  const [labels, setLabels] = useState([...preset.labels]);
  const [theme, setTheme] = useState<PresetTheme>({ ...preset.theme });
  const imageDataUrl = useMemo(() => renderPresetImage(preset, { brandName, labels, theme }), [preset, brandName, labels, theme]);

  const changeLabel = (index: number, value: string) => setLabels(items => items.map((item, i) => i === index ? value : item));
  const changeColor = (key: keyof PresetTheme, value: string) => setTheme(current => ({ ...current, [key]: value }));

  return (
    <div className="desktop-preset-editor">
      <header className="desktop-library-head">
        <div><strong>編輯 Rich Menu 範本</strong><span>{preset.name}・{preset.industry}</span></div>
        <button onClick={onBack}>返回圖庫</button>
      </header>
      <div className="desktop-editor-layout">
        <div className="desktop-editor-preview">
          <div className="desktop-editor-preview-canvas" style={{ aspectRatio: preset.size === 'large' ? 2500 / 1686 : 2500 / 843 }}><img src={imageDataUrl} alt="Rich Menu 即時預覽" /></div>
          <div className="desktop-editor-tip">右側修改後會立即更新預覽。</div>
        </div>
        <div className="desktop-editor-form">
          <section>
            <h3>品牌設定</h3>
            <label><span>品牌名稱</span><input value={brandName} maxLength={16} onChange={e => setBrandName(e.target.value)} /><small>{brandName.length}/16</small></label>
          </section>
          <section>
            <h3>品牌色</h3>
            <div className="desktop-color-grid">
              <label><span>主色</span><input type="color" value={theme.primary} onChange={e => changeColor('primary', e.target.value)} /><code>{theme.primary.toUpperCase()}</code></label>
              <label><span>背景色</span><input type="color" value={theme.secondary} onChange={e => changeColor('secondary', e.target.value)} /><code>{theme.secondary.toUpperCase()}</code></label>
              <label><span>強調色</span><input type="color" value={theme.accent} onChange={e => changeColor('accent', e.target.value)} /><code>{theme.accent.toUpperCase()}</code></label>
            </div>
          </section>
          <section>
            <h3>選單文字</h3>
            <div className="desktop-label-grid">
              {labels.map((label, index) => (
                <label key={`${preset.id}-${index}`}><b>{String.fromCharCode(65 + index)}</b><input value={label} maxLength={10} onChange={e => changeLabel(index, e.target.value)} /><small>{label.length}/10</small></label>
              ))}
            </div>
          </section>
        </div>
      </div>
      <footer className="desktop-library-actions">
        <button className="btn secondary" onClick={onBack}>返回圖庫</button>
        <button className="btn primary" onClick={() => onApply({ preset, brandName: brandName.trim() || preset.name, labels: labels.map((label, i) => label.trim() || preset.labels[i]), theme, imageDataUrl })}>套用到圖文選單</button>
      </footer>
    </div>
  );
}
