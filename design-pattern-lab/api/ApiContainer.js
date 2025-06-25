//- ApiContainer.js
import { container } from '@/containers/index.js'

export class ApiContainer {
  static instance = null

  static getInstance() {
    if (!ApiContainer.instance) {
      ApiContainer.instance = new ApiContainer()
    }
    return ApiContainer.instance
  }

  constructor() {
    this.strategy = null
    this.baseURL = ''
    this.defaultHeaders = {}
    this.onResponseInterceptor = null // ✅ 攔截器
  }

  //- 這個是接收走api還是mock的容器
  setStrategy(strategy) {
    this.strategy = strategy
  }

  setBaseURL(baseURL) {
    this.baseURL = baseURL
  }

  setHeaders(headers) {
    this.defaultHeaders = headers
  }

  setOnResponseInterceptor(fn) {
    this.onResponseInterceptor = fn
  }

  getHeaders() {
    return this.headers
  }

  async request(endpoint, options = {}) {
    if (!this.strategy) {
      throw new Error('尚未設定 API 策略')
    }

    const token = container.resolve('tokenStore').get()
    const resolvedHeaders = {
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    }

    const mergedOptions = {
      ...options,
      headers: {
        ...resolvedHeaders,
        ...(options.headers || {}),
      },
      body: options.data ? JSON.stringify(options.data) : undefined, // ✅轉換
    }
    

    const result = await this.strategy.request(endpoint, mergedOptions)

    // ✅ 攔截處理
    if (this.onResponseInterceptor && typeof this.onResponseInterceptor === 'function') {
      this.onResponseInterceptor(result, endpoint)
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
