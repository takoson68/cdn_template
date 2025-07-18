// @/components/modalComponent.js

import coverComponent from '@/components/coverComponent/index.js'
const modalComponent = {
  components: { coverComponent },
  props: ['title', 'data', 'editableFields'],
  data() {
    return {
      localData: Object.assign({}, this.data), // 深拷貝數據以便修改
    };
  },
  template: `
    <coverComponent :title="title">
      <!-- 這裡是表單內容 -->
      <form @submit.prevent="handleSave">
        <div v-for="field in editableFields" :key="field[0]" class="form-item">
          <label :for="field[0]">{{ field[1] }}：</label>
          <template v-if="isTextField(localData[field[0]])">
            <input :type="getInputType(localData[field[0]])" :id="field[0]" v-model="localData[field[0]]" />
          </template>
          <template v-else-if="isBooleanField(localData[field[0]])">
            <input type="checkbox" :id="field[0]" v-model="localData[field[0]]" />
          </template>
          <template v-else>
            <input type="text" :id="field[0]" v-model="localData[field[0]]" />
          </template>
        </div>

        <div class="actions">
          <button type="button" @click="closeModal">取消</button>
          <button type="submit">保存</button>
        </div>
      </form>
    </coverComponent>
  `,
  methods: {
    handleSave() {
      this.$emit('save', this.localData); // 向父層傳遞保存的數據
    },
    closeModal() {
      this.$emit('close'); // 向父層通知關閉
    },
    getInputType(value) {
      if (typeof value === 'number') return 'number';
      if (typeof value === 'string') {
        return value.includes('@') ? 'email' : 'text';
      }
      if (Object.prototype.toString.call(value) === '[object Date]') return 'date';
      return 'text';
    },
    isTextField(value) {
      return typeof value === 'string' || typeof value === 'number';
    },
    isBooleanField(value) {
      return typeof value === 'boolean';
    },
  },
};


export { modalComponent }
export default modalComponent;
