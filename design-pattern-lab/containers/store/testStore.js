// @/containers/store/testStore.js
import { createStore } from '@/containers/_storeFactory.js'

export default createStore({
  name: 'testStore',
  storageKey: 'test_data',
  defaultValue: {
    name: 'otto',
    role: '111111111111',
    loggedIn: false
  }
})
