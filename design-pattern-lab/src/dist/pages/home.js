import { defineComponent, createVueApp } from '@Vue';
import { c as createAutoInstaller } from './__componentUtils-3Xzt3v_F.js';
import '@/containers/style-container.js';

// components/allComponents.js


// 註冊元件
const modules = await Promise.all([
  import('./index-VYaqqu08.js'),
  import('@/containers/directives/v-can.js'),
  // import('@/components/listUseStarTemp/index.js'),
  // import('@/components/ratingStarComponent/index.js'),
]);

var allComponents = {
  install(app) {
    modules.forEach(mod => app.use(mod.default));
  }
};

// index.js

var menuComponent = await createAutoInstaller(import.meta.url, {
  componentFile: 'menuComponent.js',
  exportName: 'menuComponent' //- 元件的name
});

// index.js

var todoListComponent = await createAutoInstaller(import.meta.url, {
  componentFile: 'todoListComponent.js',
  exportName: 'todoListComponent' //- 元件的name
});

// @/pages/home/_pageComponents.js


var pageComponents = {
  install(app) {
    const modules = [
      menuComponent,
      todoListComponent
    ];

    modules.forEach(component => {
      if (component.name) {
        app.component(component.name, component);
      } else {
        console.warn('Component missing name:', component);
      }
    });
  }
};

// @/pages/home/index.js

// import Components from '@/components/components.js'  // 路徑依你實際調整

const initPage = async ({ container, api }) => {
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
        testBox: "這是 home 頁面的內容 test!! 確定能上傳了嗎～～～～",
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
          res.data;

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
  // app.use(Components)
  app.mount("#app");
};

export { initPage };
