// @/pages/about/index.js

import { createVueApp, defineComponent } from "@Vue";
//- 常駐元件下載
import allComponents from "@/pages/_allComponents.js"
//- 集中分頁元件下載
import pageComponents from "@/pages/about/_pageComponents.js"


export const initPage = async ({ container, api }) => {
  // 可加載資料、做權限驗證、登入等
  const tokenStore = container.resolve("tokenStore");

  const App = defineComponent({
    name: "aboutApp",
    // components: { DefaultLayout }, //- 模板DefaultLayout 從最下面app.cue(allComponents)那邊注入
    template: `
      <DefaultLayout :testBox="testBox">
        <template #conApp>
          <div class="conApp">
            <ComponentTemplate />
        
            <hr>
            <PaginationComponent :showset="true" :editable-fields="editableFields" :items="items" :columns="columns"/>
            <hr>
            <listUseStarTemp :items="items"/>
          </div>
        </template>
      </DefaultLayout>
    `,
    data() {
      return {
        indexPage: "about",
        testBox: "這是 about 頁面的內容",
        items: [],
        // items: Array.from({ length: 42 }, (_, i) => `項目 ${i + 1}`)
        editableFields:[['id','帳號'],['name','名稱'], ['age','年齡'], ['email','電子信箱']], // 僅允許修改 `name` 和 `email`,'age'
        //- columns 想要顯示的參數
        columns: ['name' , 'email', 'age','date'],
        rating: 3,
      };
    },
    created() {
      //- 取得跨頁資訊--------------------
      const pageDataBridge = container.resolve("pageDataBridge");

      const receivedData = pageDataBridge.receive();
      console.log("跨頁資料：", receivedData);

      this.callData()
    },
    methods: {
      async callData(){
        const data = await api.get('/api/data');
        this.items = data.data
        console.log('Data:', data.data);
      }
    },
  });

  const app = createVueApp(App);
  // DefaultLayout 從這邊載入註冊
  app.use(allComponents)   // 常駐 元件註冊並注入 CSS
  app.use(pageComponents)   // 集中分頁 元件註冊並注入 CSS
  
  app.mount("#app");

};
