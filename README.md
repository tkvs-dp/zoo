# 森野 Zoo

純靜態 HTML、CSS 與 JavaScript 網站。

## 開啟網站

直接以瀏覽器開啟 `index.html` 即可使用。圖片、影片、字型與資料均包含在資料夾中。

## 部署

將 `index.html`、`src/` 與 `public/` 放在靜態主機的同一個目錄，即可使用。素材採用相對路徑，支援網站根目錄或 `/Zoo/` 等子目錄。

## 編輯

- `index.html`：首頁、棲息地、保育與導覽內容。
- `src/animals.js`：動物圖鑑資料。
- `src/main.js`：搜尋、篩選、動物介紹與嚮導互動。
- `src/style.css`：手機版排版與動畫。

探索進度與保育行動儲存在瀏覽器 localStorage。直接開啟本機檔案時，記錄是否能持久保存依瀏覽器設定而定。

## 開發工具

安裝 Node.js 後，可選擇執行 `npm run dev`，在 `http://localhost:8080/` 預覽。`npm run build` 會將靜態檔案複製到 `dist/`；`npm run preview` 可預覽該目錄。

自動化測試：先執行 `npm install` 與 `npx playwright install chromium`，啟動 `npm run dev` 後，在另一個終端執行 `npm test`。

`TEST_URL` 可指定測試網址。測試結果與截圖儲存於 `tests/artifacts`。

## 素材授權

照片與影片來源：`public/images/sources.json`。照片使用 Unsplash 素材；影片來自 USFWS Mountain-Prairie 公有領域作品。Space Grotesk 字型授權：`public/fonts/OFL.txt`。
