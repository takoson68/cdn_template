// 🚀 此檔案由 rollup.config.mjs 自動產生
import mytestComponent from './mytestComponent/mytestComponent.vue'
import newComponent from './newComponent/newComponent.vue'

export {
  mytestComponent,
  newComponent
}

export default {
  install(app) {
    app.component('mytestComponent', mytestComponent)
    app.component('newComponent', newComponent)
  }
}
