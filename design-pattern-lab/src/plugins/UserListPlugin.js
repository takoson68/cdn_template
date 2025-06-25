// UserListPlugin.js
import { container } from "./ContainerPattern/_ServiceContainer.js"; //容器模式
import "./ContainerPattern/serviceRegistration.js"; // 確保所有服務已註冊完成

export default {
  name: "UserListPlugin",
  setup() {
    const { ref, onMounted } = window.Vue;

    const users = ref([]);
    const newUser = ref('') // 用來綁定新增的使用者名稱

    const logger = container.resolve("logger");
    const userService = container.resolve("userService");
    
    onMounted(() => {
      logger.log("載入使用者清單中...");
      users.value = userService.getAllUsers();
    });

    // 新增使用者的方法
    const addUser = () => {
      if (newUser.value) {
        userService.addUser(newUser.value) // 新增使用者
        users.value = userService.getAllUsers() // 更新使用者列表
        newUser.value = '' // 清空輸入框
      }
    }

    return {
      users,newUser, addUser
    };
  },

  template: `
    <div>
      <h2>使用者列表（容器模式）UserListPlugin</h2>
      <ul>
        <li v-for="user in users" :key="user">{{ user }}</li>
      </ul>
      <div class="btSet">
        <input v-model="newUser" placeholder="輸入新使用者名稱" />
        <button @click="addUser">新增使用者</button>
      </div>
    </div>
  `,
};
