import { container } from "@/containers/index-dist.js";

const tempStore = container.resolve('tempStore')

const componentTemplate = {
  name: 'componentTemplate',
  template: `
    <div class="component-template">
      <h2>{{myTest.name}}</h2>
      <p>這是元件模板!!!!!</p>
      <p>資料是從mytestComponent模板使用store更新，達成跨元件同步資料</p>
    </div>
  `,
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
export { componentTemplate }
export default componentTemplate;
