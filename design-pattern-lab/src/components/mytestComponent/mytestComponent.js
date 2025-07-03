// @/components/mytestComponent.js
import { container } from "@/containers/index.js"; 

const tempStore = container.resolve('tempStore')
// 設定臨時條件
tempStore.set('myTest.name', 'ＯＴＴＯ')

const mytestComponent = {
  name: 'mytestComponent',
  template: '#mytestComponent',
  props: {},
  data() {
    return {
      myTest: tempStore.get()
    }
  },
  methods: {
    say(){
      console.log(this.myTest.name);
    },
  },
  created() {
    console.log(container);
  },
}

export { mytestComponent }
export default mytestComponent;
