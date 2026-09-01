import { templates } from '../domain/templates';

export type PresetSize = 'large' | 'compact';

export interface PresetTheme {
  primary: string;
  secondary: string;
  accent: string;
}

export interface RichMenuPreset {
  id: string;
  name: string;
  industry: string;
  purpose: string;
  style: string;
  size: PresetSize;
  templateId: string;
  labels: string[];
  theme: PresetTheme;
  imageDataUrl: string;
}

const toDataUrl = (svg: string) => `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
const XML_ENTITIES: Record<string, string> = {
  '<': '&lt;',
  '>': '&gt;',
  '&': '&amp;',
  '"': '&quot;',
  "'": '&apos;'
};

function escapeXml(value: string) {
  return value.replace(/[<>&"']/g, char => XML_ENTITIES[char] ?? char);
}

function safeColor(value: string, fallback: string) {
  return /^#[0-9a-fA-F]{6}$/.test(value) ? value : fallback;
}

function safeText(value: string, fallback: string, max: number) {
  const normalized = value.trim() || fallback;
  return escapeXml(normalized.slice(0, max));
}

function largeSix(colors: [string, string, string], title: string, labels: string[]) {
  const [primary, secondary, accent] = colors;
  const safeTitle = safeText(title, '我的品牌', 16);
  const safeLabels = labels.map(label => safeText(label, '未命名', 10));
  const cellW = 400;
  const cellH = 404.5;

  return toDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="809" viewBox="0 0 1200 809">
  <defs><filter id="shadow"><feDropShadow dx="0" dy="3" stdDeviation="6" flood-opacity="0.12"/></filter></defs>
  <rect width="1200" height="809" fill="${secondary}"/>
  ${safeLabels.map((label, index) => {
    const col = index % 3;
    const row = Math.floor(index / 3);
    const x = col * cellW;
    const y = row * cellH;
    const cx = x + cellW / 2;
    const cy = y + cellH / 2;
    const brand = index === 0 ? `<text x="${x + 28}" y="${y + 42}" font-family="Arial, sans-serif" font-size="22" font-weight="700" fill="${primary}">${safeTitle}</text>` : '';
    return `
      <rect x="${x + 7}" y="${y + 7}" width="386" height="390.5" rx="18" fill="#fff" stroke="${accent}" stroke-width="2" filter="url(#shadow)"/>
      ${brand}
      <circle cx="${cx}" cy="${cy - 42}" r="42" fill="${accent}" opacity="0.18"/>
      <circle cx="${cx}" cy="${cy - 42}" r="15" fill="${primary}" opacity="0.92"/>
      <text x="${cx}" y="${cy + 52}" text-anchor="middle" font-family="Arial, sans-serif" font-size="32" font-weight="700" fill="#283033">${label}</text>
      <text x="${cx}" y="${cy + 86}" text-anchor="middle" font-family="Arial, sans-serif" font-size="17" fill="#7b8388">點擊查看</text>`;
  }).join('')}
</svg>`);
}

function largeFour(colors: [string, string, string], title: string, labels: string[]) {
  const [primary, secondary, accent] = colors;
  const safeTitle = safeText(title, '我的品牌', 16);
  const safeLabels = labels.map(label => safeText(label, '未命名', 10));
  const cellW = 600;
  const cellH = 404.5;

  return toDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="809" viewBox="0 0 1200 809">
  <defs><filter id="shadow"><feDropShadow dx="0" dy="3" stdDeviation="6" flood-opacity="0.10"/></filter></defs>
  <rect width="1200" height="809" fill="${secondary}"/>
  ${safeLabels.map((label, index) => {
    const col = index % 2;
    const row = Math.floor(index / 2);
    const x = col * cellW;
    const y = row * cellH;
    const brand = index === 0 ? `<text x="${x + 38}" y="${y + 48}" font-family="Arial, sans-serif" font-size="25" font-weight="700" fill="${primary}">${safeTitle}</text>` : '';
    return `
      <rect x="${x + 10}" y="${y + 10}" width="580" height="384.5" rx="20" fill="#fff" stroke="${accent}" stroke-width="2" filter="url(#shadow)"/>
      ${brand}
      <rect x="${x + 54}" y="${y + 122}" width="82" height="82" rx="23" fill="${accent}" opacity="0.20"/>
      <circle cx="${x + 95}" cy="${y + 163}" r="15" fill="${primary}" opacity="0.92"/>
      <text x="${x + 166}" y="${y + 160}" font-family="Arial, sans-serif" font-size="35" font-weight="700" fill="#252b2f">${label}</text>
      <text x="${x + 166}" y="${y + 203}" font-family="Arial, sans-serif" font-size="19" fill="#7b8388">立即查看服務內容</text>`;
  }).join('')}
</svg>`);
}

function compactThree(colors: [string, string, string], title: string, labels: string[]) {
  const [primary, secondary, accent] = colors;
  const safeTitle = safeText(title, '我的品牌', 14);
  const safeLabels = labels.map(label => safeText(label, '未命名', 9));
  return toDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="405" viewBox="0 0 1200 405">
  <rect width="1200" height="405" fill="${secondary}"/>
  ${safeLabels.map((label, index) => {
    const x = index * 400;
    return `
      <rect x="${x + 8}" y="8" width="384" height="389" rx="18" fill="#fff" stroke="${accent}" stroke-width="2"/>
      ${index === 0 ? `<text x="${x + 24}" y="42" font-family="Arial, sans-serif" font-size="20" font-weight="700" fill="${primary}">${safeTitle}</text>` : ''}
      <circle cx="${x + 200}" cy="145" r="52" fill="${primary}" opacity="0.13"/>
      <text x="${x + 200}" y="160" text-anchor="middle" font-family="Arial, sans-serif" font-size="40" font-weight="700" fill="${primary}">${index + 1}</text>
      <text x="${x + 200}" y="250" text-anchor="middle" font-family="Arial, sans-serif" font-size="32" font-weight="700" fill="#262d31">${label}</text>`;
  }).join('')}
</svg>`);
}

function genericLayout(colors: [string, string, string], title: string, labels: string[], templateId: string) {
  const template = templates.find(item => item.id === templateId);
  if (!template) return '';
  const [primary, secondary, accent] = colors;
  const safeTitle = safeText(title, '我的品牌', 16);
  const safeLabels = template.areas.map((_, index) => safeText(labels[index] ?? `功能${index + 1}`, `功能${index + 1}`, 10));
  const width = 1200;
  const height = template.size === 'large' ? 809 : 405;

  return toDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="${width}" height="${height}" fill="${secondary}"/>
  ${template.areas.map((area, index) => {
    const x = area.x * width;
    const y = area.y * height;
    const w = area.width * width;
    const h = area.height * height;
    const pad = Math.max(5, Math.min(12, Math.min(w, h) * 0.025));
    const cx = x + w / 2;
    const cy = y + h / 2;
    const circle = Math.max(20, Math.min(46, Math.min(w, h) * 0.12));
    const labelSize = Math.max(22, Math.min(38, w * 0.075, h * 0.14));
    const brandSize = Math.max(17, Math.min(28, w * 0.05));
    return `
      <rect x="${x + pad}" y="${y + pad}" width="${Math.max(1, w - pad * 2)}" height="${Math.max(1, h - pad * 2)}" rx="${Math.min(18, pad * 1.4)}" fill="#fff" stroke="${accent}" stroke-width="2"/>
      ${index === 0 ? `<text x="${x + pad + 18}" y="${y + pad + brandSize + 10}" font-family="Arial, sans-serif" font-size="${brandSize}" font-weight="700" fill="${primary}">${safeTitle}</text>` : ''}
      <circle cx="${cx}" cy="${cy - circle * 0.55}" r="${circle}" fill="${accent}" opacity="0.18"/>
      <text x="${cx}" y="${cy - circle * 0.25}" text-anchor="middle" font-family="Arial, sans-serif" font-size="${Math.max(20, circle * 0.72)}" font-weight="700" fill="${primary}">${index + 1}</text>
      <text x="${cx}" y="${cy + circle * 1.15}" text-anchor="middle" font-family="Arial, sans-serif" font-size="${labelSize}" font-weight="700" fill="#283033">${safeLabels[index]}</text>`;
  }).join('')}
</svg>`);
}

const curatedPresets: RichMenuPreset[] = [
  {
    id: 'cafe-warm-01', name: '暖木咖啡', industry: '餐飲', purpose: '訂位・導購', style: '溫暖自然', size: 'large', templateId: 'large-6',
    labels: ['最新菜單', '線上訂位', '本月優惠', '門市資訊', '會員專區', '聯絡我們'],
    theme: { primary: '#6b4b3e', secondary: '#eadfce', accent: '#c58f62' },
    imageDataUrl: largeSix(['#6b4b3e', '#eadfce', '#c58f62'], '暖木咖啡', ['最新菜單', '線上訂位', '本月優惠', '門市資訊', '會員專區', '聯絡我們'])
  },
  {
    id: 'beauty-soft-01', name: '柔光美學', industry: '美容', purpose: '預約・服務介紹', style: '柔和質感', size: 'large', templateId: 'large-6',
    labels: ['立即預約', '服務療程', '價目資訊', '作品案例', '本月優惠', '線上客服'],
    theme: { primary: '#9b6f75', secondary: '#f3e7e4', accent: '#d9a9af' },
    imageDataUrl: largeSix(['#9b6f75', '#f3e7e4', '#d9a9af'], '柔光美學', ['立即預約', '服務療程', '價目資訊', '作品案例', '本月優惠', '線上客服'])
  },
  {
    id: 'realestate-urban-01', name: '城市房產', industry: '房地產', purpose: '名單蒐集', style: '專業穩重', size: 'large', templateId: 'large-4',
    labels: ['我要找房', '我要賣屋', '免費估價', '聯絡顧問'],
    theme: { primary: '#17365d', secondary: '#edf2f7', accent: '#c9a45b' },
    imageDataUrl: largeFour(['#17365d', '#edf2f7', '#c9a45b'], '城市房產', ['我要找房', '我要賣屋', '免費估價', '聯絡顧問'])
  },
  {
    id: 'consulting-smart-01', name: '商務顧問', industry: '顧問', purpose: '諮詢・案例', style: '商務科技', size: 'large', templateId: 'large-4',
    labels: ['服務方案', '成功案例', '預約諮詢', '聯絡我們'],
    theme: { primary: '#1f4c5c', secondary: '#eef5f4', accent: '#4aa69b' },
    imageDataUrl: largeFour(['#1f4c5c', '#eef5f4', '#4aa69b'], '商務顧問', ['服務方案', '成功案例', '預約諮詢', '聯絡我們'])
  },
  {
    id: 'education-bright-01', name: '好學教室', industry: '教育', purpose: '課程報名', style: '明亮活潑', size: 'compact', templateId: 'compact-3',
    labels: ['熱門課程', '立即報名', '課程公告'],
    theme: { primary: '#3566c8', secondary: '#f4f8ff', accent: '#f0b73e' },
    imageDataUrl: compactThree(['#3566c8', '#f4f8ff', '#f0b73e'], '好學教室', ['熱門課程', '立即報名', '課程公告'])
  },
  {
    id: 'retail-clean-01', name: '好物選品', industry: '零售', purpose: '商品導購', style: '清爽簡約', size: 'compact', templateId: 'compact-3',
    labels: ['熱門商品', '會員優惠', '客服中心'],
    theme: { primary: '#2c6f68', secondary: '#eff7f4', accent: '#78b9a8' },
    imageDataUrl: compactThree(['#2c6f68', '#eff7f4', '#78b9a8'], '好物選品', ['熱門商品', '會員優惠', '客服中心'])
  }
];

const baseTheme: PresetTheme = { primary: '#176b55', secondary: '#edf8f3', accent: '#59b89b' };
const officialLayoutDefinitions = [
  ['official-large-6', '官方版型・大6格', 'large-6', ['功能1','功能2','功能3','功能4','功能5','功能6']],
  ['official-large-4', '官方版型・大4格', 'large-4', ['功能1','功能2','功能3','功能4']],
  ['official-large-top4', '官方版型・上1下3', 'large-4-top', ['主打入口','功能2','功能3','功能4']],
  ['official-large-side3', '官方版型・左大右2', 'large-3-side', ['主打入口','功能2','功能3']],
  ['official-large-horizontal2', '官方版型・上下2格', 'large-2-horizontal', ['上方入口','下方入口']],
  ['official-large-vertical2', '官方版型・左右2格', 'large-2-vertical', ['左側入口','右側入口']],
  ['official-large-1', '官方版型・大單格', 'large-1', ['主要入口']],
  ['official-compact-3', '官方版型・小3格', 'compact-3', ['功能1','功能2','功能3']],
  ['official-compact-left', '官方版型・小左大右小', 'compact-left', ['主要入口','次要入口']],
  ['official-compact-right', '官方版型・小左小右大', 'compact-right', ['次要入口','主要入口']],
  ['official-compact-2', '官方版型・小2格', 'compact-2', ['功能1','功能2']],
  ['official-compact-1', '官方版型・小單格', 'compact-1', ['主要入口']]
] as const;

const officialLayoutPresets: RichMenuPreset[] = officialLayoutDefinitions.map(([id, name, templateId, labels]) => {
  const template = templates.find(item => item.id === templateId)!;
  const theme = { ...baseTheme };
  return {
    id,
    name,
    industry: '官方版型',
    purpose: '版型練習',
    style: '基礎可編輯',
    size: template.size,
    templateId,
    labels: [...labels],
    theme,
    imageDataUrl: genericLayout([theme.primary, theme.secondary, theme.accent], '我的品牌', [...labels], templateId)
  };
});

export const richMenuPresets: RichMenuPreset[] = [...curatedPresets, ...officialLayoutPresets];

export function renderPresetImage(
  preset: RichMenuPreset,
  customization?: {
    brandName?: string;
    labels?: string[];
    theme?: Partial<PresetTheme>;
  }
) {
  const brandName = customization?.brandName?.trim() || preset.name;
  const labels = preset.labels.map((fallback, index) => customization?.labels?.[index]?.trim() || fallback);
  const theme = {
    primary: safeColor(customization?.theme?.primary ?? preset.theme.primary, preset.theme.primary),
    secondary: safeColor(customization?.theme?.secondary ?? preset.theme.secondary, preset.theme.secondary),
    accent: safeColor(customization?.theme?.accent ?? preset.theme.accent, preset.theme.accent)
  };
  const colors: [string, string, string] = [theme.primary, theme.secondary, theme.accent];

  if (preset.id === 'cafe-warm-01' || preset.id === 'beauty-soft-01') return largeSix(colors, brandName, labels);
  if (preset.id === 'realestate-urban-01' || preset.id === 'consulting-smart-01') return largeFour(colors, brandName, labels);
  if (preset.id === 'education-bright-01' || preset.id === 'retail-clean-01') return compactThree(colors, brandName, labels);
  return genericLayout(colors, brandName, labels, preset.templateId);
}

export const presetIndustries = ['全部', ...Array.from(new Set(richMenuPresets.map(item => item.industry)))];
