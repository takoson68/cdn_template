// @/pages/home/_pageComponents.js

import menuComponent from '../../components/menuComponent/index.js'
import todoListComponent from '../../components/todoListComponent/index.js'

export default {
  install(app) {
    const modules = [
      menuComponent,
      todoListComponent
    ]

    modules.forEach(component => {
      if (component.name) {
        app.component(component.name, component)
      } else {
        console.warn('Component missing name:', component)
      }
    })
  }
}

