//- api/index.js
import { ApiContainer } from './ApiContainer.js'
import { RealApiStrategy } from './strategies/RealApiStrategy.js'
import { MockApiStrategy } from '@/mock/MockApiStrategy.js'
import { container } from '@/containers/index.js'

const useMock = !!window.Mock
const baseURL = 'https://api.example.com'

// 取得實例
const api = ApiContainer.getInstance()
api.setBaseURL(baseURL)
api.setStrategy(useMock ? new MockApiStrategy() : new RealApiStrategy())

// ✅ 註冊攔截處理器（處理 code === 999）
api.setOnResponseInterceptor((res, endpoint) => {
  if (res.code === 999) {
    console.warn(`[API] Token 過期，請重新登入（觸發於 ${endpoint}）`)
    const tokenStore = container.resolve('tokenStore')
    const permissionStore = container.resolve('permissionStore')
    
    tokenStore.clear()
    permissionStore.clear();
    alert('登入逾時，請重新登入')
    location.reload()
  }
})

export { api }
