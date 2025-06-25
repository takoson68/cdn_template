// @/pages/home/index.js

import { createVueApp, defineComponent } from "@Vue";
import allComponents from "@/pages/_allComponents.js";
import pageComponents from "@/pages/home/_pageComponents.js";

export const initPage = async ({ container, api }) => {
  const App = defineComponent({
    name: "homeApp",
    template: `
      <DefaultLayout :indexPage="indexPage" :testBox="testBox">
        <template #conApp>
          <div class="conApp">
            <div class="btSet">
              <button v-can="'post:edit'" @click="testToken"> 過期測試  </button>
              <button v-can="'user:view'" @click="seedToPage"> 傳出檔案 </button>
              <a href='./about.html?foo=123&bar=test'>傳出檔案2</a>
            </div>
            <br />
            <br />
            <hr>
            <todoListComponent />
            

          </div>
        </template>
      </DefaultLayout>
    `,
    data() {
      return {
        // langDD: lang.langData,
        indexPage: "home",
        testBox: "這是 home 頁面的內容 test!!",
      };
    },
    created() {
      const testStore = container.resolve("testStore");
      console.log(container);
      console.log("testStore :", testStore.get());
    },
    methods: {
      testToken() {
        api.get("/api/users").then((res) => {
          const data = res.data;

          console.log(res);
        });
      },
      seedToPage() {
        const pageDataBridge = container.resolve("pageDataBridge");
        pageDataBridge.send(
          { userId: 123, token: "abc123" },
          "./about.html?foo=123456&abcc=test&vvv=111"
        );
      },
    },
  });

  const app = createVueApp(App);
  // DefaultLayout 從這邊載入註冊
  app.use(allComponents); // 常駐 元件註冊並注入 CSS
  app.use(pageComponents); // 集中分頁 元件註冊並注入 CSS

  app.mount("#app");
};
