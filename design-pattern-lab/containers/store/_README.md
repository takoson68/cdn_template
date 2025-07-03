
# 如果使用_storeFactory.js 來產生store，要特別注意 
## defaultValue: [] // 權限列表，預設為空陣列
## 注意型別如果是字串而且成陣列，會出錯


------ //- 使用方式

import { createStore } from '@/containers/_storeFactory.js'

const permissionStore = createStore({
  name: 'permissionStore',
  storageKey: 'user_permissions',
  defaultValue: [] // 權限列表，預設為空陣列
})

export default permissionStore

-----


### tempStore.js 主要放置臨時資料，也使用幫訂功能，跨元件使用

-----
// 設定臨時條件 - 在這個臨時資料的最初生命週期產生一個命名，
// 然後就可以垮元件使用了

import { container } from "@/containers/index.js"; 
const tempStore = container.resolve('tempStore')

tempStore.set('myTest.name', 'ＯＴＴＯ') //- (名稱,資料)

-----