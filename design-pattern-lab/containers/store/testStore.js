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
/*
  物件這邊最好將資料結構設計完整，才不會出現奇怪的問屜。
  （每次設計資料都應該要想清楚，最好不要有那種只有keyName，
    但不知道型別的東西）
*/