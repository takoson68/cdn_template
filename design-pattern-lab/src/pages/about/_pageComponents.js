// about/_pageComponents.js

const modules = await Promise.all([
  import('@/components/pagination-module/index.js'),
  import('@/components/component-template/index.js'),
  import('@/components/listUseStarTemp/index.js'),
  import('@/components/ratingStarComponent/index.js'),
  import('@/components/mytestComponent/index.js'),
])

export default {
  install(app) {
    modules.forEach(mod => app.use(mod.default))
  }
}


