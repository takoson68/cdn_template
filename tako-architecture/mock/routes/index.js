import myMenu from '../data/menuData.js'
import *  as mackSet  from './mackSet.js'
// Mock 一個 API 回應
const Random = Mock.Random;
const listCount = Random.integer(23, 60);// 隨機生成數據數量

const { start, end } = mackSet.getThreeMonthRangeFromToday();

export const mockRoutes = {
  '/api/login': (options) => {
    const bodyText = options.data || '{}'
    let body = {}

    try {
      body = typeof bodyText === 'string' ? JSON.parse(bodyText) : bodyText
    } catch (e) {
      return { code: 400, message: '無效的 JSON 格式' }
    }

    const { username, password } = body

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
    data: myMenu,
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
}


