// containers/store/tokenStore.js
import { createStore } from '@/containers/_storeFactory.js'

const tokenStore = createStore({
  name: 'tokenStore',
  storageKey: 'token_data',
  defaultValue: '' // 權限列表，預設為空字串
})

export default tokenStore


