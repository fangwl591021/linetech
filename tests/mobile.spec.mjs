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
  await page.getByRole('button',{name:'建立新訊息',exact:true}).click();
  await page.locator('.official-form-section input:not([type=checkbox])').first().fill('預約');
  await page.locator('.official-form-section textarea').fill('請選擇服務');
  await page.locator('.official-bottom-save').getByRole('button',{name:'儲存',exact:true}).click();
  await page.getByLabel('顧客訊息').fill('預約');
  await page.locator('.customer-input button').click();
  await expect(page.locator('.customer-chat')).toContainText('請選擇服務');
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
