import * as Vue from '../../vendors/vue/vue.esm-browser.prod.js';

// Container.js
class Container {
  #services = new Map();

  register(name, service) {
    if (!this.#services.has(name)) {
      this.#services.set(name, service);
    }
  }

  resolve(name) {
    if (!this.#services.has(name)) {
      throw new Error(`Service "${name}" 尚未註冊`);
    }
    return this.#services.get(name);
  }

  has(name) {
    return this.#services.has(name);
  }

  unregister(name) {
    this.#services.delete(name);
  }
}

const container = new Container();

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
    const path = window.location.pathname;
    const segments = path.split('/');
    const lastSegment = segments.pop() || segments.pop(); // 防止結尾為 '/' 的情況
    const name = lastSegment.split('.')[0] || '';
    return name
  },
  
  // 取得網址查詢參數（回傳物件）
  getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    const result = {};
    for (const [key, value] of params.entries()) {
      result[key] = value;
    }
    return result
  },

  // 根據 key 取得指定參數
  getQueryParam(key) {
    return new URLSearchParams(window.location.search).get(key)
  }
};

// containers/services/userService.js
class UserService {
  constructor() {
    this.users = [];
  }

  getAllUsers() {
    return this.users;
  }

  addUser(user) {
    this.users.push(user);
  }
}

const userService = new UserService();

// containers/services/loggerService.js
class LoggerService {
  log(message) {
    console.log(`[LOG]: ${message}`);
  }
}

const loggerService = new LoggerService();

// containers/services/listService.js
class ListService {
  constructor() {
    this.list = [];
  }

  setList(list) {
    this.list = list;
  }

  getList() {
    return this.list;
  }
}

const listService = new ListService();

const languageStore = {
  language: localStorage.getItem("lang_code")||"zh",
  langData: {},

  async loadLanguageFile(langCode) {
    langCode = langCode || this.language;

    try {
      const res = await fetch(`/design-pattern-lab/lang/lang-${langCode}.txt`);
      const text = await res.text();
      const parsed = this.parseLangText(text);

      this.language = langCode;
      this.langData = parsed;

      // 儲存到 localStorage
      localStorage.setItem("lang_code", langCode);
      localStorage.setItem(`lang_data_${langCode}`, JSON.stringify(parsed));
    } catch (err) {
      console.error(`[languageStore] 無法載入語言檔: ${langCode}`, err);
    }
  },

  parseLangText(text) {
    const lines = text.split("\n");
    const map = {};
    lines.forEach(line => {
      const [key, ...rest] = line.trim().split("=");
      if (key && rest.length > 0) {
        map[key] = rest.join("=").trim();
      }
    });
    return map;
  },

  t(key) {
    return this.langData[key] || key;
  },

  async setLanguage(langCode) {
    await this.loadLanguageFile(langCode);
  },

  getLanguage() {
    return this.language;
  },

  getLangData() {
    return this.langData;
  },

  // ✅ 初始化時執行，優先讀 localStorage
  async initLanguage() {
    const savedLangCode = localStorage.getItem("lang_code");
    const savedLangData = savedLangCode ? localStorage.getItem(`lang_data_${savedLangCode}`) : null;

    if (savedLangCode && savedLangData) {
      this.language = savedLangCode;
      this.langData = JSON.parse(savedLangData);
      this.replaceMenuLang();
      console.log(`[languageStore] 已從 localStorage 還原語言：${savedLangCode}`);
    } else {
      // fallback：第一次載入
      await this.loadLanguageFile(this.language);
      console.log(`[languageStore] 載入預設語言：${this.language}`);
    }
  },

  // ✅ 替換所有 DOM 上的語言內容
replaceMenuLang() {
  const elements = document.querySelectorAll("[data-lang], [data-i18n-title], [data-i18n-placeholder], [data-i18n-value]");
  elements.forEach((el) => {
    // 處理 textContent
    if (el.hasAttribute("data-lang")) {
      const key = el.getAttribute("data-lang");
      const value = this.t(key);
      if (value) el.textContent = value;
    }

    // 處理 title 屬性
    if (el.hasAttribute("data-i18n-title")) {
      const key = el.getAttribute("data-i18n-title");
      const value = this.t(key);
      if (value) el.setAttribute("title", value);
    }

    // 處理 placeholder 屬性
    if (el.hasAttribute("data-i18n-placeholder")) {
      const key = el.getAttribute("data-i18n-placeholder");
      const value = this.t(key);
      if (value) el.setAttribute("placeholder", value);
    }

    // 處理 value 屬性
    if (el.hasAttribute("data-i18n-value")) {
      const key = el.getAttribute("data-i18n-value");
      const value = this.t(key);
      if (value) el.setAttribute("value", value);
    }
  });
}

};

// 將常用 Vue 函數全部轉出（依你的需求自行擴增）
const {
  ref,
  reactive,
  toRaw} = Vue;

// @/containers/_storeFactory.js
//- 使用vue3處理資料綁定，提供跨元件雙向綁定
//- 如此就不需要使用props傳遞，提供另一個資料流的做法
//- 如果要跨頁，還是必須執行set將資料存在瀏覽器
function isPlainObject(val) {
  return Object.prototype.toString.call(val) === '[object Object]'
}

function isTypeMatch(value, template) {
  // 判斷 value 是否與 template 同型態
  if (Array.isArray(template)) return Array.isArray(value)
  if (isPlainObject(template)) return isPlainObject(value)
  return typeof value === typeof template
}

function createStore({ name, storageKey = null, defaultValue }) {
  if (!name) throw new Error(`❌ createStore 缺少 name`)
  if (defaultValue === undefined) throw new Error(`❌ createStore 缺少 defaultValue`)

  const isObj = isPlainObject(defaultValue);
  const isArray = Array.isArray(defaultValue);
  const isPrimitive = !isObj && !isArray;
  const state = isObj || isArray ? reactive(structuredClone(defaultValue)) : ref(defaultValue);

  const store = {
    get() {
      return isObj || isArray ? state : state.value
    },
    set(value) {
      if (!isTypeMatch(value, defaultValue)) {
        throw new TypeError(`[${name}] 預期 set 型態與 defaultValue 不符，請傳入相同型態資料。收到：${JSON.stringify(value)}`)
      }

      if (isObj) {
        Object.assign(state, value);
      } else if (isArray) {
        state.splice(0, state.length, ...value);
      } else if (isPrimitive) {
        state.value = value;
      }

      if (storageKey) {
        try {
          const raw = isObj || isArray ? toRaw(state) : value;
          localStorage.setItem(storageKey, JSON.stringify(raw));
        } catch (err) {
          console.warn(`[${name}] 儲存失敗:`, err);
        }
      }
    },
    clear() {
      if (isObj || isArray) {
        store.set(structuredClone(defaultValue));
      } else {
        state.value = defaultValue;
      }
      localStorage.removeItem(storageKey);
    },
    loadFromStorage() {
      if (!storageKey) return
      try {
        const raw = localStorage.getItem(storageKey);
        if (raw) store.set(JSON.parse(raw));
      } catch (err) {
        console.warn(`[${name}] 載入失敗:`, err);
      }
    }
  };

  store.loadFromStorage();
  store.__storeName = name;
  return store
}

// containers/store/tokenStore.js

const tokenStore = createStore({
  name: 'tokenStore',
  storageKey: 'token_data',
  defaultValue: '' // 儲存資料，預設為空字串
});

// containers/store/menuStore.js

const menuStore = createStore({
  name: 'menuStore',
  storageKey: 'menu_data',
  defaultValue: [] // 權限列表，預設為空陣列
});

// containers/store/otherStore.js

const otherStore = createStore({
  name: 'otherStore',
  storageKey: 'other_data',
  defaultValue: [] // 權限列表，預設為空陣列
});

class PageDataBridge {
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

// @/containers/store/todoStore.js

const todoStore = createStore({
  name: 'todoStore',
  storageKey: 'todo_list',
  defaultValue: []  // 這裡預設是陣列，表示 todo 項目陣列
});

// 你可以額外加些便捷方法
todoStore.addItem = function(text) {
  const items = this.get();
  items.push(text);
  this.set(items);
};

todoStore.removeItem = function(index) {
  const items = this.get();
  items.splice(index, 1);
  this.set(items);
};

// @/containers/store/testStore.js

var testStore = createStore({
  name: 'testStore',
  storageKey: 'test_data',
  defaultValue: {
    name: 'otto',
    role: '111111111111',
    loggedIn: false
  }
});
/*
  物件這邊最好將資料結構設計完整，才不會出現奇怪的問屜。
  （每次設計資料都應該要想清楚，最好不要有那種只有keyName，
    但不知道型別的東西）
*/

// tempStore.js
/*
  這裡是放置臨時資料的store，因為不想讓store因為不必要的資料而一直成長下去，
  但又需要用到跨元件資料同步，所以產生這個臨時的store，
*/

const state = reactive({});

// 工具：字串路徑存取物件屬性（如 foo.bar.baz）
function getByPath(obj, path) {
  return path.split('.').reduce((o, k) => (o ? o[k] : undefined), obj)
}
function setByPath(obj, path, value) {
  const keys = path.split('.');
  const lastKey = keys.pop();
  const target = keys.reduce((o, k) => (o[k] ??= {}), obj);
  target[lastKey] = value;
}
function deleteByPath(obj, path) {
  const keys = path.split('.');
  const lastKey = keys.pop();
  const target = keys.reduce((o, k) => (o ? o[k] : undefined), obj);
  if (target) delete target[lastKey];
}

const store = {
  get(path) {
    return path ? getByPath(state, path) : state
  },
  set(path, value) {
    setByPath(state, path, value);
  },
  delete(path) {
    deleteByPath(state, path);
  },
  clearAll() {
    Object.keys(state).forEach(k => delete state[k]);
  },
  toRaw() {
    return toRaw(state)
  }
};

// @/containers/store/permissionStore.js

const permissionStore = createStore({
  name: 'permissionStore',
  storageKey: 'user_permissions',
  defaultValue: []
});

permissionStore.has = (code) => {
  const list = permissionStore.get();
  return Array.isArray(list) && list.includes(code)
};

// @/containers/utils/permissionUtils.js

function hasPermission(code) {
  return permissionStore.has(code)
}

// containers/index.js

// 註冊服務與狀態
container.register('urlUtils', urlUtils);
container.register('userService', userService);
container.register('loggerService', loggerService);
container.register('listService', listService);
container.register('languageStore', languageStore);
container.register('tokenStore', tokenStore);
container.register('menuStore', menuStore);
container.register('otherStore', otherStore);
container.register('pageDataBridge', new PageDataBridge());
container.register('todoStore', todoStore);
container.register('testStore', testStore);
// 臨時倉庫註冊
container.register('tempStore', store);

container.register('permissionStore', permissionStore);
container.register('hasPermission', hasPermission);
// 提供 Vue App 用的掛載方式
container.register('can', (code) => permissionStore.has(code));

export { container };
