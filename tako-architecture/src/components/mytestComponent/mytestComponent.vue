<!-- components/newComponent/newComponent.vue -->
<template lang="pug">
.mytestComponent-template
  h2 新增mytestComponent元件 ~~~~ 1
  p 這裡綁定 testStore 資料達到跨元件資料處理。
  input(v-model="myTest.name", placeholder="請輸入文字")
  button.btn(@click="say") Submit

</template>

<script>
import { container } from "@/containers/index-dist.js"; 

const tempStore = container.resolve('tempStore')
// 設定臨時條件
tempStore.set('myTest.name', 'ＯＴＴＯ')


export default {
  name: 'newComponent',
  // components: { XXXXXXXXXX },
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
</script>

<style lang="stylus" scoped>

.mytestComponent-template 
  padding: 1rem
  background: #f2f2f2
  border: 1px dashed #999

  h2 
    color: #abc660
    
</style>

