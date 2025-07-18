// @/components/tableComponent.js
import modalComponent from '@/components/modalComponent/index.js'

const tableComponent = {
  name: 'tableComponent',
  components: {
    modalComponent
  },
  template: `
    <ul class="userBox"> 
      <li v-for="(user,ind) in users" :key="user.id">
        <div>
          <b class="nbr">{{ ind + 1 }}</b>
          <span>{{ user.name }} - {{ user.age }} </span>
          <span>{{ user.email }}</span>
          <span>{{ user.date }}</span>
          <b v-if="showset" class="showsetBtn" v-show="user.age!=='無資料'" @click="showModal('修改用戶資訊', user)" title="修改">
            <i class="fa fa-cog"></i>
          </b>
        </div>
      </li>
    </ul>
    <modalComponent
      v-if="modalData"
      :title="modalTitle"
      :data="modalData"
      :editable-fields="editableFields"
      @close="closeModal"
      @save="saveData" />
  `,
  //-------- 使用this.$emit('close')來執行 @close="closeModal" --------
  data() {
    return {
      modalTitle: '',
      modalData: null, // 只用來存放當前彈窗的數據
      // editableFields: ['name','age', 'email'], // 僅允許修改 `name` 和 `email`,'age'
    };
  },
  props: ['users','showset','editableFields'],
  created() {

  },
  methods: {
    showModal(title, data) {
      this.modalTitle = title;
      this.modalData = data; // 傳入需要編輯的數據
    },
    closeModal() {
      this.modalData = null; // 清除彈窗數據
    },
    saveData(updatedData) {
      console.log('保存的數據：', updatedData);
      const userIndex = this.users.findIndex(user => user.id === updatedData.id);
      if (userIndex !== -1) {
        this.users[userIndex] = { ...updatedData }; // 直接更新數組中的對應物件
      }
      this.closeModal(); // 關閉彈窗
    }
    
  },
  mounted() {
  },
};

export { tableComponent }
export default tableComponent;
