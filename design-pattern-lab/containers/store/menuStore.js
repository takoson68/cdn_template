// containers/store/menuStore.js
import { createStore } from '@/containers/_storeFactory.js'

const menuStore = createStore({
  name: 'menuStore',
  storageKey: 'menu_data',
  defaultValue: [] // 權限列表，預設為空陣列
})

export default menuStore


