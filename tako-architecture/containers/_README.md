# framework/ 這個資料夾的函式，
# 不註冊到 containers/index.js 給介面使用

## 專心處理架構用的共用函式
### 不會在index.js註冊
### style-container.js 樣式也不會註冊進入index.js


containers/
├── index.js               # UI 層統一入口
├── style-container.js     # 樣式層 派發至head
├── stores/                # 全部狀態容器
├── services/              # 通用服務工具（UI 可用）
├── framework/             # 🔥 系統架構工具（UI 不使用）
│   ├── componentUtils.js
│   ├── eventBusAdapter.js
│   └── mockBridge.js
├── utils/                 # 這裡是放通用工具函式
├── directives/            # 自訂指令 如：v-can


