# 這個模組是用來自訂 vue 的共用功能，之後要註冊到的模組區 app.use()
## 如： omponents/allComponents.js

# 若未來若有多個指令（如 v-can, v-focus, v-debounce），也可以整理為一個 directives/index.js 模組

例如：

---

// components/allComponents.js
// 註冊元件
const modules = await Promise.all([
  import('@/containers/directives/v-can.js'),
  import('@/containers/directives/v-focus.js'),
])

export default {
  install(app) {
    modules.forEach(mod => app.use(mod.default))
  }
}

---
