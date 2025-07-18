import { createChain } from './handlersBox/index.js'

export default {
  name: 'handlerPlugin',
  	components: { createChain },
  template: `
    </div>
      <h2>責任鏈模式測試 - handlerPlugin</h2>
      <div class="btSet">
        <input v-model="inputText" placeholder="輸入文字" />
        <button @click="runChain">執行流程</button>
      </div>
      <p>結果: {{ result }}</p>
    </div>
  `,

  data() {
    return {
      inputText: '',
      result: '',
      chain: createChain()
    };
  },

  computed: {},

  mounted() {
    // console.log(this.routes);
  },

  methods: {

    runChain() {
      const payload = { text: this.inputText }
      const output = this.chain.handle(payload)
      this.result = output?.text || '處理失敗'
    },
  },
};
