# V2 資料庫初稿

這是五個模組共用的起點，不代表登入、訂單、扣庫存或異常檢核功能已完成。
使用 SQLite、SQLAlchemy 與 Alembic；Docker 中使用 Python 3.12。

## 資料表

| 表 | 用途 | 主要關聯 |
| --- | --- | --- |
| roles | 角色名稱，唯一 | 一個角色可有多個使用者 |
| users | 帳號、密碼雜湊、啟用狀態 | role_id → roles |
| products | SKU、名稱、單價、啟用狀態 | SKU 唯一 |
| orders | 訂單編號、狀態、建立人 | created_by → users，可空 |
| order_items | 訂單商品、數量、當時單價 | order_id → orders；product_id → products |
| stock_movements | 庫存增減與原因 | product_id → products；可關聯訂單和操作人 |
| anomalies | 規則代碼、描述、處理狀態 | 至少關聯一筆訂單或商品 |

首頁透過查詢上述資料取得統計，不需要獨立資料表。
外鍵已啟用，避免不存在的關聯；有紀錄被引用時不允許直接刪除。
商品與使用者可透過 is_active 停用，保留歷史紀錄。

## 暫定假設與待討論事項

- 一個使用者對應一個角色，尚未建立權限矩陣，也沒有預設帳密。password_hash 只應存安全密碼雜湊，不能存明碼。
- 單一庫存範圍，數量使用整數。庫存量為該商品所有 quantity_delta 的總和；無紀錄視為 0。入庫為正、出庫為負，不額外儲存另一份庫存餘額。
- 尚未限制負庫存；何時扣庫存、取消如何回補、重複請求如何防止，必須在業務流程與交易設計時確認。
- 金額以整數最小貨幣單位保存，禁止負值；例如採用「分」時，100 代表 1 元。上線前需統一幣別與單位，目前不支援多幣別。
- 訂單明細保留當時單價，不受商品改價影響。訂單總額可由數量乘單價加總，尚無折扣、稅額或運費設計。
- 訂單預設 draft、異常預設 open；完整狀態清單與轉換規則尚未定案，所以尚未用資料庫限制清單。
- 建立時間使用資料庫 CURRENT_TIMESTAMP（SQLite 為 UTC），顯示時再轉換為使用者時區。
- 客戶、付款、多倉庫、小數數量、異常處理人及處理歷程等需求尚待確認。

## 啟動與資料保存

在 V2 根目錄執行：

```sh
docker compose up --build -d
docker compose exec backend alembic current
```

後端啟動時先執行 `alembic upgrade head`，成功後才啟動 API。第一次建立資料表，之後只執行尚未套用的版本，不會在每次登入時重新建表。
資料存於 Docker 的 sqlite_data volume，容器內路徑為 /data/orders.db。
每位組員有自己的本機資料庫；Git 分享的是模型與 migration，不是 .db 檔案。
`docker compose down` 保留資料，`docker compose down -v` 會刪除資料。
有既存且同名、未納入 Alembic 的資料表時，先備份並檢查，不能直接 stamp 或刪除。

## 修改資料表

由一人統整 migration，各模組負責人提出需求。修改 app/models.py 後：

```sh
docker compose exec backend alembic revision --autogenerate -m "describe change"
# 檢查新產生的 migration；確認資料轉換、預設值及升降版行為。
docker compose exec backend alembic upgrade head
docker compose exec backend alembic check
```

不要修改已套用的歷史 migration，不要用 create_all 更新舊表。
migration 與 alembic.ini 已掛載，修改它們不必重建映像，但需要執行 upgrade。
改 requirements.txt 或 Dockerfile 才需要重建後端。資料庫結構變更前先備份；降版可能刪除資料。

## 驗證

在 V2 根目錄執行，測試只使用暫存資料庫：

```sh
docker compose run --rm --no-deps -v "$PWD/backend/tests:/tests:ro" backend python -m unittest discover -s /tests -v
```

涵蓋升版、重複升版、模型與 migration 一致性、關聯和金額／數量限制、庫存加總及暫存資料庫降版後再升版。
