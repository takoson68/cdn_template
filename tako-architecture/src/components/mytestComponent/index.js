// @/components/mytestComponent.js
import { container } from "@/containers/index-dist.js"; 

const tempStore = container.resolve('tempStore')
// 設定臨時條件
tempStore.set('myTest.name', 'ＯＴＴＯ')

const mytestComponent = {
  name: 'mytestComponent',
  template: `
    <div class="mytestComponent-template">
      <h2>新增mytestComponent元件 ~~~~ </h2>
      <p>這裡綁定 testStore 資料達到跨元件資料處理。</p>
      <input v-model="myTest.name" placeholder="請輸入文字"/>
      <button class="btn" @click="say">Submit</button>
    </div>
  `,
  props: {},
  data() {
    return {
      myTest: tempStore.get().myTest
    }
  },
  methods: {
    say(){
      console.log(this.myTest.name);
      tempStore.set('myTest.name', this.myTest.name)
    },
  },
  created() {
    let n = tempStore.get() || '無名稱';
    console.log('mytestComponent created:', n);
    console.log(tempStore.get().myTest);
  },
}

export { mytestComponent }
export default mytestComponent;
