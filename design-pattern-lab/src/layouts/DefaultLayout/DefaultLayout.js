// @/components/DefaultLayout.js
import menuComponent from "@/components/menuComponent/index.js";
import listComponent from "@/components/listComponent/index.js";
const DefaultLayout = {
  name: "DefaultLayout",
  components: { menuComponent ,listComponent},
  props: {
    indexPage: {
      type: String,
      required: false, // 改為非必填
      default: ''
    },
    showMenu: {
      type: Boolean, 
      required: false, // 改為非必填
      default: true    // 預設為 true，表示顯示 listComponent
    },
    testBox: {
      type: String,
      required: false // false為非必填
    },
  },
  template: `
    <div class="layout-container">
      <header class="layout-header">
      <menuComponent />
      </header>

      <main :class="'layout-main'+' '+ indexPage">
        <div class="containerBox">

          <listComponent v-if="showMenu" />

          <slot name="coverNoMemu">
            <!-- 左邊calendar月曆 (可以在不顯示菜單的地方插入元件) -->
          </slot>

          <slot name="conApp">
            <!-- 頁面主內容會顯示在這裡 -->
          </slot>
        </div>
      </main>

      <footer class="layout-footer">
        <p>© 2025 My Website
          <b v-if="!!testBox"> {{ testBox }} </b>
        </p>
      </footer>
    </div>
  `,
  data() {
    return {
      // routes: menuStore.getMenu(),
    };
  },

  computed: {},

  mounted() {
    // console.log(this.langDD);
  },

  methods: {},
}

export { DefaultLayout }
export default DefaultLayout;
