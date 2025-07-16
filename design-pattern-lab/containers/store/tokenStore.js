// containers/store/tokenStore.js
import { createStore } from '../_storeFactory.js'

const tokenStore = createStore({
  name: 'tokenStore',
  storageKey: 'token_data',
  defaultValue: '' // 儲存資料，預設為空字串
})

export default tokenStore


