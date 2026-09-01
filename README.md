# linetech — LINE OA 教學模擬器

Phase 1：Rich Menu（圖文選單）模擬教學。

## 目標

- 左側盡量還原 LINE Official Account Manager 的操作路徑、欄位名稱與設定順序。
- 右側提供 LINE 手機聊天室即時模擬，讓老師設定後不用切換畫面即可展示結果。
- 第一版不登入、不接 D1、不呼叫真正 LINE API；資料儲存在瀏覽器 LocalStorage。
- 教學模式可顯示 Rich Menu 熱區，關閉後則以一般使用者視角測試。

## Phase 1 已實作

1. LINE OA Manager 外框：上方導覽、左側選單、「聊天室相關 → 圖文選單」。
2. 圖文選單初始說明頁與「建立圖文選單」。
3. 基本設定：標題、開始/結束日期時間。
4. 內容設定：大/小版型選擇、背景圖片上傳、A~F 等熱區。
5. Action：優惠券、網址、文字、集點卡、不設定。
6. 選單列文字、預設顯示/隱藏。
7. 右側手機即時模擬：文字訊息、網址 WebView、優惠券/集點卡模擬回饋。
8. LocalStorage 儲存草稿。

## 開發

```bash
npm install
npm run dev
```

## 建置

```bash
npm run build
```

## Cloudflare Workers 部署

```bash
npx wrangler login
npm run deploy
```

正式 Worker 名稱：`linetech`

## 架構

- `src/components/`：Official Account Manager / Phone Simulator UI
- `src/domain/`：Rich Menu 資料模型與版型定義
- `src/App.tsx`：Phase 1 狀態、LocalStorage、互動模擬引擎

後續 Phase 2 可將自動回應、關鍵字回覆接入同一個事件模擬核心。
