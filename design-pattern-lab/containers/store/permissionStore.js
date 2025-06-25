// @/containers/store/permissionStore.js
import { createStore } from '@/containers/_storeFactory.js'

const permissionStore = createStore({
  name: 'permissionStore',
  storageKey: 'user_permissions',
  defaultValue: []
})

permissionStore.has = (code) => {
  const list = permissionStore.get()
  return Array.isArray(list) && list.includes(code)
}

export default permissionStore
