// @/pages/about/index.js

import { createVueApp, defineComponent } from "@Vue";
import Components from '@/components/components.js'  // 路徑依你實際調整
import vueComponents from '@/components/vueComponents.js'  // 路徑依你實際調整


export const initPage = async ({ container, api }) => {
  // 可加載資料、做權限驗證、登入等
  const tokenStore = container.resolve("tokenStore");

  const App = defineComponent({
    name: "aboutApp",
    template: `
      <DefaultLayout :testBox="testBox">
        <template #conApp>
          <div class="conApp">
            <newComponent />
            <mytestComponent />
            <componentTemplate />
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
        editableFields: [['id', '帳號'], ['name', '名稱'], ['age', '年齡'], ['email', '電子信箱']], // 僅允許修改 `name` 和 `email`,'age'
        //- columns 想要顯示的參數
        columns: ['name', 'email', 'age', 'date'],
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
      async callData() {
        const data = await api.get('/api/data');
        this.items = data.data
        console.log('Data:', data.data);
      }
    },
  });

  const app = createVueApp(App);
  // DefaultLayout 從這邊載入註冊
  app.use(Components)
  app.use(vueComponents)

  app.mount("#app");

};
