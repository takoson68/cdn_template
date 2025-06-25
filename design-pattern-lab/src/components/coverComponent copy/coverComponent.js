const coverComponent = {
  props: ['title'],
  data() {
    return {
    };
  },
  template: `
    <div class="modal-overlay">
      <div class="modal">
        <h2 v-if="title">{{ title }}</h2>
        <!-- 使用 slot 傳入動態內容 -->
        <div class="modal-content">
          <slot></slot>
        </div>
        <!-- 操作按鈕 -->
        <span class="clo" @click="closeModal" title="關閉">X</span>
      </div>
      <div class="bgEvent" @click="closeModal"></div>
    </div>
  `,
  methods: {
    closeModal() {
      this.$emit('close'); // 向父層通知彈窗已關閉
    },
  },
};

export { coverComponent }
export default coverComponent;
