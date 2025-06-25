// 主程式檔案
import { createVueApp } from "@Vue";

import conApp from "@/plugins/app.js";
import listComponent from "@/components/listComponent.js";
import menuComponent from "@/components/menuComponent.js";
import DefaultLayout from "@/layouts/DefaultLayout.js";

// - 容器模式製作 store
import { container } from "@/containers/index.js";



// // 使用服務
const urlUtils = container.resolve('urlUtils')
const pageName = urlUtils.getPageName()

//--取得資料都使用api---
import { api } from "./api/index.js";

api.post("/api/login", {
    username: "test",
    password: "123456",
  })
  .then((res) => {
    // console.log(res);
    const token = res.token;
    container.register("token", token); // 註冊 Token 到容器（或 store）
    const tokenStore = container.resolve('tokenStore');
    tokenStore.setToken(token);
    console.log("---登入了---token : " + tokenStore.getToken());
  });


// 將本頁的js import 進入主程式

const loadPageModule = async (page) => {
  try {
    const module = await import(`/design-pattern-lab/src/pages/${page}.js`);
    if (module && module.init) {
      module.init();
    }
  } catch (err) {
    console.error(`頁面模組 ${page} 無法載入:`, err);
  }
};

document.addEventListener("DOMContentLoaded", async () => {
  const page = urlUtils.getPageName();
  // if(page!=='login') createMenu(routes); // 排除登入頁面加載菜單
  if(page) loadPageModule(page);

});



// Vue 已由 VueContext.js 掛到 window.Vue，不需要再 import Vue
const { defineComponent } = window.Vue;

// App 元件使用 template 字串寫法
const App = defineComponent({
  name: "App",
  components: { DefaultLayout, menuComponent, conApp,listComponent },
  data() {
    return {
      pickMe: true,
      testBox: '測試用內容~~'
    };
  },
  template: `
    <DefaultLayout :testBox="testBox">
      <template #nav>
        <menuComponent />
      </template>

      <template #menuL v-if="pickMe">
        <listComponent />
      </template>

      <template #conApp>
        <conApp  :testBox="testBox"/>
      </template>
    </DefaultLayout>
  `,
});

// 建立 App 並註冊全域元件與 plugin
const app = createVueApp(App);
app.mount("#app");
