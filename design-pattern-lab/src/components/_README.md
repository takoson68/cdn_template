# 元件使用說明範例

!!!!!!!!!

# 這邊很重要！！！
如果元件給元件使用，就不要用index.js，而是直接抓component.js本身，
還有component.js需要將本身最後 轉出 export default ComponentTemplate;
而css 要另外置入到main.sass 
!!!!!!!!!

使用方式在目標頁面先 import 載入後，  
命名名稱如本範例 ComponentTemplate，  
在目標頁面最下面 app 部分注入。
__componentUtils.js  這一控制元件的函式原本放在容器中，
但是現在這專案比較小，將它放在元件資料夾會比較直觀！！！

!!!資料夾中如果有style.css檔案，就會自動注入 <head>
而css裡面內容是空的話，就會忽略






可以考慮在元件這邊採用
分層式架構

你若採用：

    @/components/base/ → 基礎 UI 元件

    @/components/common/ → 多處共用元件

    @/components/page/xxx/ → 頁面特化元件

    @/components/dialogs/ → 各種彈窗

    @/components/forms/ → 表單欄位元件

這種分層分類下，數百個元件非常合理。

components/
├─ base/           # 基礎原子元件
├─ common/         # 常用共用元件
├─ forms/          # 表單欄位元件
├─ layout/         # 頁面框架元件
├─ pageHome/       # Home 頁面專用元件
├─ pageProfile/
└─ dialogs/        # 各種彈窗



---

## 主程式

```js
import { createAutoInstaller } from '@/components/__componentUtils.js'


export default await createAutoInstaller(import.meta.url, {
  componentFile: 'component.js',
  exportName: 'ComponentTemplate' //- 元件的name
})

```

-----------------------------------------

## 下面是使用說明

```js
import PaginationComponent from '@/components/pagination-module/index.js'
import ComponentTemplate from '@/components/component-template/index.js'

// ...其他程式碼...

const app = createVueApp(App);

// 也可以用 use()，會自動執行函式中的 install()
// DefaultLayout 從這邊載入註冊
app.use(allComponents)   // 常駐 元件註冊並注入 CSS
app.use(pageComponents)   // 集中分頁 元件註冊並注入 CSS

app.mount("#app");

```
＃原始使用方式，因為希望共用所以把它拆出去到containers




