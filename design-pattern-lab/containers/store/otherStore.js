// containers/store/otherStore.js
import { createStore } from '@/containers/_storeFactory.js'

const otherStore = createStore({
  name: 'otherStore',
  storageKey: 'other_data',
  defaultValue: [] // 權限列表，預設為空陣列
})

export default otherStore

