# 訂單與庫存系統 V2｜新手操作指南

這份說明寫給第一次使用 Git 和 Docker 的組員。**先照第 1～4 節把網站跑起來、學會交作業，後面的內容遇到時再查，不用一次背完。**

## 1. 系統預期功能

我們五個人一起開發一個網站：顧客（Customer）可以瀏覽商品、下單，管理員（Admin）可以處理訂單與庫存。**這些是預計要做的功能，目前還沒完成。** 現在只有起始畫面、連線檢查和資料庫基本結構，看到簡單的介紹頁是正常的。

先認識五個名稱就好：

| 名稱 | 白話說明 | 你會用它做什麼？ |
| --- | --- | --- |
| 編輯器，例如 VS Code | 打開及修改程式檔案的工具 | 修改畫面、儲存程式 |
| 終端機（CMD） | 用輸入文字的方式操作電腦 | 貼上這份文件中的指令 |
| Git | 記錄程式每一次修改的工具 | 記錄自己的成果、取得別人的更新 |
| GitHub | 放團隊程式的網站，與 Git 是不同東西 | 上傳成果、請組員檢查後合併 |
| Docker Desktop | 幫你準備並執行網站需要的環境 | 在自己電腦啟動前端、後端 |

「前端」是瀏覽器看到的畫面；「後端」負責處理請求；「資料庫」保存商品、訂單等資料。前端透過 API（前後端約好的資料傳遞介面）請後端讀寫資料庫。

平常的操作是：**本機修改檔案 → 儲存 → 用瀏覽器看結果 → 用 Git 記錄 → 上傳 GitHub。** 不需要進 Docker 裡寫程式。

每個人的電腦都有自己的程式副本和資料庫。你新增商品後，別人的電腦不會自動出現同一筆商品；你修改程式，也不會立刻改到別人的檔案。

## 2. 第一次使用：讓網站在自己電腦跑起來

### 2-1. 先準備工具與帳號

請先安裝 **Git、Docker Desktop、VS Code** / **Cursor**（已使用其他編輯器也可以），並準備 GitHub 帳號。安裝完成後重新開啟終端機，讓電腦讀到新工具。

只照這份指南用 Docker 啟動網站，不需要另外安裝 Python 和 Node.js。

### 2-2. 指令要在哪裡輸入？

可以用以下任一方式：

- **Windows**：開啟 CMD。
- **Mac**：開啟「終端機 (Terminal)」應用程式。
- **VS Code**：開啟資料夾後，從「終端機／Terminal」選單開啟新的終端機。

文件中的灰底區塊是指令。**一次複製一行，貼到終端機，按 Enter，等它完成再輸入下一行。** 不要貼到瀏覽器網址列；也不要把 Markdown 的三個反引號一起貼上。以 `#` 開頭的是說明，不必輸入。

先依序輸入：

```sh
git --version
docker --version
docker compose version
```

**成功會看到版本號碼**，不必和組員的號碼完全一樣。如果看到「找不到指令」或 `command not found`，表示工具尚未安裝好或終端機需要重開，先處理再往下走。

### 2-3. 告訴 Git 你的名字

這是讓組員知道每次修改是誰提交的，**不是登入 GitHub，也不需要輸入密碼**。下面兩個引號中的內容請換成自己的名字、信箱；保留引號。

```sh
git config --global user.name "你的名字"
git config --global user.email "你的信箱"
```

成功時通常不會顯示任何文字。這會設定這台電腦的 Git 預設身分；信箱可使用自己 GitHub 帳號提供的 noreply 信箱。

### 2-4. 下載團隊的程式

**還沒有 V2 資料夾的人：** 先在 VS Code 開啟你想放專案的資料夾，例如自己建立的 `projects`，再開終端機。依序執行：

```sh
git clone https://github.com/zeroleafx/order-system.git
cd order-system
```

第一行把團隊程式下載成 `order-system` 資料夾；第二行是「進入這個資料夾」。`clone` 只需要做一次，不是每次都要下載一份。

**已經有 V2 資料夾的人：** 跳過上面兩行，在 VS Code 用「開啟資料夾」選擇自己的 `order-system`，再開新的終端機。不要複製別人的路徑，你的電腦路徑可能不同。

如果下載時顯示沒有權限或 `Repository not found`，請負責人確認邀請及網址；需要登入 GitHub 時依提示完成，不要把密碼或 token 傳給 AI 或寫進檔案。

### 2-5. 啟動網站

先開啟 **Docker Desktop**，等它顯示引擎已啟動，再到 V2 的終端機輸入：

```sh
docker compose up --build -d
```

這行會準備環境並在背景啟動網站。第一次會下載套件，可能等幾分鐘；看到很多安裝文字是正常的。等終端機重新出現可以輸入指令的位置後，再輸入：

```sh
docker compose ps
```

應看到 `backend` 和 `frontend`，狀態為 `Up`，後端稍後會顯示 `healthy`。如果是 `Exited` 或錯誤訊息，先看第 9 節，不要一直重複執行。

### 2-6. 用瀏覽器確認成功

開啟 [網站首頁](http://localhost:5173)。看到介紹頁以及 **`API: ok · Database: connected`**，就代表前端、後端與資料庫已接通。

`localhost` 表示「你自己的電腦」。把網址傳給組員，不會讓他看到你的網站，他也要在自己的電腦啟動。

需要排查時，才查看 [健康檢查](http://localhost:8000/api/health) 或 [API 文件](http://localhost:8000/docs)。健康檢查正常會顯示：

```json
{"status":"ok","database":"connected"}
```

## 3. 每天開始與結束時要做什麼？

**開始工作：** 開 Docker Desktop → 用編輯器開 V2 → 開終端機 → 輸入：

```sh
git status
docker compose up -d
```

`git status` 是查看目前分支和哪些檔案改過，不會修改你的檔案。網站啟動後，開啟 [首頁](http://localhost:5173)。

**修改程式：** 在編輯器修改本機檔案，按 Ctrl+S（Mac 是 Command+S）儲存，再到瀏覽器查看。一般畫面與後端程式會自動重新載入，不必每改一行就重建 Docker。

**結束工作：** 先儲存檔案，依第 4 節記錄需要保留的修改，再輸入：

```sh
docker compose down
```

這會停止網站，保留資料庫。下次再用 `docker compose up -d` 啟動。不要加 `-v`，因為它會連資料庫一起刪除。

**剛取得組員更新時：** 如果包含套件或環境設定變更，使用 `docker compose up --build -d`；如果有資料表更新，依第 6 節套用。Git 下載新程式，不代表正在跑的環境與資料表已全部更新。

## 4. 怎麼把自己的成果交給團隊？

### 4-1. 先理解分支，避免直接改共用版本

「分支（branch）」是同一份專案中的不同開發路線。`main` 放大家已整合的版本，你做新功能時先建立自己的分支，做好後請組員看過，再合併回 `main`。

切分支通常不會多出一個資料夾，Git 會切換目前資料夾中的程式內容。分支也不會阻止你改到共用檔案，所以仍要遵守分工。

### 4-2. 開始一個新任務

先輸入：

```sh
git status
```

如果看到 **`nothing to commit, working tree clean`**，表示沒有未提交的修改，可以繼續。如果看到 `modified` 或 `Untracked files`，先確認這些檔案的來源、依下方步驟處理，不要直接刪掉。

接著一行一行執行：

```sh
git switch main
git pull --ff-only origin main
git switch -c feat/product-list
```

| 指令 | 意思 | 正常時會發生什麼 |
| --- | --- | --- |
| `git switch main` | 切回共用版本 | 顯示切到 main，或已在 main |
| `git pull --ff-only origin main` | 取得 GitHub 上最新的 main | 下載更新，或顯示 `Already up to date` |
| `git switch -c feat/自己取個名稱` | 建立並切到建立的分支 | 顯示切到新的分支 |

`origin` 是下載專案時 Git 自動取的遠端名稱。`feat/...` 是分支名稱範例，請依任務取名，例如 `feat/login`；名字中不要放空格。任何一步出錯都先停下來看訊息，不要繼續貼後面的指令。

**繼續昨天的任務不用再建立分支。** 用 `git status` 確認已在自己的分支，直接繼續工作即可。不要五個人共同推送同一個功能分支。

### 4-3. 改完後，先查看自己改了什麼

儲存檔案，確認畫面或功能正常後，執行：

```sh
git status
git diff
```

`git status` 列出修改的檔案；`git diff` 顯示已追蹤檔案中改了哪些內容。新增、尚未被追蹤的檔案要另外在編輯器打開確認。如果畫面停在長篇差異內容，按 `q` 離開。

### 4-4. 選取檔案，存成一次修改紀錄

以下假設你只改了既有的 `frontend/src/main.jsx`，請依實際檔案調整，不要照抄不相關的路徑：

```sh
git add frontend/src/main.jsx
git diff --cached
```

`git add` 是把檔案放進「這次準備記錄的清單」，還沒有上傳。改了多個檔案，就對每個相關檔案執行一次 `git add 檔案路徑`。`git diff --cached` 讓你最後確認清單內的內容，新檔案也會顯示。

確認只有自己這次需要的修改後：

```sh
git commit -m "更改訊息 (ex. 新增商品列表畫面)"
```

引號內換成這次真正完成的內容。成功後會看到提交編號及修改檔案數量。**Commit 只記錄在自己的電腦，組員還看不到。**

不要加入密碼、`.env`、資料庫 `.db` 或套件資料夾 `node_modules`。`.gitignore` 是告訴 Git 哪些檔案不用收錄的規則，團隊應將這份規則本身提交到 Git。

### 4-5. 上傳自己的分支

第一次上傳這個分支：

```sh
git push -u origin feat/上面取的名稱
```

分支名稱要與自己建立的一樣。成功後可在 GitHub 找到這個分支；同一分支之後繼續提交，用 `git push` 即可。

**Push 是上傳你的分支，不會自動把成果合併進 main。** 如果被拒絕，先確認權限和錯誤訊息，不要使用強制推送。

### 4-6. 請組員檢查並合併（PR）

PR 是 Pull Request，意思是「請把我這個分支的修改合併進去」。在 [團隊 GitHub 儲存庫](https://github.com/zeroleafx/order-system) 建立 PR，選擇自己的分支合併到 `main`。不確定操作時，請一位組員陪同完成第一次。

在說明中寫清楚：

- 做了什麼，例如新增商品列表。
- 怎麼確認正常，例如開啟商品頁、確認商品名稱與價格。
- 有沒有改共用檔案、套件或資料庫。

請至少一位組員確認後再合併。不要自己略過審查直接推送到 `main`。

### 4-7. 合併後，更新自己的電腦

GitHub 合併成功不會自動改你電腦的檔案。確認自己的工作已提交後：

```sh
git switch main
git pull --ff-only origin main
```

下一個任務再建立新的分支。若正在做的功能還沒完成，但需要接入別人的更新，請看下方進階說明。

<details>
<summary>進階：開發一半如何接入最新 main？遇到衝突怎麼辦？</summary>

先妥善提交自己的修改，確認工作目錄乾淨，在自己的功能分支執行：

```sh
git fetch origin
git merge origin/main
```

`fetch` 取得遠端最新紀錄；`merge` 把最新 main 合併進目前分支。若出現 `CONFLICT`，表示 Git 無法自行決定同一段內容要留哪個版本，不表示檔案已經遺失。

先用 `git status` 看哪些檔案衝突，找該檔案負責人一起確認。不要全部選「我的版本」或「對方版本」。處理好 `<<<<<<<`、`=======`、`>>>>>>>` 標記後，選取修好的檔案、提交、重新驗證再上傳。

若這次 merge 還沒完成，想先取消它，可用 `git merge --abort` 回到合併前；不確定目前狀態時先請組員協助。即使沒有文字衝突，也需要確認功能能一起運作。

</details>

---

以下是查閱區：遇到分工、環境或資料庫問題時，再找對應章節。

## 5. 五人分工與使用 AI 的約定

以下是討論中的分工建議：

| 人員 | 模組 | 主要工作 |
| --- | --- | --- |
| A | 登入與權限 | Customer／Admin 登入相關畫面、使用者身分與後端權限檢查 |
| B | 訂單 | 顧客建立及查看自己的訂單、管理員處理訂單 |
| C | 商品與庫存 | 顧客商品頁、管理員商品維護與庫存操作 |
| D | 異常檢核 | 異常規則、檢核邏輯、異常列表與處理狀態 |
| E | 首頁與整合 | 兩端首頁、共用版型、導覽、路由與整合驗證 |

各模組負責人處理自己模組的前端與後端。A、C 可先提供登入和商品的基礎 API，B、D 同步用假資料做畫面與規則，E 從一開始參與整合。商品瀏覽頁可以先做，再接登入。

共用檔案要協調：

- `backend/app/models.py` 與 `backend/migrations`：指定一人統整資料表和 migration，各模組提出需求。
- `frontend/src/main.jsx`、共用樣式和未來的路由：由整合負責人協調。現在前端仍集中在入口檔，開始多人開發前應先約定模組拆分方式。
- `backend/app/main.py`：共用 API 入口，新增路由時與相關組員協調。
- 套件清單、lockfile、Dockerfile、`compose.yaml`：先說明必要變更，避免影響全組環境。

每人使用自己的 clone 和分支。分支不是檔案鎖，AI 也不會自動知道誰負責哪裡。可以在每次任務開頭告訴 AI：

> 我負責商品與庫存模組。請先閱讀專案規範，只修改本模組相關檔案。若需要修改共用入口、路由、資料模型、migration、套件或 Docker 設定，先列出必要變更讓我確認。不要重構其他模組，也不要覆蓋與任務無關的修改。完成後列出修改檔案及驗證結果。

**初步設置可先看到這就好，以下可先略過**

## 6. Docker 日常操作與何時重建

| 目的 | 指令 |
| --- | --- |
| 啟動現有環境 | `docker compose up -d` |
| 建置並啟動 | `docker compose up --build -d` |
| 查看服務狀態 | `docker compose ps` |
| 追蹤後端紀錄 | `docker compose logs -f backend` |
| 追蹤前端紀錄 | `docker compose logs -f frontend` |
| 重啟前端 | `docker compose restart frontend` |
| 停止並移除容器，保留資料庫 | `docker compose down` |

追蹤 logs 時按 Ctrl+C 只是結束查看紀錄，不會停止背景服務。

| 修改內容 | 需要的操作 |
| --- | --- |
| `frontend/src`、`frontend/index.html` | 已掛載，儲存後由 Vite 更新 |
| `backend/app` | 已掛載，Uvicorn 會重新載入；改模型不會自動改資料表 |
| `frontend/vite.config.js` | 已掛載，必要時重啟前端 |
| `backend/requirements.txt` | `docker compose up --build -d backend` |
| `frontend/package.json`、`package-lock.json` | 更新兩者後，`docker compose up --build -d frontend` |
| Dockerfile 或 Python／Node 版本 | 修改對應 Dockerfile，再重建該服務 |
| Compose 的環境變數、連接埠、掛載 | 執行 `docker compose up -d` 套用；若也改建置內容則加 `--build` |
| 新 migration | 執行 `docker compose exec backend alembic upgrade head`，或重新啟動後端讓啟動流程套用 |

前端使用 `npm ci` 安裝 lockfile 中的套件。新增依賴時需更新並提交 `package.json` 與 `package-lock.json`；單純重建 Docker 不會替你更新 lockfile。若用本機 npm，請使用與 Docker 相容的 Node.js 22 環境，在 `frontend` 內執行 `npm install 套件名稱`。Python 目前使用版本範圍，尚未鎖定所有套件的精確版本。

**不要把 `docker compose down -v` 當成一般停止指令。它會刪除本機資料庫 volume。** 重建映像通常不需要刪除資料庫。

## 7. 資料庫在哪裡？

SQLite 位於後端容器的 `/data/orders.db`，由 `sqlite_data` volume 保存，沒有獨立的資料庫容器。每個人第一次啟動時都會建立自己的資料表。

```sh
# 查看目前資料庫版本
docker compose exec backend alembic current

# 列出資料表
docker compose exec backend python -c "from sqlalchemy import inspect; from app.database import engine; print(inspect(engine).get_table_names())"
```

如需用 SQLite 圖形工具查看，可先透過 SQLite 備份功能建立一致的快照，再複製到本機：

```sh
docker compose exec backend python -c "import sqlite3; src=sqlite3.connect('/data/orders.db'); dst=sqlite3.connect('/tmp/orders-view.db'); src.backup(dst); dst.close(); src.close()"
docker compose cp backend:/tmp/orders-view.db ./orders-view.db
```

`orders-view.db` 是副本，修改它不會改到系統使用的資料庫；要看最新資料，請重新執行上述步驟。不要把資料庫檔案提交到 Git。

資料表欄位、設計假設與 migration 操作請看 [資料庫設計與操作說明](docs/DATABASE.md)。目前仍需討論角色權限、訂單所屬顧客、扣庫存時機、取消回補及金額單位。

## 8. 提交前的基本驗證

先啟動服務，確認健康檢查與自己修改的畫面／API，再視變更執行：

```sh
# 前端建置檢查（前端容器需已啟動）
docker compose exec frontend npm run build

# 資料模型與 migration 是否一致（後端容器需已啟動，且已套用最新 migration）
docker compose exec backend alembic check
```

資料庫測試在暫存資料庫驗證，不會清空開發資料。以下掛載寫法適用 macOS／Linux 的 shell，於 V2 根目錄執行：

```sh
docker compose run --rm --no-deps -v "$PWD/backend/tests:/tests:ro" backend python -m unittest discover -s /tests -v
```

Windows PowerShell 請改用：

```powershell
docker compose run --rm --no-deps -v "${PWD}/backend/tests:/tests:ro" backend python -m unittest discover -s /tests -v
```

目前這些檢查不代表完整業務測試；登入、訂單和庫存流程完成後仍需各自驗證。

## 9. 常見問題

| 問題 | 先檢查什麼 |
| --- | --- |
| 無法連到 Docker daemon | Docker Desktop 是否已啟動並就緒 |
| 找不到 Compose 設定 | 是否在含 `compose.yaml` 的 V2 根目錄 |
| 5173 或 8000 已被占用 | 是否有舊專案或其他程式使用同一個連接埠；確認服務身分後再決定停止或調整 |
| 前端無法連到 API | 先看 `docker compose ps` 與 `docker compose logs backend`，確認後端及 migration 成功 |
| 改了套件卻沒有生效 | 套件清單沒有掛載，需要重建對應映像 |
| 改了模型卻沒有新欄位 | 需要建立、審查並套用 migration，不能只改 models.py |
| 多人 migration 產生多個 head | 交給資料庫統整者處理版本分支，不要刪掉別人的 migration |
| Git pull 被拒絕或有衝突 | 先看 `git status`，保留自己的修改，再與組員一起處理；不要直接 reset 或強推 |

## 10. 專案結構

```text
order_sys_V2/
├── frontend/
│   ├── src/                 # React 畫面與樣式
│   ├── package.json         # 前端套件需求
│   ├── package-lock.json    # 前端套件鎖定版本
│   └── Dockerfile
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI 入口與健康檢查
│   │   ├── database.py      # 資料庫連線與 session
│   │   └── models.py        # 資料模型初稿
│   ├── migrations/          # 資料表版本更新
│   ├── tests/               # 資料庫驗證
│   ├── alembic.ini
│   ├── requirements.txt
│   └── Dockerfile
├── docs/DATABASE.md
├── compose.yaml             # 前後端服務與掛載設定
└── README.md
```
