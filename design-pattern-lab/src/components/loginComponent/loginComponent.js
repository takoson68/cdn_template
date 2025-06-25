// @/components/loginComponent.js
import { defineComponent, ref, onMounted } from "@Vue";
import { container } from "@/containers/index.js"; 

const langStore = container.resolve("languageStore");

const loginComponent = defineComponent({
  name: "loginComponent",
  emits: ["submit", "cancel"],
  setup(_, { emit }) {
    const username = ref("admin");
    const password = ref("123456");

    const onSubmit = (e) => {
      e.preventDefault();
      if (!username.value || !password.value) {
        alert("請輸入帳號與密碼");
        return;
      }
      emit("submit", { username: username.value, password: password.value });
    };

    onMounted(() => {
      langStore.replaceMenuLang();
    });

    const cancelLogin = () => {
      emit("cancel"); // 通知父層取消
    };

    return { username, password, onSubmit, cancelLogin };
  },
  template: `
    <form @submit="onSubmit" class="login-form" aria-label="登入表單">
      <label for="username"><b data-lang="cont_lang_03">帳號：</b>
        <input
          id="username"
          type="text"
          v-model="username"
          required
          autocomplete="username"
          data-i18n-placeholder="cont_lang_01"
          aria-required="true"
        />
      </label>
      <label for="password"><b data-lang="cont_lang_04">密碼：</b>
        <input
          id="password"
          type="password"
          v-model="password"
          required
          autocomplete="current-password"
          data-i18n-placeholder="cont_lang_02"
          aria-required="true"
        />
      </label>
      <div class="btnBox">
        <button type="button" @click="cancelLogin">取消</button>
        <button type="submit" data-lang="cont_lang_05">登入</button>
      </div>

    </form>
  `,
});

export { loginComponent };
export default loginComponent;
