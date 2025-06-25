// @/containers/utils/permissionUtils.js
import permissionStore from '@/containers/store/permissionStore.js'

export function hasPermission(code) {
  return permissionStore.has(code)
}
