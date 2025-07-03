import { container } from "@/containers/index.js";

const tempStore = container.resolve('tempStore')

const ComponentTemplate = {
  name: 'ComponentTemplate',
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
      myTest: tempStore.get()||{}
    }
  },
  methods: {},
  created() {

  },
}
export { ComponentTemplate }
export default ComponentTemplate;
