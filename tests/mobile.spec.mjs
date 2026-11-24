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
  await page.locator('.auto-rule-row > button').click();
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
  await page.locator('.auto-rule-row > button').click();
  await page.getByRole('button',{name:'啟用已儲存訊息',exact:true}).click();
  await page.getByLabel('顧客訊息').fill('你好');
  await page.locator('.customer-input button').click();
  await expect(page.locator('.customer-bubble.oa').filter({hasText:'您好，請稍候'})).toHaveCount(1);
});
