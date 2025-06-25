// @/containers/store/watcherStore.js

const { watch } = window.Vue;
const watchers = new Map()

export const watcherStore = {
  /**
   * 註冊一個監聽器
   * @param {String} key 唯一 key
   * @param {Ref | Reactive | Function} source 被監聽資料
   * @param {Function} callback 變化回呼
   * @param {Object} options watch 的額外選項
   */
  register(key, source, callback, options = {}) {
    if (watchers.has(key)) {
      console.warn(`[watcherStore] 監聽鍵已存在：${key}，自動移除前一個`)
      this.remove(key)
    }

    const stop = watch(source, callback, options)
    watchers.set(key, stop)
  },

  /**
   * 移除單一監聽器
   */
  remove(key) {
    if (watchers.has(key)) {
      const stop = watchers.get(key)
      stop() // 停止監聽
      watchers.delete(key)
    }
  },

  /**
   * 清除全部監聽器
   */
  clearAll() {
    watchers.forEach(stop => stop())
    watchers.clear()
  },

  /**
   * 是否已存在某監聽器
   */
  has(key) {
    return watchers.has(key)
  }
}
