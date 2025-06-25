// @/components/menuComponent.js

import { nextTick } from "@Vue";
import loginComponent from "@/components/loginComponent/index.js";
import { container } from "@/containers/index.js"; // 將 tokenStore 註冊在這裡
const menuStore = container.resolve("menuStore");
const tokenStore = container.resolve("tokenStore");
const langStore = container.resolve("languageStore");
const permissionStore = container.resolve('permissionStore')
//--取得資料都使用api---
import { api } from "@/api/index.js";

const menuComponent = {
  name: "menuComponent",
  components: {
    loginComponent 
  },
  template: `
    <nav class="topMenu">
      <ul>
        <li v-for="route in routes" :key="route.path">
          <a v-if="route.path !== ''" :href="route.path" :data-lang="route.meta.lang">
            {{ langDD[route.meta.lang] }}
          </a>
          <a v-else :data-lang="route.meta.lang">
            {{ langDD[route.meta.lang] }}
          </a>

          <ul v-if="route.children && route.children.length > 0" :id="'i18n-'+route.component">
            <li v-for="child in route.children" :key="child.path || child.component">
              <a v-if="child.path !== ''" :href="child.path" :data-lang="child.meta.lang">
                {{ langDD[child.meta.lang] }}
              </a>
              <a v-else @click="setLangDD(child.component)" :id="'i18n-'+child.component" :data-lang="child.meta.lang">
                {{ langDD[child.meta.lang] }}
              </a>
            </li>
          </ul>
        </li>
      </ul>
      <button v-can="'post:edit'" class="login_btn" @click="logout">
        <b>登出</b>
      </button>
      <button v-if="!token" class="login_btn" @click="toggleLogin">
        <i class="fa fa-address-card" aria-hidden="true"></i>  
        <b data-lang="cont_lang_05">登入</b>
      </button>

      <div v-if="showLogin" class="bgGary">
        <loginComponent @submit="handleLogin" @cancel="cancelLogin" />
      </div>
    </nav>
  `,

  data() {
    return {
      routes: menuStore.get()||[],
      showLogin: false,
      langDD: langStore.langData,
      language: langStore.getLanguage(),
      token: tokenStore.get()||'',
    };
  },

  created() {
    if (!this.routes.length) { //- 預設應該要給空陣列所以靠長度判斷
      api.get("/api/menu").then((res) => {
        const menu = res.data;
        menuStore.set(menu);
        this.routes = menu;
      });
    }
    //- 若是查不到token執行
    if (!tokenStore.get()) {
      this.showLogin = true;
    }
  },
  methods: {
    async setLangDD(lang) {
      await langStore.setLanguage(lang); // 等待語言載入完成
      this.langDD = langStore.getLangData(); // 確保是最新資料

      await nextTick(); // 等畫面 DOM 更新完畢（nextTick）之後執行
      langStore.replaceMenuLang();
    },
    toggleLogin() {
      this.showLogin = !this.showLogin;
    },
    handleLogin(payload) {
      console.log("登入資訊：", payload);
      // 可執行登入請求等行為

      api.post("/api/login", payload).then((res) => {
        if (res.code === 200) {
          const token = res.token;
          tokenStore.set(token);
          const permissions = res.permissions; // 寫入權限
          permissionStore.set(permissions)

          // this.showLogin = false; // 登入成功後自動隱藏登入元件
          location.reload() //- 重整後就不需要改showLogin

        } else {
          alert(res.message);
        }
      });
    },
    cancelLogin() {
      this.showLogin = false; // 關閉登入視窗
    },
    logout(){
      tokenStore.clear();
      permissionStore.clear();
      location.reload()
    },
  },
  mounted() {
    this.setLangDD(this.language);
  },
};

export { menuComponent };
export default menuComponent;
