// @/components/listComponent.js
import { container } from "/design-pattern-lab/containers/index.js"; // 將 tokenStore 註冊在這裡
const menuStore = container.resolve("menuStore");

//--取得資料都使用api---
import { api } from "/design-pattern-lab/api/index.js";

const listComponent = {
  name: "listComponent",
  template: `
    <nav class="listMenu">
      <ul>
        <li v-for="route in routes" :key="route.path">
          <a v-if="route.path !== ''" :href="route.path" :data-lang="route.meta.lang">
            {{ route.meta.title }}
          </a>
          <a v-else :id="'i18n-'+route.component" :data-lang="route.meta.lang">
            {{ route.meta.title }}
          </a>

          <ul v-if="route.children && route.children.length > 0">
            <li v-for="child in route.children" :key="child.path || child.component">
              <a v-if="child.path !== ''" :href="child.path" :data-lang="child.meta.lang">
                {{ child.meta.title }}
              </a>
              <a v-else :id="'i18n-'+route.component" :data-lang="child.meta.lang">
                {{ child.meta.title }}
              </a>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  `,

  data() {
    return {
      routes: menuStore.get(),
    };
  },

  computed: {},
  created() {
    if (!this.routes) {
      api.get("/api/menu").then((res) => {
        console.log(res.data);
        const menu = res.data;
        menuStore.set(menu);
        this.routes = menu;
      });
    }
  },
  mounted() {
    // console.log(this.routes);
  },

  methods: {},
};


export { listComponent }
export default listComponent;
