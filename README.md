# 森野 Zoo

純靜態 HTML、CSS 與 JavaScript 網站。

## 提示詞

在Zoo目錄下建立一個手機優先的「動物園探索」靜態網站。 
- 首頁第一眼要像走進森林探索動物。
- 以大型動物照片和自然景觀作為主要視覺。
- 規劃動物圖鑑、棲息地、保育知識與探索導覽。
- 讓使用者可以點擊動物，快速認識特色與生活習性。
- 點進動物圖鑑時，要有明顯但自然的互動動畫。
- 加入一個會持續出現在網站中的小動物角色。
- 圖片與影片要比長篇文字更重要。
- 使用「可持續的動畫效果」，讓網站有生命感，但不要影響閱讀與操作。
- 使用 frontend-design Skill，並遵循 DESIGN.md。
- 完成後檢查手機效能、動畫與操作是否流暢。

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
