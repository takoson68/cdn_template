// 🚀 此檔案由 generate-components-index.mjs 自動產生
import DefaultLayout from './DefaultLayout/index.js'
import calendarComponent from './calendarComponent/index.js'
import componentTemplate from './componentTemplate/index.js'
import coverComponent from './coverComponent/index.js'
import listComponent from './listComponent/index.js'
import listUseStarTemp from './listUseStarTemp/index.js'
import loginComponent from './loginComponent/index.js'
import menuComponent from './menuComponent/index.js'
import modalComponent from './modalComponent/index.js'
import mytestComponent from './mytestComponent/index.js'
import ratingStarComponent from './ratingStarComponent/index.js'
import tableComponent from './tableComponent/index.js'
import todoListComponent from './todoListComponent/index.js'

export {
  DefaultLayout,
  calendarComponent,
  componentTemplate,
  coverComponent,
  listComponent,
  listUseStarTemp,
  loginComponent,
  menuComponent,
  modalComponent,
  mytestComponent,
  ratingStarComponent,
  tableComponent,
  todoListComponent,
}

export default {
  install(app) {
    app.component('DefaultLayout', DefaultLayout)
    app.component('calendarComponent', calendarComponent)
    app.component('componentTemplate', componentTemplate)
    app.component('coverComponent', coverComponent)
    app.component('listComponent', listComponent)
    app.component('listUseStarTemp', listUseStarTemp)
    app.component('loginComponent', loginComponent)
    app.component('menuComponent', menuComponent)
    app.component('modalComponent', modalComponent)
    app.component('mytestComponent', mytestComponent)
    app.component('ratingStarComponent', ratingStarComponent)
    app.component('tableComponent', tableComponent)
    app.component('todoListComponent', todoListComponent)
  }
}
