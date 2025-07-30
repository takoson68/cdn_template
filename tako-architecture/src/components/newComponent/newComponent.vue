<!-- components/newComponent/newComponent.vue -->
<template lang="pug">
.component-template
  h2 {{myTest.name}} ~~~~~
  p 這是元件 {{ myTest.name }} 模板!!!!!
  p 資料是從mytestComponent模板使用store更新，達成跨元件同步資料

</template>

<script>
import { container } from "@/containers/index-dist.js";

const tempStore = container.resolve('tempStore')

export default {
  name: 'newComponent',
  // components: { XXXXXXXXXX },
  props: {},
  data() {
    return {
      myTest: tempStore.get().myTest||{}
    }
  },
  methods: {},
  created() {

  },
}
</script>

<style lang="stylus" scoped>

.component-template 
  padding: 1rem
  border: 1px solid #ccc
  background-color: #42b983
  font-family: sans-serif
  border-radius: .5em
  color: #ffffff


</style>

