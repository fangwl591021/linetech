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

/**
 * 大・6格：畫面內容嚴格依照 3x2 官方熱區切分。
 * 不再使用額外的上方品牌 BAR，避免視覺區塊與 A~F 點擊熱區錯位。
 */
function largeSix(colors: [string, string, string], title: string, labels: string[]) {
  const [primary, secondary, accent] = colors;
  const safeTitle = safeText(title, '我的品牌', 16);
  const safeLabels = labels.map(label => safeText(label, '未命名', 10));
  const cellW = 400;
  const cellH = 404.5;

  return toDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="809" viewBox="0 0 1200 809">
  <defs>
    <filter id="shadow"><feDropShadow dx="0" dy="3" stdDeviation="6" flood-opacity="0.12"/></filter>
  </defs>
  <rect width="1200" height="809" fill="${secondary}"/>
  ${safeLabels.map((label, index) => {
    const col = index % 3;
    const row = Math.floor(index / 3);
    const x = col * cellW;
    const y = row * cellH;
    const cx = x + cellW / 2;
    const cy = y + cellH / 2;
    const brand = index === 0
      ? `<text x="${x + 28}" y="${y + 42}" font-family="Arial, sans-serif" font-size="22" font-weight="700" fill="${primary}">${safeTitle}</text>`
      : '';
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

/**
 * 大・4格：畫面內容嚴格依照 2x2 官方熱區切分。
 * 品牌識別只放在 A 區內，不額外占用畫布高度。
 */
function largeFour(colors: [string, string, string], title: string, labels: string[]) {
  const [primary, secondary, accent] = colors;
  const safeTitle = safeText(title, '我的品牌', 16);
  const safeLabels = labels.map(label => safeText(label, '未命名', 10));
  const cellW = 600;
  const cellH = 404.5;

  return toDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="809" viewBox="0 0 1200 809">
  <defs>
    <filter id="shadow"><feDropShadow dx="0" dy="3" stdDeviation="6" flood-opacity="0.10"/></filter>
  </defs>
  <rect width="1200" height="809" fill="${secondary}"/>
  ${safeLabels.map((label, index) => {
    const col = index % 2;
    const row = Math.floor(index / 2);
    const x = col * cellW;
    const y = row * cellH;
    const brand = index === 0
      ? `<text x="${x + 38}" y="${y + 48}" font-family="Arial, sans-serif" font-size="25" font-weight="700" fill="${primary}">${safeTitle}</text>`
      : '';
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
  <defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${secondary}"/><stop offset="1" stop-color="#ffffff"/></linearGradient></defs>
  <rect width="1200" height="405" fill="url(#bg)"/>
  ${safeLabels.map((label, index) => {
    const x = index * 400;
    return `
      <rect x="${x + 8}" y="8" width="384" height="389" rx="18" fill="#fff" stroke="${accent}" stroke-width="2"/>
      <circle cx="${x + 200}" cy="135" r="54" fill="${primary}" opacity="0.13"/>
      <text x="${x + 200}" y="151" text-anchor="middle" font-family="Arial, sans-serif" font-size="42" font-weight="700" fill="${primary}">${index + 1}</text>
      <text x="${x + 200}" y="240" text-anchor="middle" font-family="Arial, sans-serif" font-size="32" font-weight="700" fill="#262d31">${label}</text>
      <text x="${x + 200}" y="285" text-anchor="middle" font-family="Arial, sans-serif" font-size="17" fill="#7a8388">${safeTitle}</text>`;
  }).join('')}
</svg>`);
}

export const richMenuPresets: RichMenuPreset[] = [
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

  if (preset.templateId === 'large-6') return largeSix(colors, brandName, labels);
  if (preset.templateId === 'large-4') return largeFour(colors, brandName, labels);
  return compactThree(colors, brandName, labels);
}

export const presetIndustries = ['全部', ...Array.from(new Set(richMenuPresets.map(item => item.industry)))];