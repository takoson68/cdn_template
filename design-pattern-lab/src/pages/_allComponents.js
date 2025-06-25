// components/allComponents.js

// 註冊元件
const modules = await Promise.all([
  import('@/layouts/DefaultLayout/index.js'),
  import('@/containers/directives/v-can.js'),
  // import('@/components/listUseStarTemp/index.js'),
  // import('@/components/ratingStarComponent/index.js'),
])

export default {
  install(app) {
    modules.forEach(mod => app.use(mod.default))
  }
}


