export class PageDataBridge {
  constructor(storageKey = "pageData") {
    this.key = storageKey;
  }
  //--  跨頁存取資料模組
  /** //---------目前以取得 (網址列，本地暫存) 兩種帶入資訊--------
   * 傳送資料：支援 localStorage 或直接寫入 URL 查詢參數
   * @param {Object} data
   * @param {string} nextPageUrl
   * @param {Object} options
   * @param {boolean} options.useUrl - 是否使用 query string 傳遞資料
   */
  send(data, nextPageUrl, options = { useUrl: false }) {
    if (options.useUrl && nextPageUrl) {
      const url = new URL(nextPageUrl, window.location.origin);
      Object.entries(data).forEach(([key, value]) => {
        url.searchParams.set(key, value);
      });
      window.location.href = url.toString();
    } else {
      localStorage.setItem(this.key, JSON.stringify(data));
      if (nextPageUrl) window.location.href = nextPageUrl;
    }
  }

  /**
   * 接收資料：自動合併 localStorage 與 URL 參數，URL 權重大於 localStorage
   */
  receive(autoClear = true) {
    const fromUrl = this._getUrlData();
    const fromLocal = this._getLocal();

    if (autoClear) this.clear();

    return {
      ...(fromLocal || {}),
      ...(fromUrl || {}),
    };
  }

  /**
   * 取得合併資料（不清除）
   */
  get() {
    return {
      ...(this._getLocal() || {}),
      ...(this._getUrlData() || {}),
    };
  }

  /**
   * 清除 localStorage 與 URL 上所有資料
   */
  clear() {
    localStorage.removeItem(this.key);

    const url = new URL(window.location.href);

    // 正確：複製靜態參數 key 列表再刪除
    const keys = Array.from(url.searchParams.entries()).map(([key]) => key);
    keys.forEach((key) => url.searchParams.delete(key));

    // 替換 URL（避免刷新）
    window.history.replaceState({}, "", url.toString());
  }

  /**
   * 私有：取得 localStorage 資料
   */
  _getLocal() {
    const raw = localStorage.getItem(this.key);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  /**
   * 私有：取得 URL 查詢參數（轉為物件）
   */
  _getUrlData() {
    const params = new URLSearchParams(window.location.search);
    const result = {};
    for (const [key, value] of params.entries()) {
      result[key] = value;
    }
    return Object.keys(result).length ? result : null;
  }
}
