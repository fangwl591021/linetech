import { useMemo, useState } from 'react';
import { renderPresetImage } from './presets';
import type { PresetTheme, RichMenuPreset } from './presets';

export interface PresetEditorResult {
  brandName: string;
  labels: string[];
  theme: PresetTheme;
  imageDataUrl: string;
}

interface Props {
  preset: RichMenuPreset;
  onBack: () => void;
  onApply: (result: PresetEditorResult) => void;
}

export function PresetEditor({ preset, onBack, onApply }: Props) {
  const [brandName, setBrandName] = useState(preset.name);
  const [labels, setLabels] = useState([...preset.labels]);
  const [theme, setTheme] = useState<PresetTheme>({ ...preset.theme });

  const imageDataUrl = useMemo(
    () => renderPresetImage(preset, { brandName, labels, theme }),
    [preset, brandName, labels, theme]
  );

  const updateLabel = (index: number, value: string) => {
    setLabels(current => current.map((item, i) => i === index ? value : item));
  };

  const updateTheme = (key: keyof PresetTheme, value: string) => {
    setTheme(current => ({ ...current, [key]: value }));
  };

  const reset = () => {
    setBrandName(preset.name);
    setLabels([...preset.labels]);
    setTheme({ ...preset.theme });
  };

  return (
    <div className="mobile-picker-overlay linetech-editor-overlay">
      <div className="linetech-editor-sheet">
        <div className="linetech-editor-head">
          <button onClick={onBack}>‹ 返回</button>
          <div><strong>編輯範本</strong><span>{preset.name}・{preset.industry}</span></div>
          <button className="linetech-reset-btn" onClick={reset}>重設</button>
        </div>

        <div className="linetech-editor-badge">Linetech 擴充功能・即時產生原創 Rich Menu</div>

        <div className="linetech-live-preview" style={{ aspectRatio: preset.size === 'large' ? 2500 / 1686 : 2500 / 843 }}>
          <img src={imageDataUrl} alt="可編輯 Rich Menu 即時預覽" />
        </div>

        <div className="linetech-editor-form">
          <section>
            <h3>品牌設定</h3>
            <label className="linetech-text-field">
              <span>品牌名稱</span>
              <input value={brandName} maxLength={16} onChange={e => setBrandName(e.target.value)} placeholder="輸入品牌名稱" />
              <small>{brandName.length}/16</small>
            </label>
          </section>

          <section>
            <h3>品牌色</h3>
            <div className="linetech-color-grid">
              <label><span>主色</span><input type="color" value={theme.primary} onChange={e => updateTheme('primary', e.target.value)} /><code>{theme.primary.toUpperCase()}</code></label>
              <label><span>背景色</span><input type="color" value={theme.secondary} onChange={e => updateTheme('secondary', e.target.value)} /><code>{theme.secondary.toUpperCase()}</code></label>
              <label><span>強調色</span><input type="color" value={theme.accent} onChange={e => updateTheme('accent', e.target.value)} /><code>{theme.accent.toUpperCase()}</code></label>
            </div>
          </section>

          <section>
            <h3>選單文字</h3>
            <p className="linetech-editor-help">文字會直接寫入範本圖片；下一階段再為 A、B、C…設定實際點擊動作。</p>
            <div className="linetech-label-list">
              {labels.map((label, index) => (
                <label key={`${preset.id}-${index}`}>
                  <b>{String.fromCharCode(65 + index)}</b>
                  <input value={label} maxLength={10} onChange={e => updateLabel(index, e.target.value)} placeholder={`區塊 ${String.fromCharCode(65 + index)}`} />
                  <small>{label.length}/10</small>
                </label>
              ))}
            </div>
          </section>
        </div>

        <div className="linetech-editor-actions">
          <button className="apply" onClick={() => onApply({ brandName: brandName.trim() || preset.name, labels: labels.map((label, index) => label.trim() || preset.labels[index]), theme, imageDataUrl })}>套用到圖文選單</button>
          <button className="back" onClick={onBack}>返回範本庫</button>
        </div>
      </div>
    </div>
  );
}
