// @/containers/store/todoStore.js
import { createStore } from '@/containers/_storeFactory.js'

const todoStore = createStore({
  name: 'todoStore',
  storageKey: 'todo_list',
  defaultValue: []  // 這裡預設是陣列，表示 todo 項目陣列
})

// 你可以額外加些便捷方法
todoStore.addItem = function(text) {
  const items = this.get()
  items.push(text)
  this.set(items)
}

todoStore.removeItem = function(index) {
  const items = this.get()
  items.splice(index, 1)
  this.set(items)
}

export default todoStore
