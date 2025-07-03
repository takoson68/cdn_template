// tempStore.js
/*
  這裡是放置臨時資料的store，因為不想讓store因為不必要的資料而一直成長下去，
  但又需要用到跨元件資料同步，所以產生這個臨時的store，
*/
import { reactive, toRaw } from '@Vue'

const state = reactive({})

// 工具：字串路徑存取物件屬性（如 foo.bar.baz）
function getByPath(obj, path) {
  return path.split('.').reduce((o, k) => (o ? o[k] : undefined), obj)
}
function setByPath(obj, path, value) {
  const keys = path.split('.')
  const lastKey = keys.pop()
  const target = keys.reduce((o, k) => (o[k] ??= {}), obj)
  target[lastKey] = value
}
function deleteByPath(obj, path) {
  const keys = path.split('.')
  const lastKey = keys.pop()
  const target = keys.reduce((o, k) => (o ? o[k] : undefined), obj)
  if (target) delete target[lastKey]
}

const store = {
  get(path) {
    return path ? getByPath(state, path) : state
  },
  set(path, value) {
    setByPath(state, path, value)
  },
  delete(path) {
    deleteByPath(state, path)
  },
  clearAll() {
    Object.keys(state).forEach(k => delete state[k])
  },
  toRaw() {
    return toRaw(state)
  }
}

export default store
