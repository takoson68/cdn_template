// @/containers/_storeFactory.js
import { ref, reactive, toRaw } from '@Vue'

function isPlainObject(val) {
  return Object.prototype.toString.call(val) === '[object Object]'
}

function isTypeMatch(value, template) {
  // 判斷 value 是否與 template 同型態
  if (Array.isArray(template)) return Array.isArray(value)
  if (isPlainObject(template)) return isPlainObject(value)
  return typeof value === typeof template
}

export function createStore({ name, storageKey = null, defaultValue }) {
  if (!name) throw new Error(`❌ createStore 缺少 name`)
  if (defaultValue === undefined) throw new Error(`❌ createStore 缺少 defaultValue`)

  const isObj = isPlainObject(defaultValue)
  const isArray = Array.isArray(defaultValue)
  const isPrimitive = !isObj && !isArray
  const state = isObj || isArray ? reactive(structuredClone(defaultValue)) : ref(defaultValue)

  const store = {
    get() {
      return isObj || isArray ? state : state.value
    },
    set(value) {
      if (!isTypeMatch(value, defaultValue)) {
        throw new TypeError(`[${name}] 預期 set 型態與 defaultValue 不符，請傳入相同型態資料。收到：${JSON.stringify(value)}`)
      }

      if (isObj) {
        Object.assign(state, value)
      } else if (isArray) {
        state.splice(0, state.length, ...value)
      } else if (isPrimitive) {
        state.value = value
      }

      if (storageKey) {
        try {
          const raw = isObj || isArray ? toRaw(state) : value
          localStorage.setItem(storageKey, JSON.stringify(raw))
        } catch (err) {
          console.warn(`[${name}] 儲存失敗:`, err)
        }
      }
    },
    clear() {
      if (isObj || isArray) {
        store.set(structuredClone(defaultValue))
      } else {
        state.value = defaultValue
      }
      localStorage.removeItem(storageKey)
    },
    loadFromStorage() {
      if (!storageKey) return
      try {
        const raw = localStorage.getItem(storageKey)
        if (raw) store.set(JSON.parse(raw))
      } catch (err) {
        console.warn(`[${name}] 載入失敗:`, err)
      }
    }
  }

  store.loadFromStorage()
  store.__storeName = name
  return store
}
