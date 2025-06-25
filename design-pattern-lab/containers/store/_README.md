
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

