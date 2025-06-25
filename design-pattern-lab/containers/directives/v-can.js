// @/containers/directives/v-can.js
import { hasPermission } from '@/containers/utils/permissionUtils.js'

const vCanDirective = {
  mounted(el, binding) {
    const code = binding.value
    if (!hasPermission(code)) {
      el.style.display = 'none'
    }
  }
}

const vCan = {
  install(app) {
    app.directive('can', vCanDirective)
  }
}

export { vCan }
export default vCan
