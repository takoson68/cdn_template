// @/components/todoListComponent.js
import { container } from '@/containers/index-dist.js'

const todoStore = container.resolve('todoStore')

const todoListComponent = {
  name: 'todoListComponent',

  // template: `
  //   <div class="todo-container">
  //     <h2>📋 待辦清單</h2>
  //     <hr>
  //     <input
  //       v-model="newItem"
  //       type="text"
  //       placeholder="輸入新任務"
  //       @keyup.enter="addItem"
  //       class="todo-input"
  //     />

  //     <ul class="todo-list">
  //       <li v-for="(item, index) in items" :key="index">
  //         <span @click="toggleItem(index)">
  //           {{ item.text }}<br>
  //           <small>{{ item.createdAt }}</small>
  //         </span>
  //         <button @click="removeItem(index)">✕</button>
  //       </li>
  //     </ul>
  //   </div>
  // `,
  template: '#todoListComponent',
  data() {
    return {
      newItem: '',
      items:  todoStore.get(),
    };
  },
  computed: {
  },
  methods: {
    addItem() {
      const text = this.newItem.trim();
      if (!text) return;
    
      const now = new Date();
      const timestamp = now.toLocaleString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });
    
      todoStore.addItem({
        text,
        createdAt: timestamp
      });
    
      this.newItem = '';
    },
    toggleItem(index) {
      // todoStore.toggleItem(index);
    },
    removeItem(index) {
      todoStore.removeItem(index);
    }
  }
}

export { todoListComponent }
export default todoListComponent;
