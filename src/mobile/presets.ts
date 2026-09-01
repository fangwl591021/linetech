export type PresetSize = 'large' | 'compact';

export interface RichMenuPreset {
  id: string;
  name: string;
  industry: string;
  purpose: string;
  style: string;
  size: PresetSize;
  templateId: string;
  labels: string[];
  imageDataUrl: string;
}

const toDataUrl = (svg: string) => `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;

function largeSix(colors: [string, string, string], title: string, labels: string[]) {
  const [primary, secondary, accent] = colors;
  return toDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="809" viewBox="0 0 1200 809">
  <defs>
    <linearGradient id="hero" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${primary}"/>
      <stop offset="1" stop-color="${secondary}"/>
    </linearGradient>
    <filter id="shadow"><feDropShadow dx="0" dy="4" stdDeviation="8" flood-opacity="0.18"/></filter>
  </defs>
  <rect width="1200" height="809" fill="${secondary}"/>
  <rect width="1200" height="185" fill="url(#hero)"/>
  <circle cx="1010" cy="70" r="130" fill="${accent}" opacity="0.20"/>
  <circle cx="1090" cy="135" r="92" fill="#fff" opacity="0.08"/>
  <text x="68" y="84" font-family="Arial, sans-serif" font-size="46" font-weight="700" fill="#fff">${title}</text>
  <text x="68" y="132" font-family="Arial, sans-serif" font-size="22" fill="#fff" opacity="0.9">LINE 官方帳號快速入口</text>
  ${labels.map((label, index) => {
    const col = index % 3;
    const row = Math.floor(index / 3);
    const x = col * 400;
    const y = 185 + row * 312;
    const cx = x + 200;
    const cy = y + 156;
    return `
      <rect x="${x + 7}" y="${y + 7}" width="386" height="298" rx="16" fill="#fff" filter="url(#shadow)"/>
      <circle cx="${cx}" cy="${cy - 34}" r="38" fill="${accent}" opacity="0.18"/>
      <text x="${cx}" y="${cy - 22}" text-anchor="middle" font-family="Arial, sans-serif" font-size="30" font-weight="700" fill="${primary}">${index + 1}</text>
      <text x="${cx}" y="${cy + 45}" text-anchor="middle" font-family="Arial, sans-serif" font-size="31" font-weight="700" fill="#283033">${label}</text>`;
  }).join('')}
</svg>`);
}

function largeFour(colors: [string, string, string], title: string, labels: string[]) {
  const [primary, secondary, accent] = colors;
  return toDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="809" viewBox="0 0 1200 809">
  <rect width="1200" height="809" fill="${secondary}"/>
  <rect width="1200" height="168" fill="${primary}"/>
  <path d="M0 168 L1200 90 L1200 168 Z" fill="${accent}" opacity="0.32"/>
  <text x="62" y="82" font-family="Arial, sans-serif" font-size="45" font-weight="700" fill="#fff">${title}</text>
  <text x="62" y="125" font-family="Arial, sans-serif" font-size="21" fill="#fff" opacity="0.9">專業服務，一鍵找到</text>
  ${labels.map((label, index) => {
    const col = index % 2;
    const row = Math.floor(index / 2);
    const x = col * 600;
    const y = 168 + row * 320.5;
    return `
      <rect x="${x + 12}" y="${y + 12}" width="576" height="296" rx="18" fill="#fff" stroke="${accent}" stroke-width="2"/>
      <rect x="${x + 45}" y="${y + 72}" width="76" height="76" rx="20" fill="${accent}" opacity="0.20"/>
      <text x="${x + 83}" y="${y + 122}" text-anchor="middle" font-family="Arial, sans-serif" font-size="30" font-weight="700" fill="${primary}">${index + 1}</text>
      <text x="${x + 160}" y="${y + 120}" font-family="Arial, sans-serif" font-size="34" font-weight="700" fill="#252b2f">${label}</text>
      <text x="${x + 160}" y="${y + 164}" font-family="Arial, sans-serif" font-size="19" fill="#7b8388">立即查看服務內容</text>`;
  }).join('')}
</svg>`);
}

function compactThree(colors: [string, string, string], title: string, labels: string[]) {
  const [primary, secondary, accent] = colors;
  return toDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="405" viewBox="0 0 1200 405">
  <defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${secondary}"/><stop offset="1" stop-color="#ffffff"/></linearGradient></defs>
  <rect width="1200" height="405" fill="url(#bg)"/>
  ${labels.map((label, index) => {
    const x = index * 400;
    return `
      <rect x="${x + 8}" y="8" width="384" height="389" rx="18" fill="#fff" stroke="${accent}" stroke-width="2"/>
      <circle cx="${x + 200}" cy="135" r="54" fill="${primary}" opacity="0.13"/>
      <text x="${x + 200}" y="151" text-anchor="middle" font-family="Arial, sans-serif" font-size="42" font-weight="700" fill="${primary}">${index + 1}</text>
      <text x="${x + 200}" y="240" text-anchor="middle" font-family="Arial, sans-serif" font-size="32" font-weight="700" fill="#262d31">${label}</text>
      <text x="${x + 200}" y="285" text-anchor="middle" font-family="Arial, sans-serif" font-size="17" fill="#7a8388">${title}</text>`;
  }).join('')}
</svg>`);
}

export const richMenuPresets: RichMenuPreset[] = [
  {
    id: 'cafe-warm-01', name: '暖木咖啡', industry: '餐飲', purpose: '訂位・導購', style: '溫暖自然', size: 'large', templateId: 'large-6',
    labels: ['最新菜單', '線上訂位', '本月優惠', '門市資訊', '會員專區', '聯絡我們'],
    imageDataUrl: largeSix(['#6b4b3e', '#eadfce', '#c58f62'], '暖木咖啡', ['最新菜單', '線上訂位', '本月優惠', '門市資訊', '會員專區', '聯絡我們'])
  },
  {
    id: 'beauty-soft-01', name: '柔光美學', industry: '美容', purpose: '預約・服務介紹', style: '柔和質感', size: 'large', templateId: 'large-6',
    labels: ['立即預約', '服務療程', '價目資訊', '作品案例', '本月優惠', '線上客服'],
    imageDataUrl: largeSix(['#9b6f75', '#f3e7e4', '#d9a9af'], '柔光美學', ['立即預約', '服務療程', '價目資訊', '作品案例', '本月優惠', '線上客服'])
  },
  {
    id: 'realestate-urban-01', name: '城市房產', industry: '房地產', purpose: '名單蒐集', style: '專業穩重', size: 'large', templateId: 'large-4',
    labels: ['我要找房', '我要賣屋', '免費估價', '聯絡顧問'],
    imageDataUrl: largeFour(['#17365d', '#edf2f7', '#c9a45b'], '城市房產', ['我要找房', '我要賣屋', '免費估價', '聯絡顧問'])
  },
  {
    id: 'consulting-smart-01', name: '商務顧問', industry: '顧問', purpose: '諮詢・案例', style: '商務科技', size: 'large', templateId: 'large-4',
    labels: ['服務方案', '成功案例', '預約諮詢', '聯絡我們'],
    imageDataUrl: largeFour(['#1f4c5c', '#eef5f4', '#4aa69b'], '商務顧問', ['服務方案', '成功案例', '預約諮詢', '聯絡我們'])
  },
  {
    id: 'education-bright-01', name: '好學教室', industry: '教育', purpose: '課程報名', style: '明亮活潑', size: 'compact', templateId: 'compact-3',
    labels: ['熱門課程', '立即報名', '課程公告'],
    imageDataUrl: compactThree(['#3566c8', '#f4f8ff', '#f0b73e'], '好學教室', ['熱門課程', '立即報名', '課程公告'])
  },
  {
    id: 'retail-clean-01', name: '好物選品', industry: '零售', purpose: '商品導購', style: '清爽簡約', size: 'compact', templateId: 'compact-3',
    labels: ['熱門商品', '會員優惠', '客服中心'],
    imageDataUrl: compactThree(['#2c6f68', '#eff7f4', '#78b9a8'], '好物選品', ['熱門商品', '會員優惠', '客服中心'])
  }
];

export const presetIndustries = ['全部', ...Array.from(new Set(richMenuPresets.map(item => item.industry)))];
