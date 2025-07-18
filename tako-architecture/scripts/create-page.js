#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const process = require('process')

const rawName = process.argv[2]
if (!rawName) {
  console.error('❌ 請輸入頁面名稱，例如：about')
  process.exit(1)
}

const folderName = rawName
const pageDir = path.resolve(`./design-pattern-lab/src/pages/${folderName}`)

if (fs.existsSync(pageDir)) {
  console.error(`❌ 資料夾已存在：${pageDir}`)
  process.exit(1)
}

fs.mkdirSync(pageDir, { recursive: true })

// index.js
fs.writeFileSync(
  path.join(pageDir, 'index.js'),
`// @/pages/${folderName}/index.js

import { createVueApp, defineComponent } from "@Vue";
import allComponents from "@/pages/_allComponents.js"
import pageComponents from "@/pages/${folderName}/_pageComponents.js"

export const initPage = async ({ container, api }) => {
  const tokenStore = container.resolve("tokenStore");

  const App = defineComponent({
    name: "${folderName}App",
    data() {
      return {
        indexPage: "${folderName}",
      };
    },
    template: \`
      <DefaultLayout :testBox="testBox">
        <template #conApp>
          <div class="conApp">
            <h1>頁面：{{ indexPage }}</h1>
          </div>
        </template>
      </DefaultLayout>
    \`,
    created() {
      console.log("新增頁面：", this.indexPage);
    }
  });

  const app = createVueApp(App);
  // DefaultLayout 從這邊載入註冊
  app.use(allComponents)   // 常駐 元件註冊並注入 CSS
  app.use(pageComponents)   // 集中分頁 元件註冊並注入 CSS
  
  app.mount("#app");
};
`)

// _pageComponents.js
fs.writeFileSync(
  path.join(pageDir, '_pageComponents.js'),
`// @/pages/${folderName}/_pageComponents.js

const modules = await Promise.all([
  // import('@/components/calendarComponent.js'),
  // import('@/components/tableComponent.js'),
]);

export default {
  install(app) {
    modules.forEach(mod => {
      const component = mod.default;
      if (component.name) {
        app.component(component.name, component);
      } else {
        console.warn('Component missing name:', component);
      }
    });
  }
}


`)



console.log(`✅ 頁面模組「${rawName}」已建立於：src/pages/${folderName}`)
