const urlUtils = { //- 網址存取函式------
  // 取得完整網址
  getFullURL() {
    return window.location.href
  },

  // 取得目前路徑（不含 query）
  getPath() {
    return window.location.pathname
  },
  
  getPageName() {
    const path = window.location.pathname
    const segments = path.split('/')
    const lastSegment = segments.pop() || segments.pop() // 防止結尾為 '/' 的情況
    const name = lastSegment.split('.')[0] || ''
    return name
  },
  
  // 取得網址查詢參數（回傳物件）
  getQueryParams() {
    const params = new URLSearchParams(window.location.search)
    const result = {}
    for (const [key, value] of params.entries()) {
      result[key] = value
    }
    return result
  },

  // 根據 key 取得指定參數
  getQueryParam(key) {
    return new URLSearchParams(window.location.search).get(key)
  }
}

export default urlUtils
