# linetech — LINE OA 教學模擬器

LINE Official Account Manager / App 的互動式教學模擬器。

## 核心原則

- 操作路徑、欄位名稱、設定順序盡量與 LINE 官方實際畫面一致，避免學員回到真正後台後混淆。
- 教學輔助 UI 與 LINE 模擬畫面分離，不把自訂功能混入官方介面。
- 第一版不登入、不接 D1、不呼叫真正 LINE API；資料以瀏覽器本機為主。

## 電腦版 Rich Menu Phase 1

1. LINE OA Manager 外框：上方導覽、左側選單、「聊天室相關 → 圖文選單」。
2. 圖文選單初始說明頁與「建立圖文選單」。
3. 基本設定：標題、開始/結束日期時間。
4. 內容設定：大/小版型選擇、背景圖片上傳、A~F 等熱區。
5. Action：優惠券、網址、文字、集點卡、不設定。
6. 選單列文字、預設顯示/隱藏。
7. 右側手機即時模擬：文字訊息、網址 WebView、優惠券/集點卡模擬回饋。
8. LocalStorage 儲存草稿。

## 手機版 Rich Menu Phase 1

依 2026 LINE Official Account App 實際畫面建立：

1. 手機 OA 主頁與功能九宮格。
2. 主頁點「圖文選單」進入介紹頁。
3. 點「建立」進入「內容設定（1/3）」。
4. 小 / 大版型選擇滿版浮層。
5. 選版型後顯示 A、B、C… 熱區預覽。
6. 模擬從手機上傳 JPG / JPEG / PNG。
7. 教學用預設圖片。
8. 未完成版型及圖片前，「下一步」保持 disabled。
9. 獨立教學輔助區顯示目前操作步驟。
10. 右下角可切換「電腦版 / 手機版」教學。

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

- `src/components/`：電腦版 Official Account Manager / Phone Simulator UI
- `src/mobile/`：手機版 Official Account App / Rich Menu 流程
- `src/domain/`：Rich Menu 資料模型與版型定義
- `src/App.tsx`：電腦版狀態與互動模擬
- `src/Root.tsx`：電腦版 / 手機版教學模式切換
- `src/mobile.css`：手機版與教學輔助區樣式

下一階段：手機版「內容設定（2/3）、（3/3）」與 Action 設定，再接右側顧客 LINE 即時互動。
