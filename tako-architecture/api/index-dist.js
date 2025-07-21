import { container } from '@/containers/index-dist.js';

//- ApiContainer.js

class ApiContainer {
  static instance = null

  static getInstance() {
    if (!ApiContainer.instance) {
      ApiContainer.instance = new ApiContainer();
    }
    return ApiContainer.instance
  }

  constructor() {
    this.strategy = null;
    this.baseURL = '';
    this.defaultHeaders = {};
    this.onResponseInterceptor = null; // ✅ 攔截器
  }

  //- 這個是接收走api還是mock的容器
  setStrategy(strategy) {
    this.strategy = strategy;
  }

  setBaseURL(baseURL) {
    this.baseURL = baseURL;
  }

  setHeaders(headers) {
    this.defaultHeaders = headers;
  }

  setOnResponseInterceptor(fn) {
    this.onResponseInterceptor = fn;
  }

  getHeaders() {
    return this.headers
  }

  async request(endpoint, options = {}) {
    if (!this.strategy) {
      throw new Error('尚未設定 API 策略')
    }

    const token = container.resolve('tokenStore').get();
    const resolvedHeaders = {
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    };

    const mergedOptions = {
      ...options,
      headers: {
        ...resolvedHeaders,
        ...(options.headers || {}),
      },
      body: options.data ? JSON.stringify(options.data) : undefined, // ✅轉換
    };
    

    const result = await this.strategy.request(endpoint, mergedOptions);

    // ✅ 攔截處理
    if (this.onResponseInterceptor && typeof this.onResponseInterceptor === 'function') {
      this.onResponseInterceptor(result, endpoint);
    }

    return result
  }

  
  // 快速方法封裝
  get(url, params) {
    return this.request(url, { method: 'GET', params })
  }

  post(url, data) {
    return this.request(url, { method: 'POST', data })
  }

  put(url, data) {
    return this.request(url, { method: 'PUT', data })
  }

  delete(url, data) {
    return this.request(url, { method: 'DELETE', data })
  }
}

class RealApiStrategy {
  request(endpoint, options = {}) {
    const api = ApiContainer.getInstance();
    const headers = {
      ...api.getHeaders(),
      ...(options.headers || {})
    };

    return fetch(api.baseURL + endpoint, {
      method: options.method || 'GET',
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined
    }).then(res => res.json())
  }
}

const menu = [
  {
    path: "/cdn_template/tako-architecture/home.html",
    component: "Home",
    meta: {
      title: "首頁",
      lang: "menu_lang_00",
      description: "Welcome to the Home Page of our site.",
    },
    // children: [], // 無子路由
  },
  {
    path: "/cdn_template/tako-architecture/about.html",
    component: "About",
    meta: {
      title: "關於我們",
      lang: "menu_lang_23",
      description: "Learn more about our team and mission.",
    },
    children: [
      {
        path: "/cdn_template/tako-architecture/about_team.html",
        component: "About",
        meta: {
          title: "團隊介紹",
          lang: "menu_lang_25",
          description: "Meet our team.",
        },
      },
      {
        path: "/cdn_template/tako-architecture/about_mission.html",
        component: "About",
        meta: {
          title: "我們的使命",
          lang: "menu_lang_26",
          description: "Our mission and vision.",
        },
      },
    ],
  },
  {
    path: "/cdn_template/tako-architecture/contact.html",
    component: "Contact",
    meta: {
      title: "聯絡我們",
      lang: "menu_lang_24",
      description: "Learn more about how to contact our team and mission.",
    },
    // children: [], // 無子路由
  },
  {
    path: "/cdn_template/tako-architecture/calendar.html",
    component: "calendar",
    meta: {
      title: "萬年曆",
      lang: "menu_lang_15",
      description: "查看萬年曆並選擇日期。",
    },
  },
  {
    path: "/cdn_template/tako-architecture/mtk2mad.html",
    component: "mtk2mad",
    meta: {
      title: "攻擊路徑圖",
      lang: "menu_lang_22",
      description: "攻擊路徑圖繪製功能",
    },
  },
  {
    path: "",
    component: "Language",
    meta: {
      title: "語言",
      lang: "menu_lang_27",
      description: "Learn more about our team and mission.",
    },
    children: [
      {
        path: "",
        component: "en",
        meta: {
          title: "英文",
          lang: "menu_lang_28",
          description: "Meet our team.",
        },
      },
      {
        path: "",
        component: "zh",
        meta: {
          title: "中文",
          lang: "menu_lang_29",
          description: "Our mission and vision.",
        },
      },
    ],
  },
];

// Mock 一個 API 回應
const Random$1 = Mock.Random;

// 計算今天的前後三個月的日期範圍
const getThreeMonthRangeFromToday = () => {
  const today = new Date();

  const start = new Date(today);
  start.setMonth(start.getMonth() - 3);

  const end = new Date(today);
  end.setMonth(end.getMonth() + 3);

  return { start, end };
};

//----------Users------------------------------------------
// 隨機生成數據數量（33到50之間）
Random$1.integer(33, 50);



//--------------list------------------------------------------
Random$1.integer(23, 60);// 隨機生成數據數量

// Mock 一個 API 回應
const Random = Mock.Random;
const listCount = Random.integer(23, 60);// 隨機生成數據數量

const { start, end } = getThreeMonthRangeFromToday();

const mockRoutes = {
  '/api/login': (options) => {
    const bodyText = options.data || '{}';
    let body = {};

    try {
      body = typeof bodyText === 'string' ? JSON.parse(bodyText) : bodyText;
    } catch (e) {
      return { code: 400, message: '無效的 JSON 格式' }
    }

    const { username, password } = body;

    // 模擬帳號密碼檢查
    if (username === 'admin' && password === '123456') {
      return {
        code: 200,
        token: 'mocked-token-123',
        user: { id: 'u1', name: 'Mock User' },
        permissions: ["post:edit", "user:view"],
      }
    } else {
      return {
        code: 401,
        message: '帳號或密碼錯誤',
      }
    }
  },

  '/api/users': (options) => ({
    code: 999,
    data: Array.from({ length: 3 }).map((_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`,
      email: `user${i + 1}@mock.com`,
    })),
  }),

  '/api/menu': (options) => ({
    code: 200,
    data: menu,
  }),
  
  '/api/list': (options) => ({
    code: 200,
    data: Array.from({ length: listCount }, (_, index) => ({
      id: Random.id(),
      title: Random.csentence(6, 9),
      ip: Random.ip(),
      date: Random.cparagraph(), // 使用自定義函式生成日期
      nb: index + 1, // 新增遞增的編號屬性，從 1 開始
      rating: Random.integer(0, 5),
      imageUrl: `https://picsum.photos/100/100?random=${index}`, // 使用 Picsum 生成圖片
    })),
  }),

  '/api/data': (options) => ({
    code: 200,
    data: Array.from({ length: Random.integer(33, 50) }, () => ({
      id: Random.id(),
      name: Random.name(),
      age: Random.integer(18, 60),
      star: Random.integer(0, 5),
      email: Random.email(),
      date: mackSet.generateRandomDate(start, end), // 使用當日前後三個月的隨機日期
    })),
  }),
  // ...自由擴充更多 API
};

class MockApiStrategy {
request(url, options = {}) {
  const headers = options.headers || {};
  let parsedData = {};

  if (!headers.Authorization && url !== "/api/login") {
    console.log('[MockApiStrategy] 尚未登入（缺少 Authorization）');
  }

  try {
    if (typeof options.body === 'string') {
      parsedData = JSON.parse(options.body);
    }
  } catch (err) {
    console.warn('MockApiStrategy body parse error:', err);
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      const route = Object.entries(mockRoutes).find(([key]) => url.includes(key));

      if (route) {
        const [, handler] = route;
        const result = handler({
          headers,
          data: parsedData,
          method: options.method,
        });
        resolve(result);
      } else {
        resolve({ code: 404, message: `Mock 路由未定義: ${url}` });
      }
    }, 0);
  })
}

}

//- api/index.js

const useMock = !!window.Mock;
const baseURL = 'https://api.example.com';

// 取得實例
const api = ApiContainer.getInstance();
api.setBaseURL(baseURL);
api.setStrategy(useMock ? new MockApiStrategy() : new RealApiStrategy());

// ✅ 註冊攔截處理器（處理 code === 999）
api.setOnResponseInterceptor((res, endpoint) => {
  if (res.code === 999) {
    console.warn(`[API] Token 過期，請重新登入（觸發於 ${endpoint}）`);
    const tokenStore = container.resolve('tokenStore');
    const permissionStore = container.resolve('permissionStore');
    
    tokenStore.clear();
    permissionStore.clear();
    alert('登入逾時，請重新登入');
    location.reload();
  }
});

export { api };
