// 🚀 此檔案由 generate-components-index.mjs 自動產生，勿手動修改

import DefaultLayout from './DefaultLayout/DefaultLayout.js'
import calendarComponent from './calendarComponent/calendarComponent.js'
import componentTemplate from './componentTemplate/componentTemplate.js'
import coverComponent from './coverComponent/coverComponent.js'
import listComponent from './listComponent/listComponent.js'
import listUseStarTemp from './listUseStarTemp/listUseStarTemp.js'
import loginComponent from './loginComponent/loginComponent.js'
import menuComponent from './menuComponent/menuComponent.js'
import modalComponent from './modalComponent/modalComponent.js'
import mytestComponent from './mytestComponent/mytestComponent.js'
import ratingStarComponent from './ratingStarComponent/ratingStarComponent.js'
import tableComponent from './tableComponent/tableComponent.js'
import todoListComponent from './todoListComponent/todoListComponent.js'

// 將元件掛載到全域物件，供 createAutoInstaller 打包判斷時取得
window.__BUNDLED_COMPONENTS__ = {
  'calendarComponent.js': calendarComponent,
  'componentTemplate.js': componentTemplate,
  'coverComponent.js': coverComponent,
  'listComponent.js': listComponent,
  'listUseStarTemp.js': listUseStarTemp,
  'loginComponent.js': loginComponent,
  'menuComponent.js': menuComponent,
  'modalComponent.js': modalComponent,
  'mytestComponent.js': mytestComponent,
  'ratingStarComponent.js': ratingStarComponent,
  'tableComponent.js': tableComponent,
  'todoListComponent.js': todoListComponent,
  'DefaultLayout.js': DefaultLayout,
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
