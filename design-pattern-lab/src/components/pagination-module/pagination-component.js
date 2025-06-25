import modalComponent from '@/components/modalComponent/index.js'

const PaginationComponent = {
  components: { modalComponent },
  name: 'PaginationComponent',
  props: {
    items: {
      type: [Array, Object],
      required: true,
      default: () => [],
    },
    pageSizeOptions: {
      type: Array,
      default: () => [5, 10, 20, 30],
      validator: (val) => val.every(n => typeof n === 'number'),
    },
    columns: {
      type: Array,
      default: () => [], // 若未傳入，將自動從第一筆資料推斷 key
    },
    showset: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      currentPage: 1,
      pageSize: 5,
      modalTitle: '',
      modalData: null, // 只用來存放當前彈窗的數據
      editableFields:[['id','帳號'],['name','名稱'], ['age','年齡'], ['email','電子信箱']], // 僅允許修改 `name` 和 `email`,'age'
      dataFlex: [
        ['id','帳號', 3],
        ['name','名稱', 5],
        ['age','年齡', 1],
        ['email','電子信箱', 6],
        ['date','日期', 3],
      ] // 這個來控制顯示資料的css寬度設定flex
    }
  },
  computed: {
    normalizedItems() {
      // 防呆處理：保證 items 是 Array
      if (Array.isArray(this.items)) return this.items
      if (typeof this.items === 'object' && this.items !== null) return Object.values(this.items)
      return []
    },
    totalPages() {
      return Math.ceil(this.normalizedItems.length / this.pageSize)
    },
    paginatedItems() {
      const start = (this.currentPage - 1) * this.pageSize
      return this.normalizedItems.slice(start, start + this.pageSize)
    },
    displayColumns() {
      if (this.columns.length > 0) return this.columns
      const firstItem = this.paginatedItems[0]
      return firstItem ? Object.keys(firstItem) : []
    },
    fieldDisplayMap() {
      const map = {}
      this.dataFlex.forEach(([key, label, flex = 1]) => {
        map[key] = { label, flex }
      })
      return map
    },
  },
  methods: {
    changePage(page) {
      this.currentPage = page
    },
    changeSize(size) {
      this.pageSize = size
      this.currentPage = 1
    },
    // showModal(title, user) {
    //   alert(`Modal: ${title}\n\n${JSON.stringify(user, null, 2)}`)
    // }
    showModal(title, data) {
      this.modalTitle = title;
      this.modalData = data; // 傳入需要編輯的數據
    },
    closeModal() {
      this.modalData = null; // 清除彈窗數據
    },
    saveData(updatedData) {
      console.log('保存的數據：', updatedData);
      const userIndex = this.items.findIndex(user => user.id === updatedData.id);
      if (userIndex !== -1) {
        this.items[userIndex] = { ...updatedData }; // 直接更新數組中的對應物件
      }
      this.closeModal(); // 關閉彈窗
    }
  },
  template: `
    <div class="pagination-wrapper">
      <div class="controls">
        <label>
          每頁顯示：
          <select v-model.number="pageSize" @change="changeSize(pageSize)">
            <option v-for="option in pageSizeOptions" :key="option" :value="option">
              {{ option }}
            </option>
          </select>
        </label>
      </div>

      <ul class="userBox"> 
        <li v-for="(user, ind) in paginatedItems" :key="user.id || ind">
          <div>
            <b class="nbr">{{ ind + 1 }}</b>
            <span v-for="field in displayColumns" :style="{ flex: (fieldDisplayMap[field]?.flex || 1) }" :key="field">
              {{ user[field] ?? '無資料' }}
            </span>
            <b v-if="showset && user.age !== '無資料'" class="showsetBtn" @click="showModal('修改用戶資訊', user)" title="修改">
              <i class="fa fa-cog"></i>
            </b>
          </div>
        </li>
        <!-- 🔧 這裡是補空白行 -->
        <li v-for="n in pageSize - paginatedItems.length" :key="'blank-' + n" class="blank-row">
          <div>&nbsp;</div>
        </li>
      </ul>

      <div class="pagination">
        <button :disabled="currentPage === 1" @click="changePage(currentPage - 1)">上一頁</button>
        <span>第 {{ currentPage }} / {{ totalPages }} 頁</span>
        <button :disabled="currentPage === totalPages" @click="changePage(currentPage + 1)">下一頁</button>
      </div>

      <modalComponent
        v-if="modalData"
        :title="modalTitle"
        :data="modalData"
        :editable-fields="editableFields"
        @close="closeModal"
        @save="saveData" />
    </div>
  `,
}

export { PaginationComponent }
export default PaginationComponent;
