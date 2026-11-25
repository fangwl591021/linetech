import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button',{name:'手機版',exact:true}).click();
});

test('all 16 home shortcuts navigate and return', async ({page})=>{
  const buttons=page.locator('.mobile-home-grid > button');
  await expect(buttons).toHaveCount(16);
  for(let i=0;i<16;i++){
    await buttons.nth(i).click();
    await expect(page.locator('.mobile-home-grid')).toHaveCount(0);
    await page.locator('.oa-mobile-device').locator('.oa-mobile-header button, .broadcast-latest-header button').first().click();
    await expect(buttons).toHaveCount(16);
  }
});
test('broadcast text draft persists after reload',async({page})=>{
  await page.locator('.mobile-home-grid > button').nth(0).click();
  await page.getByRole('button',{name:'建立新訊息',exact:true}).click();
  await page.locator('.broadcast-type-grid').getByRole('button',{name:'文字',exact:true}).click();
  await page.getByPlaceholder('輸入文字',{exact:true}).fill('課堂群發測試');
  await page.getByRole('button',{name:'儲存草稿',exact:true}).click();
  await expect(page.locator('.broadcast-records')).toContainText('課堂群發測試');
  await page.reload();
  await page.locator('.mobile-home-grid > button').nth(0).click();
  await page.locator('.broadcast-status-select select').selectOption('草稿');
  await expect(page.locator('.broadcast-records')).toContainText('課堂群發測試');
});
test('welcome and keyword rules update the customer simulator',async({page})=>{
  await page.locator('.mobile-home-grid > button').nth(1).click();
  await page.locator('.welcome-message-card textarea').first().fill('歡迎光臨');
  await page.locator('.official-bottom-save').getByRole('button',{name:'儲存',exact:true}).click();
  await page.getByRole('button',{name:'模擬加入好友',exact:true}).click();
  await expect(page.locator('.customer-chat')).toContainText('歡迎光臨');
  await page.locator('.oa-mobile-device .oa-mobile-header button').first().click();
  await page.locator('.mobile-home-grid > button').nth(2).click();
  await page.locator('.auto-reply-footer').getByRole('button',{name:'建立',exact:true}).click();
  await page.getByLabel('標題',{exact:true}).fill('預約服務');
  await page.getByLabel('關鍵字回應',{exact:true}).check();
  await page.getByLabel('輸入關鍵字',{exact:true}).fill('預約');
  await page.getByRole('button',{name:'新增',exact:true}).click();
  await page.getByLabel('輸入關鍵字',{exact:true}).fill('BOOK');
  await page.getByRole('button',{name:'新增',exact:true}).click();
  await page.getByRole('button',{name:'下一步',exact:true}).click();
  await page.locator('.auto-compose').getByRole('button',{name:'新增',exact:true}).click();
  await page.locator('.broadcast-type-grid').getByRole('button',{name:'文字',exact:true}).click();
  await page.getByLabel('回應訊息 1',{exact:true}).fill('請選擇服務');
  await page.locator('.auto-reply-footer').getByRole('button',{name:'啟用',exact:true}).click();
  await expect(page.locator('.mobile-teaching-panel h2')).toContainText('自動回應訊息');
  await expect(page.locator('.training-checkpoints')).toHaveCount(0);
  await expect(page.locator('.customer-menu')).toHaveCount(0);
  await page.getByLabel('顧客訊息').fill('預約');
  await page.locator('.customer-input button').click();
  await expect(page.locator('.customer-chat')).toContainText('請選擇服務');
  await page.getByLabel('顧客訊息').fill('ｂｏｏｋ');
  await page.locator('.customer-input button').click();
  await expect(page.locator('.customer-bubble.oa').filter({hasText:'請選擇服務'})).toHaveCount(2);
  await page.getByLabel('顧客訊息').fill('請問可以預約嗎');
  await page.locator('.customer-input button').click();
  await expect(page.locator('.customer-bubble.oa').filter({hasText:'請選擇服務'})).toHaveCount(2);
  await page.locator('.auto-rule-row > button').filter({hasText:'預約服務'}).click();
  await page.getByRole('button',{name:'停止使用',exact:true}).click();
  await page.getByLabel('顧客訊息').fill('預約');
  await page.locator('.customer-input button').click();
  await expect(page.locator('.customer-bubble.oa').filter({hasText:'請選擇服務'})).toHaveCount(2);
});
test('rich menu template and text hotspot share the customer chat',async({page})=>{
  await page.locator('.mobile-home-grid > button').nth(9).click();
  await page.locator('.mobile-fixed-action button').click();
  await page.getByRole('button',{name:'Linetech 原創範本庫',exact:true}).click();
  await page.locator('.linetech-preset-card').first().click();
  await page.getByRole('button',{name:'編輯並套用',exact:true}).click();
  await page.getByRole('button',{name:'套用到圖文選單',exact:true}).click();
  await page.locator('.mobile-next-area button').click();
  await page.locator('.menu-practice-body select').first().selectOption('text');
  await page.locator('.menu-practice-body input').first().fill('我要預約');
  await page.getByRole('button',{name:'熱區 A',exact:true}).click();
  await expect(page.locator('.customer-chat')).toContainText('我要預約');
  await page.locator('.menu-practice-footer button').click();
  await expect(page.locator('.menu-practice-screen')).toContainText('內容設定（3/3）');
});

test('coupon assets can be created, reused in broadcast and survive reload',async({page})=>{
  await page.locator('.mobile-home-grid > button').nth(5).click();
  await page.locator('.asset-editor-footer button').click();
  await page.locator('.coupon-type-list button').first().click();
  await page.getByLabel('優惠券名稱',{exact:true}).fill('教學咖啡優惠');
  const dates=page.locator('.asset-editor-body input[type=date]');
  await dates.nth(0).fill('2020-01-01');await dates.nth(1).fill('2099-12-31');
  const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jH1sAAAAASUVORK5CYII=','base64');
  await page.getByLabel('優惠券圖片',{exact:true}).setInputFiles({name:'demo.png',mimeType:'image/png',buffer:png});
  await page.locator('.asset-editor-body textarea').first().fill('教學使用');
  await expect(page.locator('.asset-upload-preview')).toBeVisible();
  await page.locator('.asset-editor-footer').getByRole('button',{name:'儲存',exact:true}).click();
  await expect(page.locator('.asset-record')).toContainText('教學咖啡優惠');
  await page.reload();
  await page.locator('.mobile-home-grid > button').nth(0).click();
  await page.getByRole('button',{name:'建立新訊息',exact:true}).click();
  await page.locator('.broadcast-type-grid').getByRole('button',{name:'優惠券',exact:true}).click();
  await page.getByLabel('選擇優惠券').selectOption({label:'教學咖啡優惠'});
  await expect(page.locator('.broadcast-media-editor img')).toBeVisible();
  await expect(page.getByRole('button',{name:'下一步',exact:true})).toBeEnabled();
});
test('rich messages expose eight independent square layouts',async({page})=>{
  await page.locator('.mobile-home-grid > button').nth(3).click();
  await page.locator('.asset-editor-footer button').click();
  await expect(page.locator('.rich-asset-grid button')).toHaveCount(8);
  await page.locator('.rich-asset-grid button').last().click();
  await expect(page.locator('.rich-asset-preview span')).toHaveCount(6);
  await expect(page.locator('.asset-editor-footer button')).toBeDisabled();
});

test('auto reply saved inactive is not delivered, and activated default is delivered',async({page})=>{
  await page.locator('.mobile-home-grid > button').nth(2).click();
  await page.locator('.auto-reply-footer').getByRole('button',{name:'建立',exact:true}).click();
  await page.getByLabel('標題',{exact:true}).fill('預設招呼');
  await page.getByRole('button',{name:'下一步',exact:true}).click();
  await page.locator('.auto-compose').getByRole('button',{name:'新增',exact:true}).click();
  await page.locator('.broadcast-type-grid').getByRole('button',{name:'文字',exact:true}).click();
  await page.getByLabel('回應訊息 1',{exact:true}).fill('您好，請稍候');
  await page.locator('.auto-reply-footer').getByRole('button',{name:'儲存',exact:true}).click();
  await page.getByLabel('顧客訊息').fill('你好');
  await page.locator('.customer-input button').click();
  await expect(page.locator('.customer-bubble.oa').filter({hasText:'您好，請稍候'})).toHaveCount(0);
  await page.locator('.auto-rule-row > button').filter({hasText:'預設招呼'}).click();
  await page.getByRole('button',{name:'啟用已儲存訊息',exact:true}).click();
  await page.getByLabel('顧客訊息').fill('你好');
  await page.locator('.customer-input button').click();
  await expect(page.locator('.customer-bubble.oa').filter({hasText:'您好，請稍候'})).toHaveCount(1);
});

test('Taiwan auto reply real-screen labels and initial Default row',async({page})=>{
  await page.locator('.mobile-home-grid > button').nth(2).click();
  await expect(page.locator('.auto-tw-description')).toHaveText('可設定當用戶傳訊給本帳號時，系統將自動回傳的訊息內容。');
  const initial=page.locator('.auto-rule-row');
  await expect(initial).toHaveCount(1);
  await expect(initial).toContainText('Default');
  await expect(initial).toContainText('一律回應');
  await expect(initial).toContainText('停用中');
  await page.locator('.auto-reply-footer').getByRole('button',{name:'建立',exact:true}).click();
  await page.getByLabel('關鍵字回應',{exact:true}).check();
  await expect(page.locator('.auto-tw-title-foot')).toContainText('標題為方便後台管理用，不會向用戶顯示。');
  await expect(page.locator('.auto-tw-title-foot')).toContainText('0/20');
  await expect(page.locator('.auto-tw-help')).toHaveText('Help');
  await expect(page.locator('.auto-tw-options')).toContainText('選項設定');
  await expect(page.locator('.auto-tw-options')).toContainText('指定日期或時間');
  await expect(page.locator('.auto-tw-options')).toContainText('不設定');
  await page.getByRole('button',{name:'下一步',exact:true}).click();
  await expect(page.locator('.auto-settings [role=alert]')).toContainText('請輸入標題');
});

test('Taiwan add-friends reference cards, contextual preview and QR generation',async({page})=>{
  await page.locator('.mobile-home-grid > button').nth(7).click();
  await expect(page.locator('.friend-growth-screen .oa-mobile-header strong')).toHaveText('增加好友人數');
  await expect(page.locator('.friend-growth-guide')).toContainText('增加好友人數所需的3大要素');
  await expect(page.locator('.friend-growth-section h3')).toHaveText(['店頭宣傳','線上宣傳']);
  await expect(page.locator('.friend-growth-card strong')).toHaveText(['建立海報','建立集點卡','建立加入好友行動條碼','建立優惠券行動條碼','建立加好友廣告','建立網址','建立按鍵','建立好友推薦優惠券']);
  await expect.poll(async()=>page.locator('.friend-growth-card img').evaluateAll(imgs=>imgs.every(x=>x.complete&&x.naturalWidth>0))).toBe(true);
  await expect(page.locator('.customer-phone')).toHaveCount(0);
  await page.locator('.friend-growth-card').nth(2).click();
  await expect(page.locator('.friend-practice h2')).toContainText('建立加入好友行動條碼');
  await expect(page.locator('.friend-qr-preview img')).toBeVisible();
  await expect.poll(async()=>page.locator('.friend-qr-preview img').evaluate(x=>x.complete&&x.naturalWidth>0)).toBe(true);
  await expect(page.locator('.friend-practice-label input')).toHaveValue('https://example.invalid/linetech/friend');
  await page.getByRole('button',{name:'模擬加入好友',exact:true}).click();
  await expect(page.locator('.friend-welcome-preview')).toContainText('歡迎加入好友！');
  await page.locator('.friend-growth-screen .oa-mobile-header button').first().click();
  await page.locator('.friend-growth-card').nth(0).click();
  await page.getByLabel('海報標語').fill('掃描行動條碼');
  await expect(page.locator('.friend-qr-preview')).toContainText('掃描行動條碼');
  await page.locator('.friend-growth-screen .oa-mobile-header button').first().click();
  await page.locator('.friend-growth-card').nth(1).click();
  await expect(page.locator('.asset-editor-screen .oa-mobile-header')).toContainText('集點卡');
  await page.locator('.asset-editor-screen .oa-mobile-header button').first().click();
  await page.locator('.friend-growth-card').nth(3).click();
  await expect(page.locator('.friend-practice-label select')).toBeVisible();
  await expect(page.getByRole('button',{name:'前往建立優惠券',exact:true})).toBeVisible();
});

test('RC7 remaining artwork, three-column shares, editable message and saved image',async({page})=>{
  await page.locator('.mobile-home-grid > button').nth(7).click();
  await expect(page.locator('.friend-share-card strong')).toHaveText(['LINE','Instagram 限時動態','Facebook','X（舊稱：Twitter）','電子郵件']);
  await expect.poll(async()=>page.locator('.friend-share-card img').evaluateAll(imgs=>imgs.every(x=>x.complete&&x.naturalWidth>0))).toBe(true);
  await page.getByRole('button',{name:'選擇分享用的圖片',exact:true}).first().click();
  const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jH1sAAAAASUVORK5CYII=','base64');
  await page.getByLabel('上傳分享圖片',{exact:true}).setInputFiles({name:'demo.png',mimeType:'image/png',buffer:png});
  await expect(page.getByAltText('分享圖片預覽')).toBeVisible();
  await page.locator('.friend-growth-screen .oa-mobile-header button').first().click();
  await page.locator('.friend-template-button').click();
  await page.getByLabel('分享文案',{exact:true}).fill('RC7課堂分享');
  await page.locator('.friend-growth-screen .oa-mobile-header button').first().click();
  await page.locator('.friend-share-card').nth(1).click();
  await expect(page.locator('.friend-social-preview')).toContainText('RC7課堂分享');
  await expect(page.getByAltText('分享圖片預覽')).toBeVisible();
  await page.getByRole('button',{name:'模擬分享',exact:true}).click();
  await expect(page.locator('.friend-extra-practice [role=status]')).toContainText('未對外傳送');
  await page.reload();
  await page.locator('.mobile-home-grid > button').nth(7).click();
  await page.locator('.friend-share-card').nth(4).click();
  await expect(page.getByLabel('分享文案',{exact:true})).toHaveValue('RC7課堂分享');
  await expect(page.getByAltText('分享圖片預覽')).toBeVisible();
});
test('RC7 promotion link and button, ad and referral practice, landing scroll restore',async({page})=>{
  await page.locator('.mobile-home-grid > button').nth(7).click();
  await page.locator('.friend-growth-card').nth(5).click();
  await page.getByLabel('活動名稱（教學用）').fill('夏日活動');
  await expect(page.getByLabel('教學網址',{exact:true})).toHaveValue('https://example.invalid/linetech/friend?campaign='+encodeURIComponent('夏日活動'));
  await page.locator('.friend-growth-screen .oa-mobile-header button').first().click();
  await page.locator('.friend-growth-card').nth(6).click();
  await expect(page.getByLabel('按鍵 HTML')).toHaveValue(/https:\/\/example\.invalid/);
  await page.getByRole('button',{name:'加入好友',exact:true}).click();
  await expect(page.locator('.friend-welcome-preview')).toBeVisible();
  await page.locator('.friend-growth-screen .oa-mobile-header button').first().click();
  await page.locator('.friend-growth-card').nth(4).click();
  await page.getByLabel('廣告標題').fill('教學廣告');
  await expect(page.locator('.friend-social-preview')).toContainText('教學廣告');
  await page.locator('.friend-growth-screen .oa-mobile-header button').first().click();
  const scroll=page.locator('.friend-growth-scroll');
  await page.locator('.friend-growth-card').nth(7).scrollIntoViewIfNeeded();
  const before=await scroll.evaluate(e=>e.scrollTop);
  expect(before).toBeGreaterThan(0);
  await page.locator('.friend-growth-card').nth(7).click();
  await expect(page.getByLabel('選擇好友介紹優惠券')).toBeVisible();
  await expect(page.getByRole('button',{name:'前往建立優惠券',exact:true})).toBeVisible();
  await page.locator('.friend-growth-screen .oa-mobile-header button').first().click();
  await expect.poll(()=>page.locator('.friend-growth-scroll').evaluate(e=>e.scrollTop)).toBe(before);
});

test('RC7.1 actual wheel scroll reaches the final share-image setting with fixed header',async({page})=>{
  await page.setViewportSize({width:1280,height:760});
  await page.locator('.mobile-home-grid > button').nth(7).click();
  const scroll=page.locator('.friend-growth-scroll');
  const header=page.locator('.friend-growth-screen .oa-mobile-header');
  const bounds=await header.boundingBox();
  expect(bounds).not.toBeNull();
  await expect(page.locator('.friend-growth-card')).toHaveCount(8);
  await expect(page.locator('.friend-share-card')).toHaveCount(5);
  expect(await scroll.evaluate(e=>e.scrollHeight-e.clientHeight)).toBeGreaterThan(500);
  await scroll.hover();
  for(let i=0;i<6;i++){await page.mouse.wheel(0,500);await page.waitForTimeout(80);}
  await expect.poll(()=>scroll.evaluate(e=>Math.abs(e.scrollHeight-e.clientHeight-e.scrollTop))).toBeLessThan(3);
  await expect(page.locator('.friend-setting-section button')).toBeInViewport({ratio:1});
  expect(Math.abs((await header.boundingBox()).y-bounds.y)).toBeLessThan(2);
  await page.locator('.friend-setting-section button').click();
  await expect(page.getByLabel('上傳分享圖片',{exact:true})).toBeVisible();
  await header.locator('button').click();
  await expect.poll(()=>scroll.evaluate(e=>Math.abs(e.scrollHeight-e.clientHeight-e.scrollTop))).toBeLessThan(3);
});

test('rich menu original preset entry and all twelve layouts remain usable on shorter viewport',async({page})=>{
  await page.setViewportSize({width:1440,height:780});
  await page.locator('.mobile-home-grid > button').nth(9).click();
  await page.locator('.mobile-fixed-action button').click();
  await expect(page.locator('.menu-training-steps')).toContainText('選擇版型');
  await page.getByRole('button',{name:'選擇版型',exact:true}).click();
  await expect(page.locator('.mobile-template-thumb')).toHaveCount(5);
  await page.locator('.mobile-picker-tabs').getByRole('button',{name:'大',exact:true}).click();
  await expect(page.locator('.mobile-template-thumb')).toHaveCount(7);
  await page.locator('.mobile-template-thumb').last().click();
  await page.locator('.mobile-picker-actions .select').click();
  await expect(page.locator('.mobile-area-label')).toHaveCount(1);
  await page.getByRole('button',{name:'選擇預設圖片',exact:true}).click();
  await expect(page.locator('.linetech-preset-card')).toHaveCount(18);
  await page.locator('.linetech-library-filters').getByRole('button',{name:'官方版型',exact:true}).click();
  await expect(page.locator('.linetech-preset-card')).toHaveCount(12);
  await page.locator('.linetech-preset-card').last().click();
  await page.getByRole('button',{name:'編輯並套用',exact:true}).click();
  await page.getByPlaceholder('輸入品牌名稱').fill('回歸測試');
  await page.getByRole('button',{name:'套用到圖文選單',exact:true}).click();
  await expect(page.locator('.mobile-file-status')).toContainText('回歸測試');
  await expect(page.locator('.mobile-selected-preview img')).toBeVisible();
  await page.getByRole('button',{name:'選擇版型',exact:true}).click();
  await expect(page.locator('.mobile-template-thumb.selected')).toHaveCount(1);
  await page.locator('.mobile-picker-actions .select').click();
  await expect(page.locator('.mobile-file-status')).toContainText('回歸測試');
  await expect(page.locator('.mobile-next-area button')).toBeEnabled();
});
test('rich menu accepts official alternative dimensions and preserves the image on same-layout selection',async({page})=>{
  await page.locator('.mobile-home-grid > button').nth(9).click();
  await page.locator('.mobile-fixed-action button').click();
  await page.getByRole('button',{name:'選擇版型',exact:true}).click();
  await page.locator('.mobile-template-thumb').first().click();
  await page.locator('.mobile-picker-actions .select').click();
  const makePng=async(w,h)=>Buffer.from((await page.evaluate(({w,h})=>{const c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');x.fillStyle='#06c755';x.fillRect(0,0,w,h);return c.toDataURL('image/png').split(',')[1];},{w,h})),'base64');
  for(const [w,h] of [[1200,405],[800,270],[2500,843]]){
    await page.locator('.mobile-step1-controls input[type=file]').setInputFiles({name:w+'.png',mimeType:'image/png',buffer:await makePng(w,h)});
    await expect(page.locator('.mobile-file-status')).toContainText(w+'.png');
    await expect(page.locator('.mobile-next-area button')).toBeEnabled();
  }
  await page.getByRole('button',{name:'選擇版型',exact:true}).click();
  await page.locator('.mobile-picker-actions .select').click();
  await expect(page.locator('.mobile-file-status')).toContainText('2500.png');
  await page.getByRole('button',{name:'選擇版型',exact:true}).click();
  await page.locator('.mobile-picker-tabs').getByRole('button',{name:'大',exact:true}).click();
  await page.locator('.mobile-template-thumb').first().click();
  await page.locator('.mobile-picker-actions .select').click();
  for(const [w,h] of [[1200,810],[800,540],[2500,1686]]){
    await page.locator('.mobile-step1-controls input[type=file]').setInputFiles({name:w+'-large.png',mimeType:'image/png',buffer:await makePng(w,h)});
    await expect(page.locator('.mobile-file-status')).toContainText(w+'-large.png');
  }
  await expect(page.locator('.mobile-area-label')).toHaveCount(6);
  await expect(page.locator('.mobile-next-area button')).toBeEnabled();
});

test('desktop rich menu retains direct original library and opens it cleanly again',async({page})=>{
  await page.getByRole('button',{name:'電腦版',exact:true}).click();
  await page.getByRole('button',{name:'建立圖文選單',exact:true}).click();
  await page.getByRole('button',{name:'Linetech 原創範本庫',exact:true}).click();
  await expect(page.locator('.desktop-preset-card')).toHaveCount(18);
  await page.locator('.desktop-preset-card').first().click();
  await page.getByRole('button',{name:'編輯並套用',exact:true}).click();
  await page.locator('.desktop-editor-form section').first().locator('input').fill('桌面回歸測試');
  await page.getByRole('button',{name:'套用到圖文選單',exact:true}).click();
  await expect(page.locator('.file-name')).toContainText('桌面回歸測試');
  await expect(page.locator('.preview-menu img')).toBeVisible();
  await page.getByRole('button',{name:'Linetech 原創範本庫',exact:true}).click();
  await expect(page.locator('.desktop-preset-card')).toHaveCount(18);
});
